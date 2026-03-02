import React from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';

const LegalPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/legal_document/1920/1080" 
            alt="Legal & Privacy" 
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
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-wide">PHÁP LÝ & QUYỀN RIÊNG TƯ</h1>
            <p className="text-lg md:text-xl font-light tracking-wider uppercase">Cam kết bảo mật và minh bạch</p>
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
          className="mb-16"
        >
          <h2 className="text-3xl font-display font-bold text-luvia-blue mb-8">Chính Sách Bảo Mật</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            LUVIA cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. Chúng tôi hiểu rằng sự tin tưởng của quý khách là nền tảng cho sự phát triển bền vững của chúng tôi.
          </p>
          <p className="text-gray-600 leading-relaxed text-lg">
            Mọi thông tin cá nhân mà quý khách cung cấp (bao gồm tên, địa chỉ, số điện thoại, email, thông tin tài chính...) đều được chúng tôi thu thập, xử lý và lưu trữ theo đúng quy định của pháp luật hiện hành về bảo vệ dữ liệu cá nhân.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-display font-bold text-luvia-blue mb-8">Điều Khoản Sử Dụng</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            Khi truy cập và sử dụng website cũng như các dịch vụ của LUVIA, quý khách đồng ý tuân thủ các điều khoản và điều kiện được quy định tại đây.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-4 text-lg pl-4">
            <li>Sử dụng dịch vụ cho mục đích hợp pháp và không vi phạm quyền lợi của bên thứ ba.</li>
            <li>Không thực hiện các hành vi gây hại đến hệ thống, dữ liệu hoặc uy tín của LUVIA.</li>
            <li>Tuân thủ các quy định về thanh toán và cung cấp thông tin chính xác.</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-50 p-10 rounded-xl"
        >
          <h3 className="text-2xl font-display font-bold text-luvia-blue mb-6">Liên Hệ Pháp Lý</h3>
          <p className="text-gray-600 mb-4">
            Nếu quý khách có bất kỳ câu hỏi hoặc thắc mắc nào liên quan đến chính sách bảo mật hoặc điều khoản sử dụng, vui lòng liên hệ với bộ phận pháp lý của chúng tôi:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li><strong>Email:</strong> legal@luvia.vn</li>
            <li><strong>Điện thoại:</strong> 0899 660 847</li>
            <li><strong>Địa chỉ:</strong> [Địa chỉ văn phòng LUVIA]</li>
          </ul>
        </motion.div>
      </section>
    </div>
  );
};

export default LegalPage;
