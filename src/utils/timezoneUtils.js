// Timezone conversion utility for Interview Scheduler
// Uses native JavaScript Intl API with IANA timezones for exact Daylight Saving Time (DST) & real-world accuracy

export const TIMEZONE_OPTIONS = [
  { value: 'Eastern Time (US & Canada)', iana: 'America/New_York', label: 'Eastern Time - ET (US & Canada)' },
  { value: 'Central Time (US & Canada)', iana: 'America/Chicago', label: 'Central Time - CT (US & Canada)' },
  { value: 'Mountain Time (US & Canada)', iana: 'America/Denver', label: 'Mountain Time - MT (US & Canada)' },
  { value: 'Pacific Time (US & Canada)', iana: 'America/Los_Angeles', label: 'Pacific Time - PT (US & Canada)' },
  { value: 'Alaska Time', iana: 'America/Anchorage', label: 'Alaska Time - AKT' },
  { value: 'Hawaii Time', iana: 'Pacific/Honolulu', label: 'Hawaii Time - HST' },
  { value: 'Atlantic Time (Canada)', iana: 'America/Halifax', label: 'Atlantic Time - AT' },
  { value: 'Newfoundland Time', iana: 'America/St_Johns', label: 'Newfoundland Time - NST' },
  { value: 'UTC', iana: 'UTC', label: 'Coordinated Universal Time - UTC' },
  { value: 'London / UK Time (GMT/BST)', iana: 'Europe/London', label: 'London / UK Time (GMT/BST)' },
  { value: 'Central European Time', iana: 'Europe/Paris', label: 'Central European Time - CET/CEST' },
  { value: 'Eastern European Time', iana: 'Europe/Athens', label: 'Eastern European Time - EET/EEST' },
  { value: 'Arabia Standard Time', iana: 'Asia/Riyadh', label: 'Arabia Standard Time - AST (UTC+3)' },
  { value: 'Gulf Standard Time', iana: 'Asia/Dubai', label: 'Gulf Standard Time - GST (UTC+4)' },
  { value: 'Pakistan Standard Time', iana: 'Asia/Karachi', label: 'Pakistan Standard Time - PKT (UTC+5)' },
  { value: 'India Standard Time', iana: 'Asia/Kolkata', label: 'India Standard Time - IST (UTC+5:30)' },
  { value: 'Nepal Time', iana: 'Asia/Kathmandu', label: 'Nepal Time - NPT (UTC+5:45)' },
  { value: 'Bangladesh Standard Time', iana: 'Asia/Dhaka', label: 'Bangladesh Standard Time - BST (UTC+6)' },
  { value: 'Indochina Time', iana: 'Asia/Bangkok', label: 'Indochina Time - ICT (UTC+7)' },
  { value: 'China Standard Time', iana: 'Asia/Shanghai', label: 'China Standard Time - CST (UTC+8)' },
  { value: 'Singapore Time', iana: 'Asia/Singapore', label: 'Singapore Time - SGT (UTC+8)' },
  { value: 'Japan Standard Time', iana: 'Asia/Tokyo', label: 'Japan Standard Time - JST (UTC+9)' },
  { value: 'Korea Standard Time', iana: 'Asia/Seoul', label: 'Korea Standard Time - KST (UTC+9)' },
  { value: 'Australian Western Time', iana: 'Australia/Perth', label: 'Australian Western Time - AWST' },
  { value: 'Australian Central Time', iana: 'Australia/Adelaide', label: 'Australian Central Time - ACST/ACDT' },
  { value: 'Australian Eastern Time', iana: 'Australia/Sydney', label: 'Australian Eastern Time - AEST/AEDT' },
  { value: 'New Zealand Time', iana: 'Pacific/Auckland', label: 'New Zealand Time - NZST/NZDT' },
];

