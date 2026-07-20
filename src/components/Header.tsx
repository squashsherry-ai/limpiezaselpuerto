/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Phone, ShieldCheck, Settings, Award, User } from 'lucide-react';

interface HeaderProps {
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
  isAdminMode: boolean;
  showAdminFeatures?: boolean;
  onUnlockAdmin?: () => void;
  onOpenClientPortal: () => void;
  isClientPortalActive: boolean;
  onScrollToSection?: (id: string) => void;
}

export default function Header({
  onOpenCalculator,
  onOpenAdmin,
  isAdminMode,
  showAdminFeatures = false,
  onUnlockAdmin,
  onOpenClientPortal,
  isClientPortalActive,
  onScrollToSection,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onScrollToSection ? onScrollToSection('top') : window.scrollTo({ top: 0, behavior: 'smooth' })}
          onDoubleClick={onUnlockAdmin}
          title="Doble clic para acceso administrativo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight uppercase text-slate-900 flex items-center gap-1.5 leading-none">
              Limpiezas El Puerto
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-widest text-sky-600 mt-1">
              El Puerto de Santa María
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase">
          <button 
            onClick={() => onScrollToSection?.('servicios')} 
            className="text-slate-500 hover:text-sky-500 transition-colors bg-transparent border-none cursor-pointer font-bold uppercase tracking-widest p-0"
          >
            Servicios
          </button>
          <button 
            onClick={() => onScrollToSection?.('calculadora')} 
            className="text-slate-500 hover:text-sky-500 transition-colors bg-transparent border-none cursor-pointer font-bold uppercase tracking-widest p-0"
          >
            Calculadora
          </button>
          <button 
            onClick={() => onScrollToSection?.('testimonios')} 
            className="text-slate-500 hover:text-sky-500 transition-colors bg-transparent border-none cursor-pointer font-bold uppercase tracking-widest p-0"
          >
            Opiniones
          </button>
        </nav>

        <div className="flex items-center gap-2">


          <button
            onClick={onOpenClientPortal}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              isClientPortalActive
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
            title="Área Privada de Clientes"
            id="btn-client-portal-header"
          >
            <User className="h-3.5 w-3.5 text-sky-500" />
            <span>Área Clientes</span>
          </button>

          <a
            href="tel:+34682020758"
            className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-all uppercase tracking-wider"
            id="link-call-header"
          >
            <Phone className="h-3.5 w-3.5 text-sky-500" />
            <span>682 020 758</span>
          </a>

          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            id="btn-reserve-header"
          >
            <span>Presupuesto</span>
          </button>
        </div>
      </div>
    </header>
  );
}
