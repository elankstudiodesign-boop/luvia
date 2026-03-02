import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, CheckCircle, Phone, X, MessageCircle, Loader2, 
  AlertCircle, Plane, Home, ShieldCheck, Star, Clock, 
  Users, Award, FileCheck, ChevronRight, XCircle, Coffee, ThumbsUp, HeartHandshake
} from 'lucide-react';
import { categories, PricingPackage, ServicePsychology } from '../data/services';
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
  
  // Extended form state
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    note: '',
    // Passport specific
    dob: '',
    gender: 'Nam',
    pob: '', // Place of birth
    cccd: '', // ID Card
    cccdDate: '', // Issue Date
    permanentAddr: '',
    currentAddr: '',
    // Visa specific
    destination: '',
    visaType: 'Du lịch',
    passportNo: '',
    passportExpiry: '',
    job: '',
    // Global Booking (Flight & Hotel) specific
    bookingType: 'flight', // flight, hotel, combo
    flightType: 'roundtrip', // oneway, roundtrip
    fromLocation: '',
    toLocation: '',
    departDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    hotelLocation: '',
    checkIn: '',
    checkOut: '',
    rooms: 1,
    guests: 1,
    budget: '',
    hotelStars: '3'
  });

  const [bookingCode, setBookingCode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to determine actual payment amount
  const getPaymentAmount = () => {
    if (!pkg?.price) return 0;
    if (pkg.price.toLowerCase().includes('miễn phí') || pkg.price.toLowerCase().includes('free')) return 0;
    
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

      // Auto-select booking type based on package name
      if (pkg?.name) {
        const name = pkg.name.toLowerCase();
        if (name.includes('combo')) {
          setFormData(prev => ({ ...prev, bookingType: 'combo' }));
        } else if (name.includes('khách sạn') || name.includes('hotel')) {
          setFormData(prev => ({ ...prev, bookingType: 'hotel' }));
        } else {
          setFormData(prev => ({ ...prev, bookingType: 'flight' }));
        }
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, pkg]);

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
      // Construct detailed note based on service type
      let detailedNote = formData.note;
      if (serviceId === 'passport') {
        detailedNote = `
          [Thông tin làm Hộ chiếu]
          - Ngày sinh: ${formData.dob}
          - Giới tính: ${formData.gender}
          - Nơi sinh: ${formData.pob}
          - CCCD: ${formData.cccd} (Cấp ngày: ${formData.cccdDate})
          - Thường trú: ${formData.permanentAddr}
          - Địa chỉ nhận: ${formData.currentAddr}
          - Ghi chú: ${formData.note}
        `.trim();
      } else if (serviceId === 'visa') {
        detailedNote = `
          [Thông tin xin Visa]
          - Nước đến: ${formData.destination}
          - Loại Visa: ${formData.visaType}
          - Số Hộ chiếu: ${formData.passportNo} (Hết hạn: ${formData.passportExpiry})
          - Công việc: ${formData.job}
          - Ghi chú: ${formData.note}
        `.trim();
      } else if (serviceId === 'global-booking') {
        const isFlight = formData.bookingType === 'flight' || formData.bookingType === 'combo';
        const isHotel = formData.bookingType === 'hotel' || formData.bookingType === 'combo';
        
        let flightInfo = '';
        if (isFlight) {
          flightInfo = `
          [Vé máy bay]
          - Hành trình: ${formData.flightType === 'roundtrip' ? 'Khứ hồi' : 'Một chiều'}
          - Từ: ${formData.fromLocation} -> Đến: ${formData.toLocation}
          - Ngày đi: ${formData.departDate} ${formData.flightType === 'roundtrip' ? `- Ngày về: ${formData.returnDate}` : ''}
          - Khách: ${formData.adults} Lớn, ${formData.children} Trẻ em, ${formData.infants} Em bé
          `.trim();
        }

        let hotelInfo = '';
        if (isHotel) {
          hotelInfo = `
          [Khách sạn]
          - Điểm đến: ${formData.hotelLocation || formData.toLocation}
          - Check-in: ${formData.checkIn} - Check-out: ${formData.checkOut}
          - Số lượng: ${formData.rooms} phòng, ${formData.guests} khách
          - Ngân sách/Sao: ${formData.budget}, ${formData.hotelStars} sao
          `.trim();
        }

        detailedNote = `
          [Yêu cầu Đặt vé/Phòng]
          - Loại dịch vụ: ${formData.bookingType === 'combo' ? 'Combo Vé + Khách sạn' : (formData.bookingType === 'flight' ? 'Vé máy bay' : 'Khách sạn')}
          ${flightInfo}
          ${hotelInfo}
          - Ghi chú: ${formData.note}
        `.trim();
      }

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
        note: detailedNote,
        // Pass raw details for flexibility
        details: formData,
        status: paymentAmount === 0 ? 'New Request' : 'Pending Payment',
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
          name: formData.name,
          phone: formData.phone,
          note: detailedNote,
          service_id: serviceId,
          service_name: serviceTitle,
          package_name: pkg?.name,
          package_price: paymentAmount.toString()
        }),
      });

      if (paymentAmount === 0) {
        setStep('success');
      } else {
        setStep('payment');
      }
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

  const renderPassportForm = () => (
    <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
      <h4 className="font-bold text-luvia-blue text-sm uppercase">Thông tin tờ khai Hộ chiếu</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày sinh <span className="text-red-500">*</span></label>
          <input required type="date" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm" 
            value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giới tính</label>
          <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nơi sinh (Tỉnh/TP) <span className="text-red-500">*</span></label>
        <input required type="text" placeholder="Ví dụ: Hà Nội" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
          value={formData.pob} onChange={e => setFormData({...formData, pob: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số CCCD <span className="text-red-500">*</span></label>
          <input required type="text" placeholder="12 số CCCD" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.cccd} onChange={e => setFormData({...formData, cccd: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày cấp</label>
          <input required type="date" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.cccdDate} onChange={e => setFormData({...formData, cccdDate: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ thường trú <span className="text-red-500">*</span></label>
        <input required type="text" placeholder="Theo sổ hộ khẩu/Cơ sở dữ liệu dân cư" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
          value={formData.permanentAddr} onChange={e => setFormData({...formData, permanentAddr: e.target.value})} />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ nhận hộ chiếu <span className="text-red-500">*</span></label>
        <input required type="text" placeholder="Địa chỉ hiện tại để bưu điện gửi về" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
          value={formData.currentAddr} onChange={e => setFormData({...formData, currentAddr: e.target.value})} />
      </div>
    </div>
  );

  const renderVisaForm = () => (
    <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
      <h4 className="font-bold text-luvia-blue text-sm uppercase">Thông tin xin Visa</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nước muốn đến <span className="text-red-500">*</span></label>
          <input required type="text" placeholder="VD: Hàn Quốc, Nhật Bản..." className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loại Visa</label>
          <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.visaType} onChange={e => setFormData({...formData, visaType: e.target.value})}>
            <option value="Du lịch">Du lịch</option>
            <option value="Công tác">Công tác</option>
            <option value="Thăm thân">Thăm thân</option>
            <option value="Du học">Du học</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số Hộ chiếu (Nếu có)</label>
          <input type="text" placeholder="Số Passport" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.passportNo} onChange={e => setFormData({...formData, passportNo: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày hết hạn</label>
          <input type="date" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.passportExpiry} onChange={e => setFormData({...formData, passportExpiry: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Công việc hiện tại</label>
        <input required type="text" placeholder="VD: Nhân viên văn phòng, Kinh doanh tự do..." className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
          value={formData.job} onChange={e => setFormData({...formData, job: e.target.value})} />
      </div>
    </div>
  );

  const renderGlobalBookingForm = () => {
    const isFlight = formData.bookingType === 'flight' || formData.bookingType === 'combo';
    const isHotel = formData.bookingType === 'hotel' || formData.bookingType === 'combo';

    return (
      <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {['flight', 'hotel', 'combo'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, bookingType: type })}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all ${
                formData.bookingType === type 
                  ? 'bg-white text-luvia-blue shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type === 'flight' ? 'Vé máy bay' : type === 'hotel' ? 'Khách sạn' : 'Combo'}
            </button>
          ))}
        </div>

        {isFlight && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="font-bold text-luvia-blue text-sm uppercase flex items-center gap-2">
              <Plane size={16} /> Thông tin chuyến bay
            </h4>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="flightType" value="roundtrip" 
                  checked={formData.flightType === 'roundtrip'}
                  onChange={() => setFormData({...formData, flightType: 'roundtrip'})}
                  className="text-luvia-blue focus:ring-luvia-blue"
                />
                Khứ hồi
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="flightType" value="oneway" 
                  checked={formData.flightType === 'oneway'}
                  onChange={() => setFormData({...formData, flightType: 'oneway'})}
                  className="text-luvia-blue focus:ring-luvia-blue"
                />
                Một chiều
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Điểm đi</label>
                <input required={isFlight} type="text" placeholder="Hà Nội (HAN)" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.fromLocation} onChange={e => setFormData({...formData, fromLocation: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Điểm đến</label>
                <input required={isFlight} type="text" placeholder="Đà Nẵng (DAD)" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.toLocation} onChange={e => setFormData({...formData, toLocation: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày đi</label>
                <input required={isFlight} type="date" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.departDate} onChange={e => setFormData({...formData, departDate: e.target.value})} />
              </div>
              {formData.flightType === 'roundtrip' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày về</label>
                  <input required={isFlight} type="date" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                    value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Người lớn</label>
                <input type="number" min="1" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.adults} onChange={e => setFormData({...formData, adults: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trẻ em (2-12)</label>
                <input type="number" min="0" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.children} onChange={e => setFormData({...formData, children: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Em bé (&lt;2)</label>
                <input type="number" min="0" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.infants} onChange={e => setFormData({...formData, infants: parseInt(e.target.value)})} />
              </div>
            </div>
          </div>
        )}

        {isHotel && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-dashed border-gray-200 pt-3">
            <h4 className="font-bold text-luvia-blue text-sm uppercase flex items-center gap-2">
              <Home size={16} /> Thông tin Khách sạn
            </h4>
            
            {!isFlight && (
               <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Điểm đến / Khu vực</label>
                <input required={isHotel} type="text" placeholder="Đà Lạt, Gần chợ..." className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.hotelLocation} onChange={e => setFormData({...formData, hotelLocation: e.target.value})} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-in</label>
                <input required={isHotel} type="date" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-out</label>
                <input required={isHotel} type="date" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số phòng</label>
                <input type="number" min="1" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.rooms} onChange={e => setFormData({...formData, rooms: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số khách</label>
                <input type="number" min="1" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.guests} onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})} />
              </div>
            </div>

             <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngân sách (đêm)</label>
                <input type="text" placeholder="VD: 1tr - 2tr" className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hạng sao</label>
                <select className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm"
                  value={formData.hotelStars} onChange={e => setFormData({...formData, hotelStars: e.target.value})}>
                  <option value="any">Tùy chọn</option>
                  <option value="3">3 sao</option>
                  <option value="4">4 sao</option>
                  <option value="5">5 sao</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
                {/* Common Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ và tên <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-luvia-blue transition-colors text-sm" 
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="tel" 
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-luvia-blue transition-colors text-sm" 
                      placeholder="0909xxxxxx"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                {/* Specific Forms */}
                {serviceId === 'passport' && renderPassportForm()}
                {serviceId === 'visa' && renderVisaForm()}
                {serviceId === 'global-booking' && renderGlobalBookingForm()}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ghi chú thêm</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-luvia-blue transition-colors h-20 resize-none text-sm" 
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

const PsychologyTimeline = ({ steps }: { steps: { step: string; title: string; description: string }[] }) => (
  <div className="py-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-10 tracking-tight">Quy trình tinh gọn</h3>
    <div className="relative">
      {/* Connector Line (Desktop) */}
      <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-gray-100 -z-10"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item, idx) => (
          <div key={idx} className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-luvia-blue text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-lg shadow-blue-200">
              {idx + 1}
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContrastSection = ({ psychology }: { psychology?: ServicePsychology }) => {
  if (!psychology) return null;

  return (
    <div className="my-16 bg-gray-50 rounded-3xl p-8 md:p-12 overflow-hidden relative">
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Sự lựa chọn của bạn</h3>
        <p className="text-gray-500">Tại sao phải tự làm khổ mình trong khi có thể thảnh thơi?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Pain Side */}
        <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <XCircle className="text-red-500" size={32} />
            <h4 className="text-xl font-bold text-gray-500">Tự làm (0đ)</h4>
          </div>
          <ul className="space-y-4">
            {psychology.painPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-500">
                <XCircle size={18} className="flex-shrink-0 mt-1 text-red-300" />
                <span>{point}</span>
              </li>
            ))}
            <li className="flex items-start gap-3 text-gray-500 font-bold mt-6 pt-4 border-t border-gray-100">
              <Clock size={18} className="flex-shrink-0 mt-1 text-red-300" />
              <span>Mất hàng chục giờ chờ đợi</span>
            </li>
          </ul>
        </div>

        {/* Gain Side */}
        <div className="bg-white p-8 rounded-2xl border-2 border-luvia-blue shadow-xl transform md:scale-105 relative z-20">
          <div className="absolute top-0 right-0 bg-luvia-blue text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
            Khuyên dùng
          </div>
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <CheckCircle className="text-green-500" size={32} />
            <h4 className="text-xl font-bold text-luvia-blue">Ủy thác LUVIA</h4>
          </div>
          <ul className="space-y-4">
            {psychology.gainPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-800">
                <CheckCircle size={18} className="flex-shrink-0 mt-1 text-green-500" />
                <span className="font-medium">{point}</span>
              </li>
            ))}
            <li className="flex items-start gap-3 text-luvia-blue font-bold mt-6 pt-4 border-t border-gray-100">
              <Coffee size={18} className="flex-shrink-0 mt-1" />
              <span>Tiết kiệm {psychology.hoursSaved} cuộc đời</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const AuthoritySection = ({ signals }: { signals?: string[] }) => {
  if (!signals || signals.length === 0) return null;
  
  return (
    <div className="mt-8 pt-8 border-t border-gray-100">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-4">
        Được tín nhiệm bởi
      </p>
      <div className="flex flex-wrap justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        {signals.map((signal, idx) => (
          <span key={idx} className="bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-600">
            {signal}
          </span>
        ))}
      </div>
    </div>
  );
};

const SeniorSupport = () => (
  <div className="flex items-center justify-between gap-3 group cursor-pointer hover:bg-white/50 transition-colors rounded-lg p-1">
    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-luvia-blue flex-shrink-0 group-hover:scale-110 transition-transform">
      <HeartHandshake size={16} />
    </div>
    <div className="text-left flex-1">
      <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Dành cho người lớn tuổi</p>
      <p className="text-[10px] text-gray-500">Hỗ trợ riêng 1:1, kiên nhẫn & tận tâm</p>
    </div>
    <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
  </div>
);

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
    <div className="min-h-screen bg-white">
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        pkg={selectedPackage}
        serviceTitle={service.title}
        serviceId={service.id}
        categoryId={category.id}
        formUrl={service.formUrl}
      />

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

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-[#FAFAFA]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content - 8 cols */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Trust Header */}
            <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Được tin dùng bởi 10.000+ khách hàng</p>
                <div className="flex text-yellow-500 gap-0.5">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <span className="text-gray-400 ml-2 font-normal">4.9/5 đánh giá</span>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
                Chi tiết dịch vụ
              </h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p className="leading-relaxed text-lg mb-8 text-gray-800">
                  {service.detailedDescription || service.description}
                </p>
                
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm my-8">
                  <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-green-600" size={24} />
                    Cam kết từ LUVIA
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-3">
                      <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <span className="font-bold text-gray-900 block">Minh bạch tuyệt đối</span>
                        <span className="text-sm text-gray-500">Báo cáo tiến độ theo thời gian thực, không phí ẩn.</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <span className="font-bold text-gray-900 block">Hoàn tiền 100%</span>
                        <span className="text-sm text-gray-500">Nếu không đạt kết quả như cam kết ban đầu.</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <span className="font-bold text-gray-900 block">Bảo mật thông tin</span>
                        <span className="text-sm text-gray-500">Dữ liệu khách hàng được mã hóa và bảo vệ 2 lớp.</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <span className="font-bold text-gray-900 block">Hỗ trợ 24/7</span>
                        <span className="text-sm text-gray-500">Đội ngũ chuyên viên sẵn sàng giải đáp mọi lúc.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features / Benefits - Editorial Style */}
            {service.features && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Tại sao chọn chúng tôi?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="group">
                      <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="font-bold text-lg">{idx + 1}</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">Tiêu chuẩn {idx === 0 ? 'Quốc tế' : (idx === 1 ? 'Chuyên nghiệp' : (idx === 2 ? 'Tận tâm' : 'Bảo mật'))}</h4>
                      <p className="text-gray-600 leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Steps - Minimalist Timeline */}
            {service.process && <PsychologyTimeline steps={service.process} />}

            {/* Contrast Section - Pain vs Gain */}
            <ContrastSection psychology={service.psychology} />

            {/* Booking Form for Medical Service - Replaces Pricing */}
             {serviceId === 'medical-assistant' ? (
               <div className="mt-12" id="booking-form">
                 <MedicalBookingForm onSuccess={() => {}} />
               </div>
             ) : (
              /* Pricing Section - Clean Table */
              service.pricing && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Bảng giá minh bạch</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {service.pricing.map((pkg, idx) => (
                    <div key={idx} className={`relative p-8 rounded-2xl border transition-all duration-300 ${pkg.recommended ? 'bg-gray-900 text-white border-gray-900 shadow-xl scale-105 z-10' : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'}`}>
                      {pkg.recommended && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Phổ biến nhất
                          </span>
                        </div>
                      )}
                      
                      <h4 className={`text-lg font-bold uppercase tracking-wider mb-4 ${pkg.recommended ? 'text-gray-300' : 'text-gray-500'}`}>{pkg.name}</h4>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold">{pkg.price}</span>
                      </div>
                      <p className={`text-sm mb-8 pb-8 border-b ${pkg.recommended ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-100'}`}>{pkg.description}</p>

                      <ul className="space-y-4 mb-8">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-3 text-sm">
                            <CheckCircle size={18} className={`flex-shrink-0 mt-0.5 ${pkg.recommended ? 'text-green-400' : 'text-green-600'}`} />
                            <span className="leading-relaxed">{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {pkg.actionLabel && pkg.actionUrl ? (
                        <a 
                          href={pkg.actionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`block w-full text-center py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${pkg.recommended ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                        >
                          {pkg.actionLabel}
                        </a>
                      ) : (
                        <button 
                          onClick={() => handleSelectPackage(pkg)}
                          className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${pkg.recommended ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                        >
                          Chọn gói này
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 bg-white p-4 rounded-lg border border-gray-100 inline-block mx-auto">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span>Cam kết không phát sinh chi phí ẩn. Hoàn tiền 100% nếu không hài lòng.</span>
                </div>
              </div>
            )
            )}
          </div>

          {/* Sidebar / CTA - 4 cols */}
          <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {/* Consultation Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-luvia-blue via-blue-400 to-luvia-mint"></div>
                  
                  <div className="flex items-center gap-5 mb-8 border-b border-gray-50 pb-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-gray-100 to-white shadow-lg">
                        <img src="https://picsum.photos/seed/expert_avatar/200/200" alt="Specialist" className="w-full h-full rounded-full object-cover border-2 border-white" />
                      </div>
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full shadow-sm animate-pulse"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-luvia-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          Chuyên gia cao cấp
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-xl text-gray-900 flex items-center gap-1.5">
                        Nguyễn Thanh Hương
                        <CheckCircle size={16} className="text-blue-500 fill-blue-50" />
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1.5">
                        <div className="flex">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={14} fill="currentColor" className="text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-gray-400 font-medium ml-1.5">(4.9/5 - 500+ tư vấn)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3">Đăng ký tư vấn miễn phí</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Để lại thông tin, chuyên viên của chúng tôi sẽ phân tích hồ sơ và liên hệ lại tư vấn giải pháp tối ưu cho bạn trong vòng 30 phút.
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <a 
                      href="https://zalo.me/0899660847" 
                      target="_blank" 
                      rel="noreferrer"
                      className="group relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-[#0068FF] to-[#0054CC] text-white py-4 font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <MessageCircle size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
                      <span className="relative z-10">Chat Zalo ngay</span>
                    </a>
                    <a 
                      href="tel:0899660847"
                      className="group flex items-center justify-center gap-3 w-full bg-white border border-gray-200 text-gray-700 py-4 font-bold uppercase tracking-widest hover:border-luvia-blue hover:text-luvia-blue hover:bg-blue-50/30 transition-all rounded-xl hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Phone size={20} className="group-hover:scale-110 transition-transform" />
                      Gọi 0899 660 847
                    </a>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 mb-6">
                    <SeniorSupport />
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1.5">
                          <Clock size={12} /> Tốc độ phản hồi
                        </span>
                        <span className="font-bold text-green-600 text-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          ~ 5 phút
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 border-l border-gray-100 pl-4">
                        <span className="text-xs text-gray-400 flex items-center gap-1.5">
                          <Users size={12} /> Trực tuyến
                        </span>
                        <span className="font-bold text-luvia-blue text-sm">
                          12 chuyên viên
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
                  <div className="text-center p-2">
                    <ShieldCheck className="mx-auto text-luvia-blue mb-2" size={24} />
                    <p className="text-xs font-bold text-gray-700 uppercase">Bảo mật 100%</p>
                  </div>
                  <div className="text-center p-2">
                    <Award className="mx-auto text-luvia-blue mb-2" size={24} />
                    <p className="text-xs font-bold text-gray-700 uppercase">Uy tín hàng đầu</p>
                  </div>
                </div>

                <AuthoritySection signals={service.psychology?.authoritySignals} />
              </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
