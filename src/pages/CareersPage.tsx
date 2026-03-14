import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CareersPage = () => {
  return (
    <div className="bg-[#fbfdf9] text-[#143a2a] min-h-screen">
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
      
      <section className="relative bg-white overflow-hidden border-b border-gray-200">
        <div className="absolute -left-24 top-24 w-56 h-56 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#14b8a6] opacity-95"></div>
        <div className="absolute -right-20 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] opacity-90"></div>
        <div className="absolute right-16 top-8 w-56 h-56 rounded-full bg-gradient-to-br from-[#93c5fd] to-[#6ee7b7] opacity-85"></div>
        <div className="absolute right-0 top-20 w-36 h-36 rounded-full bg-gradient-to-br from-[#2563eb] to-[#16a34a] opacity-80"></div>
        <div className="absolute -left-6 bottom-10 w-28 h-28 rounded-full border-[6px] border-[#60a5fa]/50"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 md:pt-14 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f8f77]">Tuyển dụng</p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-4xl md:text-6xl font-black leading-tight text-[#113a2b]"
              >
                Gia nhập đội ngũ LAVIA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-5 text-lg md:text-xl text-gray-700 leading-relaxed"
              >
                Môi trường chuyên nghiệp, minh bạch, tôn trọng con người
              </motion.p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/70 bg-white shadow-[0_20px_50px_rgba(3,15,12,0.10)]">
              <img src="/images/careers-bg.jpg" alt="LAVIA Team" className="w-full h-[300px] md:h-[420px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative overflow-hidden max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-16 w-64 h-64 rounded-full bg-gradient-to-br from-[#60a5fa]/30 to-[#22c55e]/25 blur-2xl" />
          <div className="absolute -right-24 bottom-6 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9]/25 to-[#14b8a6]/25 blur-2xl" />
          <div className="absolute right-[18%] top-[44%] w-36 h-36 rounded-full border-[6px] border-[#60a5fa]/20" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#113a2b] mb-6">Tại sao chọn LAVIA?</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              Tại LAVIA, chúng tôi tin rằng con người là tài sản quý giá nhất. Chúng tôi không chỉ tìm kiếm những nhân sự xuất sắc, mà còn tìm kiếm những người đồng hành cùng chia sẻ tầm nhìn và giá trị cốt lõi.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Môi trường làm việc tại LAVIA là nơi bạn được khuyến khích sáng tạo, phát triển bản thân và đóng góp vào những dự án mang tầm vóc quốc tế. Chúng tôi cam kết mang đến chế độ đãi ngộ hấp dẫn, cơ hội thăng tiến rõ ràng và một văn hóa doanh nghiệp cởi mở, chuyên nghiệp.
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm"
            >
              <h3 className="text-2xl font-black text-[#113a2b] mb-3">Môi trường chuyên nghiệp</h3>
              <p className="text-gray-600 leading-relaxed">
                Làm việc cùng những chuyên gia hàng đầu trong lĩnh vực di trú, bất động sản và dịch vụ cao cấp. Bạn sẽ được tiếp cận với những quy trình làm việc chuẩn mực và công nghệ tiên tiến.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm"
            >
              <h3 className="text-2xl font-black text-[#113a2b] mb-3">Phúc lợi hấp dẫn</h3>
              <p className="text-gray-600 leading-relaxed">
                Chế độ lương thưởng cạnh tranh, bảo hiểm sức khỏe toàn diện, du lịch hàng năm và các chương trình đào tạo chuyên sâu để nâng cao kỹ năng nghề nghiệp.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-black text-[#113a2b] mb-4">Vị trí đang tuyển dụng</h3>
            <p className="text-gray-500 mb-8">Hiện tại chúng tôi chưa có vị trí trống nào. Tuy nhiên, bạn luôn có thể gửi CV của mình để chúng tôi lưu trữ cho các cơ hội trong tương lai.</p>
            <a 
              href="mailto:lavia.ecosystem@gmail.com" 
              className="inline-block px-8 py-3 bg-[#0f8f77] text-white font-bold rounded-full hover:bg-[#0c7a66] transition-colors"
            >
              Gửi CV Ngay
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
