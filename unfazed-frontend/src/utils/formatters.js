// Utility functions for Unfazed Practice Management

export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  // Handles 24h or already formatted strings
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${m || '00'} ${ampm}`;
};

export const getStatusBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
    case 'completed':
    case 'active':
    case 'paid':
      return 'bg-sage-light text-sage-dark border-sage/40';
    case 'upcoming':
    case 'scheduled':
    case 'pending':
    case 'in-progress':
      return 'bg-misty-light text-midnight border-misty/40';
    case 'cancelled':
    case 'refunded':
    case 'no-show':
    case 'paused':
      return 'bg-rosewood-light text-rosewood border-rosewood/30';
    case 'shared':
      return 'bg-sage-light text-sage-dark border-sage/40';
    case 'private':
      return 'bg-blush-light text-rosewood border-blush/60';
    default:
      return 'bg-vanilla-dark/50 text-midnight-muted border-gray-200';
  }
};
