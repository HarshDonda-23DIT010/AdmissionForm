import React, { useState, useEffect } from 'react';
import { getTotalCount, getWeeklyStats, getInquiriesByDateRange, getAllInquiries } from '../../utils/storage';
import { exportToExcel } from '../../utils/exportExcel';

const Dashboard = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadStats();
    
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    setToDate(today.toISOString().split('T')[0]);
    setFromDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, [refreshKey]);

  const loadStats = () => {
    setTotalCount(getTotalCount());
    setWeeklyStats(getWeeklyStats());
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleExport = () => {
    if (!fromDate || !toDate) {
      alert('Please select both From and To dates');
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      alert('From date cannot be greater than To date');
      return;
    }

    setIsExporting(true);
    
    try {
      const data = getInquiriesByDateRange(fromDate, toDate);
      
      if (data.length === 0) {
        alert('No inquiries found for the selected date range');
        setIsExporting(false);
        return;
      }

      const fileName = `DEPSTAR_Inquiries_${fromDate}_to_${toDate}`;
      exportToExcel(data, fileName);
    } catch (error) {
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = () => {
    setIsExporting(true);
    
    try {
      const data = getAllInquiries();
      
      if (data.length === 0) {
        alert('No inquiries to export');
        setIsExporting(false);
        return;
      }

      exportToExcel(data, 'DEPSTAR_All_Inquiries');
    } catch (error) {
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getMaxCount = () => {
    return Math.max(...weeklyStats.map(d => d.count), 1);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <button
            onClick={handleRefresh}
            className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-600 text-white rounded-xl p-3 text-center">
          <p className="text-2xl font-bold">{totalCount}</p>
          <p className="text-xs text-blue-200">Total</p>
        </div>
        <div className="bg-blue-500 text-white rounded-xl p-3 text-center">
          <p className="text-2xl font-bold">
            {weeklyStats.length > 0 ? weeklyStats[weeklyStats.length - 1].count : 0}
          </p>
          <p className="text-xs text-blue-200">Today</p>
        </div>
        <div className="bg-blue-700 text-white rounded-xl p-3 text-center">
          <p className="text-2xl font-bold">
            {weeklyStats.reduce((sum, day) => sum + day.count, 0)}
          </p>
          <p className="text-xs text-blue-200">This Week</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Last 7 Days</h3>
        
        <div className="grid grid-cols-7 gap-1">
          {weeklyStats.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-500">{day.day}</p>
              <div className="h-16 flex items-end justify-center my-2">
                <div
                  className="w-6 bg-blue-500 rounded-t transition-all duration-300"
                  style={{ 
                    height: `${Math.max((day.count / getMaxCount()) * 100, 8)}%`,
                    minHeight: day.count > 0 ? '16px' : '4px'
                  }}
                ></div>
              </div>
              <p className="text-sm font-bold text-gray-800">{day.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Export to Excel</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : 'Export Range'}
            </button>

            <button
              onClick={handleExportAll}
              disabled={isExporting}
              className="bg-blue-800 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-blue-900 transition-colors disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : 'Export All'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
