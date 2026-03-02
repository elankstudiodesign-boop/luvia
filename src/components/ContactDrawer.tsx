import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Phone, Mail, MessageCircle, MessageSquare, Facebook 
} from 'lucide-react';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactOption = ({ icon: Icon, label, href, subLabel }: { icon: any, label: string, href: string, subLabel?: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-4 py-4 group hover:bg-gray-50 transition-colors -mx-4 px-4 rounded-lg"
  >
    <Icon size={20} strokeWidth={1.5} className="text-gray-900" />
    <div className="flex-1">
      <span className="block text-sm font-medium text-gray-900">{label}</span>
      {subLabel && <span className="block text-xs text-gray-500 mt-0.5">{subLabel}</span>}
    </div>
  </a>
);

const FooterLink = ({ label, href }: { label: string, href: string }) => (
  <a 
    href={href} 
    className="block py-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-luvia-blue transition-colors"
  >
    {label}
  </a>
);

const ContactDrawer: React.FC<ContactDrawerProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.4, ease: "circOut" }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 pb-4">
              <h2 className="text-xl font-display font-medium text-gray-900 tracking-wide">Liên hệ với chúng tôi</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors -mr-2"
              >
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-4">
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                Trung tâm Tư vấn Khách hàng của LUVIA rất hân hạnh được hỗ trợ quý khách.
              </p>

              <div className="space-y-1">
                <ContactOption 
                  icon={Phone} 
                  label="+84 899 660 847" 
                  href="tel:0899660847" 
                />
                <ContactOption 
                  icon={Mail} 
                  label="Gửi email" 
                  href="mailto:support@luvia.vn" 
                />
                <ContactOption 
                  icon={MessageCircle} 
                  label="WhatsApp" 
                  href="https://wa.me/84899660847" 
                />
                <ContactOption 
                  icon={MessageSquare} 
                  label="Apple Message" 
                  href="sms:0899660847" 
                />
                <ContactOption 
                  icon={Facebook} 
                  label="Facebook Messenger" 
                  href="https://m.me/luvia.vn" 
                />
                {/* Zalo - Custom Icon or Generic */}
                <a 
                  href="https://zalo.me/0899660847"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-4 group hover:bg-gray-50 transition-colors -mx-4 px-4 rounded-lg"
                >
                  <div className="w-5 h-5 flex items-center justify-center font-bold text-[10px] border border-gray-900 rounded text-gray-900">Z</div>
                  <span className="text-sm font-medium text-gray-900">Zalo</span>
                </a>
              </div>

              <div className="my-8 border-t border-gray-100"></div>

              <div className="space-y-6">
                <p className="text-sm text-gray-900 font-medium">Chúng tôi có thể giúp gì được cho quý khách?</p>
                <div className="space-y-2">
                  <FooterLink label="Câu hỏi thường gặp" href="/faq" />
                  <FooterLink label="Dịch vụ chăm sóc" href="/services" />
                  <FooterLink label="Tìm cửa hàng" href="/stores" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactDrawer;
