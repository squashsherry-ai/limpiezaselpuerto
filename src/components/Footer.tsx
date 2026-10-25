/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Mail, Phone, MapPin, Clock, Settings, MessageCircle, ShieldCheck } from 'lucide-react';

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
    <footer className="bg-slate-950 text-slate-400 text-xs py-16 md:py-20 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              className="flex items-center gap-2 cursor-pointer select-none"
              onDoubleClick={onUnlockAdmin}
              title="Doble clic para acceso administrativo"
            >
              <div className="h-8 w-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="text-sm font-black uppercase tracking-widest text-white block leading-none">
                  Limpiezas El Puerto
                </span>
                <span className="text-[10px] text-sky-400 font-mono tracking-wider">
                  limpiezaselpuerto.com
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-light">
              Empresa líder en servicios integrales de limpieza, desinfección y mantenimiento técnico en <strong>El Puerto de Santa María</strong>. Compromiso riguroso de calidad para hogares, comunidades de propietarios, oficinas y alojamientos turísticos.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Personal 100% asegurado • Seguro de RC 300.000€</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 font-light">
              <li>
                <button 
                  onClick={() => onScrollToSection?.('servicios')}
                  className="hover:text-white transition-colors uppercase text-[10px] tracking-wider text-left bg-transparent border-none cursor-pointer p-0 font-medium"
                >
                  Servicios y Tarifas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection?.('calculadora')}
                  className="hover:text-white transition-colors uppercase text-[10px] tracking-wider text-left bg-transparent border-none cursor-pointer p-0 font-medium"
                >
                  Calculadora Online
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection?.('zonas')}
                  className="hover:text-white transition-colors uppercase text-[10px] tracking-wider text-left bg-transparent border-none cursor-pointer p-0 font-medium"
                >
                  Zonas de Cobertura
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection?.('garantias')}
                  className="hover:text-white transition-colors uppercase text-[10px] tracking-wider text-left bg-transparent border-none cursor-pointer p-0 font-medium"
                >
                  Garantía y Confianza
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection?.('testimonios')}
                  className="hover:text-white transition-colors uppercase text-[10px] tracking-wider text-left bg-transparent border-none cursor-pointer p-0 font-medium"
                >
                  Opiniones de Clientes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onScrollToSection?.('faq')}
                  className="hover:text-white transition-colors uppercase text-[10px] tracking-wider text-left bg-transparent border-none cursor-pointer p-0 font-medium"
                >
                  Preguntas Frecuentes
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white mb-4">
              Contacto El Puerto
            </h4>
            <ul className="space-y-3 font-light text-xs">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <a href="tel:+34682020758" className="hover:text-white transition-colors font-semibold text-slate-200">
                  +34 682 020 758
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <a 
                  href="https://wa.me/34682020758?text=Hola,%20contacto%20desde%20limpiezaselpuerto.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors text-emerald-400 font-semibold"
                >
                  WhatsApp 24h
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <a href="mailto:info@limpiezaselpuerto.com" className="hover:text-white transition-colors">
                  info@limpiezaselpuerto.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Avda Juan Melgarejo, 2, 11500, El Puerto de Santa María (Cádiz)
                </span>
              </li>
            </ul>
          </div>

          {/* Schedule & Administration */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-white mb-4">
              Horario & Gestión
            </h4>
            <ul className="space-y-3 font-light text-xs">
              <li>
                <p className="font-semibold text-slate-300">Servicio 24 Horas:</p>
                <p className="text-[10px] text-sky-400 mt-0.5 uppercase tracking-wider font-bold">
                  Lunes a Domingo • 24/7
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Fines de semana y festivos disponibles.
                </p>
              </li>
              <li className="pt-2 border-t border-slate-900">
                <button
                  onClick={showAdminFeatures ? onOpenAdmin : () => onUnlockAdmin?.()}
                  className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors font-semibold cursor-pointer uppercase tracking-wider text-[10px] bg-transparent border-none p-0"
                  id="footer-btn-admin"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>{isAdminMode ? 'Volver a la Web' : 'Panel de Control Admin'}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 font-light text-[11px]">
          <div 
            className="cursor-pointer select-none hover:text-slate-400 transition-colors"
            onDoubleClick={onUnlockAdmin}
            title="Doble clic para acceso administrativo"
          >
            &copy; {currentYear} <strong className="text-slate-400">limpiezaselpuerto.com</strong> — Limpiezas El Puerto S.L. Todos los derechos reservados.
          </div>
          <div className="flex gap-4 uppercase tracking-widest text-[10px] font-semibold text-slate-400">
            <span className="hover:text-white cursor-pointer">Aviso Legal</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Política de Privacidad</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Cookies</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
