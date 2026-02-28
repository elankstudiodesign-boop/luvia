import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  const cards = [
    {
      title: 'Tổng doanh thu (Ước tính)',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.counts.revenue),
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+12.5%'
    },
    {
      title: 'Đơn hàng mới',
      value: stats.counts.new,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      trend: '+5'
    },
    {
      title: 'Đã hoàn thành',
      value: stats.counts.completed,
      icon: CheckCircle,
      color: 'bg-purple-500',
      trend: '+8.2%'
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.counts.total,
      icon: TrendingUp,
      color: 'bg-orange-500',
      trend: '+2.4%'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan</h1>
        <p className="text-gray-500">Chào mừng trở lại, Administrator!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${card.color} bg-opacity-10 text-${card.color.split('-')[1]}-600`}>
                <card.icon size={24} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {card.trend}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Thống kê đơn hàng (7 ngày qua)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chart}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Area type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panel / Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Hoạt động gần đây</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-800 font-medium">Đơn hàng mới từ Nguyễn Văn A</p>
                  <p className="text-xs text-gray-500">2 phút trước</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
            Xem tất cả
          </button>
        </div>
      </div>
    </div>
  );
};

import { CheckCircle } from 'lucide-react';

export default DashboardHome;
