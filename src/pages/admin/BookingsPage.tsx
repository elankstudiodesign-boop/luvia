import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Search, Filter } from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  phone: string;
  note: string;
  service_name: string;
  package_name: string;
  package_price: string;
  created_at: string;
  status: 'new' | 'contacted' | 'completed' | 'cancelled';
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchBookings();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = 
      b.name.toLowerCase().includes(search.toLowerCase()) || 
      b.phone.includes(search) ||
      b.service_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Mới';
      case 'contacted': return 'Đã liên hệ';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Hủy';
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <button 
          onClick={fetchBookings}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Làm mới
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['all', 'new', 'contacted', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === s 
                  ? 'bg-luvia-blue text-white' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s === 'all' ? 'Tất cả' : getStatusLabel(s)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chi tiết</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Chưa có dữ liệu phù hợp</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.name}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{booking.service_name}</div>
                      <div className="text-xs text-gray-400">ID: {booking.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{booking.package_name}</div>
                      <div className="text-xs text-luvia-mint font-bold">{booking.package_price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(booking.created_at).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <select 
                        className="bg-white border border-gray-200 text-gray-700 text-xs rounded px-2 py-1 focus:outline-none focus:border-luvia-blue cursor-pointer"
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                      >
                        <option value="new">Mới</option>
                        <option value="contacted">Đã liên hệ</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Hủy</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
