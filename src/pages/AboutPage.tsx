import React from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/luxury_office/1920/1080" 
            alt="LUVIA Office" 
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
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-wide">VỀ LUVIA</h1>
            <p className="text-lg md:text-xl font-light tracking-wider uppercase">Kiến tạo phong cách sống thượng lưu</p>
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
          <h2 className="text-3xl font-display font-bold text-luvia-blue mb-8">Câu Chuyện Của Chúng Tôi</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            LUVIA không chỉ là một đơn vị cung cấp dịch vụ, mà là người bạn đồng hành tin cậy trên hành trình nâng tầm chất lượng cuộc sống của bạn. Được thành lập với sứ mệnh mang đến những giải pháp toàn diện và đẳng cấp nhất, chúng tôi tự hào là cầu nối giữa khách hàng và những trải nghiệm sống tinh tế.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Từ những bước đầu tiên trong lĩnh vực di trú và du lịch, LUVIA đã không ngừng mở rộng hệ sinh thái sang bất động sản, chăm sóc gia đình và giải pháp doanh nghiệp. Mỗi dịch vụ của chúng tôi đều được thiết kế tỉ mỉ, đặt sự hài lòng và lợi ích của khách hàng lên hàng đầu.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-display font-bold text-luvia-blue mb-4">Tầm Nhìn</h3>
            <p className="text-gray-600 leading-relaxed">
              Trở thành biểu tượng hàng đầu về chất lượng và sự uy tín trong lĩnh vực cung cấp dịch vụ cao cấp tại Việt Nam và vươn tầm quốc tế. Chúng tôi hướng tới việc xây dựng một cộng đồng thịnh vượng, nơi mọi nhu cầu của khách hàng đều được đáp ứng với tiêu chuẩn cao nhất.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-display font-bold text-luvia-blue mb-4">Sứ Mệnh</h3>
            <p className="text-gray-600 leading-relaxed">
              Mang đến sự an tâm tuyệt đối và trải nghiệm vượt trội cho khách hàng thông qua sự chuyên nghiệp, tận tâm và minh bạch. Chúng tôi cam kết không ngừng đổi mới và hoàn thiện để xứng đáng với niềm tin mà quý khách hàng đã trao gửi.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 p-10 rounded-xl text-center"
        >
          <h3 className="text-2xl font-display font-bold text-luvia-blue mb-6">Giá Trị Cốt Lõi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-2 text-luvia-mint">Tận Tâm</h4>
              <p className="text-sm text-gray-600">Luôn đặt khách hàng làm trọng tâm trong mọi suy nghĩ và hành động.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-luvia-mint">Uy Tín</h4>
              <p className="text-sm text-gray-600">Cam kết thực hiện đúng lời hứa và đảm bảo chất lượng dịch vụ tốt nhất.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2 text-luvia-mint">Đẳng Cấp</h4>
              <p className="text-sm text-gray-600">Không ngừng nâng cao tiêu chuẩn để mang lại trải nghiệm sang trọng và khác biệt.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
