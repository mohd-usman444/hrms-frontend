import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const AttendanceReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      const { data } = await api.get('/attendance/all', {
        params: { 
          search: filters.search,
          department: filters.department,
          fromDate: filters.date,
          toDate: filters.date,
        }
      });
      setRecords(data);
    } catch (error) {
      toast.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Employee ID', 'Department', 'Date', 'Check In', 'Status'];
    const csvData = records.map(r => [
      r.employeeId?.name,
      r.employeeId?.employeeId,
      r.employeeId?.department,
      new Date(r.date).toLocaleDateString(),
      r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '-',
      r.status
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(e => e.join(","))
      .join("\n");
      
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${filters.date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Attendance Report</h1>
        <button className="btn btn-primary" onClick={exportCSV} disabled={records.length === 0}>
          Export CSV
        </button>
      </div>
      
      <div className="glass" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search employee..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div style={{ width: '200px' }}>
          <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div style={{ width: '200px' }}>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>
      </div>

      <div className="glass table-container">
        {loading ? <Spinner /> : (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No records found for this date</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id}>
                    <td>
                      <div style={{ fontWeight: '500' }}>{record.employeeId?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{record.employeeId?.employeeId}</div>
                    </td>
                    <td>{record.employeeId?.department}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</td>
                    <td>
                      <span className={`badge ${record.status === 'Present' ? 'badge-approved' : 'badge-rejected'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
