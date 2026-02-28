import React from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';

const CareersPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden mt-[64px] md:mt-[80px]">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/luxury_team/1920/1080" 
            alt="LUVIA Team" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-wide">TUYỂN DỤNG</h1>
            <p className="text-lg md:text-xl font-light tracking-wider uppercase">Gia nhập đội ngũ LUVIA</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-display font-bold text-luvia-blue mb-8">Tại Sao Chọn LUVIA?</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            Tại LUVIA, chúng tôi tin rằng con người là tài sản quý giá nhất. Chúng tôi không chỉ tìm kiếm những nhân sự xuất sắc, mà còn tìm kiếm những người đồng hành cùng chia sẻ tầm nhìn và giá trị cốt lõi.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Môi trường làm việc tại LUVIA là nơi bạn được khuyến khích sáng tạo, phát triển bản thân và đóng góp vào những dự án mang tầm vóc quốc tế. Chúng tôi cam kết mang đến chế độ đãi ngộ hấp dẫn, cơ hội thăng tiến rõ ràng và một văn hóa doanh nghiệp cởi mở, chuyên nghiệp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-8 rounded-xl"
          >
            <h3 className="text-2xl font-display font-bold text-luvia-blue mb-4">Môi Trường Chuyên Nghiệp</h3>
            <p className="text-gray-600 leading-relaxed">
              Làm việc cùng những chuyên gia hàng đầu trong lĩnh vực di trú, bất động sản và dịch vụ cao cấp. Bạn sẽ được tiếp cận với những quy trình làm việc chuẩn mực và công nghệ tiên tiến.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-8 rounded-xl"
          >
            <h3 className="text-2xl font-display font-bold text-luvia-blue mb-4">Phúc Lợi Hấp Dẫn</h3>
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
          className="text-center"
        >
          <h3 className="text-2xl font-display font-bold text-luvia-blue mb-6">Vị Trí Đang Tuyển Dụng</h3>
          <p className="text-gray-500 mb-8">Hiện tại chúng tôi chưa có vị trí trống nào. Tuy nhiên, bạn luôn có thể gửi CV của mình để chúng tôi lưu trữ cho các cơ hội trong tương lai.</p>
          <a 
            href="mailto:tuyendung@luvia.vn" 
            className="inline-block px-8 py-3 bg-luvia-blue text-white font-bold rounded-full hover:bg-luvia-mint transition-colors"
          >
            Gửi CV Ngay
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default CareersPage;
