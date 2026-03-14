import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Facebook, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const AboutPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash]);

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
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f8f77]">Giới thiệu</p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-4xl md:text-6xl font-black leading-tight text-[#113a2b]"
              >
                Về LAVIA
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="mt-5 text-lg md:text-xl text-gray-700 leading-relaxed"
              >
                Kiến tạo phong cách sống thượng lưu
              </motion.p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-white/70 bg-white shadow-[0_20px_50px_rgba(3,15,12,0.10)]">
              <img src="/images/about-bg.jpg" alt="LAVIA Office" className="w-full h-[300px] md:h-[420px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative overflow-hidden max-w-6xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-8 w-64 h-64 rounded-full bg-gradient-to-br from-[#60a5fa]/30 to-[#22c55e]/25 blur-2xl" />
          <div className="absolute -right-24 top-52 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9]/25 to-[#14b8a6]/25 blur-2xl" />
          <div className="absolute left-[38%] -bottom-24 w-44 h-44 rounded-full border-[6px] border-[#60a5fa]/20" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#113a2b] mb-6">Câu chuyện của chúng tôi</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              LAVIA không chỉ là một đơn vị cung cấp dịch vụ, mà là người bạn đồng hành tin cậy trên hành trình nâng tầm chất lượng cuộc sống của bạn. Được thành lập với sứ mệnh mang đến những giải pháp toàn diện và đẳng cấp nhất, chúng tôi tự hào là cầu nối giữa khách hàng và những trải nghiệm sống tinh tế.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Từ những bước đầu tiên trong lĩnh vực di trú và du lịch, LAVIA đã không ngừng mở rộng hệ sinh thái sang bất động sản, chăm sóc gia đình và giải pháp doanh nghiệp. Mỗi dịch vụ của chúng tôi đều được thiết kế tỉ mỉ, đặt sự hài lòng và lợi ích của khách hàng lên hàng đầu.
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10"
            >
              <h3 className="text-2xl font-black text-[#113a2b] mb-3">Tầm nhìn</h3>
              <p className="text-gray-600 leading-relaxed">
                Trở thành biểu tượng hàng đầu về chất lượng và sự uy tín trong lĩnh vực cung cấp dịch vụ cao cấp tại Việt Nam và vươn tầm quốc tế. Chúng tôi hướng tới việc xây dựng một cộng đồng thịnh vượng, nơi mọi nhu cầu của khách hàng đều được đáp ứng với tiêu chuẩn cao nhất.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10"
            >
              <h3 className="text-2xl font-black text-[#113a2b] mb-3">Sứ mệnh</h3>
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
            className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-black text-[#113a2b] mb-6">Giá trị cốt lõi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-gray-100 bg-[#fbfdf9] p-6">
                <h4 className="font-black text-lg mb-2 text-[#0f8f77]">Tận tâm</h4>
                <p className="text-sm text-gray-600">Luôn đặt khách hàng làm trọng tâm trong mọi suy nghĩ và hành động.</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#fbfdf9] p-6">
                <h4 className="font-black text-lg mb-2 text-[#0f8f77]">Uy tín</h4>
                <p className="text-sm text-gray-600">Cam kết thực hiện đúng lời hứa và đảm bảo chất lượng dịch vụ tốt nhất.</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#fbfdf9] p-6">
                <h4 className="font-black text-lg mb-2 text-[#0f8f77]">Đẳng cấp</h4>
                <p className="text-sm text-gray-600">Không ngừng nâng cao tiêu chuẩn để mang lại trải nghiệm sang trọng và khác biệt.</p>
              </div>
            </div>
          </motion.div>

          <div id="contact" className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f8f77]">Liên hệ</p>
                <h3 className="mt-3 text-2xl md:text-3xl font-black text-[#113a2b]">Liên hệ chúng tôi</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  Gửi yêu cầu của bạn, đội ngũ LAVIA sẽ phản hồi nhanh và rõ ràng.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://zalo.me/0899660847"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f8f77] px-5 py-3 text-white font-bold shadow-sm"
                >
                  <MessageCircle size={18} />
                  Chat Zalo
                </a>
                <a
                  href="tel:0899660847"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#0f8f77]/30 bg-white px-5 py-3 text-[#0f8f77] font-bold hover:bg-[#f2fffb] transition-colors"
                >
                  <Phone size={18} />
                  Gọi ngay
                </a>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-100 bg-[#fbfdf9] p-6">
                <div className="flex items-start gap-3">
                  <span className="h-10 w-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#0f8f77]">
                    <Phone size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-black text-[#113a2b]">Số điện thoại</p>
                    <a href="tel:0899660847" className="mt-1 block text-gray-600 font-semibold hover:text-[#0f8f77] transition-colors">
                      0899 660 847
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#fbfdf9] p-6">
                <div className="flex items-start gap-3">
                  <span className="h-10 w-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#0f8f77]">
                    <Mail size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-black text-[#113a2b]">Email</p>
                    <a
                      href="mailto:lavia.ecosystem@gmail.com"
                      className="mt-1 inline-flex items-center gap-2 text-gray-600 font-semibold hover:text-[#0f8f77] transition-colors"
                    >
                      <span>lavia.ecosystem@gmail.com</span>
                      <Mail size={16} className="text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#fbfdf9] p-6 md:col-span-2">
                <div className="flex items-start gap-3">
                  <span className="h-10 w-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#0f8f77]">
                    <Facebook size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-black text-[#113a2b]">Fanpage</p>
                    <a
                      href="https://www.facebook.com/lavia.ecosystem"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-gray-600 font-semibold hover:text-[#0f8f77] transition-colors"
                    >
                      LAVIA - Giải Pháp Trợ Giúp Đa Ngành
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#fbfdf9] p-6 md:col-span-2">
                <div className="flex items-start gap-3">
                  <span className="h-10 w-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#0f8f77]">
                    <MapPin size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-black text-[#113a2b]">Địa chỉ</p>
                    <p className="mt-1 text-gray-600 font-semibold">
                      [Địa chỉ văn phòng LAVIA]
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
