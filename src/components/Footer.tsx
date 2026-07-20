/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Mail, Phone, MapPin, Clock, Settings } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  isAdminMode: boolean;
  showAdminFeatures?: boolean;
  onUnlockAdmin?: () => void;
  onScrollToSection?: (id: string) => void;
}

export default function Footer({
  onOpenAdmin,
  isAdminMode,
  showAdminFeatures = false,
  onUnlockAdmin,
  onScrollToSection,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 text-[11px] py-16 md:py-20 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <div 
              className="flex items-center gap-2 cursor-pointer select-none"
              onDoubleClick={onUnlockAdmin}
              title="Doble clic para acceso administrativo"
            >
              <span className="text-xs font-black uppercase tracking-widest text-white">Limpiezas El Puerto</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs font-light">
              Servicio profesional de alta gama para hogares, oficinas y comunidades de propietarios en El Puerto de Santa María.
            </p>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-5">Contacto Directo</h4>
            <ul className="space-y-3 font-light">
              <li className="flex items-start gap-2.5">
                <span className="text-sky-500">📞</span>
                <a href="tel:+34682020758" className="hover:text-white transition-colors font-semibold">682 020 758</a>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-500">✉</span>
                <a href="mailto:info@limpiezaselpuerto.com" className="hover:text-white transition-colors">info@limpiezaselpuerto.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-sky-500">📍</span>
                <span className="leading-relaxed">Avda Juan Melgarejo, 2, 11500, El Puerto de Santa María, Cádiz</span>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-5">Horario Comercial</h4>
            <ul className="space-y-3 font-light">
              <li>
                <p className="font-semibold text-slate-300">Servicio Continuo 24 Horas:</p>
                <p className="text-[10px] text-sky-400 mt-1 uppercase tracking-widest font-bold">Lunes a Domingo — 24h / 7 días</p>
              </li>
              <li>
                <p className="text-[10px] text-slate-500 mt-1">Abierto sábados, domingos y festivos.</p>
              </li>
            </ul>
          </div>

          {/* Admin and shortcuts */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-5">Atajos y Gestión</h4>
            <ul className="space-y-3 font-light">
              <li>
                <button
                  onClick={showAdminFeatures ? onOpenAdmin : () => onUnlockAdmin?.()}
                  className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors font-semibold cursor-pointer uppercase tracking-wider text-[10px] bg-transparent border-none p-0"
                  id="footer-btn-admin"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>{isAdminMode ? 'Volver a la Web' : 'Panel de Control Admin'}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection?.('servicios')}
                  className="hover:text-white transition-colors uppercase text-[10px] tracking-wider text-left bg-transparent border-none cursor-pointer p-0 font-bold font-sans"
                >
                  Tarifas por m²
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection?.('calculadora')}
                  className="hover:text-white transition-colors uppercase text-[10px] tracking-wider text-left bg-transparent border-none cursor-pointer p-0 font-bold font-sans"
                >
                  Calcular Presupuesto
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600 font-light">
          <div 
            className="cursor-pointer select-none hover:text-slate-500 transition-colors"
            onDoubleClick={onUnlockAdmin}
            title="Doble clic para acceso administrativo"
          >
            &copy; {currentYear} Limpiezas El Puerto. Todos los derechos reservados.
          </div>
          <div className="flex gap-4 uppercase tracking-widest text-[9px] font-bold">
            <span className="hover:text-slate-400 cursor-pointer">Aviso Legal</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacidad</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
