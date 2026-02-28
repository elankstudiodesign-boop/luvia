import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  Users, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/admin' },
    { icon: Package, label: 'Đơn hàng', path: '/admin/bookings' },
    { icon: FileText, label: 'Dịch vụ', path: '/admin/services' },
    { icon: Users, label: 'Khách hàng', path: '/admin/customers' },
    { icon: Settings, label: 'Cài đặt', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <span className="text-xl font-display font-bold text-luvia-blue tracking-widest">LUVIA ADMIN</span>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-luvia-blue text-white shadow-md shadow-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-luvia-blue'
                }`
              }
            >
              <item.icon size={20} strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} strokeWidth={1.5} />
            Thoát
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-luvia-blue text-white flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">Administrator</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
