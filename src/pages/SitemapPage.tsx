import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categories } from '../data/services';

const SitemapPage = () => {
  return (
    <div className="bg-[#fbfdf9] text-[#143a2a] min-h-screen">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f8f77] transition-colors"
          >
            <ArrowLeft size={18} />
            Trang chủ
          </Link>
          <Link to="/" className="select-none">
            <span className="font-display font-bold uppercase tracking-[0.2em] text-[#061b49] text-lg md:text-xl">
              LAVIA
            </span>
          </Link>
          <div className="w-[96px]" />
        </div>
      </div>
      
      <section className="relative bg-white overflow-hidden border-b border-gray-200">
        <div className="absolute -left-24 top-24 w-56 h-56 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#14b8a6] opacity-95"></div>
        <div className="absolute -right-20 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] opacity-90"></div>
        <div className="absolute right-16 top-8 w-56 h-56 rounded-full bg-gradient-to-br from-[#93c5fd] to-[#6ee7b7] opacity-85"></div>
        <div className="absolute right-0 top-20 w-36 h-36 rounded-full bg-gradient-to-br from-[#2563eb] to-[#16a34a] opacity-80"></div>
        <div className="absolute -left-6 bottom-10 w-28 h-28 rounded-full border-[6px] border-[#60a5fa]/50"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 md:pt-14 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f8f77]">Điều hướng</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-black leading-tight text-[#113a2b]">Sitemap</h1>
            <p className="mt-5 text-lg md:text-xl text-gray-700 leading-relaxed">Bản đồ website</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative overflow-hidden max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-16 w-64 h-64 rounded-full bg-gradient-to-br from-[#60a5fa]/30 to-[#22c55e]/25 blur-2xl" />
          <div className="absolute -right-24 bottom-10 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9]/25 to-[#14b8a6]/25 blur-2xl" />
          <div className="absolute left-[52%] top-[42%] w-40 h-40 rounded-full border-[6px] border-[#60a5fa]/20" />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Main Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
          >
            <h2 className="text-2xl font-black text-[#113a2b] mb-6 border-b border-gray-100 pb-3">Trang chính</h2>
            <ul className="space-y-4 text-gray-600">
              <li><Link to="/" className="hover:text-[#0f8f77] transition-colors font-semibold">Trang chủ</Link></li>
              <li><Link to="/about" className="hover:text-[#0f8f77] transition-colors font-semibold">Về LAVIA</Link></li>
              <li><Link to="/careers" className="hover:text-[#0f8f77] transition-colors font-semibold">Tuyển dụng</Link></li>
              <li><Link to="/legal" className="hover:text-[#0f8f77] transition-colors font-semibold">Pháp lý & Quyền riêng tư</Link></li>
              <li><Link to="/sitemap" className="hover:text-[#0f8f77] transition-colors font-semibold">Sitemap</Link></li>
            </ul>
          </motion.div>

          {/* Services Categories */}
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
            >
              <h2 className="text-2xl font-black text-[#113a2b] mb-6 border-b border-gray-100 pb-3">{category.title}</h2>
              <ul className="space-y-4 text-gray-600">
                {category.items.map((item) => (
                  <li key={item.id}>
                    <Link to={`/service/${category.id}/${item.id}`} className="hover:text-[#0f8f77] transition-colors font-semibold">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Admin Section (Optional visibility) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
          >
            <h2 className="text-2xl font-black text-[#113a2b] mb-6 border-b border-gray-100 pb-3">Quản trị</h2>
            <ul className="space-y-4 text-gray-600">
              <li><Link to="/admin" className="hover:text-[#0f8f77] transition-colors font-semibold">Dashboard</Link></li>
            </ul>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default SitemapPage;
