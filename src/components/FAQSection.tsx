import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Reservas y Pago',
    question: '¿Por qué las reservas se confirman con pago por adelantado?',
    answer: 'Para garantizar la exclusividad del equipo de limpieza y la franja horaria exacta en nuestro calendario oficial. Al abonar tu reserva por adelantado (a través de tarjeta bancaria segura o Bizum en el Área de Clientes), bloqueamos a los profesionales correspondientes y preparamos los vehículos y maquinaria con total puntualidad.'
  },
  {
    category: 'Materiales y Productos',
    question: '¿Tengo que aportar yo los productos y utensilios de limpieza?',
    answer: 'No, nosotros aportamos absolutamente todo: aspiradores profesionales con filtro HEPA, mopas de microfibra de uso desinfectado, máquinas de vapor y productos biodegradables con certificación Ecolabel. Si prefieres que usemos algún producto específico de tu agrado para suelos delicados, indícanoslo en las notas.'
  },
  {
    category: 'Presencia del Cliente',
    question: '¿Tengo que estar en la vivienda o local durante el servicio?',
    answer: 'No es indispensable. Muchos clientes nos reciben para abrir la puerta y vuelven al finalizar, o coordinan la entrega y recogida de llaves a través de conserjería, buzón de seguridad o nuestro servicio de custodia de llaves de confianza. Todo nuestro personal cuenta con seguro de responsabilidad civil.'
  },
  {
    category: 'Alquiler Vacacional',
    question: '¿Hacéis limpiezas de cambio para pisos turísticos (Airbnb / Booking)?',
    answer: 'Sí, somos especialistas en pisos turísticos y vacacionales en Valdelagrana, Costa Oeste y Centro Histórico. Realizamos desinfección integral, cambio de sábanas y toallas, reposición de amenities y comprobación del estado del apartamento con reporte fotográfico si lo necesitas.'
  },
  {
    category: 'Garantía y Facturación',
    question: '¿Emitís factura legal con IVA desglosado?',
    answer: 'Por supuesto. Emitimos factura oficial desglosando el IVA correspondiente para empresas, comunidades de vecinos, particulares y profesionales autónomos. Puedes solicitarla o descargarla directamente desde tu Área de Clientes.'
  },
  {
    category: 'Garantía y Calidad',
    question: '¿Qué ocurre si algún detalle no queda a mi entera satisfacción?',
    answer: 'En Limpiezas El Puerto nos comprometemos con la excelencia. Si tras la inspección notas que algún punto no ha quedado perfecto, dispones de 24 horas para avisarnos y enviaremos a nuestro personal a repasarlo completamente gratis.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/60" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-sky-600" />
            <span>Resolución de Dudas en limpiezaselpuerto.com</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-slate-900">
            Preguntas <span className="font-semibold text-sky-600">Frecuentes</span>
          </h2>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Todo lo que necesitas saber antes de contratar tu servicio de limpieza profesional en El Puerto de Santa María.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 uppercase tracking-wider shrink-0 hidden sm:inline-block">
                      {faq.category}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {faq.question}
                    </span>
                  </div>
                  <div className={`h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-sky-100 text-sky-600' : 'text-slate-500'}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center p-6 bg-white rounded-2xl border border-slate-200">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
            ¿Tienes alguna consulta especial sobre tu vivienda o negocio?
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Llámanos directamente o escríbenos por WhatsApp y te orientaremos al instante.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href="tel:+34682020758"
              className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors"
            >
              Llamar al 682 020 758
            </a>
            <a
              href="https://wa.me/34682020758?text=Hola,%20quisiera%20hacer%20una%20consulta%20a%20limpiezaselpuerto.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
