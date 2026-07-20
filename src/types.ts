/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ServiceType = 'hogar' | 'oficina' | 'comunidad' | 'fin_obra';

export interface ServiceDetail {
  id: ServiceType;
  title: string;
  description: string;
  basePricePerSqm: number;
  icon: string;
  features: string[];
}

export interface BookingRequest {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  neighborhood: string;
  serviceType: ServiceType;
  sqm: number;
  frequency: 'una_vez' | 'semanal' | 'quincenal' | 'mensual';
  extras: {
    cristales: boolean;
    plancha: boolean;
    ecoProducts: boolean;
    desinfeccion: boolean;
  };
  notes: string;
  estimatedPrice: number;
  status: 'pendiente' | 'contactado' | 'completado';
  createdAt: string;
  photos?: string[];
  paymentStatus?: 'pendiente' | 'pagado';
  addressLocator?: string;
}

export interface AdTemplate {
  title: string;
  subtitle: string;
  discount: string;
  couponCode: string;
  phone: string;
  whatsapp: string;
  neighborhoodsText: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  imageUrl?: string;
}

export interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  type: 'confirmacion' | 'pago' | 'aviso';
  read: boolean;
}
