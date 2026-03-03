import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '../data/services';

const FeaturedServices = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Flatten services and pick some for "Featured"
  const featuredServices = categories.flatMap(cat => 
    cat.items.map(item => ({
      ...item,
      categoryName: cat.shortTitle || cat.title, // Use shortTitle preferably
      categoryId: cat.id,
      price: item.pricing?.[0]?.price || "Liên hệ"
    }))
  ).slice(0, 8); // Take top 8

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 2 : current.offsetWidth / 2;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 md:py-20 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-xl md:text-2xl font-display font-medium text-gray-900 uppercase tracking-widest">
            Dịch vụ nổi bật
          </h2>
          
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('left')} 
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-900 transition-colors duration-300"
            >
              <ChevronLeft size={20} className="text-gray-900" strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-900 transition-colors duration-300"
            >
              <ChevronRight size={20} className="text-gray-900" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-0 scrollbar-hide snap-x snap-mandatory -mx-4 md:mx-0 pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {featuredServices.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[280px] md:min-w-[320px] snap-start border-r border-gray-100 last:border-r-0 flex-shrink-0 group cursor-pointer bg-[#F9F9F9] relative transition-colors hover:bg-[#F0F0F0]"
              onClick={() => navigate(`/service/${service.categoryId}/${service.id}`)}
            >
              {/* Heart Icon */}
              <button className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <Heart size={20} strokeWidth={1.5} />
              </button>

              {/* Image Container */}
              <div className="aspect-[4/5] w-full p-8 flex items-center justify-center relative overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Info Container */}
              <div className="px-6 pb-8 pt-2">
                <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-bold">
                  {service.categoryName}
                </p>
                <h3 className="text-base text-gray-900 font-medium mb-1 line-clamp-1">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-900 font-medium tracking-wide">
                  {service.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