export const TIMEZONE_IANA_MAP = {
  // Eastern
  'EST (UTC-5)': 'America/New_York',
  'Eastern Time - EST (UTC-5)': 'America/New_York',
  'Eastern Time (US & Canada)': 'America/New_York',
  'Eastern Time - ET (US & Canada)': 'America/New_York',
  'America/New_York': 'America/New_York',
  
  // Central
  'CST (UTC-6)': 'America/Chicago',
  'Central Time - CST (UTC-6)': 'America/Chicago',
  'Central Time (US & Canada)': 'America/Chicago',
  'Central Time - CT (US & Canada)': 'America/Chicago',
  'America/Chicago': 'America/Chicago',
  
  // Mountain
  'MST (UTC-7)': 'America/Denver',
  'Mountain Time - MST (UTC-7)': 'America/Denver',
  'Mountain Time (US & Canada)': 'America/Denver',
  'Mountain Time - MT (US & Canada)': 'America/Denver',
  'America/Denver': 'America/Denver',
  
  // Pacific
  'PST (UTC-8)': 'America/Los_Angeles',
  'Pacific Time - PST (UTC-8)': 'America/Los_Angeles',
  'Pacific Time (US & Canada)': 'America/Los_Angeles',
  'Pacific Time - PT (US & Canada)': 'America/Los_Angeles',
  'America/Los_Angeles': 'America/Los_Angeles',
  
  // Alaska
  'AKST (UTC-9)': 'America/Anchorage',
  'Alaska Time - AKST (UTC-9)': 'America/Anchorage',
  'Alaska Time': 'America/Anchorage',
  'Alaska Time - AKT': 'America/Anchorage',
  'America/Anchorage': 'America/Anchorage',
  
  // Hawaii
  'HST (UTC-10)': 'Pacific/Honolulu',
  'Hawaii Time - HST (UTC-10)': 'Pacific/Honolulu',
  'Hawaii Time': 'Pacific/Honolulu',
  'Hawaii Time - HST': 'Pacific/Honolulu',
  'Pacific/Honolulu': 'Pacific/Honolulu',
  
  // Atlantic
  'AST (UTC-4)': 'America/Halifax',
  'Atlantic Time - AST (UTC-4)': 'America/Halifax',
  'Atlantic Time (Canada)': 'America/Halifax',
  'America/Halifax': 'America/Halifax',
  
  // Newfoundland
  'NST (UTC-3:30)': 'America/St_Johns',
  'Newfoundland Time - NST (UTC-3:30)': 'America/St_Johns',
  'Newfoundland Time': 'America/St_Johns',
  'America/St_Johns': 'America/St_Johns',
  
  // UTC / GMT / London
  'UTC': 'UTC',
  'UTC (UTC+0)': 'UTC',
  'Universal Coordinated - UTC': 'UTC',
  'Coordinated Universal Time - UTC': 'UTC',
  'GMT (UTC+0)': 'Europe/London',
  'Greenwich Mean Time - GMT': 'Europe/London',
  'London / UK Time (GMT/BST)': 'Europe/London',
  'Europe/London': 'Europe/London',
  
  // European
  'WET (UTC+0)': 'Europe/Lisbon',
  'Western European Time - WET': 'Europe/Lisbon',
  'CET (UTC+1)': 'Europe/Paris',
  'Central European Time': 'Europe/Paris',
  'Central European Time - CET/CEST': 'Europe/Paris',
  'Central European Time - CET (UTC+1)': 'Europe/Paris',
  'EET (UTC+2)': 'Europe/Athens',
  'Eastern European Time': 'Europe/Athens',
  'Eastern European Time - EET/EEST': 'Europe/Athens',
  'Eastern European Time - EET (UTC+2)': 'Europe/Athens',
  
  // Middle East & Asia
  'AST (UTC+3)': 'Asia/Riyadh',
  'Arabia Standard Time': 'Asia/Riyadh',
  'Arabia Standard Time - AST (UTC+3)': 'Asia/Riyadh',
  'GST (UTC+4)': 'Asia/Dubai',
  'Gulf Standard Time': 'Asia/Dubai',
  'Gulf Standard Time - GST (UTC+4)': 'Asia/Dubai',
  'PKT (UTC+5)': 'Asia/Karachi',
  'Pakistan Standard Time': 'Asia/Karachi',
  'Pakistan Standard Time - PKT (UTC+5)': 'Asia/Karachi',
  'IST (UTC+5:30)': 'Asia/Kolkata',
  'India Standard Time': 'Asia/Kolkata',
  'India Standard Time - IST (UTC+5:30)': 'Asia/Kolkata',
  'NPT (UTC+5:45)': 'Asia/Kathmandu',
  'Nepal Time': 'Asia/Kathmandu',
  'Nepal Time - NPT (UTC+5:45)': 'Asia/Kathmandu',
  'BST (UTC+6)': 'Asia/Dhaka',
  'Bangladesh Standard Time': 'Asia/Dhaka',
  'Bangladesh Standard Time - BST (UTC+6)': 'Asia/Dhaka',
  'ICT (UTC+7)': 'Asia/Bangkok',
  'Indochina Time': 'Asia/Bangkok',
  'Indochina Time - ICT (UTC+7)': 'Asia/Bangkok',
  'CST (UTC+8)': 'Asia/Shanghai',
  'China Standard Time': 'Asia/Shanghai',
  'China Standard Time - CST (UTC+8)': 'Asia/Shanghai',
  'SGT (UTC+8)': 'Asia/Singapore',
  'Singapore Time': 'Asia/Singapore',
  'Singapore Time - SGT (UTC+8)': 'Asia/Singapore',
  'JST (UTC+9)': 'Asia/Tokyo',
  'Japan Standard Time': 'Asia/Tokyo',
  'Japan Standard Time - JST (UTC+9)': 'Asia/Tokyo',
  'KST (UTC+9)': 'Asia/Seoul',
  'Korea Standard Time': 'Asia/Seoul',
  'Korea Standard Time - KST (UTC+9)': 'Asia/Seoul',
  
  // Australia / NZ
  'AWST (UTC+8)': 'Australia/Perth',
  'Australian Western Time': 'Australia/Perth',
  'Australian Western Time - AWST': 'Australia/Perth',
  'ACST (UTC+9:30)': 'Australia/Adelaide',
  'Australian Central Time': 'Australia/Adelaide',
  'Australian Central Time - ACST/ACDT': 'Australia/Adelaide',
  'AEST (UTC+10)': 'Australia/Sydney',
  'Australian Eastern Time': 'Australia/Sydney',
  'Australian Eastern Time - AEST/AEDT': 'Australia/Sydney',
  'NZST (UTC+12)': 'Pacific/Auckland',
  'New Zealand Time': 'Pacific/Auckland',
  'New Zealand Time - NZST/NZDT': 'Pacific/Auckland',
};

