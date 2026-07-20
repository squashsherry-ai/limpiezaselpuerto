/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Briefcase, Building2, HardHat, Check, ShieldAlert } from 'lucide-react';
import { ServiceDetail, ServiceType } from '../types';

interface ServicesProps {
  onSelectService: (service: ServiceType) => void;
}

export const servicesData: ServiceDetail[] = [
  {
    id: 'hogar',
    title: 'Limpieza del Hogar',
    description: 'Hacemos tu casa o piso brillar. Perfecto para mantenimiento semanal, quincenal o limpiezas generales profundas.',
    basePricePerSqm: 2.50,
    icon: 'Home',
    features: [
      'Aspirado y fregado de todos los suelos',
      'Desinfección profunda de baños y cocina',
      'Limpieza de polvo en superficies y muebles',
      'Ventilación de estancias y vaciado de papeleras',
      'Opción de planchado y colada de ropa'
    ]
  },
  {
    id: 'oficina',
    title: 'Oficinas y Locales',
    description: 'Espacios de trabajo impecables que inspiran productividad. Horarios flexibles fuera de tu horario laboral.',
    basePricePerSqm: 2.70,
    icon: 'Briefcase',
    features: [
      'Limpieza de escritorios y ordenadores',
      'Higienización de teclados, ratones y teléfonos',
      'Zonas comunes, office y baños impecables',
      'Reposición de consumibles higiénicos',
      'Vaciado y reciclado de residuos de oficina'
    ]
  },
  {
    id: 'comunidad',
    title: 'Comunidades de Vecinos',
    description: 'Mantenimiento impecable de portales, escaleras y zonas comunes para garantizar la mejor convivencia.',
    basePricePerSqm: 2.70,
    icon: 'Building2',
    features: [
      'Barrido y fregado de portal, descansillos y escaleras',
      'Limpieza de ascensor, espejos y puertas de cabina',
      'Despolvado de buzones, barandillas y apliques',
      'Limpieza periódica de cristales comunitarios',
      'Mantenimiento y retirada de contenedores'
    ]
  },
  {
    id: 'fin_obra',
    title: 'Fin de Obra / Mudanzas',
    description: 'Limpiezas extremas de puesta a punto tras reformas o antes de mudarte. Eliminamos el polvo rebelde, restos de pintura y suciedad acumulada.',
    basePricePerSqm: 3.00,
    icon: 'HardHat',
    features: [
      'Retirada de restos de cemento, yeso, pintura y silicona',
      'Aspirado industrial de polvo microparticulado',
      'Limpieza intensiva de armarios (interior y exterior)',
      'Cristales, marcos y persianas a fondo',
      'Sanitarios y griferías desincrustados y abrillantados'
    ]
  }
];

export default function Services({ onSelectService }: ServicesProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="h-5 w-5 text-sky-500" />;
      case 'Briefcase': return <Briefcase className="h-5 w-5 text-sky-500" />;
      case 'Building2': return <Building2 className="h-5 w-5 text-sky-500" />;
      case 'HardHat': return <HardHat className="h-5 w-5 text-sky-500" />;
      default: return <Home className="h-5 w-5 text-sky-500" />;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white" id="servicios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Nuestros Servicios</h2>
          <p className="mt-2 text-3xl sm:text-5xl font-light tracking-tight text-slate-900">
            Soluciones profesionales de limpieza en El Puerto
          </p>
          <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto">
            Ofrecemos servicios de alta gama adaptados a cada necesidad. Todos nuestros trabajos incluyen supervisión de calidad y personal uniformado altamente cualificado.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between bg-[#F8FAFC] rounded-xl border border-slate-100 p-6 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-100/50"
              id={`service-card-${service.id}`}
            >
              <div>
                {/* Icon wrapper */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sky-500 shadow-xs border border-slate-100 group-hover:bg-sky-50 group-hover:text-sky-600 transition-all">
                  {getIcon(service.icon)}
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900 uppercase tracking-wider group-hover:text-sky-500 transition-colors">
                  {service.title}
                </h3>
                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Desde <span className="text-sky-600 text-xs font-black">{service.basePricePerSqm.toFixed(2)}€</span> por m²
                </p>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="h-3.5 w-3.5 text-sky-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectService(service.id)}
                className="mt-6 w-full text-center bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest py-3 px-4 rounded-lg transition-all cursor-pointer"
                id={`btn-select-service-${service.id}`}
              >
                Calcular Tarifa
              </button>
            </div>
          ))}
        </div>

        {/* Security & Guarantees */}
        <div className="mt-16 p-6 rounded-xl bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-white border border-slate-100 p-3 rounded-full shrink-0">
              <ShieldAlert className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">¿No queda satisfecho? Compromiso de resolución rápida.</h4>
              <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
                Nuestros estándares de limpieza son rigurosos y constantes. Si por cualquier motivo algún aspecto del servicio no cumple con sus expectativas, nos comprometemos a solucionarlo a la mayor brevedad.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex gap-4">
            <span className="text-[10px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-wider">
              ✓ Calidad Premium
            </span>
            <span className="text-[10px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-wider">
              ✓ Confianza Garantizada
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
