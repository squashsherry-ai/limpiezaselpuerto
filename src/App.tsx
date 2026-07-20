/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import BudgetCalculator from './components/BudgetCalculator';
import Testimonials from './components/Testimonials';
import AdminPanel from './components/AdminPanel';
import ClientPortal from './components/ClientPortal';
import Footer from './components/Footer';
import { BookingRequest, ServiceType, SimulatedEmail } from './types';

// Mock Lead Seeds for initial showcase
const initialSeeds: BookingRequest[] = [
  {
    id: 'REF-847291',
    clientName: 'Marta Soler',
    email: 'marta.soler@outlook.com',
    phone: '611 222 333',
    neighborhood: 'Vistahermosa',
    serviceType: 'hogar',
    sqm: 150,
    frequency: 'semanal',
    extras: {
      cristales: true,
      plancha: true,
      ecoProducts: true,
      desinfeccion: false,
    },
    notes: 'Tengo un Golden Retriever muy cariñoso en casa. Prefiero las visitas los martes por la mañana.',
    estimatedPrice: 198.50,
    status: 'pendiente',
    createdAt: '2026-07-18 10:24',
    paymentStatus: 'pendiente',
    photos: [],
    addressLocator: 'Calle de las Algas, 23, Chalet B, Vistahermosa'
  },
  {
    id: 'REF-293810',
    clientName: 'José Manuel Ruiz',
    email: 'jm.ruiz.valdelagrana@gmail.com',
    phone: '655 444 333',
    neighborhood: 'Valdelagrana',
    serviceType: 'hogar',
    sqm: 75,
    frequency: 'quincenal',
    extras: {
      cristales: true,
      plancha: false,
      ecoProducts: false,
      desinfeccion: true,
    },
    notes: 'Apartamento de vacaciones de cara al verano. Limpieza quincenal de mantenimiento.',
    estimatedPrice: 112.50,
    status: 'contactado',
    createdAt: '2026-07-17 14:10',
    paymentStatus: 'pagado',
    photos: [],
    addressLocator: 'Avenida del Mar, 12, 3º B, Valdelagrana'
  },
  {
    id: 'REF-104928',
    clientName: 'Alejandro Domínguez',
    email: 'alex.centro.obras@gmail.com',
    phone: '644 888 999',
    neighborhood: 'Centro Histórico',
    serviceType: 'fin_obra',
    sqm: 120,
    frequency: 'una_vez',
    extras: {
      cristales: true,
      plancha: false,
      ecoProducts: true,
      desinfeccion: true,
    },
    notes: 'Acabamos de reformar la cocina y el salón. Hay muchísimo polvo de yeso acumulado en marcos y persianas.',
    estimatedPrice: 345.00,
    status: 'completado',
    createdAt: '2026-07-15 09:15',
    paymentStatus: 'pagado',
    photos: [],
    addressLocator: 'Calle Larga, 45, 1º Izquierda, Centro Histórico'
  }
];

