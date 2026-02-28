import React, { useEffect, useState } from 'react';
import { Search, Mail, Phone, MapPin, User } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  booking_count: number;
  total_spent: number;
  created_at: string;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.phone?.includes(search)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm tên hoặc số điện thoại..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Đơn hàng</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng chi tiêu (Ước tính)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Đang tải...</td></tr>
              ) : filteredCustomers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Chưa có dữ liệu</td></tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name || 'Khách vãng lai'}</div>
                          <div className="text-xs text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} /> {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} /> {customer.email}
                          </div>
                        )}
                        {customer.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} /> {customer.address}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {customer.booking_count} đơn
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.total_spent || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString('vi-VN')}
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

export default CustomersPage;
