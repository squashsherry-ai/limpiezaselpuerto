import React from 'react';
import { ShieldCheck, Sparkles, Clock, Leaf, Users, Award, CheckCircle2, FileCheck2 } from 'lucide-react';

export default function WhyUs() {
  const pillars = [
    {
      icon: <Users className="h-6 w-6 text-sky-500" />,
      title: 'Personal 100% en Nómina y Asegurado',
      description: 'Sin subcontratas opacas. Todo nuestro equipo está dado de alta en la Seguridad Social con formación continua y protocolo de confidencialidad.',
      badge: 'Seguridad Laboral'
    },
    {
      icon: <FileCheck2 className="h-6 w-6 text-sky-500" />,
      title: 'Seguro de Responsabilidad Civil hasta 300.000€',
      description: 'Tu patrimonio está protegido desde el primer minuto. Trabajamos con cobertura completa ante cualquier incidencia en tu hogar, comercio o comunidad.',
      badge: 'Póliza Activa'
    },
    {
      icon: <Clock className="h-6 w-6 text-sky-500" />,
      title: 'Disponibilidad 24/7 y Servicio de Urgencias',
      description: 'Ideal para apartamentos turísticos y vacacionales en Valdelagrana o Vistahermosa. Check-ins imprevistos, fines de semana y festivos.',
      badge: '365 Días al Año'
    },
    {
      icon: <Leaf className="h-6 w-6 text-sky-500" />,
      title: 'Maquinaria Profesional y Productos Ecolabel',
      description: 'Equipos Kärcher industriales, aspiración con filtro HEPA 13 y químicos biodegradables seguros para mascotas y niños.',
      badge: 'Eco Friendly'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-200/60" id="garantias">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-3">
            <Award className="h-3.5 w-3.5 text-sky-600" />
            <span>Compromiso de Calidad en limpiezaselpuerto.com</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900">
            ¿Por qué elegir <span className="font-semibold text-sky-600">Limpiezas El Puerto</span>?
          </h2>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Combinamos la cercanía y dedicación de una empresa 100% de El Puerto de Santa María con los estándares técnicos y la seriedad de un servicio de primera categoría.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-white transition-all text-sky-600">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide group-hover:text-sky-600 transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Garantía Oficial limpiezaselpuerto.com</span>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Guarantee Box */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-sky-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Garantía de Satisfacción Total: Repaso Gratuito en 24 Horas
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Si tras realizar el servicio detectas que algún rincón no ha quedado exactamente según lo acordado, nuestro equipo regresa a revisarlo sin ningún coste extra. Queremos clientes 100% satisfechos en El Puerto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a 
              href="tel:+34682020758"
              className="text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl transition-all shadow-sm"
            >
              Consultar con un Asesor
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