export default function App() {
  const [selectedService, setSelectedService] = useState<ServiceType>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('servicio') || params.get('service');
      if (serviceParam && ['hogar', 'oficina', 'comunidad', 'fin_obra'].includes(serviceParam)) {
        return serviceParam as ServiceType;
      }
    } catch (e) {
      console.error('Error parsing URL query params for selectedService:', e);
    }
    return 'hogar';
  });
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showAdminFeatures, setShowAdminFeatures] = useState<boolean>(false);
  const [isClientPortalActive, setIsClientPortalActive] = useState<boolean>(false);
  const [sentEmails, setSentEmails] = useState<SimulatedEmail[]>([]);

  // Admin Passcode Modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // Load from localStorage on mount and check secret URL queries
  useEffect(() => {
    const isLocalUnlocked = localStorage.getItem('limpiezas_el_puerto_admin_unlocked') === 'true';

    if (isLocalUnlocked) {
      setShowAdminFeatures(true);
      setIsAdminMode(false);
    }

    const saved = localStorage.getItem('limpiezas_el_puerto_leads');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (err) {
        setBookings(initialSeeds);
      }
    } else {
      // Seed initial data so the administrator panel has rich content immediately
      setBookings(initialSeeds);
      localStorage.setItem('limpiezas_el_puerto_leads', JSON.stringify(initialSeeds));
    }

    const savedEmails = localStorage.getItem('limpiezas_el_puerto_sent_emails');
    if (savedEmails) {
      try {
        setSentEmails(JSON.parse(savedEmails));
      } catch (err) {
        setSentEmails([]);
      }
    }

    // Keydown listener for shortcut Alt+A / Ctrl+Alt+A to unlock
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key?.toLowerCase() === 'a') || (e.ctrlKey && e.altKey && e.key?.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsLoginModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedUser = usernameInput.trim().toLowerCase();
    const normalizedPass = passwordInput.trim().toLowerCase();
    
    if (normalizedUser === 'admin' && (normalizedPass === 'puerto' || normalizedPass === 'admin' || normalizedPass === '1234' || normalizedPass === 'limpiezas')) {
      setShowAdminFeatures(true);
      setIsAdminMode(true);
      localStorage.setItem('limpiezas_el_puerto_admin_unlocked', 'true');
      setIsLoginModalOpen(false);
      setUsernameInput('');
      setPasswordInput('');
      setLoginError('');
    } else {
      if (normalizedUser !== 'admin') {
        setLoginError('Usuario administrador incorrecto.');
      } else {
        setLoginError('Contraseña incorrecta. Inténtelo de nuevo.');
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
    setShowAdminFeatures(false);
    localStorage.removeItem('limpiezas_el_puerto_admin_unlocked');
  };

  // Sync to localStorage
  const saveBookings = (updated: BookingRequest[]) => {
    setBookings(updated);
    localStorage.setItem('limpiezas_el_puerto_leads', JSON.stringify(updated));
  };

  // Add simulated email and persist
  const handleAddSimulatedEmail = (newEmail: SimulatedEmail) => {
    const updated = [newEmail, ...sentEmails];
    setSentEmails(updated);
    localStorage.setItem('limpiezas_el_puerto_sent_emails', JSON.stringify(updated));
  };

  // Add booking lead
  const handleAddBooking = (newBooking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const bookingId = 'REF-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const fullBooking: BookingRequest = {
      ...newBooking,
      id: bookingId,
      createdAt: formattedDate,
      status: 'pendiente',
      paymentStatus: newBooking.paymentStatus || 'pendiente',
      photos: newBooking.photos || [],
    };

    const updated = [fullBooking, ...bookings];
    saveBookings(updated);

    // Helper inside email builder
    const getServiceLabel = (type: ServiceType) => {
      switch(type) {
        case 'hogar': return 'Hogar Particular';
        case 'oficina': return 'Oficinas & Despachos';
        case 'comunidad': return 'Comunidades de Vecinos';
        case 'fin_obra': return 'Fin de Obra / Reforma';
        default: return 'Limpieza General';
      }
    };

    // Automatically trigger booking confirmation email
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const confirmEmail: SimulatedEmail = {
      id: 'MAIL-' + Math.floor(10000 + Math.random() * 90000),
      to: fullBooking.email,
      subject: `✉ Presupuesto Recibido y Pre-Reserva Registrada - Ref: ${fullBooking.id}`,
      sentAt: `${now.toLocaleDateString('es-ES')} ${timeStr}`,
      type: 'confirmacion',
      read: false,
      body: `¡Hola ${fullBooking.clientName}!
      
Hemos recibido correctamente tu solicitud de presupuesto y pre-reserva de limpieza profesional en El Puerto de Santa María.

=========================================
RESUMEN DE TU SOLICITUD
=========================================
Referencia de Reserva: ${fullBooking.id}
Servicio: Limpieza de ${getServiceLabel(fullBooking.serviceType)}
Superficie: ${fullBooking.sqm} m²
Frecuencia: ${fullBooking.frequency === 'una_vez' ? 'Una sola vez' : fullBooking.frequency}
Precio Estimado: ${fullBooking.estimatedPrice.toFixed(2)}€
Domicilio: ${fullBooking.addressLocator || 'No especificado'}

-----------------------------------------
PASO OBLIGATORIO PARA CONFIRMAR:
-----------------------------------------
Recuerda que, tal como se indica en nuestra web, las reservas se tienen que pagar por adelantado para quedar oficialmente confirmadas y agendadas en nuestro calendario.

Puedes realizar el pago de manera segura con Tarjeta Bancaria o Bizum accediendo a tu Área de Cliente con tu correo electrónico (${fullBooking.email}).

Si has subido fotos de tu inmueble, nuestro equipo técnico ya las está revisando para coordinar el equipamiento necesario.

Muchas gracias por elegir Limpiezas El Puerto.

Atentamente,
El Equipo de Coordinación
Limpiezas El Puerto S.L.
Teléfono: 682 020 758
Avda Juan Melgarejo, 2, 11500, El Puerto de Santa María, Cádiz`
    };

    // Append to simulated inbox
    const updatedEmails = [confirmEmail, ...sentEmails];
    setSentEmails(updatedEmails);
    localStorage.setItem('limpiezas_el_puerto_sent_emails', JSON.stringify(updatedEmails));

    return fullBooking;
  };

  // Update lead status
  const handleUpdateStatus = (id: string, status: 'pendiente' | 'contactado' | 'completado') => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    saveBookings(updated);
  };

  // Update payment status
  const handleUpdatePaymentStatus = (id: string, paymentStatus: 'pendiente' | 'pagado') => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        // If transitioning to paid, send notification email
        if (paymentStatus === 'pagado' && b.paymentStatus !== 'pagado') {
          const now = new Date();
          const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
          const paymentEmail: SimulatedEmail = {
            id: 'MAIL-' + Math.floor(10000 + Math.random() * 90000),
            to: b.email,
            subject: `✉ ¡Reserva CONFIRMADA y Pagada! - Ref: ${b.id}`,
            sentAt: `${now.toLocaleDateString('es-ES')} ${timeStr}`,
            type: 'pago',
            read: false,
            body: `¡Hola ${b.clientName}!
            
¡Excelentes noticias! Hemos recibido correctamente el pago de tu reserva con referencia ${b.id}.

Tu servicio de limpieza profesional está OFICIALMENTE CONFIRMADO en nuestro calendario de Limpiezas El Puerto.

=========================================
DETALLES DEL PAGO RECIBIDO
=========================================
Importe Pagado: ${b.estimatedPrice.toFixed(2)}€
Estado de Reserva: Confirmada / Pagada por Adelantado
Zona del Servicio: ${b.neighborhood}
Domicilio: ${b.addressLocator || 'No especificado'}

Un supervisor de nuestro equipo técnico de El Puerto de Santa María te contactará para ultimar detalles logísticos si fuera necesario.

¡Muchas gracias por confiar en Limpiezas El Puerto!

Atentamente,
El Equipo de Coordinación
Limpiezas El Puerto S.L.
Teléfono: 682 020 758`
          };
          // Cannot call handleAddSimulatedEmail directly since we need state updates
          const newEmails = [paymentEmail, ...sentEmails];
          setSentEmails(newEmails);
          localStorage.setItem('limpiezas_el_puerto_sent_emails', JSON.stringify(newEmails));
        }
        return { ...b, paymentStatus };
      }
      return b;
    });
    saveBookings(updated);
  };

  // Update complete booking from ClientPortal
  const handleUpdateBooking = (updatedBooking: BookingRequest) => {
    const updated = bookings.map((b) => b.id === updatedBooking.id ? updatedBooking : b);
    saveBookings(updated);
  };

  // Open Client Portal helper
  const handleOpenClientPortal = (email: string) => {
    setIsAdminMode(false);
    setIsClientPortalActive(true);
    if (email) {
      localStorage.setItem('limpiezas_el_puerto_client_email', email);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete lead
  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    saveBookings(updated);
  };

  // Seed mock data manually if empty
  const handleSeedMockData = () => {
    saveBookings(initialSeeds);
  };

  // Scroll Helpers
  const scrollToSection = (id: string) => {
    setIsAdminMode(false);
    setIsClientPortalActive(false);
    setTimeout(() => {
      if (id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenCalculator={() => scrollToSection('calculadora')}
        onScrollToSection={scrollToSection}
        onOpenAdmin={() => {
          setIsClientPortalActive(false);
          setIsAdminMode(!isAdminMode);
        }}
        isAdminMode={isAdminMode}
        showAdminFeatures={showAdminFeatures}
        onUnlockAdmin={() => {
          if (showAdminFeatures) {
            setIsClientPortalActive(false);
            setIsAdminMode(!isAdminMode);
          } else {
            setIsLoginModalOpen(true);
          }
        }}
        onOpenClientPortal={() => {
          setIsAdminMode(false);
          setIsClientPortalActive(!isClientPortalActive);
        }}
        isClientPortalActive={isClientPortalActive}
      />

      {/* Main Container */}
      <main>
        {isAdminMode ? (
          <AdminPanel
            bookings={bookings}
            onUpdateStatus={handleUpdateStatus}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
            onDeleteBooking={handleDeleteBooking}
            onSeedMockData={handleSeedMockData}
            onLogout={handleAdminLogout}
          />
        ) : isClientPortalActive ? (
          <ClientPortal
            bookings={bookings}
            onUpdateBooking={handleUpdateBooking}
            onNavigateHome={() => setIsClientPortalActive(false)}
            sentEmails={sentEmails}
            onAddSimulatedEmail={handleAddSimulatedEmail}
          />
        ) : (
          <>
            {/* 1. Hero Promo Section */}
            <Hero
              onScrollToCalculator={() => scrollToSection('calculadora')}
            />

            {/* 2. Professional Services Showcase */}
            <Services
              onSelectService={(serviceId) => {
                setSelectedService(serviceId);
                scrollToSection('calculadora');
              }}
            />

            {/* 3. Interactive Budget Calculator & Lead form */}
            <BudgetCalculator
              selectedServiceId={selectedService}
              onChangeService={(serviceId) => setSelectedService(serviceId)}
              onSubmitBooking={handleAddBooking}
              onOpenClientPortal={handleOpenClientPortal}
            />

            {/* 5. Client Testimonials & Guarantees */}
            <Testimonials />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => {
          setIsClientPortalActive(false);
          setIsAdminMode(!isAdminMode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdminMode={isAdminMode}
        showAdminFeatures={showAdminFeatures}
        onUnlockAdmin={() => setIsLoginModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Premium Admin Authentication Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 p-8 shadow-2xl">
            {/* Ambient decorations */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 mb-4 border border-sky-500/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Acceso de Administración</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                Introduzca la clave de acceso de Limpiezas El Puerto para desbloquear el panel de control.
              </p>
            </div>

             <form onSubmit={handleVerifyPassword} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usuario Administrador</label>
                <input
                  type="text"
                  placeholder="Usuario (ej. admin)"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-sans"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contraseña Administrativa</label>
                <input
                  type="password"
                  placeholder="Introduzca la clave (ej. puerto)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 font-medium text-center">
                  ⚠️ {loginError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setUsernameInput('');
                    setPasswordInput('');
                    setLoginError('');
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-sky-500/10"
                >
                  Verificar
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-850 pt-4 text-center">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest">
                Sugerencia: Usuario <span className="font-mono text-slate-400 font-black">admin</span> y Clave <span className="font-mono text-slate-400 font-black">puerto</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

