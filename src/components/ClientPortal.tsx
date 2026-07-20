import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, Calendar, CreditCard, Sparkles, Upload, Trash2, 
  ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, 
  User, MapPin, Eye, Info, Lock, ChevronRight, FileText
} from 'lucide-react';
import { BookingRequest, ServiceType, SimulatedEmail } from '../types';

interface ClientPortalProps {
  bookings: BookingRequest[];
  onUpdateBooking: (updated: BookingRequest) => void;
  onNavigateHome: () => void;
  // Trigger simulation of sent emails
  sentEmails: SimulatedEmail[];
  onAddSimulatedEmail: (email: SimulatedEmail) => void;
}

export default function ClientPortal({
  bookings,
  onUpdateBooking,
  onNavigateHome,
  sentEmails,
  onAddSimulatedEmail,
}: ClientPortalProps) {
  const [emailInput, setEmailInput] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('limpiezas_el_puerto_client_email') || null;
  });
  const [loginError, setLoginError] = useState('');
  
  // Photo upload states
  const [uploadingBookingId, setUploadingBookingId] = useState<string | null>(null);
  
  // Payment modal states
  const [paymentBooking, setPaymentBooking] = useState<BookingRequest | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bizum'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bizumPhone, setBizumPhone] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Email client simulator state
  const [activeEmailTab, setActiveEmailTab] = useState<'all' | 'unread'>('all');
  const [selectedEmail, setSelectedEmail] = useState<SimulatedEmail | null>(null);
  const [showEmailInbox, setShowEmailInbox] = useState(false);

  // Get active client bookings
  const clientBookings = bookings.filter(
    (b) => b.email.trim().toLowerCase() === currentUserEmail?.trim().toLowerCase()
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail) {
      setLoginError('Por favor, introduzca su dirección de correo electrónico.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setLoginError('Por favor, introduzca un correo electrónico válido.');
      return;
    }

    // Check if there are bookings with this email
    const count = bookings.filter((b) => b.email.trim().toLowerCase() === cleanEmail).length;
    
    // Log them in anyway (they can create a booking if they don't have one)
    setCurrentUserEmail(cleanEmail);
    localStorage.setItem('limpiezas_el_puerto_client_email', cleanEmail);
    setLoginError('');
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
    localStorage.removeItem('limpiezas_el_puerto_client_email');
    setEmailInput('');
  };

  const handleQuickLogin = (demoEmail: string) => {
    setCurrentUserEmail(demoEmail);
    localStorage.setItem('limpiezas_el_puerto_client_email', demoEmail);
    setEmailInput(demoEmail);
  };

  // Image Upload handler
  const handlePhotoUpload = (bookingId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const currentPhotos = booking.photos || [];

    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Str = event.target.result as string;
          // Avoid duplicate photos
          if (!currentPhotos.includes(base64Str)) {
            const updatedBooking = {
              ...booking,
              photos: [...currentPhotos, base64Str]
            };
            onUpdateBooking(updatedBooking);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = (bookingId: string, photoIndex: number) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const currentPhotos = booking.photos || [];
    const updatedPhotos = currentPhotos.filter((_, idx) => idx !== photoIndex);
    
    const updatedBooking = {
      ...booking,
      photos: updatedPhotos
    };
    onUpdateBooking(updatedBooking);
  };

  // Start Payment flow
  const handleOpenPayment = (booking: BookingRequest) => {
    setPaymentBooking(booking);
    setCardNumber('');
    setCardName(booking.clientName || '');
    setCardExpiry('');
    setCardCvv('');
    setBizumPhone(booking.phone.replace(/\s+/g, '') || '');
    setPaymentSuccess(false);
    setIsProcessingPayment(false);
  };

  const handleProcessPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentBooking) return;

    if (paymentMethod === 'card') {
      if (cardNumber.length < 15 || !cardExpiry || cardCvv.length < 3) {
        alert('Por favor, rellene todos los campos de la tarjeta correctamente.');
        return;
      }
    } else {
      if (bizumPhone.length < 9) {
        alert('Por favor, introduzca un número de teléfono de Bizum válido.');
        return;
      }
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      // Update booking to paid
      const updatedBooking: BookingRequest = {
        ...paymentBooking,
        paymentStatus: 'pagado',
        status: paymentBooking.status === 'pendiente' ? 'contactado' : paymentBooking.status
      };
      
      onUpdateBooking(updatedBooking);

      // Auto-generate confirmation receipt email
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      const emailObj: SimulatedEmail = {
        id: 'MAIL-' + Math.floor(10000 + Math.random() * 90000),
        to: paymentBooking.email,
        subject: `✓ Confirmación de Pago Recibido - Reserva ${paymentBooking.id}`,
        sentAt: `${now.toLocaleDateString('es-ES')} ${timeStr}`,
        type: 'pago',
        read: false,
        body: `¡Hola ${paymentBooking.clientName}!
        
Hemos recibido correctamente el pago por adelantado de tu reserva de limpieza profesional. Tu reserva ha quedado oficialmente CONFIRMADA.

=========================================
DETALLES DEL RECIBO DE PAGO
=========================================
Referencia de Reserva: ${paymentBooking.id}
Concepto: Servicio de Limpieza de ${getServiceLabel(paymentBooking.serviceType)} (${paymentBooking.sqm} m²)
Método de Pago: ${paymentMethod === 'card' ? 'Tarjeta Bancaria (Terminando en ' + cardNumber.slice(-4) + ')' : 'Bizum instantáneo (' + bizumPhone + ')'}
Importe Abonado: ${paymentBooking.estimatedPrice.toFixed(2)}€ (I.V.A. incluido)
Estado de la Reserva: CONFIRMADA & PROGRAMADA
Domicilio: ${paymentBooking.addressLocator || 'No especificado'}

Nuestro equipo se pondrá en contacto contigo telefónicamente al número ${paymentBooking.phone} para terminar de coordinar los detalles de acceso a tu propiedad.

Si necesitas realizar alguna modificación en tu reserva o adjuntar fotos de tu inmueble, puedes acceder en cualquier momento a tu Área de Cliente con tu correo electrónico.

Muchas gracias por confiar en Limpiezas El Puerto.

Atentamente,
El Equipo de Coordinación
Limpiezas El Puerto S.L.
Teléfono: 682 020 758
Avda Juan Melgarejo, 2, 11500, El Puerto de Santa María, Cádiz`
      };

      onAddSimulatedEmail(emailObj);
      
      // Auto open simulated inbox notification
      setTimeout(() => {
        setShowEmailInbox(true);
      }, 1000);

    }, 1800);
  };

  const getServiceLabel = (type: ServiceType) => {
    switch (type) {
      case 'hogar': return 'Hogar';
      case 'oficina': return 'Oficina';
      case 'comunidad': return 'Comunidad';
      case 'fin_obra': return 'Fin de Obra';
      default: return type;
    }
  };

  return (
    <div className="py-12 md:py-20 bg-slate-50 min-h-[80vh]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-bold text-[10px] uppercase tracking-widest mb-1.5">
              <Lock className="h-3 w-3 text-sky-500" />
              <span>Espacio Privado del Cliente</span>
            </div>
            <h2 className="text-3xl font-light tracking-tight text-slate-900 uppercase">
              Portal de Clientes
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-widest py-2.5 px-4 rounded-lg transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver a la Web</span>
            </button>

            {currentUserEmail && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold uppercase tracking-widest py-2.5 px-4 rounded-lg transition-all"
              >
                <span>Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>

        {/* LOGIN SCREEN */}
        {!currentUserEmail ? (
          <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl shadow-xl p-8 mt-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 to-indigo-500" />
            
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-500 mb-3 border border-sky-100">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Consultar mis Reservas</h3>
              <p className="text-xs text-slate-500 mt-2">
                Introduce el correo que usaste al solicitar tu presupuesto para ver tus reservas, subir fotos de tu casa y realizar el pago de confirmación.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="ejemplo@outlook.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-mono"
                    autoFocus
                  />
                </div>
              </div>

              {loginError && (
                <div className="text-xs text-red-500 font-semibold flex items-center gap-1 bg-red-50 p-2.5 rounded-lg border border-red-100">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
              >
                Acceder a mis datos
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
                ¿Quieres probar la simulación? Acceso Demo rápido:
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleQuickLogin('marta.soler@outlook.com')}
                  className="w-full flex items-center justify-between text-left text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 transition-colors cursor-pointer"
                >
                  <div className="font-mono">
                    <span className="font-sans font-semibold text-slate-950 block">Marta Soler (Demo)</span>
                    marta.soler@outlook.com
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed mt-4">
                  O crea un presupuesto nuevo en la calculadora principal con tu propio correo y vuelve aquí para pagarlo e interactuar con él.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* CLIENT DASHBOARD CONTENT */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Profile info, simulator indicator, simulated inbox selector */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white font-bold">
                    {currentUserEmail.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 break-all">{currentUserEmail}</h3>
                    <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Cliente Registrado</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Solicitudes registradas:</span>
                    <span className="font-bold text-slate-900">{clientBookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado del Portal:</span>
                    <span className="font-bold text-emerald-600 uppercase text-[10px] flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" /> Encriptado
                    </span>
                  </div>
                </div>
              </div>

              {/* SIMULATED EMAIL INBOX COMPONENT (Super Interactive and Premium!) */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
                <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Mail className="h-4 w-4 text-sky-400" />
                      {sentEmails.filter(e => e.to.toLowerCase() === currentUserEmail.toLowerCase() && !e.read).length > 0 && (
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white">Simulador de Correo</span>
                  </div>
                  
                  <span className="text-[8px] font-black tracking-wider bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded border border-sky-500/20">
                    TEST SANDBOX
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Visualiza en tiempo real los correos automáticos transaccionales que nuestro sistema envía a tu dirección de correo electrónico.
                  </p>

                  <button
                    onClick={() => setShowEmailInbox(true)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all border border-slate-700 cursor-pointer shadow-md"
                  >
                    <Mail className="h-3.5 w-3.5 text-sky-400" />
                    <span>Ver mi Bandeja de Entrada ({sentEmails.filter(e => e.to.toLowerCase() === currentUserEmail.toLowerCase()).length})</span>
                  </button>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-emerald-900">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                  <span>Reserva 100% Garantizada</span>
                </h4>
                <p className="text-[11px] leading-relaxed text-emerald-700">
                  En Limpiezas El Puerto requerimos el pago por adelantado para formalizar y bloquear el día de tu reserva. Si surge cualquier imprevisto, puedes cancelar de manera gratuita hasta 24h antes y recibirás tu reembolso completo en el acto.
                </p>
              </div>

            </div>

            {/* RIGHT COLUMN: Bookings List & detail controls */}
            <div className="lg:col-span-2 space-y-6">
              
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Mis Solicitudes de Presupuesto y Limpieza
              </h3>

              {clientBookings.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-md">
                  <Info className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-800 font-bold uppercase tracking-wider text-sm">No tienes reservas activas</p>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                    Aún no hemos registrado ninguna solicitud de limpieza con la dirección de correo <span className="font-mono text-slate-900 font-bold">{currentUserEmail}</span>.
                  </p>
                  <button
                    onClick={onNavigateHome}
                    className="mt-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-md"
                  >
                    Calcular Presupuesto al Instante
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {clientBookings.map((b) => (
                    <div 
                      key={b.id} 
                      className="bg-white border border-slate-100 rounded-2xl shadow-md overflow-hidden flex flex-col justify-between"
                      id={`client-booking-card-${b.id}`}
                    >
                      {/* Top banner status indicator */}
                      <div className={`px-6 py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-between ${
                        b.paymentStatus === 'pagado'
                          ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-b border-amber-100'
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${b.paymentStatus === 'pagado' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                          <span>
                            {b.paymentStatus === 'pagado' ? '✓ Reserva Confirmada (Pagado)' : '⚠️ Pendiente de Pago (Pre-Reserva)'}
                          </span>
                        </div>
                        
                        <span className="font-mono text-xs text-slate-500">
                          ID: {b.id}
                        </span>
                      </div>

                      {/* Main card inner layout */}
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                          
                          {/* Booking Details */}
                          <div className="space-y-3">
                            <h4 className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Detalles del Servicio</h4>
                            
                            <div className="space-y-2 text-xs text-slate-700">
                              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                                <span className="text-slate-500">Servicio solicitado:</span>
                                <span className="font-bold text-slate-900">{getServiceLabel(b.serviceType)}</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                                <span className="text-slate-500">Superficie del inmueble:</span>
                                <span className="font-semibold text-slate-900 font-mono">{b.sqm} m²</span>
                              </div>
                              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                                <span className="text-slate-500">Frecuencia elegida:</span>
                                <span className="font-semibold text-slate-900 uppercase text-[10px]">
                                  {b.frequency === 'una_vez' ? 'Una vez' : b.frequency}
                                </span>
                              </div>
                              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                                <span className="text-slate-500">Ubicación (Barrio):</span>
                                <span className="font-semibold text-slate-900 uppercase text-[10px] flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 text-sky-500 shrink-0" /> {b.neighborhood}
                                </span>
                              </div>
                              {b.addressLocator && (
                                <div className="flex justify-between border-b border-slate-50 pb-1.5">
                                  <span className="text-slate-500">Domicilio:</span>
                                  <span className="font-semibold text-slate-900 text-right truncate max-w-[180px]" title={b.addressLocator}>
                                    {b.addressLocator}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-slate-500">Fecha de solicitud:</span>
                                <span className="font-mono text-slate-600">{b.createdAt}</span>
                              </div>
                            </div>

                            {/* Extra Options display */}
                            <div className="pt-2">
                              <span className="text-slate-400 text-[9px] uppercase font-bold tracking-widest block mb-1.5">Extras Incluidos:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {b.extras.cristales && <span className="text-[9px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2.5 py-1 rounded-md border border-sky-100">Cristales</span>}
                                {b.extras.plancha && <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-100">Plancha</span>}
                                {b.extras.ecoProducts && <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100">Bio Ecológico</span>}
                                {b.extras.desinfeccion && <span className="text-[9px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-100">Desinfección Ozono</span>}
                                {!b.extras.cristales && !b.extras.plancha && !b.extras.ecoProducts && !b.extras.desinfeccion && (
                                  <span className="text-[9px] text-slate-400 italic">Ningún extra seleccionado</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Price & Payments and Photo Upload Box */}
                          <div className="flex flex-col justify-between space-y-6">
                            
                            {/* Summary Box */}
                            <div className="bg-slate-900 text-white rounded-xl p-5 relative overflow-hidden border border-slate-950">
                              <div className="absolute right-0 bottom-0 h-16 w-16 bg-slate-800 rounded-full blur-xl opacity-40 pointer-events-none" />
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Importe Total</span>
                              
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold tracking-tight">{b.estimatedPrice.toFixed(2)}€</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">/ visita</span>
                              </div>
                              
                              <p className="text-[9px] text-slate-400 mt-2 leading-relaxed uppercase tracking-wider">
                                * I.V.A. incluido. Precio garantizado sin cargos sorpresa.
                              </p>
                            </div>

                            {/* Payment actions directly displayed inside the card */}
                            <div>
                              {b.paymentStatus !== 'pagado' ? (
                                <div className="space-y-2.5">
                                  <div className="bg-amber-50 text-amber-900 border border-amber-100 rounded-xl p-3.5 text-xs">
                                    <div className="flex items-start gap-2">
                                      <Info className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                                      <p className="leading-relaxed">
                                        Esta reserva es temporal. **Requiere pago por adelantado para ser programada y confirmada** por nuestro personal técnico.
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleOpenPayment(b)}
                                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl shadow-emerald-500/10 cursor-pointer flex items-center justify-center gap-2"
                                  >
                                    <CreditCard className="h-4 w-4" />
                                    <span>Pagar y Confirmar Reserva</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl p-4 text-xs space-y-2.5">
                                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                                    <span className="uppercase tracking-wider">¡Reserva Confirmada!</span>
                                  </div>
                                  <p className="leading-relaxed text-emerald-700">
                                    Tu pago de <span className="font-mono font-bold text-emerald-900">{b.estimatedPrice.toFixed(2)}€</span> se ha procesado con éxito. El servicio está reservado. Nos vemos pronto.
                                  </p>
                                </div>
                              )}
                            </div>

                          </div>
                        </div>

                        {/* PHOTO UPLOAD OPTION IN RESERVATION */}
                        <div className="pt-6">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="text-slate-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Upload className="h-4 w-4 text-sky-500" />
                                <span>Fotos del Inmueble ({b.photos?.length || 0})</span>
                              </h4>
                              <p className="text-[10px] text-slate-500 mt-1">
                                Añade fotos de las estancias o áreas problemáticas para que los limpiadores vengan preparados con las herramientas exactas.
                              </p>
                            </div>

                            <label className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5">
                              <Upload className="h-3 w-3" />
                              <span>Subir Fotos</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(b.id, e)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Photos Grid Container */}
                          {!b.photos || b.photos.length === 0 ? (
                            <div className="border border-dashed border-slate-200 rounded-xl py-6 text-center text-slate-400 bg-slate-50 flex flex-col items-center justify-center">
                              <Upload className="h-6 w-6 text-slate-300 mb-1.5" />
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">No hay fotos subidas todavía</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">Sube imágenes para que nuestro equipo evalúe la propiedad con más precisión.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
                              {b.photos.map((photo, pIdx) => (
                                <div key={pIdx} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-100 bg-slate-50 shadow-xs">
                                  <img 
                                    src={photo} 
                                    alt={`Foto de propiedad ${pIdx + 1}`}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        const win = window.open();
                                        if (win) {
                                          win.document.write(`<img src="${photo}" style="max-width:100%; height:auto;" />`);
                                        }
                                      }}
                                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
                                      title="Ampliar"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePhoto(b.id, pIdx)}
                                      className="p-1.5 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-colors cursor-pointer"
                                      title="Eliminar foto"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* FULL PAYMENT MODAL */}
      {paymentBooking && !paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-950 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">Pago Seguro de Confirmación</h3>
                <p className="text-xs text-slate-500 mt-1">Reserva Ref: <span className="font-mono font-bold text-slate-900">{paymentBooking.id}</span></p>
              </div>
              <button
                onClick={() => setPaymentBooking(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg"
              >
                <XButton />
              </button>
            </div>

            {/* Price indicator banner */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center my-5">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total a pagar ahora:</span>
              <span className="text-2xl font-black text-sky-600 font-mono">{paymentBooking.estimatedPrice.toFixed(2)}€</span>
            </div>

            {/* Payment tab selections */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Tarjeta Bancaria</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bizum')}
                className={`py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'bizum'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Phone className="h-4 w-4" />
                <span>Bizum</span>
              </button>
            </div>

            <form onSubmit={handleProcessPaymentSubmit} className="space-y-4">
              {paymentMethod === 'card' ? (
                /* CREDIT CARD VIEW AND PREMIUM VISUALIZATION */
                <div className="space-y-4">
                  {/* Premium Credit Card Graphic */}
                  <div className="relative h-44 w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-sky-950 p-6 text-white shadow-xl overflow-hidden">
                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
                    
                    <div className="flex justify-between items-start">
                      <div className="flex h-10 w-12 items-center justify-center rounded-md bg-white/10 border border-white/20">
                        <CreditCard className="h-6 w-6 text-sky-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">VISA / MASTERCARD</span>
                    </div>

                    <div className="mt-8">
                      <span className="font-mono text-lg tracking-widest block text-slate-200">
                        {cardNumber ? formatCardNumberDisplay(cardNumber) : '•••• •••• •••• ••••'}
                      </span>
                    </div>

                    <div className="mt-6 flex justify-between items-end">
                      <div>
                        <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Titular de la tarjeta</span>
                        <span className="text-xs uppercase tracking-wide font-bold block max-w-[200px] truncate">
                          {cardName || 'NOMBRE APELLIDOS'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[7px] text-slate-500 uppercase tracking-widest block">Caducidad</span>
                        <span className="font-mono text-xs font-bold block">{cardExpiry || 'MM/AA'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card input fields */}
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre del Titular</label>
                      <input
                        type="text"
                        placeholder="Marta Soler"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Número de Tarjeta</label>
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="4500 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 font-mono"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expiración (MM/AA)</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val.length === 2 && !val.includes('/')) {
                              val += '/';
                            }
                            setCardExpiry(val);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 font-mono"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">CVV / Cód. Seguridad</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* BIZUM VIEW */
                <div className="space-y-4">
                  <div className="bg-[#00A3A0]/10 border border-[#00A3A0]/20 rounded-2xl p-5 text-center">
                    <span className="text-[9px] font-black tracking-widest bg-[#00A3A0] text-white px-3 py-1 rounded-full uppercase">
                      BIZUM INSTANTÁNEO
                    </span>
                    <p className="text-xs text-slate-600 mt-4 max-w-sm mx-auto leading-relaxed">
                      Introduce tu número de teléfono registrado en Bizum. Recibirás una notificación push instantánea en tu app bancaria para autorizar la transacción.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teléfono de Bizum</label>
                    <input
                      type="text"
                      maxLength={9}
                      placeholder="600123456"
                      value={bizumPhone}
                      onChange={(e) => setBizumPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00A3A0] text-center font-mono text-lg font-bold tracking-widest"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setPaymentBooking(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className={`flex-1 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all cursor-pointer text-white flex items-center justify-center gap-2 ${
                    isProcessingPayment 
                      ? 'bg-slate-400 cursor-not-allowed'
                      : paymentMethod === 'card' 
                        ? 'bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/10' 
                        : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/10'
                  }`}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>Proceder al Pago</span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Pasarela Encriptada Segura SSL de 256 bits
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FULL SIMULATED EMAIL INBOX DRAWER / OVERLAY */}
      {showEmailInbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-2xl h-full max-h-[90vh] bg-[#0A111F] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100">
            
            {/* Header of Simulated Inbox */}
            <div className="bg-slate-950 p-5 border-b border-slate-800 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Bandeja de Entrada Simulada</h3>
                  <p className="text-[10px] text-slate-400 font-semibold font-mono tracking-wide">{currentUserEmail}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowEmailInbox(false);
                  setSelectedEmail(null);
                }}
                className="text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 p-2 rounded-lg"
              >
                <XButton />
              </button>
            </div>

            {/* Inner Inbox Layout */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              
              {/* If an email is selected, show details. Otherwise show list */}
              {selectedEmail ? (
                /* EMAIL DETAILS VIEW */
                <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
                  <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between shrink-0">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-sky-400 hover:text-sky-300 font-bold"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Volver al listado
                    </button>

                    <span className="text-[8px] font-black tracking-widest bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded border border-slate-700 font-mono">
                      {selectedEmail.id}
                    </span>
                  </div>

                  <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div>
                      <h4 className="text-base font-bold text-white tracking-tight">{selectedEmail.subject}</h4>
                      
                      <div className="mt-4 flex justify-between items-start text-xs border-b border-slate-800/60 pb-4">
                        <div>
                          <p className="text-slate-300 font-bold">De: <span className="text-sky-400">no-reply@limpiezaselpuerto.com</span></p>
                          <p className="text-slate-400 font-semibold mt-1">Para: <span className="font-mono text-slate-300">{selectedEmail.to}</span></p>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{selectedEmail.sentAt}</span>
                      </div>
                    </div>

                    <div className="text-xs leading-relaxed text-slate-300 whitespace-pre-wrap font-mono bg-slate-950 p-4 rounded-xl border border-slate-850">
                      {selectedEmail.body}
                    </div>
                  </div>
                </div>
              ) : (
                /* EMAILS LIST VIEW */
                <div className="flex-1 flex flex-col min-h-0">
                  
                  {/* Tabs: Todos / No leídos */}
                  <div className="flex bg-slate-950 border-b border-slate-800 shrink-0 text-[10px] font-bold uppercase tracking-widest">
                    <button
                      onClick={() => setActiveEmailTab('all')}
                      className={`flex-1 py-3 border-b-2 text-center ${
                        activeEmailTab === 'all' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Todos ({sentEmails.filter(e => e.to.toLowerCase() === currentUserEmail.toLowerCase()).length})
                    </button>
                    <button
                      onClick={() => setActiveEmailTab('unread')}
                      className={`flex-1 py-3 border-b-2 text-center ${
                        activeEmailTab === 'unread' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      No Leídos ({sentEmails.filter(e => e.to.toLowerCase() === currentUserEmail.toLowerCase() && !e.read).length})
                    </button>
                  </div>

                  {/* Mail list render */}
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-850 bg-slate-900">
                    {sentEmails.filter(e => {
                      const matchTo = e.to.toLowerCase() === currentUserEmail.toLowerCase();
                      const matchUnread = activeEmailTab === 'all' || !e.read;
                      return matchTo && matchUnread;
                    }).length === 0 ? (
                      <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center">
                        <Mail className="h-8 w-8 text-slate-700 mb-3" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Bandeja de Entrada Vacía</p>
                        <p className="text-[9px] text-slate-500 mt-1 max-w-xs mx-auto px-4">
                          No se han detectado correos para este cliente. Registra una reserva en la web o haz un pago para simular envíos automáticos.
                        </p>
                      </div>
                    ) : (
                      sentEmails
                        .filter(e => {
                          const matchTo = e.to.toLowerCase() === currentUserEmail.toLowerCase();
                          const matchUnread = activeEmailTab === 'all' || !e.read;
                          return matchTo && matchUnread;
                        })
                        .map((email) => (
                          <button
                            key={email.id}
                            onClick={() => {
                              setSelectedEmail(email);
                              email.read = true; // Mark as read
                            }}
                            className={`w-full text-left p-4 hover:bg-slate-800/50 transition-colors flex justify-between items-start gap-4 ${
                              !email.read ? 'bg-slate-850/30' : ''
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1.5">
                                {!email.read && (
                                  <span className="h-2 w-2 rounded-full bg-sky-400 shrink-0" />
                                )}
                                <span className={`text-xs uppercase font-extrabold tracking-wide truncate block ${!email.read ? 'text-white' : 'text-slate-400'}`}>
                                  {email.type === 'confirmacion' ? '✉ Confirmación de Presupuesto' : '✓ Justificante de Pago'}
                                </span>
                              </div>
                              <h4 className={`text-xs tracking-tight truncate ${!email.read ? 'font-bold text-white' : 'text-slate-300'}`}>
                                {email.subject}
                              </h4>
                              <p className="text-[10px] text-slate-400 truncate mt-1 max-w-md">
                                {email.body.replace(/\s+/g, ' ')}
                              </p>
                            </div>

                            <span className="text-[9px] text-slate-500 font-mono shrink-0 pt-0.5">
                              {email.sentAt}
                            </span>
                          </button>
                        ))
                    )}
                  </div>

                </div>
              )}

            </div>

            {/* Footer of simulated inbox */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 text-center shrink-0">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
                <Info className="h-3.5 w-3.5 text-sky-400" /> Los correos simulados son visuales para depuración de la experiencia de usuario.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent visual helpers
function formatCardNumberDisplay(num: string): string {
  const chunks = num.match(/.{1,4}/g);
  return chunks ? chunks.join(' ') : num;
}

function XButton() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
