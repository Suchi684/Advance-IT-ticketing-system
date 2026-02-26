import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), 'MMM dd, yyyy HH:mm');
  } catch {
    return dateStr;
  }
};

export const formatRelative = (dateStr) => {
  if (!dateStr) return '';
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
};
