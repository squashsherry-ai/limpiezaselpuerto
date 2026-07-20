/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calculator, Check, AlertCircle, Sparkles, Send, MapPin, 
  User, Mail, Phone, Home, Briefcase, Building2, HardHat, CalendarDays, CheckCircle,
  Upload, Trash2, CreditCard
} from 'lucide-react';
import { ServiceType, BookingRequest } from '../types';
import { servicesData } from './Services';

interface BudgetCalculatorProps {
  selectedServiceId: ServiceType;
  onChangeService: (service: ServiceType) => void;
  onSubmitBooking: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => BookingRequest;
  onOpenClientPortal: (email: string) => void;
}

export default function BudgetCalculator({
  selectedServiceId,
  onChangeService,
  onSubmitBooking,
  onOpenClientPortal,
}: BudgetCalculatorProps) {
  // Calculator States
  const [sqm, setSqm] = useState<number>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sqmParam = params.get('sqm') || params.get('m2') || params.get('metros');
      if (sqmParam) {
        const parsed = parseInt(sqmParam, 10);
        if (!isNaN(parsed) && parsed >= 30 && parsed <= 1000) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing sqm param:', e);
    }
    return 80;
  });

  const [frequency, setFrequency] = useState<'una_vez' | 'semanal' | 'quincenal' | 'mensual'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const freqParam = params.get('frecuencia') || params.get('frec') || params.get('frequency');
      if (freqParam && ['una_vez', 'semanal', 'quincenal', 'mensual'].includes(freqParam)) {
        return freqParam as 'una_vez' | 'semanal' | 'quincenal' | 'mensual';
      }
    } catch (e) {
      console.error('Error parsing frequency param:', e);
    }
    return 'una_vez';
  });
  
  // Extras
  const [cristales, setCristales] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('cristales') === 'true' || params.has('cristales');
    } catch (e) {
      return false;
    }
  });

  const [plancha, setPlancha] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('plancha') === 'true' || params.has('plancha');
    } catch (e) {
      return false;
    }
  });

  const [ecoProducts, setEcoProducts] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('eco') === 'true' || params.has('eco') || params.get('ecoProducts') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [desinfeccion, setDesinfeccion] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('desinfeccion') === 'true' || params.has('desinfeccion');
    } catch (e) {
      return false;
    }
  });

  // Form States
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [addressLocator, setAddressLocator] = useState('');
  const [notes, setNotes] = useState('');

  // UI States
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBookingId, setSuccessBookingId] = useState('');
  const [createdBookingEmail, setCreatedBookingEmail] = useState('');
  const [successAddressLocator, setSuccessAddressLocator] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Photos State
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Selected Service Detail
  const activeService = servicesData.find(s => s.id === selectedServiceId) || servicesData[0];

  // Auto-reset non-applicable extras when service changes
  useEffect(() => {
    if (selectedServiceId !== 'hogar') {
      setPlancha(false);
    }
  }, [selectedServiceId]);

  // Frequency Discounts
  const frequencyDetails = {
    una_vez: { label: 'Una sola vez', discount: 0 },
    semanal: { label: 'Semanal (15% dto)', discount: 0.15 },
    quincenal: { label: 'Quincenal (10% dto)', discount: 0.10 },
    mensual: { label: 'Mensual (5% dto)', discount: 0.05 },
  };

  // Neighborhood list for El Puerto de Santa María
  const neighborhoods = [
    'Vistahermosa',
    'Valdelagrana',
    'Fuentebravía',
    'Las Redes',
    'Centro Histórico',
    'Crevillet / San José',
    'El Tejar',
    'El Juncal',
    'Casiñas / San Ignacio'
  ];

  // Synchronous, derived state for price calculation to guarantee instant correct values
  const parsedSqm = Number(sqm);
  const safeSqm = !isNaN(parsedSqm) && parsedSqm > 0 ? parsedSqm : 30;
  
  const basePricePerSqm = activeService?.basePricePerSqm ?? 1.20;
  let basePrice = safeSqm * basePricePerSqm;
  
  if (cristales) basePrice += 25;
  if (plancha && selectedServiceId === 'hogar') basePrice += 20;
  if (ecoProducts) basePrice += safeSqm * 0.15;
  if (desinfeccion) basePrice += 35;

  const discount = frequencyDetails[frequency]?.discount ?? 0;
  const discountFactor = 1 - discount;
  let finalPrice = basePrice * discountFactor;

  let isMinPriceApplied = false;
  if (finalPrice < 45) {
    finalPrice = 45;
    isMinPriceApplied = true;
  }

  const calcPrice = isNaN(finalPrice) || finalPrice <= 0 ? 45 : Math.round(finalPrice * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validations
    if (!clientName.trim()) {
      setErrorMsg('Por favor, introduce tu nombre.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setErrorMsg('Por favor, introduce un número de teléfono válido (mínimo 9 dígitos).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor, introduce una dirección de correo electrónico válida.');
      return;
    }
    if (!neighborhood) {
      setErrorMsg('Por favor, selecciona tu zona o barrio en El Puerto.');
      return;
    }
    if (!addressLocator.trim()) {
      setErrorMsg('Por favor, introduce la dirección o localizador de tu domicilio.');
      return;
    }

    // Submit request
    const fullBooking = onSubmitBooking({
      clientName,
      email,
      phone,
      neighborhood,
      serviceType: selectedServiceId,
      sqm,
      frequency,
      extras: {
        cristales,
        plancha,
        ecoProducts,
        desinfeccion,
      },
      notes,
      estimatedPrice: calcPrice,
      photos: uploadedPhotos,
      paymentStatus: 'pendiente',
      addressLocator,
    });

    const bookingId = fullBooking ? fullBooking.id : 'REF-' + Math.floor(100000 + Math.random() * 900000);

    // Build highly detailed WhatsApp message
    const waPhone = '34682020758';
    const extrasList = [];
    if (cristales) extrasList.push('Limpieza de Cristales (+25€)');
    if (plancha) extrasList.push('Servicio de Planchado');
    if (ecoProducts) extrasList.push('Productos Ecológicos');
    if (desinfeccion) extrasList.push('Desinfección Profunda (+35€)');

    const message = `*NUEVO PRESUPUESTO - LIMPIEZAS EL PUERTO*\n` +
      `----------------------------------------\n` +
      `*Cliente:* ${clientName}\n` +
      `*Teléfono:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Barrio/Zona:* ${neighborhood}\n` +
      `*Dirección/Localizador:* ${addressLocator}\n` +
      `----------------------------------------\n` +
      `*Servicio:* ${activeService?.title || selectedServiceId}\n` +
      `*Superficie:* ${sqm} m²\n` +
      `*Frecuencia:* ${frequencyDetails[frequency]?.label || frequency}\n` +
      `*Extras:* ${extrasList.length > 0 ? extrasList.join(', ') : 'Ninguno'}\n` +
      `${notes.trim() ? `*Notas adicionales:* ${notes}\n` : ''}` +
      `----------------------------------------\n` +
      `*Referencia:* ${bookingId}\n` +
      `*PRECIO ESTIMADO:* ${calcPrice.toFixed(2)}€\n` +
      `----------------------------------------\n` +
      `_Mencione el código *PUERTO15* para obtener un 15% de descuento adicional en su primer servicio general._`;

    const generatedUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(generatedUrl);

    if (fullBooking) {
      setSuccessBookingId(fullBooking.id);
      setCreatedBookingEmail(fullBooking.email);
      setSuccessAddressLocator(addressLocator);
    } else {
      setSuccessBookingId(bookingId);
      setCreatedBookingEmail(email);
      setSuccessAddressLocator(addressLocator);
    }
    setSuccess(true);
    
    // Auto open WhatsApp in new tab
    try {
      window.open(generatedUrl, '_blank');
    } catch (err) {
      console.warn('Popup blocked:', err);
    }
    
    // Clear Form fields
    setClientName('');
    setEmail('');
    setPhone('');
    setNeighborhood('');
    setAddressLocator('');
    setNotes('');
    setUploadedPhotos([]);
  };

  const handleReset = () => {
    setSuccess(false);
    setSuccessBookingId('');
    setCreatedBookingEmail('');
    setSuccessAddressLocator('');
    setWhatsappUrl('');
    setSqm(80);
    setFrequency('una_vez');
    setCristales(false);
    setPlancha(false);
    setEcoProducts(false);
    setDesinfeccion(false);
    setUploadedPhotos([]);
    setAddressLocator('');
  };

  return (
    <section className="py-16 md:py-24 bg-white" id="calculadora">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Calculadora de Tarifas</h2>
          <p className="mt-2 text-3xl sm:text-5xl font-light tracking-tight text-slate-900">
            Calcula tu Tarifa al Instante
          </p>
          <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto">
            Sin compromiso. Indique los metros de su propiedad y los extras que necesita para obtener una estimación de precio inmediata en El Puerto de Santa María.
          </p>
        </div>

        {/* Success Card or Main Calculator Grid */}
        {success ? (
          <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-100 rounded-xl p-8 text-center shadow-lg animate-fade-in" id="success-booking-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-4 border border-emerald-100">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider text-slate-900">¡Pre-Reserva Registrada con Éxito!</h3>
            <p className="mt-3 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Hemos registrado su solicitud correctamente. **✉ Se ha enviado un correo electrónico de confirmación con los detalles.**
            </p>

            {/* Payment Warning Block */}
            <div className="mt-5 p-4 bg-amber-50 text-amber-900 border border-amber-100 rounded-xl text-xs max-w-md mx-auto">
              <div className="flex items-start gap-2.5 text-left">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold uppercase tracking-wide text-[10px] text-amber-800">Pago por Adelantado Obligatorio</p>
                  <p className="leading-relaxed mt-1 text-[11px] text-amber-700">
                    Para garantizar su reserva y confirmar oficialmente el servicio de limpieza, **el servicio debe pagarse por adelantado**. Puede abonarlo de forma segura a continuación.
                  </p>
                </div>
              </div>
            </div>

            {/* Voucher breakdown */}
            <div className="mt-6 bg-white rounded-xl p-6 border border-slate-100 text-left shadow-xs">
              <div className="flex justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Código de Referencia:</span>
                <span className="text-xs font-extrabold text-sky-600 tracking-wider">{successBookingId}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600 uppercase tracking-wider font-semibold">
                <p className="flex justify-between"><span>Servicio:</span> <span className="text-slate-900">{activeService.title}</span></p>
                <p className="flex justify-between"><span>Superficie:</span> <span className="text-slate-900">{sqm} m²</span></p>
                <p className="flex justify-between"><span>Frecuencia:</span> <span className="text-slate-900">{frequencyDetails[frequency].label}</span></p>
                {successAddressLocator && (
                  <p className="flex justify-between gap-4">
                    <span>Domicilio:</span>
                    <span className="text-slate-900 text-right truncate max-w-[220px]" title={successAddressLocator}>{successAddressLocator}</span>
                  </p>
                )}
                <p className="flex justify-between border-t border-slate-100 pt-2 mt-2 text-slate-950 font-black">
                  <span>Precio Estimado:</span> <span className="text-sky-600 font-mono">{calcPrice.toFixed(2)}€</span>
                </p>
              </div>

              <div className="mt-5 p-3.5 bg-sky-50 text-sky-800 rounded-lg border border-sky-100 text-[10px] font-semibold uppercase tracking-wider leading-relaxed">
                ★ Mencione el código <strong className="text-sky-900">PUERTO15</strong> para obtener un <strong className="text-sky-900">15% de descuento adicional</strong> en su primer servicio general.
              </div>
            </div>

            {/* Direct Portal Payment Button */}
            <div className="mt-6 p-4 bg-slate-900 text-white rounded-xl border border-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left sm:max-w-xs">
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">¿Listo para confirmar?</p>
                <p className="text-[11px] text-slate-300 mt-0.5">Acceda al portal de clientes para pagar online de forma 100% segura.</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenClientPortal(createdBookingEmail)}
                className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs uppercase tracking-widest py-3 px-6 rounded-lg transition-all shadow-md shadow-sky-500/10 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <CreditCard className="h-4 w-4" />
                <span>Pagar por Adelantado Ahora</span>
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                id="btn-recalc"
              >
                Hacer otro presupuesto
              </button>
              <a
                href={whatsappUrl || `https://wa.me/34682020758?text=Hola,%20solicito%20confirmación%20de%20reserva%20con%20referencia%20${successBookingId}%20de%20Limpiezas%20El%20Puerto`}
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-lg border border-slate-200 transition-all flex items-center justify-center gap-1.5"
                id="btn-whatsapp-confirm"
              >
                <span>Enviar por WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left side: Calculator Inputs */}
            <div className="lg:col-span-7 bg-[#F8FAFC] rounded-xl p-6 md:p-8 border border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-bold">1</span>
                <span>Configurar parámetros de limpieza</span>
              </h3>

              {/* Real-time Dynamic Price Indicator for Mobile and Desktop View */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-950 text-white p-5 rounded-xl border border-slate-900 shadow-md relative overflow-hidden" id="dynamic-realtime-price-display">
                <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-slate-900 rounded-full blur-xl opacity-30 pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Tarifa Estimada al Instante</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-3xl font-extrabold tracking-tight text-white font-mono">{calcPrice.toFixed(2)}€</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">/ visita</span>
                  </div>
                  {isMinPriceApplied && (
                    <span className="inline-block mt-1.5 text-[8px] font-black tracking-widest bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded uppercase animate-pulse">
                      ★ Tarifa Mínima Aplicada (45€)
                    </span>
                  )}
                </div>
                <div className="relative z-10 text-[10px] text-slate-400 font-bold tracking-wider uppercase border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-5 flex flex-col gap-1 shrink-0">
                  <div className="flex justify-between gap-6">
                    <span>Servicio:</span>
                    <span className="text-white font-extrabold">{activeService.title}</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span>Superficie:</span>
                    <span className="text-white font-extrabold">{sqm} m²</span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span>Frecuencia:</span>
                    <span className="text-white font-extrabold">{frequencyDetails[frequency].label.split('(')[0].trim()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                
                {/* 1. Service Type Selector */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Tipo de Servicio
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {servicesData.map((s) => {
                      const isSelected = s.id === selectedServiceId;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => onChangeService(s.id)}
                          className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                          id={`calc-service-tab-${s.id}`}
                        >
                          <div className={`p-2 rounded-full ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-50 text-sky-500'}`}>
                            {s.id === 'hogar' && <Home className="h-4 w-4" />}
                            {s.id === 'oficina' && <Briefcase className="h-4 w-4" />}
                            {s.id === 'comunidad' && <Building2 className="h-4 w-4" />}
                            {s.id === 'fin_obra' && <HardHat className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight uppercase tracking-wider">{s.title}</p>
                            <p className={`text-[10px] font-bold mt-0.5 uppercase tracking-widest ${isSelected ? 'text-sky-300' : 'text-slate-400'}`}>
                              {s.basePricePerSqm.toFixed(2)}€/m²
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Square Meters Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Superficie del Inmueble
                      </label>
                      <div className="mt-0.5 text-[10px] font-bold">
                        {isMinPriceApplied ? (
                          <span className="text-slate-500 uppercase tracking-wider font-semibold">
                            Calculado: <span className="font-mono line-through text-slate-400">{((basePrice * discountFactor) || 0).toFixed(2)}€</span>{' '}
                            <span className="text-amber-500 font-extrabold">★ Tarifa Mínima (45€)</span>
                          </span>
                        ) : (
                          <span className="text-sky-600 uppercase tracking-wider">Tarifa Estimada: <strong className="font-mono text-xs font-black text-slate-900">{calcPrice.toFixed(2)}€</strong></span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="30"
                        max="1000"
                        value={sqm || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            setSqm(0);
                          } else {
                            const num = parseInt(val, 10);
                            setSqm(isNaN(num) ? 0 : num);
                          }
                        }}
                        onBlur={() => {
                          if (!sqm || sqm < 30) {
                            setSqm(30);
                          } else if (sqm > 1000) {
                            setSqm(1000);
                          }
                        }}
                        className="w-16 text-right text-xs font-extrabold text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                        id="input-sqm-manual"
                      />
                      <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider font-mono">m²</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="450"
                    step="5"
                    value={sqm > 450 ? 450 : (sqm || 30)}
                    onChange={(e) => setSqm(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none"
                    id="slider-sqm"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                    <span>Pequeño (30 m²)</span>
                    <span>Medio (120 m²)</span>
                    <span>Grande (450 m²)</span>
                  </div>
                </div>

                {/* 3. Frequency Grid */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Frecuencia Requerida
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(Object.keys(frequencyDetails) as Array<keyof typeof frequencyDetails>).map((key) => {
                      const item = frequencyDetails[key];
                      const isSelected = frequency === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFrequency(key)}
                          className={`p-3 rounded-lg border text-center transition-all text-[10px] font-bold uppercase tracking-widest cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                          id={`calc-freq-tab-${key}`}
                        >
                          <p className="line-clamp-1">{item.label}</p>
                          {item.discount > 0 && (
                            <span className={`text-[8px] block mt-1 font-extrabold tracking-widest ${isSelected ? 'text-sky-300' : 'text-emerald-600'}`}>
                              -{item.discount * 100}% DTO.
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Optional Extras */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Adicionales / Extras
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Extra 1: Cristales */}
                    <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none transition-all ${
                      cristales ? 'bg-white border-slate-400' : 'bg-white border-slate-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={cristales}
                          onChange={(e) => setCristales(e.target.checked)}
                          className="rounded text-slate-900 focus:ring-slate-900 h-4 w-4"
                          id="check-extra-cristales"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Cristales</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase bg-slate-50 px-2 py-0.5 rounded-md shrink-0">+25€</span>
                    </label>

                    {/* Extra 2: Plancha */}
                    {selectedServiceId === 'hogar' && (
                      <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none transition-all ${
                        plancha ? 'bg-white border-slate-400' : 'bg-white border-slate-100'
                      }`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={plancha}
                            onChange={(e) => setPlancha(e.target.checked)}
                            className="rounded text-slate-900 focus:ring-slate-900 h-4 w-4"
                            id="check-extra-plancha"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Plancha</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase bg-slate-50 px-2 py-0.5 rounded-md shrink-0">+20€</span>
                      </label>
                    )}

                    {/* Extra 3: Eco Products */}
                    <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none transition-all ${
                      ecoProducts ? 'bg-white border-slate-400' : 'bg-white border-slate-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={ecoProducts}
                          onChange={(e) => setEcoProducts(e.target.checked)}
                          className="rounded text-slate-900 focus:ring-slate-900 h-4 w-4"
                          id="check-extra-eco"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Eco-Limpieza</span>
                      </div>
                      <span className="text-[8px] font-black text-sky-600 uppercase bg-sky-50 px-2 py-0.5 rounded-md shrink-0">Biodegradable</span>
                    </label>

                    {/* Extra 4: Desinfección */}
                    <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer select-none transition-all ${
                      desinfeccion ? 'bg-white border-slate-400' : 'bg-white border-slate-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={desinfeccion}
                          onChange={(e) => setDesinfeccion(e.target.checked)}
                          className="rounded text-slate-900 focus:ring-slate-900 h-4 w-4"
                          id="check-extra-desinfection"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Desinfectante</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-500 uppercase bg-slate-50 px-2 py-0.5 rounded-md shrink-0">+35€</span>
                    </label>

                  </div>
                </div>

              </div>
            </div>

            {/* Right side: Lead form and Live budget result */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Live Estimate Card - Slate 900 Modern Theme */}
              <div className="bg-slate-950 text-white rounded-xl p-6 shadow-xl relative overflow-hidden border border-slate-900">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-slate-900 rounded-full blur-2xl opacity-50" />
                
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Presupuesto Estimado</h4>
                  {isMinPriceApplied && (
                    <span className="text-[8px] font-black tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded uppercase">
                      Tarifa Mínima
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight text-white">{calcPrice.toFixed(2)}€</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">/ visita</span>
                </div>

                <div className="mt-5 border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-400 uppercase font-semibold tracking-wider">
                  <div className="flex justify-between">
                    <span>Servicio:</span>
                    <span className="text-white font-bold">{activeService.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Superficie:</span>
                    <span className="text-white font-bold">{sqm} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frecuencia:</span>
                    <span className="text-white font-bold">{frequencyDetails[frequency].label}</span>
                  </div>
                  {(cristales || plancha || ecoProducts || desinfeccion) && (
                    <div className="flex justify-between items-start">
                      <span>Extras:</span>
                      <span className="text-white font-bold text-right max-w-[150px] line-clamp-1">
                        {[
                          cristales && 'Cristales',
                          plancha && 'Plancha',
                          ecoProducts && 'Eco',
                          desinfeccion && 'Desinfectante'
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <p className="mt-5 text-[9px] text-slate-500 leading-relaxed uppercase tracking-wider font-semibold">
                  * Precio estimado sin compromiso. Tarifa mínima garantizada: 45€ por visita.
                </p>
              </div>

              {/* Lead Capture Form */}
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white text-[10px] font-bold">2</span>
                  <span>Datos de Reserva</span>
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      placeholder="María García"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                      id="input-form-name"
                    />
                  </div>

                  {/* Contact row: phone, email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        placeholder="600 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                        id="input-form-phone"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        placeholder="maria@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                        id="input-form-email"
                      />
                    </div>
                  </div>

                  {/* Neighborhood Selector */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Barrio / Zona de El Puerto
                    </label>
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all cursor-pointer font-bold uppercase tracking-wider"
                      id="select-form-neighborhood"
                    >
                      <option value="">SELECCIONA TU BARRIO...</option>
                      {neighborhoods.map((n) => (
                        <option key={n} value={n}>
                          {n.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Address Locator */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        Localizador del Domicilio (Dirección exacta)
                      </label>
                      <span className="text-[8px] font-bold text-sky-600 uppercase tracking-wider">Requerido</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="ej. Avda Juan Melgarejo, 2, Bajo B"
                        value={addressLocator}
                        onChange={(e) => setAddressLocator(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg py-2.5 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                        id="input-form-address-locator"
                        required
                      />
                    </div>
                    <p className="mt-1 text-[8px] text-slate-400">Indica la calle, número, portal, piso o datos clave para localizar la propiedad.</p>
                  </div>

                  {/* Special notes */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Notas o detalles específicos (opcional)
                    </label>
                    <textarea
                      placeholder="Indique si tiene mascotas, preferencia horaria, etc..."
                      value={notes}
                      rows={2}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                      id="input-form-notes"
                    />
                  </div>

                  {/* Photo Upload widget */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        Subir fotos del inmueble (opcional)
                      </label>
                      <span className="text-[8px] font-bold text-sky-600 uppercase tracking-wider">Múltiples archivos</span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <label className="flex-1 border border-dashed border-slate-200 bg-white rounded-lg p-3.5 text-center cursor-pointer hover:border-slate-400 transition-all flex flex-col items-center justify-center">
                        <Upload className="h-5 w-5 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Seleccionar fotos</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Sube imágenes para mostrar el estado</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files) {
                              Array.from(files).forEach((file: any) => {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    const base64Str = event.target.result as string;
                                    setUploadedPhotos((prev) => [...prev, base64Str]);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3 p-2 bg-white rounded-lg border border-slate-100">
                        {uploadedPhotos.map((photo, index) => (
                          <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-slate-200 group">
                            <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== index))}
                              className="absolute inset-0 bg-red-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white p-1 rounded cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-800 border border-red-100 text-xs flex items-center gap-1.5 font-semibold">
                      <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest py-4 rounded-lg transition-all cursor-pointer"
                    id="btn-submit-lead"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Enviar Solicitud</span>
                  </button>

                  <p className="text-[9px] text-slate-400 text-center leading-relaxed font-semibold uppercase tracking-wider">
                    Sus datos están protegidos según RGPD. Solo se usarán para esta gestión.
                  </p>

                </form>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
