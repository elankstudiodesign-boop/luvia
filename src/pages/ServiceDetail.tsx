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
    hotelStars: '3',
    // Business License specific
    businessName: '',
    businessAddress: '',
    businessCapital: '',
    businessAreas: '',
    // Verification specific
    verificationAddress: '',
    verificationCity: 'Hồ Chí Minh',
    verificationDistrict: '1'
  });

  const [bookingCode, setBookingCode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Shipping Fee Logic
  const [shippingFee, setShippingFee] = useState(0);
  const [isNegotiableFee, setIsNegotiableFee] = useState(false);

  // Flight Service Fee Logic
  const [flightServiceFee, setFlightServiceFee] = useState(200000);
  const isSingleFlight = serviceId === 'global-booking' && pkg?.name?.toLowerCase().includes('lẻ');

  // Variable Price Logic
  const [variableInputs, setVariableInputs] = useState({
    medicineValue: '',
    distance: '',
    genericInput: ''
  });
  const [calculatedFee, setCalculatedFee] = useState(0);
  
  const isVariablePrice = pkg?.price?.includes('-') || pkg?.price?.toLowerCase().includes('tuỳ');

  useEffect(() => {
    if (isVariablePrice) {
      if (serviceId === 'medicine-delivery') {
        let fee = 100000; // Base fee
        const val = parseInt(variableInputs.medicineValue.replace(/\D/g, '') || '0');
        const dist = parseInt(variableInputs.distance || '0');
        
        // Fee calculation rule:
        // Base 100k
        // +50k if value > 2M
        // +100k if value > 5M
        // +10k per km if distance > 5km
        
        if (val > 5000000) fee += 100000;
        else if (val > 2000000) fee += 50000;
        
        if (dist > 5) {
          fee += (dist - 5) * 10000;
        }
        
        // Cap at 300k as per service description
        if (fee > 300000) fee = 300000;
        
        setCalculatedFee(fee);
      } else {
        // For other variable services, try to parse the min price
        if (pkg?.price) {
            const digits = pkg.price.split('-')[0].replace(/\D/g, '');
            if (digits) setCalculatedFee(parseInt(digits));
        }
      }
    }
  }, [variableInputs, serviceId, isVariablePrice, pkg]);


  useEffect(() => {
    if (isSingleFlight) {
      if (formData.departDate) {
        const date = new Date(formData.departDate);
        const month = date.getMonth() + 1; // 1-12
        // Festival/High Season Months: Jan, Feb, Apr, May, Jun, Jul, Aug, Dec
        const highSeasonMonths = [1, 2, 4, 5, 6, 7, 8, 12];
        
        if (highSeasonMonths.includes(month)) {
          setFlightServiceFee(300000);
        } else {
          setFlightServiceFee(200000);
        }
      } else {
        setFlightServiceFee(200000); // Default base price
      }
    }
  }, [formData.departDate, isSingleFlight]);

  useEffect(() => {
    if (serviceId !== 'verification') {
        setShippingFee(0);
        setIsNegotiableFee(false);
        return;
    }

    if (formData.verificationCity !== 'Hồ Chí Minh') {
      setShippingFee(0);
      setIsNegotiableFee(true);
    } else {
      setIsNegotiableFee(false);
      const freeDistricts = ['1', '3', '5', '6', '8'];
      if (freeDistricts.includes(formData.verificationDistrict)) {
        setShippingFee(0);
      } else {
        setShippingFee(100000);
      }
    }
  }, [formData.verificationCity, formData.verificationDistrict, serviceId]);

  // Helper to determine actual payment amount
  const getBasePaymentAmount = () => {
    if (isVariablePrice) {
        return calculatedFee;
    }
    if (isSingleFlight) {
        return flightServiceFee;
    }
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

  const basePrice = getBasePaymentAmount();
  const paymentAmount = basePrice + shippingFee;

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
      } else if (serviceId === 'business-license') {
        detailedNote = `
          [Đăng ký Kinh doanh]
          - Tên HKD/Công ty dự kiến: ${formData.businessName}
          - Địa chỉ kinh doanh: ${formData.businessAddress}
          - Vốn điều lệ: ${formData.businessCapital}
          - Ngành nghề chính: ${formData.businessAreas}
          - Số CCCD/CMND: ${formData.cccd}
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
      } else if (serviceId === 'verification') {
        detailedNote = `
          [Yêu cầu Xác minh]
          - Địa chỉ cần xác minh: ${formData.verificationAddress}
          - Quận/Huyện: ${formData.verificationDistrict}
          - Tỉnh/Thành phố: ${formData.verificationCity}
          - Phí di chuyển: ${isNegotiableFee ? 'Thương lượng' : formatCurrency(shippingFee)}
          - Ghi chú: ${formData.note}
        `.trim();
      }

      if (isVariablePrice) {
         if (serviceId === 'medicine-delivery') {
             detailedNote += `
             [Chi tiết Đơn thuốc]
             - Giá trị thuốc dự kiến: ${parseInt(variableInputs.medicineValue || '0').toLocaleString('vi-VN')} đ
             - Khoảng cách mua hàng: ${variableInputs.distance} km
             - Phí dịch vụ tạm tính: ${formatCurrency(calculatedFee)}
             `.trim();
         } else {
             detailedNote += `
             [Yêu cầu Báo giá]
             - Nhu cầu/Ngân sách: ${variableInputs.genericInput}
             - Giá tham khảo: ${formatCurrency(calculatedFee)}
             `.trim();
         }
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
        
        // Flatten specific fields for easier Make.com mapping (Business License)
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
        businessCapital: formData.businessCapital,
        businessAreas: formData.businessAreas,
        ownerCCCD: formData.cccd, // Renamed for clarity

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
          package_price: paymentAmount.toString(),
          booking_code: bookingCode,
          details: formData
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
      <h4 className="font-bold text-[#0f8f77] text-sm uppercase">Thông tin tờ khai Hộ chiếu</h4>
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
      <h4 className="font-bold text-[#0f8f77] text-sm uppercase">Thông tin xin Visa</h4>
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

  const renderBusinessLicenseForm = () => (
    <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
      <h4 className="font-bold text-[#0f8f77] text-sm uppercase">Thông tin Đăng ký Kinh doanh</h4>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên HKD/Công ty dự kiến <span className="text-red-500">*</span></label>
        <input required type="text" placeholder="VD: Hộ Kinh Doanh Nguyễn Văn A / Công ty TNHH..." className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
          value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ kinh doanh <span className="text-red-500">*</span></label>
        <input required type="text" placeholder="Địa chỉ đặt trụ sở/cửa hàng" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
          value={formData.businessAddress} onChange={e => setFormData({...formData, businessAddress: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vốn điều lệ <span className="text-red-500">*</span></label>
          <input required type="text" placeholder="VD: 1 tỷ đồng" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.businessCapital} onChange={e => setFormData({...formData, businessCapital: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số CCCD chủ sở hữu <span className="text-red-500">*</span></label>
          <input required type="text" placeholder="Số CCCD/CMND" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.cccd} onChange={e => setFormData({...formData, cccd: e.target.value})} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngành nghề kinh doanh chính</label>
        <textarea placeholder="Mô tả các ngành nghề bạn muốn kinh doanh..." className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm h-20 resize-none"
          value={formData.businessAreas} onChange={e => setFormData({...formData, businessAreas: e.target.value})} />
      </div>
    </div>
  );

  const renderVerificationForm = () => (
    <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
      <h4 className="font-bold text-[#0f8f77] text-sm uppercase">Thông tin địa điểm xác minh</h4>
      
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
        <input required type="text" placeholder="Số nhà, tên đường..." className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
          value={formData.verificationAddress} onChange={e => setFormData({...formData, verificationAddress: e.target.value})} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tỉnh / Thành phố</label>
          <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
            value={formData.verificationCity} onChange={e => setFormData({...formData, verificationCity: e.target.value})}>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Tỉnh/Thành khác">Tỉnh/Thành khác</option>
          </select>
        </div>
        
        {formData.verificationCity === 'Hồ Chí Minh' && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quận / Huyện</label>
            <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
              value={formData.verificationDistrict} onChange={e => setFormData({...formData, verificationDistrict: e.target.value})}>
              <option value="1">Quận 1</option>
              <option value="3">Quận 3</option>
              <option value="5">Quận 5</option>
              <option value="6">Quận 6</option>
              <option value="8">Quận 8</option>
              <option disabled>──────────</option>
              <option value="4">Quận 4</option>
              <option value="7">Quận 7</option>
              <option value="10">Quận 10</option>
              <option value="11">Quận 11</option>
              <option value="12">Quận 12</option>
              <option value="Bình Thạnh">Bình Thạnh</option>
              <option value="Gò Vấp">Gò Vấp</option>
              <option value="Phú Nhuận">Phú Nhuận</option>
              <option value="Tân Bình">Tân Bình</option>
              <option value="Tân Phú">Tân Phú</option>
              <option value="Bình Tân">Bình Tân</option>
              <option value="Thủ Đức">Thủ Đức</option>
              <option value="Nhà Bè">Nhà Bè</option>
              <option value="Hóc Môn">Hóc Môn</option>
              <option value="Bình Chánh">Bình Chánh</option>
              <option value="Củ Chi">Củ Chi</option>
              <option value="Cần Giờ">Cần Giờ</option>
            </select>
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-blue-800 font-medium">Phí di chuyển:</span>
          <span className="font-bold text-blue-900">
            {isNegotiableFee ? 'Thương lượng' : (shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee))}
          </span>
        </div>
        <p className="text-xs text-blue-600 mt-1 italic">
          {isNegotiableFee 
            ? '* Chúng tôi sẽ liên hệ để báo phí di chuyển cụ thể.' 
            : (shippingFee === 0 
                ? '* Miễn phí di chuyển cho khu vực này.' 
                : '* Đã bao gồm phụ thu phí di chuyển.')}
        </p>
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
                  ? 'bg-white text-[#0f8f77] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type === 'flight' ? 'Vé máy bay' : type === 'hotel' ? 'Khách sạn' : 'Combo'}
            </button>
          ))}
        </div>

        {isFlight && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="font-bold text-[#0f8f77] text-sm uppercase flex items-center gap-2">
              <Plane size={16} /> Thông tin chuyến bay
            </h4>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="flightType" value="roundtrip" 
                  checked={formData.flightType === 'roundtrip'}
                  onChange={() => setFormData({...formData, flightType: 'roundtrip'})}
                  className="text-[#0f8f77] focus:ring-[#0f8f77]"
                />
                Khứ hồi
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="flightType" value="oneway" 
                  checked={formData.flightType === 'oneway'}
                  onChange={() => setFormData({...formData, flightType: 'oneway'})}
                  className="text-[#0f8f77] focus:ring-[#0f8f77]"
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
                 {isSingleFlight && (
                   <div className="text-[10px] mt-1 text-orange-600 italic">
                     * Mùa thường: 200k | Mùa lễ hội: 300k
                     <br/>(Tháng 1, 2, 4, 5, 6, 7, 8, 12 là mùa cao điểm)
                   </div>
                 )}
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
            <h4 className="font-bold text-[#0f8f77] text-sm uppercase flex items-center gap-2">
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

  const renderVariablePriceForm = () => {
    if (serviceId === 'medicine-delivery') {
      return (
        <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
          <h4 className="font-bold text-[#0f8f77] text-sm uppercase">Thông tin đơn hàng & Vận chuyển</h4>
          <p className="text-xs text-gray-500 italic mb-2">
            * Phí dịch vụ thay đổi tùy theo giá trị đơn thuốc và khoảng cách mua hàng.
            <br/>* Chưa bao gồm phí vận chuyển (thanh toán khi nhận hàng).
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giá trị thuốc dự kiến (VNĐ) <span className="text-red-500">*</span></label>
              <input 
                required 
                type="text" 
                placeholder="VD: 500.000" 
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
                value={variableInputs.medicineValue ? parseInt(variableInputs.medicineValue).toLocaleString('vi-VN') : ''}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  setVariableInputs({...variableInputs, medicineValue: val});
                }} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Khoảng cách mua hàng (km) <span className="text-red-500">*</span></label>
              <input 
                required 
                type="number" 
                placeholder="VD: 5" 
                min="0"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
                value={variableInputs.distance} 
                onChange={e => setVariableInputs({...variableInputs, distance: e.target.value})} 
              />
              <p className="text-[10px] text-gray-400 mt-1">Ước tính từ nhà thuốc đến địa chỉ của bạn.</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2 flex justify-between items-center">
             <span className="text-blue-800 font-medium text-sm">Phí dịch vụ tạm tính:</span>
             <span className="font-bold text-blue-900 text-lg">
                {formatCurrency(calculatedFee)}
             </span>
          </div>
        </div>
      );
    }

    // Generic form for other variable price services
    return (
        <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
          <h4 className="font-bold text-[#0f8f77] text-sm uppercase">Thông tin dịch vụ</h4>
          <p className="text-xs text-gray-500 italic mb-2">
            * Dịch vụ này có giá thay đổi tùy theo nhu cầu cụ thể.
          </p>
          <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả nhu cầu / Ngân sách dự kiến</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg h-20 resize-none text-sm"
                placeholder="Mô tả chi tiết yêu cầu của bạn..."
                value={variableInputs.genericInput}
                onChange={e => setVariableInputs({...variableInputs, genericInput: e.target.value})}
              />
          </div>
           <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2 flex justify-between items-center">
             <span className="text-blue-800 font-medium text-sm">Giá tham khảo từ:</span>
             <span className="font-bold text-blue-900 text-lg">
                {formatCurrency(calculatedFee)}
             </span>
          </div>
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
              <h3 className="text-2xl font-display font-bold text-[#0f8f77] mb-2">Đăng ký dịch vụ</h3>
              <p className="text-gray-500 text-sm mb-6">
                Bạn đang chọn gói <span className="font-bold text-[#0f8f77]">{pkg?.name}</span>
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
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#0f8f77] focus:ring-1 focus:ring-[#0f8f77] transition-colors text-sm" 
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
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#0f8f77] focus:ring-1 focus:ring-[#0f8f77] transition-colors text-sm" 
                      placeholder="0909xxxxxx"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                {/* Specific Forms */}
                {serviceId === 'passport' && renderPassportForm()}
                {serviceId === 'visa' && renderVisaForm()}
                {serviceId === 'business-license' && renderBusinessLicenseForm()}
                {serviceId === 'verification' && renderVerificationForm()}
                {serviceId === 'global-booking' && renderGlobalBookingForm()}
                {isVariablePrice && renderVariablePriceForm()}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ghi chú thêm</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-[#0f8f77] focus:ring-1 focus:ring-[#0f8f77] transition-colors h-20 resize-none text-sm" 
                    placeholder="Bạn cần hỗ trợ gì thêm không?"
                    value={formData.note}
                    onChange={e => setFormData({...formData, note: e.target.value})}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#0f8f77] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#0c7a66] transition-colors rounded-lg mt-4 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Tiếp tục thanh toán'}
                </button>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="p-8 text-center space-y-6">
              <h3 className="text-xl font-display font-bold text-[#0f8f77]">Thanh toán đơn hàng</h3>
              
              <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm flex items-start gap-2 text-left">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  Vui lòng quét mã QR bên dưới để thanh toán. Hệ thống sẽ tự động xác nhận sau 1-2 phút.
                </div>
              </div>

              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0f8f77] to-[#22c55e] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
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
                  <span className="font-bold text-[#0f8f77]">{formatCurrency(paymentAmount)}</span>
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
                  <div className="flex items-center justify-center gap-2 text-[#0f8f77] animate-pulse">
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
                <div className="flex flex-col items-center justify-center py-4 text-[#0f8f77]">
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
              <h3 className="text-2xl font-display font-bold text-[#0f8f77] mb-4">Đã nhận đơn hàng!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Cảm ơn bạn đã thanh toán. Mã đơn hàng của bạn là <span className="font-bold text-[#0f8f77]">{bookingCode}</span>.
                <br/>
                Chúng tôi sẽ liên hệ với bạn qua zalo trong vòng 3-5 phút...
                <br/>
                {formUrl ? 'Vui lòng điền thêm thông tin để chúng tôi bắt đầu thực hiện.' : ''}
              </p>
              
              {formUrl ? (
                <a 
                  href={formUrl}
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-[#0f8f77] text-white py-4 font-bold uppercase tracking-widest hover:bg-[#0c7a66] transition-colors rounded-lg shadow-lg shadow-emerald-200 mb-4"
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

const PsychologyTimeline = ({ steps }: { steps: { step: string; title: string; description: string }[] }) => {
  if (!steps || steps.length === 0) return null;

  const palettes = [
    { gradient: 'from-lime-300 via-lime-400 to-lime-600' },
    { gradient: 'from-emerald-300 via-teal-400 to-teal-600' },
    { gradient: 'from-rose-300 via-orange-300 to-orange-500' },
    { gradient: 'from-amber-700 via-amber-800 to-stone-800' },
  ];

  const icons = [Users, FileCheck, ShieldCheck, Award, Star, Home];

  return (
    <div className="py-10 md:py-14 not-prose">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs md:text-sm uppercase tracking-[0.35em] text-gray-500">Quy trình</span>
          <span className="text-xs md:text-sm uppercase tracking-[0.35em] font-bold text-gray-900">tinh gọn</span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        {steps.map((item, idx) => {
          const palette = palettes[idx] || palettes[idx % palettes.length];
          const Icon = icons[idx % icons.length];
          const number = String(idx + 1).padStart(2, '0');

          return (
            <div key={`${item.step}-${idx}`} className="text-center">
              <div
                className={`text-7xl md:text-8xl font-extrabold leading-none tracking-tight bg-gradient-to-b ${palette.gradient} bg-clip-text text-transparent`}
              >
                {number}
              </div>
              <div className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-gray-900">
                {item.title}
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
              <div className="mt-8 flex justify-center">
                <Icon className="text-gray-900" size={28} strokeWidth={2.5} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ContrastSection = ({ psychology }: { psychology?: ServicePsychology }) => {
  if (!psychology) return null;

  return (
    <div className="my-16 bg-white rounded-3xl p-8 md:p-12 overflow-hidden relative border border-gray-100 shadow-sm">
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-black text-[#113a2b] mb-3">Sự lựa chọn của bạn</h3>
        <p className="text-gray-600">Tại sao phải tự làm khổ mình trong khi có thể thảnh thơi?</p>
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
        <div className="bg-white p-8 rounded-2xl border-2 border-[#0f8f77] shadow-[0_18px_50px_rgba(0,0,0,0.10)] transform md:scale-105 relative z-20">
          <div className="absolute top-0 right-0 bg-[#0f8f77] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
            Khuyên dùng
          </div>
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <CheckCircle className="text-green-500" size={32} />
            <h4 className="text-xl font-black text-[#0f8f77]">Ủy thác LAVIA</h4>
          </div>
          <ul className="space-y-4">
            {psychology.gainPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-800">
                <CheckCircle size={18} className="flex-shrink-0 mt-1 text-green-500" />
                <span className="font-medium">{point}</span>
              </li>
            ))}
            <li className="flex items-start gap-3 text-[#0f8f77] font-bold mt-6 pt-4 border-t border-gray-100">
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
    <div className="w-8 h-8 rounded-full bg-[#daf4ff] flex items-center justify-center text-[#0f8f77] flex-shrink-0 group-hover:scale-110 transition-transform">
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
  const [brokenGalleryIndexes, setBrokenGalleryIndexes] = useState<Set<number>>(() => new Set());
  
  // Find the category and service item
  const category = categories.find(c => c.id === categoryId);
  const service = category?.items.find(i => i.id === serviceId);
  const serviceGallery = service?.galleryImages && service.galleryImages.length > 0
    ? service.galleryImages
    : Array.from({ length: 6 }, (_, index) => `/images/services/${service?.id}/gallery-${index + 1}.jpg`);
  const hasVisibleGallery = serviceGallery.some((_, idx) => !brokenGalleryIndexes.has(idx));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, serviceId]);

  useEffect(() => {
    setBrokenGalleryIndexes(new Set());
  }, [categoryId, serviceId]);

  const handleSelectPackage = (pkg: PricingPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  if (!category || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfdf9] text-[#143a2a]">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-black text-[#113a2b] mb-4">Dịch vụ không tồn tại</h2>
          <Link to="/" className="text-[#0f8f77] font-semibold hover:underline">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfdf9] text-[#143a2a]">
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        pkg={selectedPackage}
        serviceTitle={service.title}
        serviceId={service.id}
        categoryId={category.id}
        formUrl={service.formUrl}
      />

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
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
            <Link to={`/category/${category.id}`} className="hover:text-[#0f8f77] transition-colors">
              {category.shortTitle || category.title}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#0f8f77]">{service.title}</span>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f8f77]">Dịch vụ</p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-4xl md:text-6xl font-black leading-tight text-[#113a2b]"
              >
                {service.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-5 text-lg md:text-xl text-gray-700 leading-relaxed"
              >
                {service.description}
              </motion.p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={serviceId === 'medical-assistant' ? '#booking-form' : '#pricing'}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f8f77] px-5 py-3 text-white font-bold shadow-sm"
                >
                  {serviceId === 'medical-assistant' ? 'Đăng ký dịch vụ' : 'Xem bảng giá'} <ChevronRight size={18} />
                </a>
                <a
                  href="https://zalo.me/0899660847"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#0f8f77]/30 bg-white px-5 py-3 text-[#0f8f77] font-bold hover:bg-[#f2fffb] transition-colors"
                >
                  Liên hệ nhanh <MessageCircle size={18} />
                </a>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/70 bg-white shadow-[0_20px_50px_rgba(3,15,12,0.10)]">
              <img src={service.image} alt={service.title} className="w-full h-[300px] md:h-[420px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-white/0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#60a5fa]/26 to-[#22c55e]/22 blur-2xl" />
          <div className="absolute -right-24 top-[46%] w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9]/22 to-[#14b8a6]/22 blur-2xl" />
          <div className="absolute left-[34%] -bottom-24 w-44 h-44 rounded-full border-[6px] border-[#60a5fa]/18" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
          
          <div className="space-y-16">
            
            {/* Trust Header */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm">
                  <p className="font-bold text-[#113a2b]">Được tin dùng bởi 10.000+ khách hàng</p>
                  <div className="mt-2 flex items-center text-yellow-500 gap-0.5">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <span className="text-gray-500 ml-2 font-semibold">4.9/5 đánh giá</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-[#f2fffb] px-3 py-1 text-[#0f8f77]">Minh bạch</span>
                  <span className="rounded-full bg-[#f2fffb] px-3 py-1 text-[#0f8f77]">Bảo mật</span>
                  <span className="rounded-full bg-[#f2fffb] px-3 py-1 text-[#0f8f77]">Hỗ trợ nhanh</span>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#113a2b] mb-8 tracking-tight leading-tight">
                Chi tiết dịch vụ
              </h2>
              <div className="prose prose-lg text-gray-700 max-w-none">
                <p className="leading-relaxed text-lg mb-8 text-gray-700">
                  {service.detailedDescription || service.description}
                </p>
                {hasVisibleGallery && (
                <div className="my-10 not-prose">
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <h3 className="text-xl md:text-2xl font-black text-[#113a2b] tracking-tight">Hình ảnh minh hoạ thực tế</h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400">Lướt ngang để xem</span>
                  </div>
                  <div className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory pb-2">
                    {serviceGallery.map((image, idx) =>
                      brokenGalleryIndexes.has(idx) ? null : (
                      <div key={`${service.id}-gallery-${idx}`} className="min-w-[80%] md:min-w-[44%] lg:min-w-[38%] aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm snap-start">
                        <img
                          src={image}
                          alt={`${service.title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={() => {
                            setBrokenGalleryIndexes((prev) => {
                              const next = new Set(prev);
                              next.add(idx);
                              return next;
                            });
                          }}
                        />
                      </div>
                      )
                    )}
                  </div>
                </div>
                )}
                
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm my-8">
                  <h4 className="font-black text-lg text-[#113a2b] mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-[#0f8f77]" size={24} />
                    Cam kết từ LAVIA
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-3">
                      <CheckCircle className="text-[#0f8f77] flex-shrink-0 mt-1" size={20} />
                      <div>
                        <span className="font-bold text-[#113a2b] block">Minh bạch tuyệt đối</span>
                        <span className="text-sm text-gray-500">Báo cáo tiến độ theo thời gian thực, không phí ẩn.</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-[#0f8f77] flex-shrink-0 mt-1" size={20} />
                      <div>
                        <span className="font-bold text-[#113a2b] block">Hoàn tiền 100%</span>
                        <span className="text-sm text-gray-500">Nếu không đạt kết quả như cam kết ban đầu.</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-[#0f8f77] flex-shrink-0 mt-1" size={20} />
                      <div>
                        <span className="font-bold text-[#113a2b] block">Bảo mật thông tin</span>
                        <span className="text-sm text-gray-500">Dữ liệu khách hàng được mã hóa và bảo vệ 2 lớp.</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle className="text-[#0f8f77] flex-shrink-0 mt-1" size={20} />
                      <div>
                        <span className="font-bold text-[#113a2b] block">Hỗ trợ 24/7</span>
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
                <h3 className="text-2xl md:text-3xl font-black text-[#113a2b] mb-8 tracking-tight">Tại sao chọn chúng tôi?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <div className="w-11 h-11 bg-[#f2fffb] text-[#0f8f77] rounded-full flex items-center justify-center">
                        <span className="font-black text-base">{idx + 1}</span>
                      </div>
                      <h4 className="mt-4 text-lg font-black text-[#113a2b]">
                        Tiêu chuẩn {idx === 0 ? 'Quốc tế' : (idx === 1 ? 'Chuyên nghiệp' : (idx === 2 ? 'Tận tâm' : 'Bảo mật'))}
                      </h4>
                      <p className="mt-2 text-gray-600 leading-relaxed">{feature}</p>
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
                <div className="mt-12" id="pricing">
                  <h3 className="text-2xl md:text-3xl font-black text-[#113a2b] mb-8 tracking-tight">Bảng giá minh bạch</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {service.pricing.map((pkg, idx) => (
                    <div
                      key={idx}
                      className={`relative p-8 rounded-2xl border transition-all duration-300 ${pkg.recommended ? 'bg-[#0f8f77] text-white border-[#0f8f77] shadow-[0_18px_50px_rgba(3,15,12,0.12)] md:scale-105 z-10' : 'bg-white text-gray-900 border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}
                    >
                      {pkg.recommended && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Phổ biến nhất
                          </span>
                        </div>
                      )}
                      
                      <h4 className={`text-lg font-bold uppercase tracking-wider mb-4 ${pkg.recommended ? 'text-white/80' : 'text-gray-500'}`}>{pkg.name}</h4>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-black">{pkg.price}</span>
                      </div>
                      <p className={`text-sm mb-8 pb-8 border-b ${pkg.recommended ? 'text-white/80 border-white/20' : 'text-gray-600 border-gray-100'}`}>{pkg.description}</p>

                      <ul className="space-y-4 mb-8">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-3 text-sm">
                            <CheckCircle size={18} className={`flex-shrink-0 mt-0.5 ${pkg.recommended ? 'text-white' : 'text-[#0f8f77]'}`} />
                            <span className="leading-relaxed">{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {pkg.actionLabel && pkg.actionUrl ? (
                        <a 
                          href={pkg.actionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`block w-full text-center py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${pkg.recommended ? 'bg-white text-[#0f8f77] hover:bg-[#f2fffb]' : 'bg-[#0f8f77] text-white hover:bg-[#0c7a66]'}`}
                        >
                          {pkg.actionLabel}
                        </a>
                      ) : (
                        <button 
                          onClick={() => handleSelectPackage(pkg)}
                          className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 ${pkg.recommended ? 'bg-white text-[#0f8f77] hover:bg-[#f2fffb]' : 'bg-[#0f8f77] text-white hover:bg-[#0c7a66]'}`}
                        >
                          Chọn gói này
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-100 inline-block mx-auto">
                  <ShieldCheck size={16} className="text-[#0f8f77]" />
                  <span>Cam kết không phát sinh chi phí ẩn. Hoàn tiền 100% nếu không hài lòng.</span>
                </div>
              </div>
            )
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-2">
                  <ShieldCheck className="mx-auto text-[#0f8f77] mb-2" size={24} />
                  <p className="text-xs font-bold text-gray-700 uppercase">Bảo mật 100%</p>
                </div>
                <div className="text-center p-2">
                  <Award className="mx-auto text-[#0f8f77] mb-2" size={24} />
                  <p className="text-xs font-bold text-gray-700 uppercase">Uy tín hàng đầu</p>
                </div>
                <div className="text-center p-2">
                  <Clock className="mx-auto text-[#0f8f77] mb-2" size={24} />
                  <p className="text-xs font-bold text-gray-700 uppercase">Đúng hẹn</p>
                </div>
                <div className="text-center p-2">
                  <Users className="mx-auto text-[#0f8f77] mb-2" size={24} />
                  <p className="text-xs font-bold text-gray-700 uppercase">Hỗ trợ nhanh</p>
                </div>
              </div>
            </div>

            <AuthoritySection signals={service.psychology?.authoritySignals} />
          </div>

        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