export function getIanaZone(tzKey = '') {
  if (!tzKey) return 'America/New_York';
  if (TIMEZONE_IANA_MAP[tzKey]) return TIMEZONE_IANA_MAP[tzKey];
  
  const found = TIMEZONE_OPTIONS.find(opt => opt.value === tzKey || opt.label === tzKey);
  if (found && found.iana) return found.iana;

  return 'America/New_York';
}

export function getTimezoneOffsetInMinutes(sourceTimezoneKey, dateStr = null) {
  const ianaZone = getIanaZone(sourceTimezoneKey);
  
  let dateObj = new Date();
  if (dateStr && typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }

  try {
    const format = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const parts = {};
    format.formatToParts(dateObj).forEach(p => {
      if (p.type !== 'literal') parts[p.type] = p.value;
    });

    let hr = parseInt(parts.hour, 10);
    if (hr === 24) hr = 0;

    const targetUtc = Date.UTC(
      parseInt(parts.year, 10),
      parseInt(parts.month, 10) - 1,
      parseInt(parts.day, 10),
      hr,
      parseInt(parts.minute, 10),
      parseInt(parts.second, 10)
    );

    return Math.round((targetUtc - dateObj.getTime()) / 60000);
  } catch (e) {
    if (typeof sourceTimezoneKey === 'string') {
      const match = sourceTimezoneKey.match(/\(UTC([+-])(\d{1,2})(?::(\d{2}))?\)/i);
      if (match) {
        const sign = match[1] === '+' ? 1 : -1;
        const hours = parseInt(match[2], 10);
        const mins = match[3] ? parseInt(match[3], 10) : 0;
        return sign * (hours * 60 + mins);
      }
    }
    return -240; // Default EDT (-4 hrs)
  }
}

export function getShortTimezoneCode(tzKey = '', dateStr = null) {
  if (!tzKey) return 'ET';
  const ianaZone = getIanaZone(tzKey);

  let dateObj = new Date();
  if (dateStr && typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    dateObj = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }

  try {
    const format = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaZone,
      timeZoneName: 'short'
    });
    const parts = format.formatToParts(dateObj);
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    if (tzPart && tzPart.value) {
      const code = tzPart.value;
      if (code === 'GMT+1' || code === 'BST') return 'BST';
      if (code === 'GMT') return 'GMT';
      return code;
    }
  } catch (e) {}

  const firstWord = tzKey.split(' ')[0];
  if (/^[A-Z]{2,5}$/.test(firstWord)) return firstWord;
  return 'ET';
}

/**
 * Converts a 12-hour time string (e.g. "10:30 AM") from sourceTimezone to IST (UTC+5:30).
 * Returns formatted IST string e.g. "09:00 PM IST" or "09:00 PM IST (+1d)".
 */
