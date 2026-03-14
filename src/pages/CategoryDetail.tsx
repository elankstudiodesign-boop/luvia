import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { categories } from '../data/services';

const CategoryDetail = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const category = categories.find(c => c.id === categoryId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfdf9] text-[#143a2a]">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black text-[#113a2b] mb-4">Không tìm thấy danh mục</h2>
          <Link to="/" className="text-[#0f8f77] font-semibold hover:underline">Quay về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfdf9] text-[#143a2a] min-h-screen pb-20">
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

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-gray-200">
        <div className="absolute -left-24 top-24 w-56 h-56 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#14b8a6] opacity-95"></div>
        <div className="absolute -right-20 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] opacity-90"></div>
        <div className="absolute right-16 top-8 w-56 h-56 rounded-full bg-gradient-to-br from-[#93c5fd] to-[#6ee7b7] opacity-85"></div>
        <div className="absolute right-0 top-20 w-36 h-36 rounded-full bg-gradient-to-br from-[#2563eb] to-[#16a34a] opacity-80"></div>
        <div className="absolute -left-6 bottom-10 w-28 h-28 rounded-full border-[6px] border-[#60a5fa]/50"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 md:pt-14 pb-10">
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-xl">
              {category.subtitle ? (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f8f77]">{category.subtitle}</p>
              ) : (
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f8f77]">Danh mục</p>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-4xl md:text-6xl font-black leading-tight text-[#113a2b]"
              >
                {category.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-5 text-lg md:text-xl text-gray-700 leading-relaxed"
              >
                {category.description}
              </motion.p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/70 bg-white shadow-[0_20px_50px_rgba(3,15,12,0.10)]">
              <img src={category.image} alt={category.title} className="w-full h-[300px] md:h-[420px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative overflow-hidden max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-16 w-72 h-72 rounded-full bg-gradient-to-br from-[#60a5fa]/26 to-[#22c55e]/22 blur-2xl" />
          <div className="absolute -right-24 top-52 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9]/22 to-[#14b8a6]/22 blur-2xl" />
          <div className="absolute left-[58%] -bottom-24 w-44 h-44 rounded-full border-[6px] border-[#60a5fa]/18" />
        </div>

        <div className="relative z-10">
          <div className="text-center mb-12 md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Danh sách dịch vụ</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#113a2b]">Dịch vụ cung cấp</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {category.items.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-5%" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
                onClick={() => navigate(`/service/${category.id}/${item.id}`)}
              >
                <div className="w-full aspect-[4/3] overflow-hidden relative bg-gray-50">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                
                <div className="flex-1 flex flex-col p-6">
                  <h3 className="text-xl font-black text-[#113a2b] mb-2 group-hover:text-[#0f8f77] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {item.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-[#0f8f77] transition-colors">
                      Xem chi tiết
                    </span>
                    <div className="h-10 w-10 rounded-xl border border-[#0f8f77]/20 bg-white text-[#0f8f77] grid place-items-center">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetail;
