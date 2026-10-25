import React from 'react';
import { MapPin, ArrowRight, Building, Home, Sun, Compass } from 'lucide-react';

interface CoverageZonesProps {
  onSelectZone: (zoneName: string) => void;
}

export const ZONES_DATA = [
  {
    name: 'Vistahermosa',
    title: 'Urbanización Vistahermosa & El Manantial',
    description: 'Chalets unifamiliares, grandes parcelas, cristaleras y mantenimiento continuado de jardines y terrazas.',
    highlight: 'Servicio VIP & Llaves en Custodia',
    type: 'Residencial Premium',
    icon: <Home className="h-4 w-4 text-sky-500" />
  },
  {
    name: 'Valdelagrana',
    title: 'Paseo Marítimo & Valdelagrana',
    description: 'Apartamentos turísticos, segundas residencias de playa, limpiezas de choque pre-temporada y cambio rápido de huéspedes.',
    highlight: 'Especial Alquiler Vacacional',
    type: 'Costa & Turístico',
    icon: <Sun className="h-4 w-4 text-amber-500" />
  },
  {
    name: 'Fuentebravía',
    title: 'Fuentebravía & Costa Oeste',
    description: 'Mantenimiento del hogar, cristales expuestos al salitre marino, limpiezas a fondo y puesta a punto.',
    highlight: 'Tratamiento Anti-Salitre',
    type: 'Residencial Costero',
    icon: <Compass className="h-4 w-4 text-sky-500" />
  },
  {
    name: 'Las Redes',
    title: 'Las Redes & El Buzo',
    description: 'Comunidades de propietarios, urbanizaciones privadas con piscina y limpiezas de pisos y adosados.',
    highlight: 'Comunidades & Hogares',
    type: 'Urb. Privada',
    icon: <Home className="h-4 w-4 text-sky-500" />
  },
  {
    name: 'Centro Histórico',
    title: 'Centro Histórico & Ribera del Marisco',
    description: 'Pisos con techos altos, casas palacio reformadas, locales comerciales, oficinas y despachos profesionales.',
    highlight: 'Locales, Oficinas & Viviendas',
    type: 'Urbano & Comercial',
    icon: <Building className="h-4 w-4 text-indigo-500" />
  },
  {
    name: 'Crevillet / San José',
    title: 'Crevillet, San José & El Tejar',
    description: 'Limpieza periódica para familias, portales comunitarios, garajes y escaleras con tarifas muy accesibles.',
    highlight: 'Máximo Ahorro Comunitario',
    type: 'Residencial & Barrios',
    icon: <Building className="h-4 w-4 text-emerald-500" />
  }
];

export default function CoverageZones({ onSelectZone }: CoverageZonesProps) {
  return (
    <section className="py-16 md:py-24 bg-white" id="zonas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-100 text-sky-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-3">
            <MapPin className="h-3.5 w-3.5 text-sky-600" />
            <span>Cobertura Local en El Puerto de Santa María (Cádiz)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900">
            Limpieza en cada barrio de <span className="font-semibold text-sky-600">El Puerto</span>
          </h2>
          <p className="mt-4 text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Nuestro equipo se desplaza con vehículos propios y equipamiento completo a cualquier punto del término municipal sin suplementos por desplazamiento.
          </p>
        </div>

        {/* Zones Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ZONES_DATA.map((zone, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-sky-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {zone.icon}
                    <span>{zone.type}</span>
                  </span>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                    {zone.highlight}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {zone.title}
                </h3>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                  {zone.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <button
                  onClick={() => onSelectZone(zone.name)}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800 group-hover:text-sky-600 bg-white group-hover:bg-sky-50 py-2.5 px-3.5 rounded-xl border border-slate-200 group-hover:border-sky-200 transition-all cursor-pointer"
                  id={`btn-zone-select-${zone.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <span>Calcular Tarifa en {zone.name}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                ¿Tu zona o urbanización no aparece en la lista?
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Cubrimos también El Juncal, Casiñas, Soto de Vistahermosa, Poblado Doña Blanca y Polígonos de El Puerto.
              </p>
            </div>
          </div>

          <a
            href="tel:+34682020758"
            className="shrink-0 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-md"
          >
            Consultar Cobertura: 682 020 758
          </a>
        </div>

      </div>
    </section>
  );
}
