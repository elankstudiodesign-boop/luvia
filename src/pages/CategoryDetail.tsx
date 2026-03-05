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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy danh mục</h2>
          <Link to="/" className="text-lavia-blue hover:underline">Quay về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={category.image} 
            alt={category.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm uppercase tracking-widest">
              <ArrowLeft size={16} className="mr-2" /> Trang chủ
            </Link>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-wide drop-shadow-lg">
              {category.title}
            </h1>
            <p className="text-lg md:text-xl font-light mb-0 max-w-2xl mx-auto leading-relaxed text-gray-200">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase block mb-3">
            {category.subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-gray-900">
            Dịch vụ cung cấp
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {category.items.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group cursor-pointer flex flex-col h-full"
              onClick={() => navigate(`/service/${category.id}/${item.id}`)}
            >
              <div className="w-full aspect-[4/3] overflow-hidden mb-6 relative bg-gray-50 rounded-sm">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <ArrowRight size={20} className="text-gray-900" />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-lavia-blue transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-3 mb-4 flex-1">
                  {item.description}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-lavia-blue transition-colors">
                  Xem chi tiết
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryDetail;