export function convertTimeToIST(time12h, sourceTimezoneKey = 'Eastern Time (US & Canada)', dateStr = null) {
  if (!time12h) return '';
  
  const sourceOffset = getTimezoneOffsetInMinutes(sourceTimezoneKey, dateStr);
  const istOffset = 330; // IST is always +5:30 (+330 mins)
  const diffMinutes = istOffset - sourceOffset;

  // Parse time12h e.g. "10:30 AM" or "02:30 PM"
  const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12h;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  let totalMinutes = hours * 60 + minutes + diffMinutes;

  let dayShift = 0;
  if (totalMinutes >= 1440) {
    dayShift = Math.floor(totalMinutes / 1440);
    totalMinutes = totalMinutes % 1440;
  } else if (totalMinutes < 0) {
    dayShift = Math.floor(totalMinutes / 1440);
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  }

  const convertedHours24 = Math.floor(totalMinutes / 60);
  const convertedMinutes = totalMinutes % 60;

  const convertedPeriod = convertedHours24 >= 12 ? 'PM' : 'AM';
  let convertedHours12 = convertedHours24 % 12;
  if (convertedHours12 === 0) convertedHours12 = 12;

  const formattedHours = convertedHours12 < 10 ? `0${convertedHours12}` : `${convertedHours12}`;
  const formattedMinutes = convertedMinutes < 10 ? `0${convertedMinutes}` : `${convertedMinutes}`;

  const timeResult = `${formattedHours}:${formattedMinutes} ${convertedPeriod} IST`;
  
  if (dayShift > 0) return `${timeResult} (+${dayShift}d)`;
  if (dayShift < 0) return `${timeResult} (${dayShift}d)`;
  return timeResult;
}

/**
 * Returns formatted dual-time string e.g., "10:30 AM EST ➔ 09:00 PM IST"
 */
export function formatDualTime(time12h, sourceTimezoneKey = 'Eastern Time (US & Canada)', dateStr = null) {
  const istTime = convertTimeToIST(time12h, sourceTimezoneKey, dateStr);
  const tzShort = getShortTimezoneCode(sourceTimezoneKey, dateStr);
  return `${time12h} ${tzShort} ➔ ${istTime}`;
}

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const str = String(timeStr).trim();

  // 12-hour format with AM/PM: e.g. "09:00 AM", "9:00PM", "12:30 pm"
  const ampmMatch = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const period = ampmMatch[3].toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // 24-hour format: e.g. "09:00", "17:00", "9:00", "09:00:00"
  const h24Match = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (h24Match) {
    const hours = parseInt(h24Match[1], 10);
    const minutes = parseInt(h24Match[2], 10);
    return hours * 60 + minutes;
  }

  return 0;
}

function minutesToTime12h(mins) {
  const hours24 = Math.floor(mins / 60) % 24;
  const minutes = mins % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  const formattedH = hours12 < 10 ? `0${hours12}` : `${hours12}`;
  const formattedM = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${formattedH}:${formattedM} ${period}`;
}

/**
 * Generates dynamic time slots for a day based on active working hours, duration, and break blocks
 */
export function generateSlotsFromSchedule(daySchedule, durationStr = '30 min') {
  if (!daySchedule || daySchedule.active === false) return [];

  const durationMins = parseInt(durationStr, 10) || 30;
  let startMins = timeToMinutes(daySchedule.startTime);
  let endMins = timeToMinutes(daySchedule.endTime);

  // Fallback defaults if startTime or endTime missing/unparsed (default 9 AM to 5 PM)
  if (startMins === 0 && endMins === 0) {
    startMins = 540; // 09:00 AM
    endMins = 1020;  // 05:00 PM
  } else if (endMins <= startMins) {
    endMins = startMins + 480; // Default 8 hour window
  }

  const breakRanges = (daySchedule.breaks || [])
    .map(b => ({
      start: timeToMinutes(b.start),
      end: timeToMinutes(b.end)
    }))
    .filter(b => b.start > 0 || b.end > 0);

  const slots = [];
  for (let current = startMins; current + durationMins <= endMins; current += durationMins) {
    const slotEnd = current + durationMins;
    
    // Check overlap with breaks
    const isOverlappingBreak = breakRanges.some(
      brk => (current < brk.end && slotEnd > brk.start)
    );

    if (!isOverlappingBreak) {
      slots.push(minutesToTime12h(current));
    }
  }

  return slots;
}

/**
 * Reliably returns the day of week name (e.g. 'Monday', 'Tuesday') for a YYYY-MM-DD date string across all timezones
 */
export function getDayNameFromDateStr(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return 'Monday';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return 'Monday';
  const [y, m, d] = parts;
  const dateObj = new Date(y, m - 1, d);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[dateObj.getDay()];
}




