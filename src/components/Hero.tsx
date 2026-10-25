/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, MapPin, Sparkles, CheckCircle2, ArrowRight, MessageCircle, Phone, Award } from 'lucide-react';
// @ts-ignore
import heroImage from '../assets/images/hero_clean_interior_1784449546749.jpg';

interface HeroProps {
  onScrollToCalculator: () => void;
  onSelectNeighborhood?: (neighborhood: string) => void;
}

export default function Hero({ onScrollToCalculator, onSelectNeighborhood }: HeroProps) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [checkStatus, setCheckStatus] = useState<'idle' | 'available' | 'loading'>('idle');

  const neighborhoodDetails: Record<string, string> = {
    'Vistahermosa': '¡Sí! Cobertura prioritaria en Vistahermosa y El Manantial: chalets, mantenimiento de exteriores y servicio VIP con llaves.',
    'Valdelagrana': '¡Sí! Cobertura completa en Valdelagrana: especialistas en apartamentos vacacionales, cambios de huéspedes y limpiezas post-verano.',
    'Fuentebravía': '¡Sí! Cobertura en Fuentebravía y Costa Oeste: eliminación de salitre en cristales y mantenimiento integral de viviendas.',
    'Las Redes': '¡Sí! Cobertura en Las Redes y El Buzo: comunidades de vecinos, jardines, portales y limpieza semanal de hogares.',
    'Centro Histórico': '¡Sí! Cobertura en el Centro Histórico y Ribera del Marisco: casas tradicionales, pisos turísticos y locales comerciales.',
    'Crevillet / San José': '¡Sí! Cobertura en Crevillet, San José y El Tejar con tarifas muy competitivas para hogares y portales.',
    'El Juncal': '¡Sí! Cobertura en El Juncal y zonas adyacentes con atención en el mismo día para limpiezas de choque o urgencias.',
  };

  const handleCheckArea = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedNeighborhood(value);
    if (value) {
      setCheckStatus('loading');
      setTimeout(() => {
        setCheckStatus('available');
      }, 350);
    } else {
      setCheckStatus('idle');
    }
  };

  const handleApplyAreaAndCalculate = () => {
    if (selectedNeighborhood && onSelectNeighborhood) {
      onSelectNeighborhood(selectedNeighborhood);
    }
    onScrollToCalculator();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/40 via-white to-slate-50 py-12 md:py-20 lg:py-24" id="inicio">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Copy & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left z-10">
            {/* Promo Tag */}
            <div className="inline-flex self-center lg:self-start items-center gap-2 px-4 py-1.5 bg-sky-100 text-sky-800 text-[10px] font-extrabold rounded-full uppercase tracking-widest mb-6 border border-sky-200">
              <Sparkles className="h-3.5 w-3.5 text-sky-600" />
              <span>limpiezaselpuerto.com • Tu Empresa Oficial en El Puerto</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 leading-tight">
              Disfruta de tu tiempo, nosotros <span className="text-sky-600 font-semibold italic">limpiamos</span>.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Servicios integrales de limpieza técnica y mantenimiento para hogares, oficinas, comunidades y pisos turísticos en <strong>El Puerto de Santa María</strong>. Precios transparentes por m² y presupuesto online en 1 minuto.
            </p>

            {/* Core Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Personal en Nómina 100% Asegurado</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-sky-500" />
                <span>Póliza RC hasta 300.000€</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Garantía de Repaso 24h</span>
              </div>
            </div>

            {/* Interactive Area Checker */}
            <div className="mt-8 p-5 rounded-2xl border border-slate-200 bg-white max-w-xl mx-auto lg:mx-0 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider shrink-0">
                  <MapPin className="h-4 w-4 text-sky-500" />
                  <span>Comprueba tu Barrio:</span>
                </div>
                <select
                  value={selectedNeighborhood}
                  onChange={handleCheckArea}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2.5 px-3.5 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-sky-500"
                  id="select-neighborhood-check"
                >
                  <option value="">-- SELECCIONA TU BARRIO O URBANIZACIÓN --</option>
                  {Object.keys(neighborhoodDetails).map((name) => (
                    <option key={name} value={name}>
                      {name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {checkStatus === 'loading' && (
                <p className="mt-3 text-xs text-sky-600 flex items-center gap-2 font-bold uppercase tracking-wider animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-bounce" />
                  Comprobando disponibilidad de equipo en tu zona...
                </p>
              )}

              {checkStatus === 'available' && selectedNeighborhood && (
                <div className="mt-3 p-3.5 rounded-xl bg-sky-50 text-slate-700 border border-sky-100 text-xs font-medium leading-relaxed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                  <p>{neighborhoodDetails[selectedNeighborhood]}</p>
                  <button
                    onClick={handleApplyAreaAndCalculate}
                    className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Calcular Presupuesto
                  </button>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onScrollToCalculator}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                id="btn-hero-calc"
              >
                <span>Calcula tu Presupuesto</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="https://wa.me/34682020758?text=Hola,%20quisiera%20solicitar%20presupuesto%20en%20limpiezaselpuerto.com"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp 24h</span>
              </a>

              <div className="hidden sm:flex items-center gap-3 pl-2">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Llámanos gratis</span>
                  <a href="tel:+34682020758" className="text-lg font-extrabold text-slate-900 leading-none hover:text-sky-600 transition-colors">
                    682 020 758
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-88 h-88 bg-sky-200/50 rounded-full blur-3xl opacity-60" />

            {/* Image Frame with Badges */}
            <div className="relative border-8 border-white shadow-2xl rounded-3xl overflow-hidden max-w-md w-full aspect-square transition-transform duration-300 hover:scale-[1.01]">
              <img
                src={heroImage}
                alt="Limpiezas impecables y relucientes en El Puerto de Santa María - limpiezaselpuerto.com"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Badge Over Image: Experience */}
              <div className="absolute -bottom-1 -left-1 bg-white p-5 rounded-tr-3xl border-t border-r border-slate-100 flex items-center gap-4 shadow-xl">
                <div className="text-3xl font-black text-sky-600 tracking-tight">+15</div>
                <div className="text-[10px] text-slate-600 font-extrabold leading-tight uppercase tracking-wider">
                  Años de<br />experiencia
                </div>
              </div>

              {/* Top Badge: Official domain */}
              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20 text-[10px] font-mono tracking-wider flex items-center gap-1.5 shadow-lg">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>limpiezaselpuerto.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
