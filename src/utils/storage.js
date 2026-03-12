// Storage utility for managing inquiry data using Firebase Firestore
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';

const COLLECTION_NAME = 'inquiries';

// Get all inquiries from Firestore
export const getAllInquiries = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('dateTime', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateTime: doc.data().dateTime?.toDate?.() 
        ? doc.data().dateTime.toDate().toISOString() 
        : doc.data().dateTime
    }));
  } catch (error) {
    console.error('Error reading from Firestore:', error);
    return [];
  }
};

// Save a new inquiry
export const saveInquiry = async (inquiry) => {
  try {
    const newInquiry = {
      ...inquiry,
      dateTime: Timestamp.now(),
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, COLLECTION_NAME), newInquiry);
    console.log('Inquiry saved with ID:', docRef.id);
    return { id: docRef.id, ...newInquiry };
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    throw error;
  }
};

// Get total count of inquiries
export const getTotalCount = async () => {
  const inquiries = await getAllInquiries();
  return inquiries.length;
};

// Get inquiries for the last 7 days with daily counts
export const getWeeklyStats = async () => {
  const inquiries = await getAllInquiries();
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
export const getInquiriesByDateRange = async (fromDate, toDate) => {
  const inquiries = await getAllInquiries();
  
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
export const deleteInquiry = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
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
