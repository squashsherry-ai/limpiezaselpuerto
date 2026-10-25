import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContact() {
  const whatsappUrl = "https://wa.me/34682020758?text=Hola,%20quisiera%20pedir%20presupuesto%20en%20limpiezaselpuerto.com%20para%20un%20servicio%20de%20limpieza%20en%20El%20Puerto.";

  return (
    <aside aria-label="Contacto Rápido" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Mini status indicator */}
      <div className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-md text-[10px] font-bold text-slate-700 uppercase tracking-wider">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Disponibles en El Puerto 24h</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Call button */}
        <a
          href="tel:+34682020758"
          className="h-12 w-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"
          title="Llamar al 682 020 758"
          id="btn-floating-call"
        >
          <Phone className="h-5 w-5 text-sky-400" />
        </a>

        {/* WhatsApp button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="h-12 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-all text-xs font-bold uppercase tracking-wider"
          title="Abrir WhatsApp Limpiezas El Puerto"
          id="btn-floating-whatsapp"
        >
          <MessageCircle className="h-5 w-5 fill-white" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}
