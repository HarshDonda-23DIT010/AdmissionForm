import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, fileName = 'DEPSTAR_Inquiries') => {
  // Prepare data for Excel
  const excelData = data.map((inquiry, index) => ({
    'Sr. No.': index + 1,
    'Student Name': inquiry.studentName || '',
    'Faculty Staff Name': inquiry.counsellorName || '',
    'Student Mobile': inquiry.studentMobile || '',
    'Email Address': inquiry.email || '',
    'Parent Mobile': inquiry.parentMobile || '',
    'City/Village': inquiry.city || '',
    'District': inquiry.district || '',
    'State': inquiry.state || 'Gujarat',
    'Board': inquiry.board || '',
    '12th PCM PR': inquiry.pcmPR || 'N/A',
    'GUJCET PR': inquiry.gujcetPR || 'N/A',
    'Branch Preference': Array.isArray(inquiry.branchPreference) 
      ? inquiry.branchPreference.join(', ') 
      : inquiry.branchPreference || '',
    'Admission Interest Type': Array.isArray(inquiry.admissionType) 
      ? inquiry.admissionType.join(', ') 
      : inquiry.admissionType || '',
    'CHARUSAT MQ/NRI Form Filled': inquiry.charusatFormFilled || '',
    'Remarks': inquiry.remarks || 'N/A',
    'Date & Time of Visit': inquiry.dateTime 
      ? new Date(inquiry.dateTime).toLocaleString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      : ''
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 8 },   // Sr. No.
    { wch: 25 },  // Student Name
    { wch: 25 },  // Counsellor Name
    { wch: 15 },  // Student Mobile
    { wch: 30 },  // Email
    { wch: 15 },  // Parent Mobile
    { wch: 20 },  // City/Village
    { wch: 20 },  // District
    { wch: 15 },  // State
    { wch: 12 },  // Board
    { wch: 12 },  // 12th PCM PR
    { wch: 12 },  // GUJCET PR
    { wch: 20 },  // Branch Preference
    { wch: 25 },  // Admission Interest Type
    { wch: 25 },  // CHARUSAT Form
    { wch: 30 },  // Remarks
    { wch: 22 },  // Date & Time
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inquiries');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  saveAs(blob, `${fileName}_${dateStr}.xlsx`);
};
