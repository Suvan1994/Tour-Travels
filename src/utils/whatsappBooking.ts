import { BookingEnquiryPayload } from '../types/travel';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateBookingEnquiry(
  data: {
    name: string;
    mobile: string;
    pickup: string;
    destination: string;
    passengers: number;
    maxCapacity: number;
    travelDate: string;
    returnDate: string;
    requireReturnDate: boolean;
  }
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please enter passenger full name (at least 2 characters).';
  }

  const digitsOnly = data.mobile.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    errors.mobile = 'Please enter a valid 10-digit mobile / WhatsApp number.';
  }

  if (!data.pickup || data.pickup.trim().length < 2) {
    errors.pickup = 'Please select or enter a pickup location.';
  }

  if (!data.destination || data.destination.trim().length < 2) {
    errors.destination = 'Please select or enter a destination.';
  }

  if (!Number.isFinite(data.passengers) || data.passengers < 1) {
    errors.passengers = 'At least 1 passenger is required.';
  } else if (data.passengers > data.maxCapacity) {
    errors.passengers = `Selected vehicle seats up to ${data.maxCapacity} passengers. Please choose a larger vehicle or reduce passenger count.`;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (!data.travelDate) {
    errors.travelDate = 'Please select your travel date.';
  } else if (data.travelDate < todayStr) {
    errors.travelDate = 'Travel date cannot be in the past.';
  }

  if (data.requireReturnDate) {
    if (!data.returnDate) {
      errors.returnDate = 'Please select a return date for a round-trip journey.';
    } else if (data.travelDate && data.returnDate < data.travelDate) {
      errors.returnDate = 'Return date must be on or after the travel date.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats the exact WhatsApp message required for JMD Tour & Travels enquiries.
 */
export function buildWhatsAppEnquiryMessage(payload: BookingEnquiryPayload): string {
  const lines = [
    '*NEW ENQUIRY - JMD TOUR & TRAVELS*',
    '',
    `Name: ${payload.name.trim()}`,
    `Mobile: ${payload.mobile.trim()}`,
    `Pickup: ${payload.pickup.trim()}`,
    `Destination: ${payload.destination.trim()}`,
    `Distance: ${payload.distanceText}`,
    `Journey Type: ${payload.journeyTypeLabel}`,
    `Vehicle: ${payload.vehicleName}`,
    `Passengers: ${payload.passengers}`,
    `Travel Date: ${payload.travelDate}`,
    `Return Date: ${payload.returnDate}`,
    `Estimated Fare: ${payload.estimatedFareText}`,
    `Special Requirements: ${payload.specialRequirements.trim() || 'None'}`,
  ];

  return lines.join('\n');
}

export function buildWhatsAppUrl(
  whatsappNumberInternational: string,
  message: string
): string {
  const cleanNumber = whatsappNumberInternational.replace(/\D/g, '') || '918859364336';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens an external URL in a new tab using a native DOM anchor element
 * with target="_blank" and rel="noopener noreferrer" (avoiding window.open).
 */
export function openExternalLinkInNewTab(url: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
