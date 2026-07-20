/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, MapPin, Sparkles, CheckCircle2, Percent, ArrowRight } from 'lucide-react';
// @ts-ignore
import heroImage from '../assets/images/hero_clean_interior_1784449546749.jpg';

interface HeroProps {
  onScrollToCalculator: () => void;
}

export default function Hero({ onScrollToCalculator }: HeroProps) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [checkStatus, setCheckStatus] = useState<'idle' | 'available' | 'loading'>('idle');

  const neighborhoodDetails: Record<string, string> = {
    'Vistahermosa': '¡Sí! Cubrimos Vistahermosa con limpieza VIP para chalets, pisos y comunidades de vecinos.',
    'Valdelagrana': '¡Sí! Cubrimos Valdelagrana, ideal para segundas residencias, apartamentos turísticos y limpieza post-verano.',
    'Fuentebravía': '¡Sí! Cubrimos Fuentebravía, especialistas en mantenimiento del hogar y viviendas vacacionales.',
    'Las Redes': '¡Sí! Cubrimos Las Redes, excelente servicio de cristales y limpieza profunda todo el año.',
    'Centro Histórico': '¡Sí! Cubrimos el Centro Histórico, ofreciendo limpiezas rápidas y adaptadas para locales y pisos antiguos.',
    'Crevillet / San José': '¡Sí! Cubrimos Crevillet y San José con tarifas especiales para comunidades y hogares.',
    'El Tejar': '¡Sí! Cubrimos El Tejar, con soluciones de limpieza cómodas y muy económicas.',
  };

  const handleCheckArea = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedNeighborhood(value);
    if (value) {
      setCheckStatus('loading');
      setTimeout(() => {
        setCheckStatus('available');
      }, 400);
    } else {
      setCheckStatus('idle');
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] py-12 md:py-20 lg:py-24" id="inicio">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Copy & Offer */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left z-10">
            {/* Promo Tag */}
            <div className="inline-block self-center lg:self-start px-4 py-1.5 bg-sky-100 text-sky-700 text-[10px] font-extrabold rounded-full uppercase tracking-widest mb-6">
              Servicios Profesionales en El Puerto de Santa María
            </div>

            {/* Display Typography */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900 leading-tight">
              Disfruta de tu tiempo, nosotros <span className="text-sky-500 font-medium italic">limpiamos</span>.
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Especialistas en mantenimiento integral y limpiezas técnicas. Máxima calidad y garantía de satisfacción para su hogar o negocio en El Puerto de Santa María.
            </p>

            {/* Core Badges */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-sky-500" />
                <span>Personal Local Cualificado</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-sky-500" />
                <span>Satisfacción Garantizada</span>
              </div>
            </div>

            {/* Interactive Area Checker styled in Clean Minimalism */}
            <div className="mt-8 p-5 rounded-xl border border-slate-100 bg-white max-w-xl mx-auto lg:mx-0 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider shrink-0">
                  <MapPin className="h-4 w-4 text-sky-500" />
                  <span>¿Trabajáis en mi zona?</span>
                </div>
                <select
                  value={selectedNeighborhood}
                  onChange={handleCheckArea}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-sky-500"
                  id="select-neighborhood-check"
                >
                  <option value="">-- SELECCIONA TU BARRIO --</option>
                  {Object.keys(neighborhoodDetails).map((name) => (
                    <option key={name} value={name}>
                      {name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {checkStatus === 'loading' && (
                <p className="mt-3 text-xs text-sky-500 flex items-center gap-2 font-bold uppercase tracking-wider animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-sky-500 animate-bounce" />
                  Comprobando cobertura...
                </p>
              )}

              {checkStatus === 'available' && selectedNeighborhood && (
                <div className="mt-4 p-3 rounded-lg bg-slate-50 text-slate-600 border border-slate-100 text-xs font-medium leading-relaxed animate-fade-in">
                  {neighborhoodDetails[selectedNeighborhood]}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
              <button
                onClick={onScrollToCalculator}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xl shadow-slate-200 uppercase tracking-widest text-xs transition-all cursor-pointer"
                id="btn-hero-calc"
              >
                Pide Presupuesto
              </button>
              
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Llámanos</span>
                  <a href="tel:+34682020758" className="text-xl font-bold text-slate-900 leading-none hover:text-sky-500 transition-colors">682 020 758</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Background Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-100 rounded-full blur-3xl opacity-40" />

            {/* Frame containing the generated image with border-8 & rounded-2xl & shadow-2xl */}
            <div className="relative border-8 border-white shadow-2xl rounded-2xl overflow-hidden max-w-md w-full aspect-square transition-transform duration-300 hover:scale-[1.01]">
              <img
                src={heroImage}
                alt="Limpiezas impecables y relucientes en El Puerto de Santa María"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Badge Over Image styled as "+15 Años de experiencia" from template */}
              <div className="absolute -bottom-1 -left-1 bg-white p-5 rounded-tr-2xl border-t border-r border-slate-50 flex items-center gap-4 shadow-lg">
                <div className="text-3xl font-black text-sky-500 tracking-tight">+15</div>
                <div className="text-[10px] text-slate-500 font-extrabold leading-tight uppercase tracking-wider">
                  Años de<br />experiencia
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
