/**
 * WhatsApp Helper Utilities for Interview Scheduler
 * Host WhatsApp phone: +91 9595579336 (919595579336)
 */

export const DEFAULT_HOST_WHATSAPP = '919595579336';

/**
 * Clean phone number string to remove non-numeric chars
 * @param {string} phone 
 * @returns {string} digits only
 */
export const sanitizePhoneNumber = (phone) => {
  if (!phone) return DEFAULT_HOST_WHATSAPP;
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned || DEFAULT_HOST_WHATSAPP;
};

/**
 * Format a rich, structured WhatsApp notification message for an interview booking
 * @param {Object} booking 
 * @returns {string} Formatted text for WhatsApp
 */
export const formatWhatsAppBookingMessage = (booking = {}) => {
  const candidateName = booking.candidateName || booking.name || 'Candidate';
  const candidateEmail = booking.candidateEmail || booking.email || 'N/A';
  const company = booking.company || 'N/A';
  const role = booking.jobRole || booking.role || 'Interview Candidate';
  const date = booking.date || 'Scheduled Date';
  const time = booking.time || booking.selectedSlot || 'Slot Time';
  const duration = booking.duration || '30 min';
  const meetLink = booking.meetLink || 'Will be shared via email';
  const notes = booking.notes || 'None';

  return `📅 *NEW INTERVIEW BOOKING ALERT* 📅\n` +
    `----------------------------------\n` +
    `👤 *Candidate:* ${candidateName}\n` +
    `📧 *Email:* ${candidateEmail}\n` +
    `🏢 *Company:* ${company}\n` +
    `💼 *Role:* ${role}\n` +
    `⏱️ *Duration:* ${duration}\n\n` +
    `📆 *Date:* ${date}\n` +
    `⏰ *Slot & IST Time:* ${time}\n` +
    `💻 *Meet Link:* ${meetLink}\n` +
    `📝 *Candidate Notes:* ${notes}\n` +
    `----------------------------------\n` +
    `✨ *Sent via InterviewScheduler Portal*`;
};

/**
 * Generate WhatsApp wa.me URL
 * @param {Object} params 
 * @param {Object} params.booking
 * @param {string} [params.phone]
 * @param {string} [params.customMessage]
 * @returns {string} wa.me URL
 */
export const getWhatsAppShareUrl = ({ booking, phone = DEFAULT_HOST_WHATSAPP, customMessage } = {}) => {
  const cleanPhone = sanitizePhoneNumber(phone);
  const messageText = customMessage || formatWhatsAppBookingMessage(booking);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
};

/**
 * Open WhatsApp directly in a new tab / app window
 * @param {Object} booking 
 * @param {string} [phone] 
 */
export const openWhatsAppNotification = (booking, phone = DEFAULT_HOST_WHATSAPP) => {
  const url = getWhatsAppShareUrl({ booking, phone });
  window.open(url, '_blank', 'noopener,noreferrer');
};
