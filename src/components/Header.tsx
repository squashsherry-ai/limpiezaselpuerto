/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Phone, ShieldCheck, User, Globe, MessageCircle, MapPin, Menu, X, Clock } from 'lucide-react';

interface HeaderProps {
  onOpenCalculator: () => void;
  onOpenAdmin: () => void;
  isAdminMode: boolean;
  showAdminFeatures?: boolean;
  onUnlockAdmin?: () => void;
  onOpenClientPortal: () => void;
  isClientPortalActive: boolean;
  onScrollToSection?: (id: string) => void;
  onOpenGoogleSitesModal?: () => void;
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
  onOpenGoogleSitesModal,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sky-400 font-bold tracking-wider">
              limpiezaselpuerto.com
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="h-3 w-3 text-sky-400" />
              Avda Juan Melgarejo, 2, El Puerto de Santa María (Cádiz)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Clock className="h-3 w-3" />
              Servicio 24 Horas / 7 Días
            </span>
            <a
              href="https://wa.me/34682020758?text=Hola,%20contacto%20desde%20limpiezaselpuerto.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
            >
              <MessageCircle className="h-3 w-3 fill-emerald-400" />
              WhatsApp
            </a>
            <a
              href="tel:+34682020758"
              className="flex items-center gap-1 text-white hover:text-sky-300 font-bold font-mono"
            >
              <Phone className="h-3 w-3 text-sky-400" />
              682 020 758
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => handleNavClick('top')}
          onDoubleClick={onUnlockAdmin}
          title="Doble clic para acceso administrativo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md shadow-sky-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold tracking-tight uppercase text-slate-900 flex items-center gap-1.5 leading-none">
              Limpiezas El Puerto
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600 mt-1 flex items-center gap-1">
              <span>El Puerto de Santa María</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-normal lowercase text-[10px]">limpiezaselpuerto.com</span>
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold tracking-wider uppercase text-slate-600">
          <button 
            onClick={() => handleNavClick('servicios')} 
            className="hover:text-sky-600 transition-colors bg-transparent border-none cursor-pointer py-1"
          >
            Servicios
          </button>
          <button 
            onClick={() => handleNavClick('calculadora')} 
            className="hover:text-sky-600 transition-colors bg-transparent border-none cursor-pointer py-1"
          >
            Tarifas / Calculadora
          </button>
          <button 
            onClick={() => handleNavClick('zonas')} 
            className="hover:text-sky-600 transition-colors bg-transparent border-none cursor-pointer py-1"
          >
            Zonas
          </button>
          <button 
            onClick={() => handleNavClick('garantias')} 
            className="hover:text-sky-600 transition-colors bg-transparent border-none cursor-pointer py-1"
          >
            Por qué nosotros
          </button>
          <button 
            onClick={() => handleNavClick('testimonios')} 
            className="hover:text-sky-600 transition-colors bg-transparent border-none cursor-pointer py-1"
          >
            Opiniones
          </button>
          <button 
            onClick={() => handleNavClick('faq')} 
            className="hover:text-sky-600 transition-colors bg-transparent border-none cursor-pointer py-1"
          >
            FAQ
          </button>
          <button 
            onClick={() => handleNavClick('contacto')} 
            className="hover:text-sky-600 transition-colors bg-transparent border-none cursor-pointer py-1"
          >
            Contacto
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {onOpenGoogleSitesModal && (
            <button
              onClick={onOpenGoogleSitesModal}
              className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all cursor-pointer"
              title="Integrar en Google Sites & Guardar en Google Drive"
              id="btn-google-sites-header"
            >
              <Globe className="h-3.5 w-3.5 text-sky-600" />
              <span>Google Sites</span>
            </button>
          )}

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
            <span className="hidden sm:inline">Área Clientes</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            id="btn-reserve-header"
          >
            <span>Pedir Presupuesto</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <button 
              onClick={() => handleNavClick('servicios')} 
              className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              Servicios
            </button>
            <button 
              onClick={() => handleNavClick('calculadora')} 
              className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              Calculadora y Precios por m²
            </button>
            <button 
              onClick={() => handleNavClick('zonas')} 
              className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              Zonas de Cobertura en El Puerto
            </button>
            <button 
              onClick={() => handleNavClick('garantias')} 
              className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              Por qué elegirnos
            </button>
            <button 
              onClick={() => handleNavClick('testimonios')} 
              className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              Opiniones de Clientes
            </button>
            <button 
              onClick={() => handleNavClick('faq')} 
              className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              Preguntas Frecuentes
            </button>
            <button 
              onClick={() => handleNavClick('contacto')} 
              className="text-left py-2 px-3 hover:bg-slate-50 rounded-lg"
            >
              Contacto y Ubicación
            </button>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="tel:+34682020758"
              className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              <Phone className="h-4 w-4 text-sky-400" />
              <span>Llamar: 682 020 758</span>
            </a>
            <a
              href="https://wa.me/34682020758?text=Hola,%20contacto%20desde%20limpiezaselpuerto.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Directo</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
