import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, Phone, X, MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import { categories, PricingPackage } from '../data/services';
import MedicalBookingForm from '../components/MedicalBookingForm';
import { INTEGRATIONS } from '../config/integrations';

const BookingModal = ({ 
  isOpen, 
  onClose, 
  pkg, 
  serviceTitle,
  serviceId,
  categoryId,
  formUrl
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  pkg: PricingPackage | null; 
  serviceTitle: string;
  serviceId: string;
  categoryId: string;
  formUrl?: string;
}) => {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', phone: '', note: '' });
  const [bookingCode, setBookingCode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to determine actual payment amount
  const getPaymentAmount = () => {
    if (!pkg?.price) return 0;
    // Remove non-digits
    const digits = pkg.price.replace(/\D/g, '');
    if (digits.length > 0) {
      return parseInt(digits);
    }
    // If price is "Liên hệ", "Hợp đồng", etc., charge a small booking fee
    return 50000; 
  };

  const paymentAmount = getPaymentAmount();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep('form');
      setBookingCode(`BK${Math.floor(10000 + Math.random() * 90000)}`); // Generate random code
      setPaymentStatus('pending');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Poll for payment status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === 'payment' && paymentStatus !== 'success') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/check-booking/${bookingCode}`);
          if (res.ok) {
            const data = await res.json();
            if (data.isPaid) {
              setPaymentStatus('success');
              clearInterval(interval);
              setTimeout(() => {
                setStep('success');
              }, 1500);
            } else if (data.error === 'Configuration missing') {
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, bookingCode, paymentStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Send to Make.com Webhook
      const payload = {
        bookingCode,
        customerName: formData.name,
        customerPhone: formData.phone,
        serviceName: serviceTitle,
        serviceId,
        categoryId,
        packageName: pkg?.name,
        totalPrice: paymentAmount,
        formattedPrice: paymentAmount.toLocaleString('vi-VN'), // Pre-formatted for Telegram
        note: formData.note,
        status: 'Pending Payment',
        createdAt: new Date().toISOString(),
      };

      console.log('🚀 Sending payload to Webhook:', payload);

      if (INTEGRATIONS.MAKE_BOOKING_WEBHOOK_URL && !INTEGRATIONS.MAKE_BOOKING_WEBHOOK_URL.includes('your-booking-webhook-id')) {
        await fetch(INTEGRATIONS.MAKE_BOOKING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(err => console.error("Webhook error:", err));
      }

      // 2. Save to local DB (optional, but good for backup)
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service_id: serviceId,
          service_name: serviceTitle,
          package_name: pkg?.name,
          package_price: paymentAmount.toString()
        }),
      });

      setStep('payment');
    } catch (error) {
      console.error('Booking failed', error);
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulatePaymentCheck = () => {
    setPaymentStatus('checking');
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        setStep('success');
      }, 1500);
    }, 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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
          className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] overflow-y-auto"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20">
            <X size={24} className="text-gray-500" />
          </button>

          {step === 'form' && (
            <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-luvia-blue mb-2">Đăng ký dịch vụ</h3>
              <p className="text-gray-500 text-sm mb-6">
                Bạn đang chọn gói <span className="font-bold text-luvia-blue">{pkg?.name}</span>
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
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-luvia-blue text-white py-4 font-bold uppercase tracking-widest hover:bg-luvia-mint hover:text-luvia-blue transition-colors rounded-lg mt-4 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Tiếp tục thanh toán'}
                </button>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="p-8 text-center space-y-6">
              <h3 className="text-xl font-display font-bold text-luvia-blue">Thanh toán đơn hàng</h3>
              
              <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm flex items-start gap-2 text-left">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  Vui lòng quét mã QR bên dưới để thanh toán. Hệ thống sẽ tự động xác nhận sau 1-2 phút.
                </div>
              </div>

              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-luvia-blue to-luvia-mint rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="w-48 h-48 bg-gray-100 mx-auto flex items-center justify-center rounded-lg mb-2 overflow-hidden">
                    <img 
                      src={`https://img.vietqr.io/image/${INTEGRATIONS.BANK_DETAILS.BANK_ID}-${INTEGRATIONS.BANK_DETAILS.ACCOUNT_NO}-${INTEGRATIONS.BANK_DETAILS.TEMPLATE}.jpg?amount=${paymentAmount}&addInfo=${bookingCode}&accountName=${encodeURIComponent(INTEGRATIONS.BANK_DETAILS.ACCOUNT_NAME)}`} 
                      alt="VietQR" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <p className="font-mono font-bold text-lg text-gray-800 tracking-wider">{bookingCode}</p>
                  <p className="text-xs text-gray-500">Nội dung chuyển khoản</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Số tiền:</span>
                  <span className="font-bold text-luvia-blue">{formatCurrency(paymentAmount)}</span>
                </div>
                {paymentAmount === 50000 && (
                   <div className="text-xs text-orange-500 italic text-right">
                     * Phí cọc/giữ chỗ (Sẽ trừ vào tổng chi phí)
                   </div>
                )}
                <div className="flex justify-between pb-2">
                  <span className="text-gray-500">Chủ tài khoản:</span>
                  <span className="font-medium uppercase">{INTEGRATIONS.BANK_DETAILS.ACCOUNT_NAME}</span>
                </div>
              </div>

              {paymentStatus === 'pending' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-luvia-blue animate-pulse">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="font-medium">Đang chờ hệ thống xác nhận...</span>
                  </div>
                  <button
                    onClick={simulatePaymentCheck}
                    className="w-full py-3 border border-gray-200 text-gray-400 text-sm rounded-xl hover:bg-gray-50 transition-colors mt-2"
                  >
                    Tôi đã chuyển khoản (Bấm nếu đợi quá lâu)
                  </button>
                </div>
              )}

              {paymentStatus === 'checking' && (
                <div className="flex flex-col items-center justify-center py-4 text-luvia-blue">
                  <Loader2 size={32} className="animate-spin mb-2" />
                  <span className="text-sm font-medium">Đang kiểm tra giao dịch...</span>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="flex flex-col items-center justify-center py-4 text-green-600">
                  <CheckCircle size={32} className="mb-2" />
                  <span className="text-lg font-bold">Thanh toán thành công!</span>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-luvia-blue mb-4">Đã nhận đơn hàng!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Cảm ơn bạn đã thanh toán. Mã đơn hàng của bạn là <span className="font-bold text-luvia-blue">{bookingCode}</span>.
                <br/>
                {formUrl ? 'Vui lòng điền thêm thông tin để chúng tôi bắt đầu thực hiện.' : 'Chuyên viên sẽ liên hệ với bạn trong ít phút.'}
              </p>
              
              {formUrl ? (
                <a 
                  href={formUrl}
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-luvia-blue text-white py-4 font-bold uppercase tracking-widest hover:bg-luvia-mint hover:text-luvia-blue transition-colors rounded-lg shadow-lg shadow-blue-200 mb-4"
                >
                  <CheckCircle size={20} />
                  Điền thông tin bổ sung
                </a>
              ) : (
                <a 
                  href="https://zalo.me/0899660847" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-blue-500 text-white py-4 font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors rounded-lg shadow-lg shadow-blue-200 mb-4"
                >
                  <MessageCircle size={20} />
                  Chat Zalo ngay
                </a>
              )}
              
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
        serviceId={service.id}
        categoryId={category.id}
        formUrl={service.formUrl}
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
