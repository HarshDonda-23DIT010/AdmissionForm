import React, { useState } from 'react';
import { saveInquiry } from '../../utils/storage';

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentMobile: '',
    email: '',
    parentMobile: '',
    city: '',
    district: '',
    districtOther: '',
    stateOther: '',
    board: '',
    boardOther: '',
    pcmPR: '',
    gujcetPR: '',
    branchPreference: [],
    branchOther: '',
    admissionType: [],
    charusatFormFilled: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const districts = [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 
    'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
    'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch',
    'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
    'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
    'Tapi', 'Vadodara', 'Valsad', 'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Required';
    }

    if (!formData.studentMobile.trim()) {
      newErrors.studentMobile = 'Required';
    } else if (!/^[6-9]\d{9}$/.test(formData.studentMobile)) {
      newErrors.studentMobile = 'Enter valid 10-digit number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter valid email';
    }

    if (!formData.parentMobile.trim()) {
      newErrors.parentMobile = 'Required';
    } else if (!/^[6-9]\d{9}$/.test(formData.parentMobile)) {
      newErrors.parentMobile = 'Enter valid 10-digit number';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Required';
    }

    if (!formData.district) {
      newErrors.district = 'Required';
    }

    if (formData.district === 'Other' && !formData.districtOther.trim()) {
      newErrors.districtOther = 'Please specify district name';
    }

    if (formData.district === 'Other' && !formData.stateOther.trim()) {
      newErrors.stateOther = 'Please specify state';
    }

    if (!formData.board) {
      newErrors.board = 'Required';
    }

    if (formData.board === 'Other' && !formData.boardOther.trim()) {
      newErrors.boardOther = 'Please specify board';
    }

    if (formData.branchPreference.length === 0) {
      newErrors.branchPreference = 'Select at least one';
    }

    if (formData.branchPreference.includes('Other') && !formData.branchOther.trim()) {
      newErrors.branchOther = 'Please specify branch';
    }

    if (formData.admissionType.length === 0) {
      newErrors.admissionType = 'Select at least one';
    }

    if (!formData.charusatFormFilled) {
      newErrors.charusatFormFilled = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please fill all required fields' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare data with Other values
      const dataToSave = {
        ...formData,
        district: formData.district === 'Other' ? formData.districtOther : formData.district,
        state: formData.district === 'Other' ? formData.stateOther : 'Gujarat',
        board: formData.board === 'Other' ? formData.boardOther : formData.board,
        branchPreference: formData.branchPreference.map(b => 
          b === 'Other' ? formData.branchOther : b
        )
      };
      
      await saveInquiry(dataToSave);
      setSubmitStatus({ type: 'success', message: 'Inquiry submitted successfully!' });
      
      setFormData({
        studentName: '',
        studentMobile: '',
        email: '',
        parentMobile: '',
        city: '',
        district: '',
        districtOther: '',
        stateOther: '',
        board: '',
        boardOther: '',
        pcmPR: '',
        gujcetPR: '',
        branchPreference: [],
        branchOther: '',
        admissionType: [],
        charusatFormFilled: '',
        remarks: ''
      });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <h2 className="text-xl font-bold text-blue-700 text-center mb-1">
        Student Inquiry Form
      </h2>
      <p className="text-gray-500 text-sm text-center mb-4">
        Fill your details for admission inquiry
      </p>

      {submitStatus && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          submitStatus.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Full Name (As per marksheet)<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className={`w-full px-3 py-2.5 border rounded-lg text-base ${errors.studentName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName}</p>}
        </div>

        {/* Student Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="studentMobile"
            value={formData.studentMobile}
            onChange={handleInputChange}
            placeholder="10-digit mobile number"
            maxLength={10}
            className={`w-full px-3 py-2.5 border rounded-lg text-base ${errors.studentMobile ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.studentMobile && <p className="text-red-500 text-xs mt-1">{errors.studentMobile}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            className={`w-full px-3 py-2.5 border rounded-lg text-base ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Parent Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="parentMobile"
            value={formData.parentMobile}
            onChange={handleInputChange}
            placeholder="10-digit mobile number"
            maxLength={10}
            className={`w-full px-3 py-2.5 border rounded-lg text-base ${errors.parentMobile ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.parentMobile && <p className="text-red-500 text-xs mt-1">{errors.parentMobile}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City / Village <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter city or village"
            className={`w-full px-3 py-2.5 border rounded-lg text-base ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District <span className="text-red-500">*</span>
          </label>
          <select
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className={`w-full px-3 py-2.5 border rounded-lg text-base ${errors.district ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
          >
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
          
          {formData.district === 'Other' && (
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="districtOther"
                  value={formData.districtOther}
                  onChange={handleInputChange}
                  placeholder="Enter district name"
                  className={`w-full px-3 py-2.5 border rounded-lg text-base ${errors.districtOther ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.districtOther && <p className="text-red-500 text-xs mt-1">{errors.districtOther}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stateOther"
                  value={formData.stateOther}
                  onChange={handleInputChange}
                  placeholder="Enter state name"
                  className={`w-full px-3 py-2.5 border rounded-lg text-base ${errors.stateOther ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.stateOther && <p className="text-red-500 text-xs mt-1">{errors.stateOther}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Board */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Board <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {['GSEB', 'CBSE', 'ICSE', 'Other'].map(board => (
              <label key={board} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="board"
                  value={board}
                  checked={formData.board === board}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{board}</span>
              </label>
            ))}
          </div>
          {errors.board && <p className="text-red-500 text-xs mt-1">{errors.board}</p>}
          
          {formData.board === 'Other' && (
            <input
              type="text"
              name="boardOther"
              value={formData.boardOther}
              onChange={handleInputChange}
              placeholder="Enter board name"
              className={`w-full mt-2 px-3 py-2.5 border rounded-lg text-base ${errors.boardOther ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          )}
          {errors.boardOther && <p className="text-red-500 text-xs mt-1">{errors.boardOther}</p>}
        </div>

        {/* 12th PCM PR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            12th PCM PR <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="number"
            name="pcmPR"
            value={formData.pcmPR}
            onChange={handleInputChange}
            placeholder="Enter percentile rank"
            min="0"
            max="100"
            step="0.01"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* GUJCET PR */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GUJCET PR <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="number"
            name="gujcetPR"
            value={formData.gujcetPR}
            onChange={handleInputChange}
            placeholder="Enter percentile rank"
            min="0"
            max="100"
            step="0.01"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Branch Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Branch Preference <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {['CE', 'CSE', 'IT', 'Other'].map(branch => (
              <label key={branch} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.branchPreference.includes(branch)}
                  onChange={() => handleCheckboxChange('branchPreference', branch)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm">{branch}</span>
              </label>
            ))}
          </div>
          {errors.branchPreference && <p className="text-red-500 text-xs mt-1">{errors.branchPreference}</p>}
          
          {formData.branchPreference.includes('Other') && (
            <input
              type="text"
              name="branchOther"
              value={formData.branchOther}
              onChange={handleInputChange}
              placeholder="Enter branch name"
              className={`w-full mt-2 px-3 py-2.5 border rounded-lg text-base ${errors.branchOther ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          )}
          {errors.branchOther && <p className="text-red-500 text-xs mt-1">{errors.branchOther}</p>}
        </div>

        {/* Admission Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admission Interest Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {['ACPC', 'Management Quota', 'NRI'].map(type => (
              <label key={type} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.admissionType.includes(type)}
                  onChange={() => handleCheckboxChange('admissionType', type)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
          {errors.admissionType && <p className="text-red-500 text-xs mt-1">{errors.admissionType}</p>}
        </div>

        {/* CHARUSAT Form */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Have you filled CHARUSAT MQ/NRI Form? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {['Yes', 'No'].map(option => (
              <label key={option} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="charusatFormFilled"
                  value={option}
                  checked={formData.charusatFormFilled === option}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
          {errors.charusatFormFilled && <p className="text-red-500 text-xs mt-1">{errors.charusatFormFilled}</p>}
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            placeholder="Any additional comments..."
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;
