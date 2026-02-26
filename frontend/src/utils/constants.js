export const CATEGORIES = [
  { value: 'RETURN', label: 'Return', color: '#e74c3c' },
  { value: 'EXCHANGE', label: 'Exchange', color: '#f39c12' },
  { value: 'REFUND', label: 'Refund', color: '#9b59b6' },
  { value: 'LOW_QUALITY', label: 'Low Quality', color: '#e67e22' },
  { value: 'SHIPPING', label: 'Shipping', color: '#3498db' },
  { value: 'ORDER_ISSUE', label: 'Order Issue', color: '#1abc9c' },
  { value: 'GENERAL', label: 'General', color: '#95a5a6' },
];

export const STATUSES = [
  { value: 'OPEN', label: 'Open', color: '#e74c3c' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#f39c12' },
  { value: 'RESOLVED', label: 'Resolved', color: '#27ae60' },
  { value: 'CLOSED', label: 'Closed', color: '#95a5a6' },
];

export const PRIORITIES = [
  { value: 'LOW', label: 'Low', color: '#95a5a6' },
  { value: 'MEDIUM', label: 'Medium', color: '#3498db' },
  { value: 'HIGH', label: 'High', color: '#f39c12' },
  { value: 'URGENT', label: 'Urgent', color: '#e74c3c' },
];

export const getCategoryColor = (category) => {
  const cat = CATEGORIES.find(c => c.value === category);
  return cat ? cat.color : '#95a5a6';
};

export const getCategoryLabel = (category) => {
  const cat = CATEGORIES.find(c => c.value === category);
  return cat ? cat.label : category;
};

export const getStatusColor = (status) => {
  const st = STATUSES.find(s => s.value === status);
  return st ? st.color : '#95a5a6';
};

export const getStatusLabel = (status) => {
  const st = STATUSES.find(s => s.value === status);
  return st ? st.label : status;
};
