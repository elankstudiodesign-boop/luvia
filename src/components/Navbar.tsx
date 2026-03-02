import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, User, ShoppingBag, Menu, X, 
  ChevronRight, Heart 
} from 'lucide-react';
import { categories } from '../data/services';

const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const allServices = useMemo(() => {
    return categories.flatMap(cat => cat.items.map(item => ({ ...item, categoryId: cat.id, categoryName: cat.title })));
  }, []);

  const filteredServices = useMemo(() => {
    if (!query) return [];
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-white/98 backdrop-blur-xl flex flex-col"
        >
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-end mb-8">
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={32} className="text-luvia-blue" strokeWidth={1} />
              </button>
            </div>
            
            <div className="max-w-4xl mx-auto w-full">
              <div className="relative mb-12">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm dịch vụ..." 
                  className="w-full text-3xl md:text-5xl font-display font-bold text-luvia-blue placeholder-gray-200 border-b-2 border-gray-100 pb-4 focus:outline-none focus:border-luvia-blue bg-transparent transition-colors"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <Search className="absolute right-0 top-2 text-gray-400" size={32} />
              </div>

              <div className="overflow-y-auto max-h-[60vh] pr-4">
                {query && filteredServices.length === 0 && (
                  <p className="text-gray-400 text-center text-lg">Không tìm thấy kết quả phù hợp.</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredServices.map((service, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group cursor-pointer border-b border-gray-50 pb-6 hover:border-gray-200 transition-colors"
                      onClick={() => {
                        navigate(`/service/${service.categoryId}/${service.id}`);
                        onClose();
                      }}
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md">
                          <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{service.categoryName}</p>
                          <h4 className="text-lg font-bold text-luvia-blue group-hover:text-luvia-mint transition-colors">{service.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{service.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
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
      
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 group hover:bg-white hover:text-luvia-blue ${
          isScrolled ? 'bg-white text-luvia-blue shadow-sm' : 'bg-transparent text-white'
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
              LUVIA
            </a>
          </div>

          {/* Right: Contact, Wishlist, Account */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            <a href="#" className="text-sm font-medium uppercase tracking-wide hover:opacity-70 transition-opacity hidden lg:block">
              Liên hệ với chúng tôi
            </a>
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
              className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-30 text-luvia-blue"
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
                              <h4 className="text-sm font-bold text-gray-800 group-hover:text-luvia-blue transition-colors mb-1">
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
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 overflow-y-auto"
            >
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <span className="font-display font-bold text-xl tracking-widest text-luvia-blue">LUVIA</span>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X size={24} strokeWidth={1.5} className="text-gray-500" />
                </button>
              </div>
              <div className="py-4">
                <div 
                  className="px-6 py-4 border-b border-gray-50 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                >
                  <Search size={20} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Tìm kiếm</span>
                </div>
                {categories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => {
                      scrollToSection(cat.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b border-gray-50 hover:bg-gray-50 flex justify-between items-center text-left text-gray-800"
                  >
                    {cat.shortTitle}
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
                <div className="mt-8 px-6 space-y-4 text-sm text-gray-600">
                  <p className="cursor-pointer hover:text-luvia-blue">Dịch vụ Khách hàng</p>
                  <p className="cursor-pointer hover:text-luvia-blue">Tuyển dụng</p>
                  <p className="cursor-pointer hover:text-luvia-blue">Pháp lý & Quyền riêng tư</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
