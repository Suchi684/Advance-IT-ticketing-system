export const STATUSES = [
  { value: 'OPEN', label: 'Open', color: '#C75050' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#D4A0B0' },
  { value: 'RESOLVED', label: 'Resolved', color: '#6B3A5E' },
  { value: 'CLOSED', label: 'Closed', color: '#8C8590' },
];

export const PRIORITIES = [
  { value: 'LOW', label: 'Low', color: '#8C8590' },
  { value: 'MEDIUM', label: 'Medium', color: '#A0516B' },
  { value: 'HIGH', label: 'High', color: '#D4A0B0' },
  { value: 'URGENT', label: 'Urgent', color: '#C75050' },
];

export const getCategoryColor = (category, categories = []) => {
  const cat = categories.find(c => c.name === category);
  return cat ? cat.color : '#8C8590';
};

export const getCategoryLabel = (category, categories = []) => {
  const cat = categories.find(c => c.name === category);
  return cat ? cat.label : category;
};

export const getStatusColor = (status) => {
  const st = STATUSES.find(s => s.value === status);
  return st ? st.color : '#8C8590';
};

export const getStatusLabel = (status) => {
  const st = STATUSES.find(s => s.value === status);
  return st ? st.label : status;
};
