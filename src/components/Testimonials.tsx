/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';

interface Testimonial {
  name: string;
  location: string;
  text: string;
  service: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Marta Soler',
    location: 'Urbanización Vistahermosa',
    text: 'Contratamos a Limpiezas El Puerto para el mantenimiento semanal de nuestro chalet de tres plantas. El servicio es de una delicadeza extrema. El personal es puntual, discreto y el resultado es impecable, especialmente los baños y la terraza exterior.',
    service: 'Limpieza del Hogar Semanal',
    rating: 5,
  },
  {
    name: 'José Manuel Ruiz',
    location: 'Apartamentos Valdelagrana',
    text: 'Tengo dos pisos de alquiler vacacional y delegar la limpieza de entrada/salida de inquilinos en ellos ha sido la mejor decisión. Las reviews de mis clientes siempre destacan que los apartamentos están limpísimos. Es una total garantía de tranquilidad.',
    service: 'Limpiezas Especiales y Llaves',
    rating: 5,
  },
  {
    name: 'Carmen Garrido',
    location: 'Calle Larga, Centro Histórico',
    text: 'Tras terminar la reforma integral de mi casa, el polvo de cemento parecía imposible de eliminar. El equipo vino con aspiradores industriales y productos desincrustantes profesionales. Dejaron el piso brillante y libre de polvo de obra en un solo día.',
    service: 'Limpieza Fin de Obra',
    rating: 5,
  },
  {
    name: 'Comunidad Los Olmos',
    location: 'Zona Las Redes / Fuentebravía',
    text: 'Como presidente de la comunidad de vecinos, llevamos un año con ellos para el mantenimiento de portales, escaleras y la rampa de garaje. Siempre huele fresco, los buzones y barandillas están desinfectados y la tarifa es muy competitiva.',
    service: 'Mantenimiento de Comunidades',
    rating: 5,
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white" id="testimonios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Testimonios</h2>
          <p className="mt-2 text-3xl sm:text-5xl font-light tracking-tight text-slate-900">
            Opiniones de Clientes
          </p>
          <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto">
            La satisfacción de nuestros vecinos en El Puerto de Santa María es nuestro mayor aval. Descubra por qué nos confían su limpieza.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-[#F8FAFC] rounded-xl p-8 border border-slate-100 relative hover:border-slate-200 transition-all duration-300"
              id={`testimonial-card-${idx}`}
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-sky-500 text-sky-500" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-xs text-slate-600 leading-relaxed italic relative z-10 font-medium">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Reviewer Details */}
              <div className="mt-6 flex items-center gap-3.5 border-t border-slate-200/60 pt-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-800 font-bold text-xs uppercase">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t.name}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                    <span>{t.location}</span>
                    <span>•</span>
                    <span className="text-sky-600">{t.service}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Guarantee Box */}
        <div className="mt-16 bg-slate-950 rounded-xl p-8 md:p-12 text-white text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden border border-slate-900">
          <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-2 text-sky-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Garantía de Calidad Certificada</span>
            </h3>
            <p className="mt-3 text-xs md:text-sm text-slate-400 leading-relaxed font-light">
              Si algún detalle no queda perfectamente a su gusto, notifíquenoslo dentro de las 24 horas siguientes. 
              **Volveremos y lo repasaremos completamente gratis**. Su total satisfacción es nuestro compromiso.
            </p>
          </div>

          <a 
            href="tel:+34682020758" 
            className="shrink-0 bg-white hover:bg-slate-100 text-slate-950 font-bold text-[10px] uppercase tracking-widest px-6 py-4 rounded-lg transition-all whitespace-nowrap cursor-pointer"
            id="btn-call-guarantee"
          >
            Llamar al 682 020 758
          </a>
        </div>

      </div>
    </section>
  );
}
