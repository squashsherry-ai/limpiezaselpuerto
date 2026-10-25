import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    neighborhood: 'Vistahermosa',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-24 bg-white" id="contacto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-100 text-sky-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            <span>Atención Personalizada en El Puerto de Santa María</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900">
            Contacta con <span className="font-semibold text-sky-600">limpiezaselpuerto.com</span>
          </h2>
          <p className="mt-4 text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Estamos disponibles las 24 horas para presupuestos, urgencias y asesoramiento personalizado para tu inmueble.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Company Details Column */}
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                  EP
                </div>
                <div>
                  <h3 className="text-base font-extrabold uppercase tracking-wider text-white">
                    Limpiezas El Puerto
                  </h3>
                  <span className="text-[10px] text-sky-400 font-mono tracking-wider">
                    limpiezaselpuerto.com
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-light mb-8">
                Empresa local de servicios integrales de limpieza, desinfección y mantenimiento técnico en El Puerto de Santa María y Bahía de Cádiz.
              </p>

              <div className="space-y-5 text-xs font-light">
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Atención Telefónica 24h</span>
                    <a href="tel:+34682020758" className="text-sm font-bold text-white hover:text-sky-400 transition-colors">
                      +34 682 020 758
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">WhatsApp Inmediato</span>
                    <a 
                      href="https://wa.me/34682020758?text=Hola,%20contacto%20desde%20limpiezaselpuerto.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold text-emerald-400 hover:underline"
                    >
                      Chat Directo con Coordinación
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Correo Electrónico</span>
                    <a href="mailto:info@limpiezaselpuerto.com" className="text-xs font-semibold text-slate-200 hover:text-sky-400 transition-colors">
                      info@limpiezaselpuerto.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Sede Operativa</span>
                    <p className="text-xs text-slate-300 leading-snug">
                      Avda Juan Melgarejo, 2, 11500, El Puerto de Santa María (Cádiz)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Horario de Servicio</span>
                    <p className="text-xs font-semibold text-sky-400">
                      Lunes a Domingo — 24 Horas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
              <span>CIF y Póliza de RC vigente</span>
              <span className="text-emerald-400 font-bold">● Servicio Activo</span>
            </div>
          </div>

          {/* Quick Callback / Message Form */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
              Solicitar Llamada o Consulta Exprés
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Déjanos tus datos y un responsable de zona te llamará en menos de 15 minutos.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center animate-in fade-in">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                  ¡Mensaje Recibido Correctamente!
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Nos pondremos en contacto contigo al teléfono facilitado para coordinar tu presupuesto.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-emerald-800 underline cursor-pointer"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Ana Fernández"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
                      Teléfono de Contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. 611 22 33 44"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
                      Barrio / Zona en El Puerto
                    </label>
                    <select
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="Vistahermosa">Vistahermosa</option>
                      <option value="Valdelagrana">Valdelagrana</option>
                      <option value="Fuentebravía">Fuentebravía</option>
                      <option value="Las Redes">Las Redes / Costa Oeste</option>
                      <option value="Centro Histórico">Centro Histórico</option>
                      <option value="Crevillet">Crevillet / San José</option>
                      <option value="El Tejar">El Tejar</option>
                      <option value="Otra Zona">Otra Zona en El Puerto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">
                    ¿Qué necesitas limpiar o cuándo te gustaría agendar?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe brevemente: metros aproximados, si es fin de obra, mantenimiento de casa, oficina..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[10px] text-slate-500">
                    🔒 Tratamos tus datos únicamente para atender tu solicitud en limpiezaselpuerto.com.
                  </p>
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5 text-sky-400" />
                    <span>Enviar Solicitud</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
