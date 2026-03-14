import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

const LegalPage = () => {
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
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f8f77]">Pháp lý</p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-4xl md:text-6xl font-black leading-tight text-[#113a2b]"
              >
                Pháp lý & Quyền riêng tư
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-5 text-lg md:text-xl text-gray-700 leading-relaxed"
              >
                Cam kết bảo mật và minh bạch
              </motion.p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/70 bg-white shadow-[0_20px_50px_rgba(3,15,12,0.10)]">
              <img src="/images/legal-bg.jpg" alt="Legal & Privacy" className="w-full h-[300px] md:h-[420px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative overflow-hidden max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 w-64 h-64 rounded-full bg-gradient-to-br from-[#60a5fa]/30 to-[#22c55e]/25 blur-2xl" />
          <div className="absolute -right-24 top-56 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9]/25 to-[#14b8a6]/25 blur-2xl" />
          <div className="absolute left-[18%] bottom-8 w-40 h-40 rounded-full border-[6px] border-[#60a5fa]/20" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 mb-6"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#113a2b] mb-6">Chính sách bảo mật</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              LAVIA cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. Chúng tôi hiểu rằng sự tin tưởng của quý khách là nền tảng cho sự phát triển bền vững của chúng tôi.
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
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 mb-6"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#113a2b] mb-6">Điều khoản sử dụng</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              Khi truy cập và sử dụng website cũng như các dịch vụ của LAVIA, quý khách đồng ý tuân thủ các điều khoản và điều kiện được quy định tại đây.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-4 text-lg pl-4">
              <li>Sử dụng dịch vụ cho mục đích hợp pháp và không vi phạm quyền lợi của bên thứ ba.</li>
              <li>Không thực hiện các hành vi gây hại đến hệ thống, dữ liệu hoặc uy tín của LAVIA.</li>
              <li>Tuân thủ các quy định về thanh toán và cung cấp thông tin chính xác.</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10"
          >
            <h3 className="text-2xl md:text-3xl font-black text-[#113a2b] mb-4">Liên hệ pháp lý</h3>
            <p className="text-gray-600 mb-4">
              Nếu quý khách có bất kỳ câu hỏi hoặc thắc mắc nào liên quan đến chính sách bảo mật hoặc điều khoản sử dụng, vui lòng liên hệ với bộ phận pháp lý của chúng tôi:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:lavia.ecosystem@gmail.com"
                  className="inline-flex items-center gap-2 font-semibold hover:text-[#0f8f77] transition-colors"
                >
                  <span>lavia.ecosystem@gmail.com</span>
                  <Mail size={16} className="text-gray-400" />
                </a>
              </li>
              <li><strong>Điện thoại:</strong> 0899 660 847</li>
              <li><strong>Địa chỉ:</strong> [Địa chỉ văn phòng LAVIA]</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LegalPage;
