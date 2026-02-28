import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Upload, CheckCircle, QrCode, AlertCircle, Loader2 } from 'lucide-react';

import { INTEGRATIONS } from '../config/integrations';

interface MedicalBookingFormProps {
  onSuccess: () => void;
}

const HOSPITALS = [
  { id: 'cho-ray', name: 'Bệnh viện Chợ Rẫy', price: 300000 },
  { id: 'y-duoc', name: 'Bệnh viện Đại học Y Dược', price: 250000 },
  { id: 'hoa-hao', name: 'Trung tâm Hòa Hảo', price: 200000 },
  { id: 'khac', name: 'Bệnh viện khác', price: 250000 },
];

const MedicalBookingForm: React.FC<MedicalBookingFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [formData, setFormData] = useState({
    hospitalId: 'cho-ray',
    date: '',
    specialty: '',
    isUrgent: false,
    files: null as FileList | null,
    customerName: '', // Added field
    customerPhone: '', // Added field
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCode] = useState(`CB${Math.floor(1000 + Math.random() * 9000)}`); // Stable booking code

  // Calculate price whenever dependencies change
  useEffect(() => {
    const hospital = HOSPITALS.find(h => h.id === formData.hospitalId);
    let price = hospital ? hospital.price : 0;
    
    // Urgent fee logic: If urgent is checked
    if (formData.isUrgent) {
      price += 50000;
    }

    setTotalPrice(price);
  }, [formData.hospitalId, formData.isUrgent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, files: e.target.files });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Prepare data for Make.com Webhook
      const payload = {
        bookingCode,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        hospital: HOSPITALS.find(h => h.id === formData.hospitalId)?.name,
        date: formData.date,
        specialty: formData.specialty,
        isUrgent: formData.isUrgent,
        totalPrice,
        status: 'Pending Payment',
        createdAt: new Date().toISOString(),
      };

      // 2. Send to Make.com (Fire and forget or wait for response)
      // Note: In a real app, you might want to upload files first and send the URL
      if (INTEGRATIONS.MAKE_BOOKING_WEBHOOK_URL && !INTEGRATIONS.MAKE_BOOKING_WEBHOOK_URL.includes('your-booking-webhook-id')) {
        await fetch(INTEGRATIONS.MAKE_BOOKING_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(err => console.error("Webhook error:", err));
      } else {
        console.log("Simulating Webhook call:", payload);
      }

      // 3. Move to payment step
      setStep('payment');
    } catch (error) {
      console.error("Booking error:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const simulatePaymentCheck = () => {
    setPaymentStatus('checking');
    // Simulate API call to PayOS/SePay -> Make.com
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        setStep('success');
        onSuccess();
      }, 1500);
    }, 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-luvia-blue p-6 text-white">
        <h3 className="text-xl font-display font-bold flex items-center gap-2">
          <Calendar className="text-luvia-mint" />
          Đặt lịch khám bệnh
        </h3>
        <p className="text-blue-100 text-sm mt-1">Điền thông tin để lấy số thứ tự sớm nhất</p>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luvia-blue outline-none"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    required
                    placeholder="0909..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luvia-blue outline-none"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>
              </div>

              {/* Hospital Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn Bệnh viện</label>
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luvia-blue focus:border-transparent outline-none transition-all"
                  value={formData.hospitalId}
                  onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                >
                  {HOSPITALS.map(h => (
                    <option key={h.id} value={h.id}>{h.name} - {formatCurrency(h.price)}</option>
                  ))}
                </select>
              </div>

              {/* Date & Specialty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khám</label>
                  <input
                    type="date"
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luvia-blue outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên khoa</label>
                  <input
                    type="text"
                    placeholder="VD: Tim mạch, Tiêu hóa..."
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luvia-blue outline-none"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh BHYT / CCCD / Sổ khám (Nếu có)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-500">
                    {formData.files ? `${formData.files.length} file đã chọn` : 'Kéo thả hoặc bấm để tải ảnh lên'}
                  </p>
                </div>
              </div>

              {/* Urgent Option */}
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <input
                  type="checkbox"
                  id="urgent"
                  className="w-5 h-5 text-luvia-blue rounded focus:ring-luvia-blue"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                />
                <label htmlFor="urgent" className="text-sm text-gray-700 flex-1 cursor-pointer select-none">
                  <span className="font-bold text-orange-600 block">Đặt gấp / Khám sớm (Trước 7h sáng)</span>
                  <span className="text-xs text-gray-500">Phụ thu 50.000 VNĐ để ưu tiên xếp hàng từ 4h sáng.</span>
                </label>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-gray-600 font-medium">Tổng thanh toán:</span>
                <span className="text-2xl font-display font-bold text-luvia-blue">{formatCurrency(totalPrice)}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-luvia-blue text-white font-bold uppercase tracking-widest rounded-xl hover:bg-luvia-mint hover:text-luvia-blue transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Tiếp tục thanh toán'}
              </button>
            </motion.form>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-6"
            >
              <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm flex items-start gap-2 text-left">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  Vui lòng quét mã QR bên dưới để thanh toán. Hệ thống sẽ tự động xác nhận sau 1-2 phút.
                </div>
              </div>

              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-luvia-blue to-luvia-mint rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  {/* Simulated QR Code - In real app, use a QR library or image from API */}
                  <div className="w-48 h-48 bg-gray-100 mx-auto flex items-center justify-center rounded-lg mb-2 overflow-hidden">
                    {/* <QrCode size={64} className="text-gray-400" /> */}
                    <img 
                      src={`https://img.vietqr.io/image/${INTEGRATIONS.BANK_DETAILS.BANK_ID}-${INTEGRATIONS.BANK_DETAILS.ACCOUNT_NO}-${INTEGRATIONS.BANK_DETAILS.TEMPLATE}.jpg?amount=${totalPrice}&addInfo=XH ${bookingCode}&accountName=${encodeURIComponent(INTEGRATIONS.BANK_DETAILS.ACCOUNT_NAME)}`} 
                      alt="VietQR" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <p className="font-mono font-bold text-lg text-gray-800 tracking-wider">XH {bookingCode}</p>
                  <p className="text-xs text-gray-500">Nội dung chuyển khoản</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Số tiền:</span>
                  <span className="font-bold text-luvia-blue">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
                  <span className="text-gray-500">Ngân hàng:</span>
                  <span className="font-medium">Techcombank</span>
                </div>
                <div className="flex justify-between text-sm pb-2">
                  <span className="text-gray-500">Chủ tài khoản:</span>
                  <span className="font-medium uppercase">{INTEGRATIONS.BANK_DETAILS.ACCOUNT_NAME}</span>
                </div>
              </div>

              {paymentStatus === 'pending' && (
                <button
                  onClick={simulatePaymentCheck}
                  className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Tôi đã chuyển khoản
                </button>
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
              
              <button 
                onClick={() => setStep('form')}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Quay lại chỉnh sửa
              </button>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-display font-bold text-luvia-blue mb-2">Đã nhận đơn hàng!</h3>
              <p className="text-gray-600 mb-6">
                Chúng tôi đã nhận được thanh toán và đang sắp xếp nhân sự lấy số cho bạn.
                <br />
                Mã đơn hàng: <span className="font-bold text-luvia-blue">{bookingCode}</span>
              </p>
              
              <div className="bg-blue-50 p-4 rounded-xl text-left text-sm text-blue-800 mb-8">
                <p className="font-bold mb-1">Bước tiếp theo:</p>
                <ul className="list-disc list-inside space-y-1 opacity-90">
                  <li>Nhân viên sẽ đến bệnh viện lúc 4h sáng mai.</li>
                  <li>Ảnh chụp phiếu số sẽ được gửi qua Zalo/Email.</li>
                  <li>Vui lòng để ý điện thoại vào sáng mai.</li>
                </ul>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:border-luvia-blue hover:text-luvia-blue transition-colors"
              >
                Đặt thêm đơn khác
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicalBookingForm;
