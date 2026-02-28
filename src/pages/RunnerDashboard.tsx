import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, CheckCircle, Camera, Search, Loader2 } from 'lucide-react';

const RunnerDashboard = () => {
  const [step, setStep] = useState<'search' | 'upload' | 'success'>('search');
  const [bookingCode, setBookingCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingCode.trim()) {
      // In a real app, validate code against API here
      setStep('upload');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    
    // Simulate API upload
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-luvia-blue text-white p-4 shadow-md sticky top-0 z-10">
        <h1 className="font-display font-bold text-lg flex items-center gap-2">
          <Camera size={20} />
          Luvia Runner App
        </h1>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {step === 'search' && (
            <div className="p-6 space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Nhập mã đơn hàng</h2>
                <p className="text-gray-500 text-sm mt-1">Nhập mã đơn (VD: CB1234) để bắt đầu trả kết quả.</p>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã Booking</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="VD: CB1234"
                      className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-luvia-blue outline-none text-lg font-mono uppercase"
                      value={bookingCode}
                      onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-luvia-blue text-white font-bold rounded-xl hover:bg-luvia-dark transition-colors"
                >
                  Tiếp tục
                </button>
              </form>
            </div>
          )}

          {step === 'upload' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Đơn hàng</p>
                  <p className="text-xl font-mono font-bold text-luvia-blue">{bookingCode}</p>
                </div>
                <button 
                  onClick={() => setStep('search')}
                  className="text-sm text-gray-400 underline"
                >
                  Thay đổi
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chụp ảnh phiếu số</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative bg-gray-50">
                    <input
                      type="file"
                      required
                      accept="image/*"
                      capture="environment"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    {file ? (
                      <div className="relative z-10">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="Preview" 
                          className="max-h-48 mx-auto rounded-lg shadow-sm mb-2"
                        />
                        <p className="text-sm font-medium text-green-600 truncate px-4">{file.name}</p>
                        <p className="text-xs text-gray-400 mt-1">Bấm để chụp lại</p>
                      </div>
                    ) : (
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-blue-100 text-luvia-blue rounded-full flex items-center justify-center mx-auto mb-3">
                          <Camera size={32} />
                        </div>
                        <p className="font-medium text-gray-700">Chụp ảnh phiếu</p>
                        <p className="text-xs text-gray-500 mt-1">Rõ nét, đầy đủ thông tin</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !file}
                  className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Xác nhận hoàn thành
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="p-8 text-center space-y-6">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle size={48} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã gửi thành công!</h2>
                <p className="text-gray-500">
                  Hệ thống đã nhận được ảnh phiếu số cho đơn <span className="font-mono font-bold text-gray-800">{bookingCode}</span>.
                </p>
              </div>
              
              <button
                onClick={() => {
                  setStep('search');
                  setBookingCode('');
                  setFile(null);
                }}
                className="w-full py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:border-luvia-blue hover:text-luvia-blue transition-colors"
              >
                Làm đơn tiếp theo
              </button>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2024 Luvia Medical Runner System
        </p>
      </div>
    </div>
  );
};

export default RunnerDashboard;
