import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, User, ShoppingBag, Menu, X, 
  ChevronRight, Heart 
} from 'lucide-react';
import { categories } from '../data/services';
import ContactDrawer from './ContactDrawer';

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const allServices = useMemo(() => {
    return categories.flatMap(cat => cat.items.map(item => ({ ...item, categoryId: cat.id, categoryName: cat.title })));
  }, []);

  const filteredServices = useMemo(() => {
    if (!query) return allServices.slice(0, 4); // Default to first 4 services
    const lowerQuery = query.toLowerCase();
    return allServices.filter(service => 
      service.title.toLowerCase().includes(lowerQuery) || 
      service.description.toLowerCase().includes(lowerQuery)
    );
  }, [query, allServices]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const popularKeywords = ["Visa", "Hộ chiếu", "Khám bệnh", "Vé máy bay", "Thành lập công ty"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-white flex flex-col"
        >
          {/* Header */}
          <div className="relative flex items-center justify-center p-6 border-b border-gray-50">
            <h2 className="text-2xl font-display font-bold tracking-[0.2em] text-lavia-blue">LAVIA</h2>
            <button 
              onClick={onClose} 
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-500" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
              {/* Search Input */}
              <div className="max-w-3xl mx-auto mb-16">
                <div className="relative group mb-8">
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm dịch vụ..." 
                    className="w-full text-lg py-3 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:border-lavia-blue focus:ring-1 focus:ring-lavia-blue transition-all placeholder:text-gray-400 text-center group-focus-within:text-left group-focus-within:placeholder:text-gray-300"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-lavia-blue transition-colors" size={20} />
                </div>

                {/* Popular Keywords */}
                {!query && (
                  <div className="text-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">Các từ khóa phổ biến</span>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                      {popularKeywords.map(keyword => (
                        <button 
                          key={keyword}
                          onClick={() => setQuery(keyword)}
                          className="text-sm text-gray-600 hover:text-lavia-blue hover:underline decoration-1 underline-offset-4 transition-all"
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Results Grid - Louis Vuitton Style */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest border-b border-gray-100 pb-2">
                  {query ? `Kết quả cho "${query}"` : "Dịch vụ nổi bật"}
                </h3>
                
                {query && filteredServices.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">Không tìm thấy kết quả phù hợp.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                    {filteredServices.map((service, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group cursor-pointer"
                        onClick={() => {
                          navigate(`/service/${service.categoryId}/${service.id}`);
                          onClose();
                        }}
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-4 relative">
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                          />
                          <button className="absolute top-3 right-3 p-2 bg-white/0 group-hover:bg-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-sm">
                             <Heart size={16} className="text-lavia-blue" />
                          </button>
                        </div>
                        <div className="space-y-1 text-center sm:text-left">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{service.categoryName}</p>
                          <h4 className="text-base font-medium text-lavia-blue group-hover:underline decoration-1 underline-offset-4 transition-all line-clamp-1">
                            {service.title}
                          </h4>
                          {service.pricing && service.pricing[0] && (
                             <p className="text-sm text-gray-900 font-medium mt-1">{service.pricing[0].price}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MenuOverlay = ({ isOpen, onClose, onOpenContact }: { isOpen: boolean; onClose: () => void; onOpenContact: () => void }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0].id);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const selectedCategoryData = useMemo(() => 
    categories.find(c => c.id === activeCategory) || categories[0]
  , [activeCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-white text-lavia-blue flex flex-col"
        >
          {/* Top Bar: Close Button */}
          <div className="flex justify-between items-center px-6 py-6 border-b border-gray-50">
             <button 
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            >
              <X size={20} strokeWidth={1} />
              <span className="hidden md:inline">Đóng</span>
            </button>
            <span className="font-display font-bold text-xl tracking-[0.2em]">LAVIA</span>
            <div className="w-5 md:w-20"></div> {/* Spacer for centering logo */}
          </div>

          {/* Content Container */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Mobile View: Accordion Menu */}
            <div className="md:hidden flex-1 overflow-y-auto py-8 px-6 flex flex-col scrollbar-hide">
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="border-b border-gray-100 last:border-none">
                    <button
                      onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                      className={`w-full text-left py-5 text-lg font-display uppercase tracking-[0.15em] flex justify-between items-center transition-all duration-300 ${
                        activeCategory === cat.id ? 'text-lavia-blue font-semibold' : 'text-gray-400 font-light'
                      }`}
                    >
                      {cat.shortTitle || cat.title}
                      <motion.div 
                        animate={{ rotate: activeCategory === cat.id ? 90 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <ChevronRight size={18} className={activeCategory === cat.id ? "text-lavia-blue" : "text-gray-300"} strokeWidth={1.5} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {activeCategory === cat.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "circOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pt-2 pl-4 flex flex-col gap-3">
                            {cat.items.map((item, idx) => (
                              <motion.button
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                onClick={() => { 
                                  navigate(`/service/${cat.id}/${item.id}`); 
                                  onClose(); 
                                }}
                                className="text-left text-base text-gray-600 font-light hover:text-lavia-blue py-1 transition-colors"
                              >
                                {item.title}
                              </motion.button>
                            ))}
                            <motion.button 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: cat.items.length * 0.05 + 0.1 }}
                              onClick={() => { 
                                navigate(`/category/${cat.id}`); 
                                onClose(); 
                              }}
                              className="text-left text-xs font-bold uppercase tracking-[0.2em] text-lavia-blue mt-4 flex items-center gap-2 group"
                            >
                              Xem tất cả 
                              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Mobile Extra Links */}
              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-6 pb-10">
                 <button 
                   onClick={() => { navigate('/about'); onClose(); }}
                   className="text-left text-lg text-gray-800 font-light hover:text-lavia-blue transition-colors uppercase tracking-widest"
                 >
                   Về LAVIA
                 </button>
                 <button 
                   onClick={() => { navigate('/careers'); onClose(); }}
                   className="text-left text-lg text-gray-800 font-light hover:text-lavia-blue transition-colors uppercase tracking-widest"
                 >
                   Tuyển dụng
                 </button>
                 <button 
                   onClick={() => { onOpenContact(); onClose(); }}
                   className="text-left text-lg text-gray-800 font-light hover:text-lavia-blue transition-colors uppercase tracking-widest"
                 >
                   Liên hệ
                 </button>
              </div>
            </div>

            {/* Desktop View: 3 Columns (Original) */}
            <div className="hidden md:flex flex-1 overflow-hidden">
              {/* Column 1: Main Categories */}
              <div className="w-1/4 border-r border-gray-50 overflow-y-auto py-8 px-8 flex flex-col gap-6">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-left text-lg font-medium transition-colors flex justify-between items-center group ${
                      activeCategory === cat.id ? 'text-lavia-blue font-bold underline decoration-1 underline-offset-8' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {cat.shortTitle || cat.title}
                    {activeCategory === cat.id && (
                      <ChevronRight size={16} className="text-lavia-blue" />
                    )}
                  </button>
                ))}
                
                {/* Extra Links */}
                <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-4">
                   <button 
                     onClick={() => { navigate('/about'); onClose(); }}
                     className="text-left text-gray-500 hover:text-lavia-blue transition-colors"
                   >
                     Về LAVIA
                   </button>
                   <button 
                     onClick={() => { navigate('/careers'); onClose(); }}
                     className="text-left text-gray-500 hover:text-lavia-blue transition-colors"
                   >
                     Tuyển dụng
                   </button>
                   <button 
                     onClick={() => { onOpenContact(); onClose(); }}
                     className="text-left text-gray-500 hover:text-lavia-blue transition-colors"
                   >
                     Liên hệ
                   </button>
                </div>
              </div>

              {/* Column 2: Sub Items */}
              <div className="w-1/4 border-r border-gray-50 overflow-y-auto py-8 px-8 bg-gray-50/30">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-200 pb-2">
                  Dịch vụ
                </h3>
                <div className="flex flex-col gap-4">
                  {selectedCategoryData.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(`/service/${selectedCategoryData.id}/${item.id}`);
                        onClose();
                      }}
                      className="text-left text-base text-gray-600 hover:text-lavia-blue transition-colors py-1 hover:translate-x-1 duration-300"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column 3: Featured Content */}
              <div className="w-1/2 relative overflow-hidden bg-gray-100 group cursor-pointer" onClick={() => navigate(`/service/${selectedCategoryData.id}/${selectedCategoryData.items[0].id}`)}>
                 <img 
                   src={selectedCategoryData.image} 
                   alt={selectedCategoryData.title}
                   className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                 
                 <div className="absolute bottom-12 left-12 text-white">
                   <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-90">Nổi bật</p>
                   <h2 className="text-3xl font-display font-bold mb-4">{selectedCategoryData.title}</h2>
                   <button className="text-sm font-bold border-b border-white pb-1 hover:text-lavia-mint hover:border-lavia-mint transition-colors">
                     Khám phá ngay
                   </button>
                 </div>
              </div>
            </div>
          </div>

          {/* Footer of Menu */}
          <div className="px-8 py-6 border-t border-gray-50 bg-white hidden md:block">
            <p 
              onClick={() => { onOpenContact(); onClose(); }}
              className="text-sm text-gray-500 font-medium cursor-pointer hover:underline underline-offset-4 decoration-gray-300"
            >
              Chúng tôi có thể giúp gì cho bạn?
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (location.pathname === '/' && location.state && (location.state as any).scrollTo) {
      const id = (location.state as any).scrollTo;
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onOpenContact={() => setIsContactOpen(true)} />
      
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 group hover:bg-white hover:text-lavia-blue ${
          isScrolled ? 'bg-white text-lavia-blue shadow-sm' : 'bg-transparent text-white'
        }`}
        onMouseLeave={() => setHoveredCategory(null)}
      >
        <div className="container mx-auto px-6 h-20 flex justify-between items-center relative z-50">
          
          {/* Left: Menu & Search */}
          <div className="flex items-center gap-6 w-1/3">
            <button 
              className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={20} strokeWidth={1.5} />
              <span className="text-sm font-medium uppercase tracking-wide hidden md:inline-block">Menu</span>
            </button>

            <button 
              className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} strokeWidth={1.5} />
              <span className="text-sm font-medium uppercase tracking-wide hidden md:inline-block">Tìm kiếm</span>
            </button>
          </div>

          {/* Center: Logo */}
          <div className="w-1/3 flex justify-center">
            <a href="/" className="text-3xl font-bold tracking-[0.2em] font-display uppercase text-center">
              LAVIA
            </a>
          </div>

          {/* Right: Contact, Wishlist, Account */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            <button 
              onClick={() => setIsContactOpen(true)}
              className="text-sm font-medium uppercase tracking-wide hover:opacity-70 transition-opacity hidden lg:block"
            >
              Liên hệ với chúng tôi
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <Heart size={20} strokeWidth={1.5} />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <User size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row (Categories) */}
        <div className={`hidden md:flex justify-center items-center h-12 border-t ${isScrolled ? 'border-gray-100' : 'border-white/20 group-hover:border-gray-100'} relative z-40 transition-colors duration-300`}>
          <div className="flex space-x-8 h-full">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                className="h-full flex items-center"
              >
                <button 
                  onClick={() => scrollToSection(cat.id)}
                  className={`text-xs font-semibold uppercase tracking-widest hover:underline underline-offset-4 transition-all ${
                    hoveredCategory === cat.id ? 'underline' : ''
                  }`}
                >
                  {cat.shortTitle}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {hoveredCategory && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-30 text-lavia-blue"
              onMouseEnter={() => setHoveredCategory(hoveredCategory)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="container mx-auto px-8 py-8">
                <div className="grid grid-cols-12 gap-8">
                  {/* Category Info */}
                  <div className="col-span-3 border-r border-gray-100 pr-8">
                    {categories.find(c => c.id === hoveredCategory) && (
                      <>
                        <h3 className="text-2xl font-display font-bold mb-2">
                          {categories.find(c => c.id === hoveredCategory)?.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                          {categories.find(c => c.id === hoveredCategory)?.description}
                        </p>
                        <div className="w-full aspect-video rounded-lg overflow-hidden">
                          <img 
                            src={categories.find(c => c.id === hoveredCategory)?.image} 
                            alt="Category" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Services List */}
                  <div className="col-span-9 pl-4">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                      {categories.find(c => c.id === hoveredCategory)?.items.map((item) => (
                        <div 
                          key={item.id} 
                          className="group cursor-pointer"
                          onClick={() => {
                            navigate(`/service/${hoveredCategory}/${item.id}`);
                            setHoveredCategory(null);
                          }}
                        >
                          <div className="flex gap-3 items-start">
                            <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-800 group-hover:text-lavia-blue transition-colors mb-1">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-700">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Menu Drawer */}
      <ContactDrawer isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Navbar;
