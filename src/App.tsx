import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Globe, Phone, ArrowRight 
} from 'lucide-react';
import { categories, ServiceCategory } from './data/services';
import ServiceDetail from './pages/ServiceDetail';
import Navbar from './components/Navbar';
import UtilityBar from './components/UtilityBar';

// --- Components ---

const Hero = () => {
  return (
    <section className="relative h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] w-full overflow-hidden mt-[64px] md:mt-[80px]">
      <div className="absolute inset-0">
        <img 
          src="https://picsum.photos/seed/luxury_hero_lv/1920/1080" 
          alt="LUVIA Hero" 
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <div className="absolute bottom-12 md:bottom-24 left-0 right-0 text-center text-white px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6 drop-shadow-md"
        >
          Chiến dịch mới
        </motion.h2>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-7xl font-display font-bold mb-10 tracking-wide drop-shadow-lg"
        >
          HỆ SINH THÁI LUVIA
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center gap-8"
        >
          <a 
            href="#travel" 
            className="inline-block px-10 py-4 bg-white text-luvia-blue text-xs font-bold uppercase tracking-[0.2em] hover:bg-luvia-mint transition-colors duration-300"
          >
            Khám phá ngay
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const FullWidthSection = ({ category }: { category: ServiceCategory }) => (
  <section id={category.id} className="relative w-full min-h-[80vh] md:min-h-screen overflow-hidden group flex items-center justify-center">
    <div className="absolute inset-0 z-0">
      <img 
        src={category.image} 
        alt={category.title} 
        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
    </div>
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 flex flex-col items-center justify-center text-center text-white p-8 md:p-16 max-w-4xl mx-auto"
    >
      <h3 className="text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6 opacity-90">{category.subtitle}</h3>
      <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">{category.title}</h2>
      <a 
        href={`#${category.id}`}
        className="inline-block border-b border-white pb-1 text-sm font-semibold uppercase tracking-widest hover:text-luvia-mint hover:border-luvia-mint transition-colors"
      >
        Xem chi tiết
      </a>
    </motion.div>
  </section>
);

const SplitSection = ({ category, reverse }: { category: ServiceCategory, reverse?: boolean }) => {
  const navigate = useNavigate();
  return (
    <section id={category.id} className="w-full flex flex-col md:flex-row min-h-screen">
      <div className={`w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative overflow-hidden ${reverse ? 'md:order-2' : ''}`}>
        <img 
          src={category.image} 
          alt={category.title} 
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-[1.5s]"
        />
      </div>
      <div className={`w-full md:w-1/2 bg-white flex flex-col items-center justify-center p-12 md:p-24 text-center ${reverse ? 'md:order-1' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto"
        >
          <h3 className="text-xs font-bold text-gray-400 tracking-[0.25em] uppercase mb-6">{category.subtitle}</h3>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-luvia-blue mb-8 leading-tight">{category.title}</h2>
          <p className="text-gray-600 font-light leading-relaxed mb-10 text-lg">
            {category.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 w-full text-left mt-8">
            {category.items.map((item, idx) => (
              <div 
                key={idx} 
                className="border-t border-gray-100 pt-4 cursor-pointer group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300"
                onClick={() => navigate(`/service/${category.id}/${item.id}`)}
              >
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h4 className="font-display font-semibold text-luvia-blue text-base group-hover:text-luvia-mint transition-colors leading-tight">{item.title}</h4>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-luvia-mint flex-shrink-0 mt-1 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <p className="text-sm text-gray-500 font-light line-clamp-3 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate(`/service/${category.id}/${category.items[0].id}`)}
            className="mt-12 inline-block border border-luvia-blue px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-luvia-blue hover:text-white transition-all duration-300"
          >
            Khám phá dịch vụ
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const GridSection = ({ category }: { category: ServiceCategory }) => {
  const navigate = useNavigate();
  return (
    <section id={category.id} className="py-24 px-4 md:px-12 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 max-w-3xl mx-auto"
      >
        <h3 className="text-xs font-bold text-gray-400 tracking-[0.25em] uppercase mb-4">{category.subtitle}</h3>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-luvia-blue mb-6">{category.title}</h2>
        <p className="text-gray-500 font-light text-lg leading-relaxed">{category.description}</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 container mx-auto">
        {category.items.map((item, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="group cursor-pointer flex flex-col items-center"
            onClick={() => navigate(`/service/${category.id}/${item.id}`)}
          >
            <div className="w-full aspect-[4/5] overflow-hidden mb-8 relative bg-gray-100">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </div>
            <h4 className="text-xl font-display font-bold text-luvia-blue mb-3 text-center uppercase tracking-wider group-hover:text-luvia-mint transition-colors duration-300 px-2">
              {item.title}
            </h4>
            <p className="text-sm text-gray-500 text-center font-light px-4 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import LegalPage from './pages/LegalPage';
import SitemapPage from './pages/SitemapPage';

// ... (existing imports)

const Footer = () => {
  return (
    <footer className="bg-white text-luvia-blue border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">LUVIA ECOSYSTEM</h4>
            <div className="flex flex-col space-y-3 text-sm text-gray-600">
              <span className="flex items-center gap-2"><Globe size={16}/> Việt Nam</span>
              <a href="tel:0899660847" className="hover:text-luvia-mint transition-colors flex items-center gap-2"><Phone size={16}/> 0899 660 847</a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Dịch vụ</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-luvia-mint transition-colors">Di trú & Du lịch</a></li>
              <li><a href="#" className="hover:text-luvia-mint transition-colors">Bất động sản</a></li>
              <li><a href="#" className="hover:text-luvia-mint transition-colors">Chăm sóc Gia đình</a></li>
              <li><a href="#" className="hover:text-luvia-mint transition-colors">Giải pháp Doanh nghiệp</a></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Công ty</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-luvia-mint transition-colors">Về LUVIA</Link></li>
              <li><Link to="/careers" className="hover:text-luvia-mint transition-colors">Tuyển dụng</Link></li>
              <li><Link to="/legal" className="hover:text-luvia-mint transition-colors">Pháp lý & Quyền riêng tư</Link></li>
              <li><Link to="/sitemap" className="hover:text-luvia-mint transition-colors">Sitemap</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Đăng ký nhận tin</h4>
            <p className="text-xs text-gray-500 mb-4">
              Cập nhật những thông tin mới nhất về dịch vụ và ưu đãi từ LUVIA.
            </p>
            <div className="flex border-b border-gray-300 pb-2">
              <input 
                type="email" 
                placeholder="Địa chỉ Email" 
                className="bg-transparent border-none outline-none text-luvia-blue w-full placeholder-gray-400 text-sm"
              />
              <button className="text-xs font-bold uppercase tracking-widest hover:text-luvia-mint transition-colors">
                Gửi
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <h1 className="text-4xl font-display font-bold tracking-[0.2em] text-gray-200 select-none">LUVIA</h1>
        </div>
        <div className="text-center mt-4 text-[10px] text-gray-400 uppercase tracking-wider">
          © {new Date().getFullYear()} LUVIA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <FullWidthSection category={categories[0]} /> {/* Travel */}
      <SplitSection category={categories[1]} /> {/* Property */}
      <GridSection category={categories[2]} /> {/* Family */}
      <FullWidthSection category={categories[3]} /> {/* Business */}
      <SplitSection category={categories[4]} reverse /> {/* Legal */}
    </>
  );
};

import AdminDashboard from './pages/AdminDashboard';

// ... (existing imports)

import AdminLayout from './components/admin/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import BookingsPage from './pages/admin/BookingsPage';
import ServicesPage from './pages/admin/ServicesPage';
import CustomersPage from './pages/admin/CustomersPage';
import SettingsPage from './pages/admin/SettingsPage';

// ... (existing imports)

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div className="min-h-screen bg-white font-sans selection:bg-luvia-mint selection:text-luvia-blue">
            <UtilityBar />
            <Navbar />
            <HomePage />
            <Footer />
          </div>
        } />
        <Route path="/service/:categoryId/:serviceId" element={
          <div className="min-h-screen bg-white font-sans selection:bg-luvia-mint selection:text-luvia-blue">
            <UtilityBar />
            <Navbar />
            <ServiceDetail />
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="min-h-screen bg-white font-sans selection:bg-luvia-mint selection:text-luvia-blue">
            <UtilityBar />
            <AboutPage />
            <Footer />
          </div>
        } />
        <Route path="/careers" element={
          <div className="min-h-screen bg-white font-sans selection:bg-luvia-mint selection:text-luvia-blue">
            <UtilityBar />
            <CareersPage />
            <Footer />
          </div>
        } />
        <Route path="/legal" element={
          <div className="min-h-screen bg-white font-sans selection:bg-luvia-mint selection:text-luvia-blue">
            <UtilityBar />
            <LegalPage />
            <Footer />
          </div>
        } />
        <Route path="/sitemap" element={
          <div className="min-h-screen bg-white font-sans selection:bg-luvia-mint selection:text-luvia-blue">
            <UtilityBar />
            <SitemapPage />
            <Footer />
          </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><DashboardHome /></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><BookingsPage /></AdminLayout>} />
        <Route path="/admin/services" element={<AdminLayout><ServicesPage /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><CustomersPage /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
        <Route path="/admin/*" element={<AdminLayout><div className="p-8 text-center text-gray-500">Chức năng đang phát triển</div></AdminLayout>} />
      </Routes>
    </Router>
  );
}
