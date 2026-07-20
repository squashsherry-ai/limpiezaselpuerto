/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, Trash2, Check, RefreshCw, Calendar, Mail, 
  Phone, MapPin, Tag, SquareSquare, SlidersHorizontal, Download, Sparkles,
  Palette, Upload, Image as ImageIcon, Copy, LogOut
} from 'lucide-react';
import { BookingRequest, ServiceType } from '../types';

interface AdminPanelProps {
  bookings: BookingRequest[];
  onUpdateStatus: (id: string, status: 'pendiente' | 'contactado' | 'completado') => void;
  onUpdatePaymentStatus: (id: string, paymentStatus: 'pendiente' | 'pagado') => void;
  onDeleteBooking: (id: string) => void;
  onSeedMockData: () => void;
  onLogout?: () => void;
}

export default function AdminPanel({
  bookings,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onDeleteBooking,
  onSeedMockData,
  onLogout,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'leads' | 'anuncios'>('leads');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterNeighborhood, setFilterNeighborhood] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [filterServiceType, setFilterServiceType] = useState<string>('all');

  // Ad & Flyer Generator States
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [copiedTextIndex, setCopiedTextIndex] = useState<number | null>(null);
  const [template, setTemplate] = useState({
    title: 'Limpieza Profesional de Confianza',
    subtitle: 'Hogares, Oficinas y Comunidades Brillantemente Limpios',
    discount: '10% de Descuento Especial',
    couponCode: 'PUERTO10',
    phone: '682 020 758',
    whatsapp: '682 020 758',
    neighborhoodsText: 'Crevillet, Vistahermosa, Centro, Valdelagrana, El Tejar',
    backgroundColor: 'bg-slate-950',
    accentColor: 'bg-sky-500 text-white',
  });

  const colorPresets = [
    { name: 'Noche Elegante', bg: 'bg-slate-950', accent: 'bg-sky-500 text-white' },
    { name: 'Verde Orgánico', bg: 'bg-emerald-950', accent: 'bg-amber-400 text-slate-950' },
    { name: 'Brillo Solar', bg: 'bg-sky-600', accent: 'bg-white text-sky-600' },
    { name: 'Ceniza Minimalista', bg: 'bg-zinc-900', accent: 'bg-amber-400 text-zinc-900' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBgImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setBgImage(null);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTextIndex(index);
    setTimeout(() => {
      setCopiedTextIndex(null);
    }, 2500);
  };

  const adCopyTemplates = [
    {
      title: 'Promoción de Redes Sociales (Facebook/Instagram)',
      text: `✨ ¡Deja la limpieza en manos de profesionales en El Puerto! ✨
¿Cansado de limpiar después de una larga jornada de trabajo o el fin de semana? En Limpiezas El Puerto nos encargamos de todo con un acabado profesional.

🏠 Hogares impecables
🏢 Oficinas relucientes
🤝 Comunidades cuidadas al detalle

🎁 ¡OFERTA ESPECIAL!: ${template.discount}
🎟️ Usa el cupón: ${template.couponCode}
📍 Cobertura en: ${template.neighborhoodsText}

📞 Llámanos hoy al: ${template.phone}
💬 WhatsApp directo: ${template.whatsapp}
👉 Calcula tu presupuesto online o llámanos ya.`
    },
    {
      title: 'Texto Directo para Campaña de WhatsApp',
      text: `🚀 ¡Hola vecino! Te presentamos una oferta exclusiva de Limpiezas El Puerto.

Ahorra tiempo y disfruta de un hogar u oficina brillante con:
✅ Garantía de calidad (si no te gusta, repetimos gratis en 24h).
✅ Productos ecológicos incluidos.
✅ Equipo local altamente cualificado.

🔥 Aprovecha un ${template.discount} con el código: ${template.couponCode}
📍 Disponible en todo El Puerto de Santa María.

¡Consúltanos sin compromiso!
📞 Teléfono comercial: ${template.phone}
💬 Escríbenos directamente aquí.`
    }
  ];

  // HTML5 Canvas Exporter for Premium Resolution PNG Downloading
  const handleDownloadFlyer = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const executeDraw = (imgElement?: HTMLImageElement) => {
      // 1. Draw Background
      if (imgElement) {
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = imgElement.width / imgElement.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let drawX = 0;
        let drawY = 0;

        if (imgAspect > canvasAspect) {
          drawWidth = canvas.height * imgAspect;
          drawX = (canvas.width - drawWidth) / 2;
        } else {
          drawHeight = canvas.width / imgAspect;
          drawY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(imgElement, drawX, drawY, drawWidth, drawHeight);
        
        // Add dark overlay
        ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Solid BG Presets
        let bgColor = '#090d16'; // default slate-950
        if (template.backgroundColor === 'bg-emerald-950') bgColor = '#022c22';
        if (template.backgroundColor === 'bg-sky-600') bgColor = '#0284c7';
        if (template.backgroundColor === 'bg-zinc-900') bgColor = '#18181b';

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtly drawn vectors for background texture
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.beginPath();
        ctx.arc(1000, 0, 450, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 1000, 300, 0, 2 * Math.PI);
        ctx.fill();
      }

      // 2. Framing Line Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 3. Header
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('LIMPIEZAS EL PUERTO', canvas.width / 2, 100);

      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fillText('• SERVICIO PROFESIONAL DE ALTA CALIDAD EN EL PUERTO •', canvas.width / 2, 140);

      // 4. Badge
      const badgeText = template.discount.toUpperCase();
      ctx.font = 'bold 30px sans-serif';
      const textWidth = ctx.measureText(badgeText).width;
      const badgeW = textWidth + 60;
      const badgeH = 70;
      const badgeX = (canvas.width - badgeW) / 2;
      const badgeY = 220;

      let accentBgColor = '#0ea5e9';
      let accentTextColor = '#ffffff';
      if (template.accentColor.includes('bg-slate-950') || template.accentColor.includes('zinc-900') || template.accentColor.includes('text-zinc-900')) {
        accentBgColor = '#f59e0b';
        accentTextColor = '#18181b';
      } else if (template.accentColor.includes('bg-white')) {
        accentBgColor = '#ffffff';
        accentTextColor = '#0284c7';
      } else if (template.accentColor.includes('bg-amber-400')) {
        accentBgColor = '#fbbf24';
        accentTextColor = '#18181b';
      }

      ctx.fillStyle = accentBgColor;
      ctx.beginPath();
      ctx.roundRect?.(badgeX, badgeY, badgeW, badgeH, 12);
      ctx.fill();

      ctx.fillStyle = accentTextColor;
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(badgeText, canvas.width / 2, badgeY + badgeH / 2 + 1);

      // 5. Title wrapping
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px sans-serif';
      
      const title = template.title.toUpperCase();
      const words = title.split(' ');
      let lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        ctx.font = 'bold 50px sans-serif';
        const width = ctx.measureText(testLine).width;
        if (width < canvas.width - 160) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      lines.push(currentLine);

      let startY = 380;
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * 65);
      });

      // 6. Subtitle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '500 24px sans-serif';
      ctx.fillText(template.subtitle, canvas.width / 2, 580);

      // 7. Coverage
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('ZONAS DE COBERTURA DESTACADAS EN EL PUERTO:', canvas.width / 2, 680);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(template.neighborhoodsText, canvas.width / 2, 720);

      // Footer line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(100, 780);
      ctx.lineTo(canvas.width - 100, 780);
      ctx.stroke();

      // 8. Contact Box
      const infoW = canvas.width - 240;
      const infoH = 120;
      const infoX = 120;
      const infoY = 810;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.beginPath();
      ctx.roundRect?.(infoX, infoY, infoW, infoH, 16);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(infoX, infoY, infoW, infoH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('📞 Llama al: ' + template.phone, canvas.width / 2, infoY + 40);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('🎟️ CÓDIGO CUPÓN: ' + template.couponCode.toUpperCase() + ' (WhatsApp: ' + template.whatsapp + ')', canvas.width / 2, infoY + 82);

      // Trigger actual image download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Anuncio_Limpiezas_El_Puerto_${template.couponCode}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if (bgImage) {
      const img = new Image();
      img.onload = () => executeDraw(img);
      img.src = bgImage;
    } else {
      executeDraw();
    }
  };

  // Filtered lists for leads tab
  const filteredBookings = bookings.filter((b) => {
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchArea = filterNeighborhood === 'all' || b.neighborhood === filterNeighborhood;
    const bPayment = b.paymentStatus || 'pendiente';
    const matchPaymentStatus = filterPaymentStatus === 'all' || bPayment === filterPaymentStatus;
    const matchServiceType = filterServiceType === 'all' || b.serviceType === filterServiceType;
    return matchStatus && matchArea && matchPaymentStatus && matchServiceType;
  });

  const getServiceLabel = (type: ServiceType) => {
    switch (type) {
      case 'hogar': return 'Hogar';
      case 'oficina': return 'Oficina';
      case 'comunidad': return 'Comunidad';
      case 'fin_obra': return 'Fin de Obra';
      default: return type;
    }
  };

  const uniqueNeighborhoods = Array.from(new Set(bookings.map((b) => b.neighborhood)));

  const totalPotentialIncome = bookings
    .filter(b => b.status !== 'pendiente')
    .reduce((sum, b) => sum + b.estimatedPrice, 0);

  const pendingLeadsCount = bookings.filter(b => b.status === 'pendiente').length;

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;
    const headers = ['ID', 'Cliente', 'Email', 'Teléfono', 'Barrio', 'Servicio', 'm2', 'Precio Estimado', 'Estado', 'Fecha'];
    const rows = filteredBookings.map((b) => [
      b.id,
      b.clientName,
      b.email,
      b.phone,
      b.neighborhood,
      getServiceLabel(b.serviceType),
      b.sqm,
      b.estimatedPrice + '€',
      b.status.toUpperCase(),
      b.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leads_Limpiezas_El_Puerto.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-slate-100 border-t border-slate-850" id="panel-admin">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-bold text-[10px] uppercase tracking-widest mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              Gestión Interna
            </div>
            <h2 className="text-3xl font-light tracking-tight text-white uppercase">Panel de Control Interno</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-xl">
              Gestione las solicitudes de presupuesto de vecinos en El Puerto de Santa María y cree contenido promocional de alto impacto para marketing local.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'leads' && bookings.length === 0 && (
              <button
                onClick={onSeedMockData}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white text-[10px] uppercase tracking-widest font-bold py-2.5 px-4 rounded-lg transition-all cursor-pointer"
                id="btn-seed-leads"
              >
                <span>Simular Clientes</span>
              </button>
            )}
            
            {activeTab === 'leads' && (
              <button
                onClick={handleExportCSV}
                disabled={filteredBookings.length === 0}
                className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold py-2.5 px-4 rounded-lg transition-all ${
                  filteredBookings.length > 0
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 cursor-pointer'
                    : 'bg-slate-800/40 text-slate-600 border border-slate-800/40 cursor-not-allowed'
                }`}
                id="btn-export-leads"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Exportar CSV</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-500 text-white text-[10px] uppercase tracking-widest font-bold py-2.5 px-4 rounded-lg transition-all cursor-pointer border border-red-500/20 shadow-lg shadow-red-500/10"
                id="btn-logout-admin-panel"
                title="Cerrar sesión"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 mt-8">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-[10px] uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'border-sky-500 text-sky-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Listado de Leads ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('anuncios')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-[10px] uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === 'anuncios'
                ? 'border-sky-500 text-sky-400 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Creador de Anuncios y Flyers</span>
          </button>
        </div>

        {activeTab === 'leads' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              <div className="bg-[#121B2A] border border-slate-800 rounded-xl p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Peticiones</p>
                <p className="text-3xl font-light mt-2 text-white">{bookings.length}</p>
                <p className="text-[10px] text-slate-500 mt-1">Registradas desde el formulario</p>
              </div>

              <div className="bg-[#121B2A] border border-slate-800 rounded-xl p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pendientes</p>
                <p className="text-3xl font-light mt-2 text-amber-400">{pendingLeadsCount}</p>
                <p className="text-[10px] text-slate-500 mt-1">Requieren atención urgente</p>
              </div>

              <div className="bg-[#121B2A] border border-slate-800 rounded-xl p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volumen Estimado</p>
                <p className="text-3xl font-light mt-2 text-sky-400">{totalPotentialIncome.toFixed(2)}€</p>
                <p className="text-[10px] text-slate-500 mt-1">Suma de leads gestionados</p>
              </div>

              <div className="bg-[#121B2A] border border-slate-800 rounded-xl p-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Zonas Activas</p>
                <p className="text-3xl font-light mt-2 text-emerald-400">
                  {uniqueNeighborhoods.length > 0 ? uniqueNeighborhoods.length : 0}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Áreas con solicitudes activas</p>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-[#121B2A] border border-slate-800 rounded-xl p-4 mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filtros:</span>
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-medium focus:outline-none focus:border-sky-500 uppercase tracking-wider text-[10px]"
                  >
                    <option value="all">TODOS LOS ESTADOS</option>
                    <option value="pendiente">PENDIENTE</option>
                    <option value="contactado">CONTACTADO</option>
                    <option value="completado">COMPLETADO</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterNeighborhood}
                    onChange={(e) => setFilterNeighborhood(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-medium focus:outline-none focus:border-sky-500 uppercase tracking-wider text-[10px]"
                  >
                    <option value="all">TODAS LAS ZONAS</option>
                    {uniqueNeighborhoods.map((n) => (
                      <option key={n} value={n}>{n.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={filterPaymentStatus}
                    onChange={(e) => setFilterPaymentStatus(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-medium focus:outline-none focus:border-sky-500 uppercase tracking-wider text-[10px]"
                    id="filter-payment-status"
                  >
                    <option value="all">TODOS LOS PAGOS</option>
                    <option value="pendiente">PAGO PENDIENTE</option>
                    <option value="pagado">PAGADO</option>
                  </select>
                </div>

                <div>
                  <select
                    value={filterServiceType}
                    onChange={(e) => setFilterServiceType(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-medium focus:outline-none focus:border-sky-500 uppercase tracking-wider text-[10px]"
                    id="filter-service-type"
                  >
                    <option value="all">TODOS LOS SERVICIOS</option>
                    <option value="hogar">HOGAR</option>
                    <option value="oficina">OFICINA</option>
                    <option value="comunidad">COMUNIDAD</option>
                    <option value="fin_obra">FIN DE OBRA</option>
                  </select>
                </div>
              </div>

              <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                Mostrando {filteredBookings.length} de {bookings.length} solicitudes
              </div>
            </div>

            {/* Leads List */}
            {filteredBookings.length === 0 ? (
              <div className="mt-8 border border-dashed border-slate-800 rounded-xl py-20 text-center text-slate-500">
                <Users className="h-10 w-10 mx-auto text-slate-700 mb-3" />
                <p className="text-xs uppercase tracking-widest font-bold">Sin coincidencias</p>
                <p className="text-xs text-slate-500 mt-2">Utilice el simulador de clientes o rellene el formulario de presupuesto.</p>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookings.map((b) => (
                  <div 
                    key={b.id}
                    className="bg-[#121B2A] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between"
                    id={`admin-lead-${b.id}`}
                  >
                    <div>
                      <div className="flex justify-between items-start pb-4 border-b border-slate-800 mb-4">
                        <div>
                          <h4 className="font-bold text-sm text-white uppercase tracking-tight">{b.clientName}</h4>
                          <div className="text-[9px] text-slate-400 mt-1 space-y-1 font-bold uppercase tracking-widest">
                            <p className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-sky-400 shrink-0" />
                              <span>{b.neighborhood}</span>
                            </p>
                            {b.addressLocator && (
                              <p className="text-slate-300 font-medium normal-case tracking-normal border-t border-slate-800/50 pt-1 mt-1 text-[10px]">
                                🏠 {b.addressLocator}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest block ${
                            b.status === 'pendiente' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            b.status === 'contactado' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {b.status}
                          </span>

                          <span className={`text-[8px] font-black px-2.5 py-0.5 rounded uppercase tracking-widest block ${
                            b.paymentStatus === 'pagado'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {b.paymentStatus === 'pagado' ? 'PAGADO ✓' : 'PENDIENTE ⚠️'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span className="uppercase text-[9px] tracking-wider">Servicio:</span>
                          <span className="font-semibold text-slate-200">{getServiceLabel(b.serviceType)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span className="uppercase text-[9px] tracking-wider">Superficie:</span>
                          <span className="font-semibold text-slate-200">{b.sqm} m²</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span className="uppercase text-[9px] tracking-wider">Frecuencia:</span>
                          <span className="font-semibold text-slate-200 uppercase text-[10px]">
                            {b.frequency === 'una_vez' ? 'Una vez' : b.frequency}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400 border-t border-slate-800/60 pt-2.5">
                          <span className="uppercase text-[9px] tracking-wider font-bold">Total Estimado:</span>
                          <span className="font-bold text-sky-400">{b.estimatedPrice.toFixed(2)}€</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                        <a href={`tel:${b.phone}`} className="flex items-center gap-2 hover:text-white transition-colors font-mono">
                          <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>{b.phone}</span>
                        </a>
                        <a href={`mailto:${b.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                          <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{b.email}</span>
                        </a>
                      </div>

                      {b.notes && (
                        <div className="mt-3 text-[10px] text-slate-400 leading-normal bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 italic">
                          &ldquo;{b.notes}&rdquo;
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap gap-1">
                        {b.extras.cristales && <span className="text-[8px] font-bold uppercase tracking-widest bg-slate-900 text-sky-400 px-2 py-0.5 rounded border border-sky-900/20">Cristales</span>}
                        {b.extras.plancha && <span className="text-[8px] font-bold uppercase tracking-widest bg-slate-900 text-amber-400 px-2 py-0.5 rounded border border-amber-900/20">Plancha</span>}
                        {b.extras.ecoProducts && <span className="text-[8px] font-bold uppercase tracking-widest bg-slate-900 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/20">Eco</span>}
                        {b.extras.desinfeccion && <span className="text-[8px] font-bold uppercase tracking-widest bg-slate-900 text-purple-400 px-2 py-0.5 rounded border border-purple-900/20">Ozono</span>}
                      </div>

                      {b.photos && b.photos.length > 0 && (
                        <div className="mt-3.5 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                          <p className="text-[8px] font-extrabold uppercase text-slate-400 tracking-widest mb-1.5">Fotos de la propiedad ({b.photos.length})</p>
                          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-thin">
                            {b.photos.map((photo, pIdx) => (
                              <img
                                key={pIdx}
                                src={photo}
                                alt="Propiedad"
                                className="h-12 w-12 object-cover rounded border border-slate-700 hover:border-slate-500 cursor-pointer transition-all shrink-0"
                                onClick={() => {
                                  const win = window.open();
                                  if (win) {
                                    win.document.write(`<img src="${photo}" style="max-width:100%; height:auto;" />`);
                                  }
                                }}
                                referrerPolicy="no-referrer"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {b.status === 'pendiente' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'contactado')}
                            className="flex items-center gap-1 bg-sky-500 hover:bg-sky-400 text-white text-[8px] font-black uppercase tracking-widest px-3 py-2 rounded transition-colors cursor-pointer"
                            id={`btn-contacted-lead-${b.id}`}
                          >
                            Contactar
                          </button>
                        )}
                        {b.status === 'contactado' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'completado')}
                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-2 rounded transition-colors cursor-pointer"
                            id={`btn-complete-lead-${b.id}`}
                          >
                            Completar
                          </button>
                        )}

                        <button
                          onClick={() => onUpdatePaymentStatus(b.id, b.paymentStatus === 'pagado' ? 'pendiente' : 'pagado')}
                          className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-3 py-2 rounded transition-colors border cursor-pointer ${
                            b.paymentStatus === 'pagado'
                              ? 'bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 border-rose-900/40'
                              : 'bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 border-emerald-900/40'
                          }`}
                          title="Cambiar estado de pago"
                        >
                          {b.paymentStatus === 'pagado' ? 'Marcar Pendiente' : 'Marcar Pagado'}
                        </button>
                      </div>

                      <button
                        onClick={() => onDeleteBooking(b.id)}
                        className="h-8 w-8 flex items-center justify-center bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-white rounded border border-red-900/30 transition-all cursor-pointer"
                        title="Eliminar Lead"
                        id={`btn-delete-lead-${b.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* CREADOR DE ANUNCIOS Y FLYERS TAB */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            {/* Controls */}
            <div className="space-y-6">
              <div className="bg-[#121B2A] border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-sky-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Personalizar Contenido</span>
                </h3>

                {/* Preajustes de Color */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estilo y Paleta</label>
                  <div className="grid grid-cols-2 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setTemplate({
                            ...template,
                            backgroundColor: preset.bg,
                            accentColor: preset.accent,
                          });
                        }}
                        className={`flex items-center gap-1.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                          template.backgroundColor === preset.bg
                            ? 'border-sky-500 bg-sky-950/20'
                            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                        }`}
                      >
                        <span className={`h-3.5 w-3.5 rounded-full ${preset.bg} border border-slate-700 shrink-0`} />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 truncate">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subir foto de fondo */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Imagen de Fondo Personalizada</label>
                  {!bgImage ? (
                    <label className="flex flex-col items-center justify-center border border-dashed border-slate-800 hover:border-slate-700 rounded-lg p-5 cursor-pointer transition-colors bg-slate-900/40 group">
                      <Upload className="h-5 w-5 text-slate-500 group-hover:text-sky-400 mb-1.5 transition-colors" />
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Subir foto (.png, .jpg)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <img src={bgImage} className="h-8 w-8 rounded object-cover border border-slate-700" alt="Subida" />
                        <span className="text-[10px] font-mono text-slate-400">Imagen de fondo activa</span>
                      </div>
                      <button
                        onClick={handleRemoveImage}
                        className="text-[9px] font-bold text-red-400 hover:text-red-300 uppercase tracking-widest cursor-pointer"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>

                {/* Text inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Oferta / Descuento</label>
                    <input
                      type="text"
                      value={template.discount}
                      onChange={(e) => setTemplate({ ...template, discount: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Código Cupón</label>
                    <input
                      type="text"
                      value={template.couponCode}
                      onChange={(e) => setTemplate({ ...template, couponCode: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Título Principal</label>
                  <input
                    type="text"
                    value={template.title}
                    onChange={(e) => setTemplate({ ...template, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Subtítulo Descriptivo</label>
                  <input
                    type="text"
                    value={template.subtitle}
                    onChange={(e) => setTemplate({ ...template, subtitle: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Teléfono Fijo</label>
                    <input
                      type="text"
                      value={template.phone}
                      onChange={(e) => setTemplate({ ...template, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Móvil/WhatsApp</label>
                    <input
                      type="text"
                      value={template.whatsapp}
                      onChange={(e) => setTemplate({ ...template, whatsapp: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Zonas Destacadas</label>
                  <input
                    type="text"
                    value={template.neighborhoodsText}
                    onChange={(e) => setTemplate({ ...template, neighborhoodsText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  onClick={handleDownloadFlyer}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg shadow-lg transition-all cursor-pointer mt-4"
                  id="btn-download-flyer-canvas"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar Cartel en PNG</span>
                </button>
              </div>
            </div>

            {/* Visual Preview & Copies Column */}
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 self-start">Vista Previa Digital (Formato Cuadrado 1:1)</p>
              
              <div 
                className="relative w-full aspect-square rounded-2xl p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800/80 transition-all duration-300"
                style={{
                  backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Fallback template background if there's no custom bgImage */}
                {!bgImage && (
                  <div className={`absolute inset-0 ${template.backgroundColor} transition-all duration-300`} />
                )}

                {/* Dark overlay for readability */}
                {bgImage && (
                  <div className="absolute inset-0 bg-slate-950/75 transition-all" />
                )}

                {/* Fine borders layout */}
                <div className="absolute inset-4 border border-white/10 rounded-xl pointer-events-none" />

                {/* Flyer content */}
                <div className="relative z-10 flex flex-col justify-between h-full text-center">
                  
                  {/* Top brand */}
                  <div>
                    <h4 className="text-sm font-black tracking-widest text-white uppercase">Limpiezas El Puerto</h4>
                    <p className="text-[8px] tracking-widest text-slate-400 uppercase font-black mt-1">Servicio de Calidad en El Puerto de Santa María</p>
                    <div className="h-[1px] w-1/3 bg-white/15 mx-auto mt-3" />
                  </div>

                  {/* Mid Title & Badge */}
                  <div className="my-auto space-y-4">
                    <div className="inline-block">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md ${template.accentColor} shadow-md`}>
                        {template.discount}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight uppercase tracking-tight max-w-sm mx-auto">
                      {template.title}
                    </h2>
                    <p className="text-xs text-slate-300 font-light max-w-xs mx-auto">
                      {template.subtitle}
                    </p>
                  </div>

                  {/* Bottom details */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Cobertura en:</p>
                      <p className="text-[10px] text-white font-bold uppercase tracking-wider px-2 truncate">
                        {template.neighborhoodsText}
                      </p>
                    </div>

                    {/* Footer callout box */}
                    <div className="bg-slate-950/60 backdrop-blur-sm border border-white/10 rounded-xl p-3.5 space-y-1">
                      <p className="text-[14px] font-black text-white flex items-center justify-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-sky-400" />
                        <span>{template.phone}</span>
                      </p>
                      <p className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">
                        Cupón: {template.couponCode}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Marketing copy presets */}
              <div className="w-full mt-6 space-y-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest self-start">Copias Listas para Redes Sociales</p>
                {adCopyTemplates.map((copy, index) => (
                  <div key={index} className="bg-[#121B2A] border border-slate-800 rounded-xl p-4.5 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider truncate max-w-[200px]">{copy.title}</span>
                      <button
                        onClick={() => handleCopyText(copy.text, index)}
                        className={`flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold py-1 px-2.5 rounded transition-all cursor-pointer ${
                          copiedTextIndex === index
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {copiedTextIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedTextIndex === index ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                      {copy.text}
                    </pre>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
