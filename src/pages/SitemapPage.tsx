import React from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { categories } from '../data/services';

const SitemapPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full overflow-hidden mt-[64px] md:mt-[80px] bg-gray-100 flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-wide text-luvia-blue">SITEMAP</h1>
            <p className="text-lg font-light tracking-wider uppercase text-gray-500">Bản đồ website</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Main Pages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-display font-bold text-luvia-blue mb-6 border-b pb-2">Trang Chính</h2>
            <ul className="space-y-4 text-gray-600">
              <li><Link to="/" className="hover:text-luvia-mint transition-colors">Trang Chủ</Link></li>
              <li><Link to="/about" className="hover:text-luvia-mint transition-colors">Về LUVIA</Link></li>
              <li><Link to="/careers" className="hover:text-luvia-mint transition-colors">Tuyển dụng</Link></li>
              <li><Link to="/legal" className="hover:text-luvia-mint transition-colors">Pháp lý & Quyền riêng tư</Link></li>
              <li><Link to="/sitemap" className="hover:text-luvia-mint transition-colors">Sitemap</Link></li>
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
            >
              <h2 className="text-2xl font-display font-bold text-luvia-blue mb-6 border-b pb-2">{category.title}</h2>
              <ul className="space-y-4 text-gray-600">
                {category.items.map((item) => (
                  <li key={item.id}>
                    <Link to={`/service/${category.id}/${item.id}`} className="hover:text-luvia-mint transition-colors">
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
          >
             <h2 className="text-2xl font-display font-bold text-luvia-blue mb-6 border-b pb-2">Quản Trị</h2>
             <ul className="space-y-4 text-gray-600">
               <li><Link to="/admin" className="hover:text-luvia-mint transition-colors">Dashboard</Link></li>
             </ul>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default SitemapPage;
