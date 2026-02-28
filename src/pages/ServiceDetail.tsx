import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, Phone, X, MessageCircle } from 'lucide-react';
import { categories, PricingPackage } from '../data/services';
import MedicalBookingForm from '../components/MedicalBookingForm';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  pkg, 
  serviceTitle 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  pkg: PricingPackage | null; 
  serviceTitle: string 
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', phone: '', note: '' });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('form');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service_id: serviceId,
          service_name: serviceTitle,
          package_name: pkg?.name,
          package_price: pkg?.price
        }),
      });
      setStep('success');
    } catch (error) {
      console.error('Booking failed', error);
      alert('Có lỗi xảy ra, vui lòng thử lại hoặc liên hệ trực tiếp qua Zalo.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20">
            <X size={24} className="text-gray-500" />
          </button>

          {step === 'form' ? (
            <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-luvia-blue mb-2">Đăng ký dịch vụ</h3>
              <p className="text-gray-500 text-sm mb-6">
                Bạn đang chọn gói <span className="font-bold text-luvia-blue">{pkg?.name}</span> - <span className="font-bold text-luvia-mint">{pkg?.price}</span>
                <br/>cho dịch vụ {serviceTitle}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-luvia-blue transition-colors" 
                    placeholder="Nhập họ tên của bạn"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="tel" 
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-luvia-blue transition-colors" 
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ghi chú thêm</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-luvia-blue transition-colors h-24 resize-none" 
                    placeholder="Bạn cần hỗ trợ gì thêm không?"
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-luvia-blue text-white py-4 font-bold uppercase tracking-widest hover:bg-luvia-mint hover:text-luvia-blue transition-colors rounded-lg mt-4">
                  Tiếp tục
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-luvia-blue mb-4">Gửi yêu cầu thành công!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Cảm ơn bạn đã đăng ký. Để đảm bảo an toàn và được hỗ trợ thanh toán ngay lập tức, vui lòng kết nối với chuyên viên qua Zalo.
              </p>
              
              <a 
                href="https://zalo.me/0899660847" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-blue-500 text-white py-4 font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors rounded-lg shadow-lg shadow-blue-200 mb-4"
              >
                <MessageCircle size={20} />
                Chat Zalo ngay
              </a>
              <button 
                onClick={onClose}
                className="text-sm text-gray-400 hover:text-gray-600 underline decoration-gray-300 underline-offset-4"
              >
                Đóng cửa sổ này
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ServiceDetail = () => {
  const { categoryId, serviceId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);
  
  // Find the category and service item
  const category = categories.find(c => c.id === categoryId);
  const service = category?.items.find(i => i.id === serviceId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, serviceId]);

  const handleSelectPackage = (pkg: PricingPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  if (!category || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-display font-bold text-luvia-blue mb-4">Dịch vụ không tồn tại</h2>
          <Link to="/" className="text-luvia-mint hover:underline">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        pkg={selectedPackage}
        serviceTitle={service.title}
      />

      {/* Breadcrumb & Back */}
      <div className="container mx-auto px-6 py-8">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-luvia-blue transition-colors mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Quay lại trang chủ
        </Link>
        <div className="flex items-center text-sm text-gray-400 uppercase tracking-wider mb-2">
          <span>{category.title}</span>
          <span className="mx-2">/</span>
          <span className="text-luvia-blue font-semibold">{service.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white container mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold mb-4"
          >
            {service.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-light opacity-90 max-w-2xl"
          >
            {service.description}
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-display font-bold text-luvia-blue mb-6">Chi tiết dịch vụ</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {service.detailedDescription || service.description}
                <br /><br />
                Chúng tôi cung cấp giải pháp toàn diện giúp bạn tiết kiệm thời gian và công sức. 
                Đội ngũ chuyên gia của LUVIA cam kết mang lại trải nghiệm dịch vụ tốt nhất với quy trình minh bạch và chuyên nghiệp.
              </p>
            </div>

            {/* Features / Benefits */}
            {service.features && (
              <div>
                <h3 className="text-xl font-display font-bold text-luvia-blue mb-6">Lợi ích nổi bật</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="text-luvia-mint flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Steps */}
            {service.process && (
              <div>
                <h3 className="text-xl font-display font-bold text-luvia-blue mb-6">Quy trình thực hiện</h3>
                <div className="space-y-6">
                  {service.process.map((item, idx) => (
                    <div key={idx} className="flex gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <span className="text-3xl font-display font-bold text-gray-200">{item.step}</span>
                      <div>
                        <h4 className="text-lg font-bold text-luvia-blue mb-2">{item.title}</h4>
                        <p className="text-gray-500 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Section */}
            {service.pricing && (
              <div className="mt-8">
                <h3 className="text-2xl font-display font-bold text-luvia-blue mb-8">Bảng giá dịch vụ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.pricing.map((pkg, idx) => (
                    <div key={idx} className={`border p-8 rounded-2xl relative transition-all duration-300 hover:shadow-lg ${pkg.recommended ? 'border-luvia-blue bg-blue-50/30 ring-1 ring-luvia-blue/20' : 'border-gray-200 bg-white'}`}>
                      {pkg.recommended && (
                        <span className="absolute top-0 right-0 bg-luvia-blue text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl uppercase tracking-wider shadow-sm">
                          Khuyên dùng
                        </span>
                      )}
                      <h4 className="text-lg font-bold text-luvia-blue mb-2">{pkg.name}</h4>
                      <div className="text-3xl font-display font-bold text-luvia-mint mb-4">{pkg.price}</div>
                      <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">{pkg.description}</p>
                      <ul className="space-y-4 mb-8">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-700">
                            <CheckCircle size={18} className="text-luvia-mint mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{feat}</span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => handleSelectPackage(pkg)}
                        className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 ${pkg.recommended ? 'bg-luvia-blue text-white hover:bg-luvia-mint hover:text-luvia-blue shadow-md hover:shadow-lg' : 'border border-gray-200 text-gray-600 hover:border-luvia-blue hover:text-luvia-blue'}`}
                      >
                        Chọn gói này
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-6 italic text-center">* Giá trên chưa bao gồm VAT và có thể thay đổi tùy theo yêu cầu cụ thể của từng hồ sơ.</p>
              </div>
            )}
          </div>

          {/* Sidebar / CTA */}
          <div className="md:col-span-1">
            {serviceId === 'medical-assistant' ? (
              <div className="sticky top-24 z-10">
                <MedicalBookingForm onSuccess={() => {}} />
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-2xl sticky top-24">
                <h3 className="text-xl font-display font-bold text-luvia-blue mb-2">Đăng ký tư vấn</h3>
                <p className="text-gray-500 text-sm mb-6">Để lại thông tin, chúng tôi sẽ liên hệ lại trong vòng 30 phút.</p>
                
                <div className="space-y-4">
                  <a 
                    href="https://zalo.me/0899660847" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-blue-500 text-white py-4 font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors rounded-lg"
                  >
                    <MessageCircle size={20} />
                    Chat Zalo ngay
                  </a>
                  <a 
                    href="tel:0899660847"
                    className="flex items-center justify-center gap-3 w-full border border-gray-300 text-gray-700 py-4 font-bold uppercase tracking-widest hover:border-luvia-blue hover:text-luvia-blue transition-colors rounded-lg"
                  >
                    <Phone size={20} />
                    Gọi 0899 660 847
                  </a>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} />
                    <span className="font-medium">0899 660 847</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-medium text-green-600">Đang hoạt động</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
