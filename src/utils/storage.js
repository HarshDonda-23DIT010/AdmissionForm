// Storage utility for managing inquiry data using localStorage
// This simulates a JSON file database for Vercel deployment

const STORAGE_KEY = 'depstar_inquiries';

// Get all inquiries from storage
export const getAllInquiries = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from storage:', error);
    return [];
  }
};

// Save a new inquiry
export const saveInquiry = (inquiry) => {
  try {
    const inquiries = getAllInquiries();
    const newInquiry = {
      ...inquiry,
      id: Date.now(),
      dateTime: new Date().toISOString(),
    };
    inquiries.push(newInquiry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
    return newInquiry;
  } catch (error) {
    console.error('Error saving to storage:', error);
    throw error;
  }
};

// Get total count of inquiries
export const getTotalCount = () => {
  return getAllInquiries().length;
};

// Get inquiries for the last 7 days with daily counts
export const getWeeklyStats = () => {
  const inquiries = getAllInquiries();
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  const weekData = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setHours(23, 59, 59, 999);
    
    const count = inquiries.filter(inq => {
      const inqDate = new Date(inq.dateTime);
      return inqDate >= date && inqDate <= nextDate;
    }).length;
    
    weekData.push({
      day: dayNames[date.getDay()],
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      fullDate: date.toISOString().split('T')[0],
      count: count
    });
  }
  
  return weekData;
};

// Get inquiries within a date range
export const getInquiriesByDateRange = (fromDate, toDate) => {
  const inquiries = getAllInquiries();
  
  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);
  
  const to = new Date(toDate);
  to.setHours(23, 59, 59, 999);
  
  return inquiries.filter(inq => {
    const inqDate = new Date(inq.dateTime);
    return inqDate >= from && inqDate <= to;
  });
};

// Delete an inquiry by ID
export const deleteInquiry = (id) => {
  try {
    const inquiries = getAllInquiries();
    const filtered = inquiries.filter(inq => inq.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    throw error;
  }
};

// Clear all data (for testing)
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
