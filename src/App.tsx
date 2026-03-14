import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  Globe,
  Phone,
  Mail,
  Facebook,
  Search,
  Wrench,
  Scale,
  ChevronLeft,
  ChevronRight,
  Plane,
  Home,
  Heart,
  Briefcase,
  Pencil,
  FileText,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle,
  Headset,
  Users,
  Clock
} from 'lucide-react';
import { categories } from './data/services';
import ServiceDetail from './pages/ServiceDetail';
import CategoryDetail from './pages/CategoryDetail';
const HOME_CATEGORY_TABS = [
  { id: 'legal', label: 'Pháp lý', icon: Wrench, categoryId: 'legal', accent: { text: 'text-indigo-600', blob: 'bg-indigo-200/70', underline: 'bg-indigo-600' } },
  { id: 'travel', label: 'Di trú', icon: Plane, categoryId: 'travel', accent: { text: 'text-emerald-600', blob: 'bg-emerald-200/70', underline: 'bg-emerald-600' } },
  { id: 'real-estate', label: 'Bất động sản', icon: Home, categoryId: 'real-estate', accent: { text: 'text-sky-600', blob: 'bg-sky-200/70', underline: 'bg-sky-600' } },
  { id: 'family', label: 'Gia đình', icon: Heart, categoryId: 'family', accent: { text: 'text-rose-600', blob: 'bg-rose-200/70', underline: 'bg-rose-600' } },
  { id: 'business', label: 'Doanh nghiệp', icon: Briefcase, categoryId: 'business', accent: { text: 'text-amber-600', blob: 'bg-amber-200/70', underline: 'bg-amber-600' } },
  { id: 'design-creative', label: 'Thiết kế', icon: Pencil, categoryId: 'design-creative', accent: { text: 'text-violet-600', blob: 'bg-violet-200/70', underline: 'bg-violet-600' } },
  { id: 'writing-publishing', label: 'Soạn thảo', icon: FileText, categoryId: 'writing-publishing', accent: { text: 'text-blue-600', blob: 'bg-blue-200/70', underline: 'bg-blue-600' } },
  {
    id: 'consulting',
    label: 'Tư vấn',
    icon: Scale,
    serviceIds: ['visa', 'legal-check', 'insurance', 'google-maps', 'freelancer-admin'],
    accent: { text: 'text-cyan-600', blob: 'bg-cyan-200/70', underline: 'bg-cyan-600' },
  },
];

const HOME_CATEGORY_STATS: Record<string, { label: string; value: string }[]> = {
  legal: [
    { label: 'Hồ sơ hành chính', value: '3.4M+' },
    { label: 'Hồ sơ pháp lý', value: '1.2M+' },
    { label: 'Hạng mục hỗ trợ', value: '850K+' },
    { label: 'Xử lý hoàn tất', value: '420K+' },
    { label: 'Khách hàng hài lòng', value: '890K+' },
  ],
  travel: [
    { label: 'Yêu cầu di chuyển', value: '2.1M+' },
    { label: 'Đặt vé & lưu trú', value: '980K+' },
    { label: 'Hồ sơ visa', value: '640K+' },
    { label: 'Lịch trình hoàn tất', value: '310K+' },
    { label: 'Khách hàng hài lòng', value: '760K+' },
  ],
  'real-estate': [
    { label: 'Khảo sát hiện trạng', value: '1.3M+' },
    { label: 'Kiểm tra pháp lý', value: '720K+' },
    { label: 'Báo cáo hình ảnh', value: '410K+' },
    { label: 'Giao dịch hỗ trợ', value: '260K+' },
    { label: 'Khách hàng hài lòng', value: '540K+' },
  ],
  family: [
    { label: 'Hạng mục gia đình', value: '1.8M+' },
    { label: 'Yêu cầu chăm sóc', value: '900K+' },
    { label: 'Hồ sơ liên quan', value: '500K+' },
    { label: 'Việc hoàn tất', value: '300K+' },
    { label: 'Khách hàng hài lòng', value: '620K+' },
  ],
  business: [
    { label: 'Hồ sơ doanh nghiệp', value: '2.6M+' },
    { label: 'Đăng ký & thay đổi', value: '1.1M+' },
    { label: 'Tư vấn vận hành', value: '700K+' },
    { label: 'Hồ sơ hoàn tất', value: '450K+' },
    { label: 'Khách hàng hài lòng', value: '800K+' },
  ],
  'design-creative': [
    { label: 'Dự án thiết kế', value: '1.4M+' },
    { label: 'Yêu cầu sáng tạo', value: '820K+' },
    { label: 'Lượt chỉnh sửa', value: '530K+' },
    { label: 'Bàn giao hoàn tất', value: '290K+' },
    { label: 'Khách hàng hài lòng', value: '610K+' },
  ],
  'writing-publishing': [
    { label: 'Văn bản soạn thảo', value: '2.9M+' },
    { label: 'Đơn từ hành chính', value: '1.6M+' },
    { label: 'Hợp đồng & biểu mẫu', value: '900K+' },
    { label: 'Hồ sơ hoàn tất', value: '520K+' },
    { label: 'Khách hàng hài lòng', value: '870K+' },
  ],
  consulting: [
    { label: 'Lượt tư vấn', value: '3.1M+' },
    { label: 'Phiên hỗ trợ', value: '1.9M+' },
    { label: 'Hồ sơ rà soát', value: '1.2M+' },
    { label: 'Phương án đề xuất', value: '650K+' },
    { label: 'Khách hàng hài lòng', value: '920K+' },
  ],
};

const REVIEWS = [
  {
    name: 'Ngọc H.',
    text: 'Mình cần xử lý hồ sơ gấp trong 2 ngày và đội ngũ làm cực nhanh, tư vấn rất rõ ràng.',
    service: 'Thủ tục Hành chính',
  },
  {
    name: 'Anh Nam T.',
    text: 'Đặt vé và khách sạn cho cả công ty rất chỉn chu, lịch trình mượt và tiết kiệm nhiều thời gian.',
    service: 'Đặt vé & Khách sạn',
  },
  {
    name: 'Mai L.',
    text: 'Mình cần kiểm tra hiện trạng nhà từ xa, báo cáo hình ảnh rất đầy đủ và đúng giờ.',
    service: 'Trợ lý hiện trường',
  },
  {
    name: 'Quốc Bảo',
    text: 'Dịch vụ passport đúng như cam kết, không phải xếp hàng và cập nhật tiến độ liên tục.',
    service: 'Passport VIP',
  },
  {
    name: 'Kim Anh',
    text: 'Hồ sơ visa được hướng dẫn chi tiết từng bước nên đỡ lo lắng hơn rất nhiều.',
    service: 'Dịch vụ Visa',
  },
  {
    name: 'Minh Tú',
    text: 'Đội hỗ trợ lịch sự, phản hồi nhanh, làm việc có trách nhiệm từ đầu đến cuối.',
    service: 'Tư vấn tổng hợp',
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState(HOME_CATEGORY_TABS[0].id);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [helpQuery, setHelpQuery] = useState('');
  const [isHelpSuggestOpen, setIsHelpSuggestOpen] = useState(false);
  const [activeHelpSuggestIndex, setActiveHelpSuggestIndex] = useState(-1);
  const helpSuggestRef = useRef<HTMLDivElement | null>(null);
  const swipeStateRef = useRef<{
    pointerId: number | null;
    isDown: boolean;
    lockedAxis: 'x' | 'y' | null;
    startX: number;
    startY: number;
  }>({
    pointerId: null,
    isDown: false,
    lockedAxis: null,
    startX: 0,
    startY: 0,
  });
  const allServices = categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryId: category.id,
      categoryTitle: category.title,
    }))
  );

  const activeTab = HOME_CATEGORY_TABS.find((tab) => tab.id === activeTabId) || HOME_CATEGORY_TABS[0];
  const activeStats = HOME_CATEGORY_STATS[activeTab.id] || HOME_CATEGORY_STATS.legal;
  const activeServices = activeTab.categoryId
    ? (categories.find((category) => category.id === activeTab.categoryId)?.items || []).map((item) => ({
        ...item,
        categoryId: activeTab.categoryId as string,
      }))
    : allServices.filter((item) => activeTab.serviceIds?.includes(item.id));

  const quickFilters = activeServices;
  const featuredItems = activeServices.length ? activeServices : allServices;
  const featuredCount = featuredItems.length;
  const featuredSafeIndex = featuredCount ? ((featuredIndex % featuredCount) + featuredCount) % featuredCount : 0;
  const featured = featuredItems[featuredSafeIndex];
  const projects = activeServices;
  const normalizedHelpQuery = helpQuery
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  const helpSuggestionSource = allServices.map((item) => ({
    key: `${item.categoryId}:${item.id}`,
    title: item.title,
    description: item.description,
    categoryTitle: item.categoryTitle,
    categoryId: item.categoryId,
    serviceId: item.id,
  }));
  const helpSuggestions = normalizedHelpQuery.length
    ? helpSuggestionSource
        .map((item) => {
          const normalizedTitle = item.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
          const normalizedCategory = item.categoryTitle
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
          const normalizedDescription = item.description
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
          const isPrefix =
            normalizedTitle.startsWith(normalizedHelpQuery) || normalizedCategory.startsWith(normalizedHelpQuery);
          const isMatch =
            isPrefix ||
            normalizedTitle.includes(normalizedHelpQuery) ||
            normalizedCategory.includes(normalizedHelpQuery) ||
            normalizedDescription.includes(normalizedHelpQuery);
          if (!isMatch) return null;
          return { ...item, isPrefix };
        })
        .filter((item): item is (typeof helpSuggestionSource)[number] & { isPrefix: boolean } => Boolean(item))
        .sort((a, b) => Number(b.isPrefix) - Number(a.isPrefix))
        .slice(0, 8)
    : [];
  const handleSelectHelpSuggestion = (suggestion: (typeof helpSuggestionSource)[number]) => {
    setHelpQuery(suggestion.title);
    setIsHelpSuggestOpen(false);
    setActiveHelpSuggestIndex(-1);
    navigate(`/service/${suggestion.categoryId}/${suggestion.serviceId}`);
  };
  const getHomeServicePrice = (priceText?: string) => {
    if (!priceText) {
      return {
        label: 'Mức giá tham khảo',
        amount: '500.000 VNĐ',
        unit: '',
      };
    }

    const cleaned = priceText.replace(/\s+/g, ' ').trim();
    const parts = cleaned.split('/');
    const amount = parts[0]?.trim() || cleaned;
    const unit = parts[1]?.trim() ? `/${parts[1].trim()}` : '';

    if (cleaned.includes('VNĐ') || cleaned.includes('đ')) {
      return {
        label: 'Giá từ',
        amount,
        unit,
      };
    }

    return {
      label: 'Giá theo báo giá',
      amount: 'Liên hệ tư vấn',
      unit: '',
    };
  };

  useEffect(() => {
    setFeaturedIndex(0);
  }, [activeTabId]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!helpSuggestRef.current) return;
      const target = event.target as Node | null;
      if (target && helpSuggestRef.current.contains(target)) return;
      setIsHelpSuggestOpen(false);
      setActiveHelpSuggestIndex(-1);
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleFeaturedPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (featuredCount <= 1) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    swipeStateRef.current.pointerId = event.pointerId;
    swipeStateRef.current.isDown = true;
    swipeStateRef.current.lockedAxis = null;
    swipeStateRef.current.startX = event.clientX;
    swipeStateRef.current.startY = event.clientY;

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      void 0;
    }
  };

  const handleFeaturedPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = swipeStateRef.current;
    if (!state.isDown || state.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!state.lockedAxis && (absX > 8 || absY > 8)) {
      state.lockedAxis = absX >= absY ? 'x' : 'y';
    }

    if (state.lockedAxis === 'x') {
      event.preventDefault();
    }
  };

  const handleFeaturedPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = swipeStateRef.current;
    if (!state.isDown || state.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    state.pointerId = null;
    state.isDown = false;
    state.lockedAxis = null;

    if (featuredCount <= 1) return;
    if (absX < 60 || absX <= absY) return;

    if (deltaX < 0) {
      setFeaturedIndex((value) => value + 1);
    } else {
      setFeaturedIndex((value) => value - 1);
    }
  };

  return (
    <main className="bg-[#fbfdf9] text-[#143a2a]">
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center">
            <span className="text-[48px] leading-none font-display font-bold uppercase tracking-[0.2em] text-[#061b49]">LAVIA</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#1b3d2e]">
            <a href="#services">Dịch vụ</a>
            <Link to="/about#contact">Liên hệ chúng tôi</Link>
            <a href="https://zalo.me/0899660847" target="_blank" rel="noreferrer" className="border border-[#0f8f77] px-5 py-2 rounded-xl">
              Trở thành cộng tác viên
            </a>
          </div>
        </div>
      </section>

      <section className="relative bg-white overflow-hidden">
        <div className="absolute -left-24 top-24 w-56 h-56 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#14b8a6] opacity-95"></div>
        <div className="absolute -right-20 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] opacity-90"></div>
        <div className="absolute right-16 top-8 w-56 h-56 rounded-full bg-gradient-to-br from-[#93c5fd] to-[#6ee7b7] opacity-85"></div>
        <div className="absolute right-0 top-20 w-36 h-36 rounded-full bg-gradient-to-br from-[#2563eb] to-[#16a34a] opacity-80"></div>
        <div className="absolute -left-6 bottom-10 w-28 h-28 rounded-full border-[6px] border-[#60a5fa]/50"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-16">
          <h1 className="text-center text-4xl md:text-6xl font-extrabold leading-tight text-[#1f3e2f]">
            Điểm Đến Của Mọi Sự Ủy Thác
          </h1>

          <div ref={helpSuggestRef} className="mt-10 max-w-3xl mx-auto relative z-20">
            <div className="flex items-center rounded-full border border-[#d5ded6] overflow-hidden bg-white shadow-sm">
              <input
                type="text"
                placeholder="Bạn đang cần hỗ trợ việc gì?"
                value={helpQuery}
                onChange={(event) => {
                  const next = event.target.value;
                  setHelpQuery(next);
                  setIsHelpSuggestOpen(true);
                  setActiveHelpSuggestIndex(-1);
                }}
                onFocus={() => {
                  if (helpQuery.trim().length) setIsHelpSuggestOpen(true);
                }}
                onKeyDown={(event) => {
                  if (!isHelpSuggestOpen || helpSuggestions.length === 0) return;
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setActiveHelpSuggestIndex((value) => Math.min(value + 1, helpSuggestions.length - 1));
                    return;
                  }
                  if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setActiveHelpSuggestIndex((value) => Math.max(value - 1, 0));
                    return;
                  }
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    const picked =
                      activeHelpSuggestIndex >= 0 ? helpSuggestions[activeHelpSuggestIndex] : helpSuggestions[0];
                    if (picked) handleSelectHelpSuggestion(picked);
                    return;
                  }
                  if (event.key === 'Escape') {
                    setIsHelpSuggestOpen(false);
                    setActiveHelpSuggestIndex(-1);
                  }
                }}
                className="w-full px-7 py-4 text-base text-gray-600 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (helpSuggestions.length) {
                    const picked = activeHelpSuggestIndex >= 0 ? helpSuggestions[activeHelpSuggestIndex] : helpSuggestions[0];
                    if (picked) handleSelectHelpSuggestion(picked);
                    return;
                  }
                  setIsHelpSuggestOpen(Boolean(helpQuery.trim().length));
                }}
                className="h-[56px] px-7 bg-[#0f8f77] text-white"
                aria-label="Tìm gợi ý dịch vụ"
              >
                <Search size={22} />
              </button>
            </div>

            {isHelpSuggestOpen && (helpSuggestions.length || helpQuery.trim().length) ? (
              <div className="absolute z-50 left-0 right-0 mt-3 rounded-2xl border border-gray-200 bg-white shadow-[0_24px_60px_rgba(3,15,12,0.18)] ring-1 ring-black/5 overflow-hidden">
                <div className="px-5 py-3 bg-white border-b border-gray-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-8 w-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#0f8f77]">
                      <Search size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#113a2b] truncate">Gợi ý dịch vụ</p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {helpQuery.trim().length ? `Từ khóa: “${helpQuery.trim()}”` : 'Gõ để tìm nhanh theo tên dịch vụ'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0f8f77] whitespace-nowrap">
                    {helpSuggestions.length ? `${helpSuggestions.length} kết quả` : '0 kết quả'}
                  </span>
                </div>

                {helpSuggestions.length ? (
                  <div className="max-h-[360px] overflow-auto">
                    {helpSuggestions.map((suggestion, index) => {
                      const isActive = index === activeHelpSuggestIndex;
                      return (
                        <button
                          key={suggestion.key}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            handleSelectHelpSuggestion(suggestion);
                          }}
                          onMouseEnter={() => setActiveHelpSuggestIndex(index)}
                          className={`w-full text-left transition-colors border-l-4 ${
                            isActive
                              ? 'bg-[#f2fffb] border-l-[#0f8f77]'
                              : 'bg-white hover:bg-[#f7faf8] border-l-transparent'
                          }`}
                        >
                          <div className="px-5 py-4 flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-black text-[#113a2b] truncate">{suggestion.title}</p>
                              <div className="mt-1 flex items-center gap-2 min-w-0">
                                <span className="inline-flex items-center rounded-full border border-[#0f8f77]/20 bg-[#f2fffb] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#0f8f77] truncate">
                                  {suggestion.categoryTitle}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{suggestion.description}</p>
                            </div>
                            <span className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-[#113a2b]">
                              Xem <ChevronRight size={16} className="text-[#0f8f77]" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-5 py-6">
                    <p className="text-sm font-semibold text-gray-600">Chưa tìm thấy dịch vụ phù hợp.</p>
                    <p className="mt-1 text-xs text-gray-500">Thử nhập từ khóa khác hoặc chọn dịch vụ ở phần bên dưới.</p>
                  </div>
                )}

                <div className="px-5 py-3 border-t border-gray-100 bg-white text-xs text-gray-500 flex items-center justify-between gap-3">
                  <span className="truncate">Enter để xem • ↑↓ để chọn • Esc để đóng</span>
                  <button
                    type="button"
                    className="font-bold text-[#0f8f77] hover:underline whitespace-nowrap"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      setIsHelpSuggestOpen(false);
                      setActiveHelpSuggestIndex(-1);
                    }}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div id="services" className="mt-10 grid grid-cols-4 sm:grid-cols-8 gap-x-3 gap-y-4 text-center">
            {HOME_CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;
              const accent = tab.accent || { text: 'text-[#0f8f77]', blob: 'bg-[#daf4ff]', underline: 'bg-[#0f8f77]' };
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex flex-col items-center gap-2 px-1 py-2 rounded-xl transition-colors ${isActive ? accent.text : 'text-gray-500 hover:text-[#0f8f77]'}`}
                >
                  <div className="relative h-12 w-12 flex items-center justify-center">
                    {isActive ? <span className={`absolute inset-0 rounded-[22px] rotate-6 scale-x-110 ${accent.blob}`}></span> : null}
                    <span className="relative z-10">
                      <Icon size={26} />
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <p className={`text-[13px] leading-tight transition-colors ${isActive ? 'font-extrabold' : 'font-semibold text-gray-600'}`}>{tab.label}</p>
                    <span className={`h-1 w-10 rounded-full transition-colors ${isActive ? accent.underline : 'bg-transparent'}`}></span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            {quickFilters.map((item) => (
              <Link
                key={item.id}
                to={`/service/${item.categoryId}/${item.id}`}
                className="rounded-full border border-[#223e31] px-5 py-2 text-sm font-semibold text-[#223e31] hover:bg-[#223e31] hover:text-white transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 mt-4">
        <div className="rounded-2xl bg-[#dff4ff] p-6 md:p-10">
          <div className="relative rounded-2xl overflow-hidden border border-white/70 bg-white shadow-[0_20px_50px_rgba(3,15,12,0.10)]">
            <div className="absolute inset-0">
              <img src={featured.image} alt={featured.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/15"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 md:p-10 items-center">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f8f77]">Danh mục</p>
                <h2 className="mt-2 text-4xl md:text-5xl font-black text-[#1c3d2d] leading-tight">{activeTab.label}</h2>
                <p className="mt-4 text-xl font-extrabold text-[#16362a]">{featured.title}</p>
                <p className="mt-3 text-gray-700 leading-relaxed">{featured.description}</p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/service/${featured.categoryId}/${featured.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0f8f77] px-5 py-3 text-white font-bold shadow-sm"
                  >
                    Xem chi tiết <ArrowRight size={18} />
                  </Link>

                  {featuredCount > 1 ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFeaturedIndex((value) => value - 1)}
                        className="h-11 w-11 rounded-xl border border-[#0f8f77]/20 bg-white/80 text-[#0f8f77] hover:bg-white"
                        aria-label="Xem dịch vụ trước"
                      >
                        <ChevronLeft className="mx-auto" size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeaturedIndex((value) => value + 1)}
                        className="h-11 w-11 rounded-xl border border-[#0f8f77]/20 bg-white/80 text-[#0f8f77] hover:bg-white"
                        aria-label="Xem dịch vụ tiếp theo"
                      >
                        <ChevronRight className="mx-auto" size={20} />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {featuredCount ? (
                <div
                  className="relative h-[240px] md:h-[320px] lg:h-[360px] select-none cursor-grab active:cursor-grabbing"
                  style={{ touchAction: 'pan-y' }}
                  onPointerDown={handleFeaturedPointerDown}
                  onPointerMove={handleFeaturedPointerMove}
                  onPointerUp={handleFeaturedPointerEnd}
                  onPointerCancel={handleFeaturedPointerEnd}
                >
                  {[-2, -1, 0, 1, 2].map((offset) => {
                    const index = ((featuredSafeIndex + offset) % featuredCount + featuredCount) % featuredCount;
                    const item = featuredItems[index];
                    const isActive = offset === 0;

                    const transformClass =
                      offset === 0
                        ? 'translate-x-0 scale-100 rotate-0 opacity-100 z-30'
                        : offset === 1
                          ? 'translate-x-[22%] md:translate-x-[28%] scale-[0.96] rotate-[2deg] opacity-90 z-20'
                          : offset === 2
                            ? 'translate-x-[42%] md:translate-x-[54%] scale-[0.92] rotate-[4deg] opacity-70 z-10'
                            : offset === -1
                              ? '-translate-x-[22%] md:-translate-x-[28%] scale-[0.96] -rotate-[2deg] opacity-90 z-20'
                              : '-translate-x-[42%] md:-translate-x-[54%] scale-[0.92] -rotate-[4deg] opacity-70 z-10';

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFeaturedIndex(index)}
                        className={`absolute left-1/2 top-1/2 w-[85%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${transformClass}`}
                        aria-label={`Xem ${item.title}`}
                      >
                        <div className={`overflow-hidden rounded-2xl border ${isActive ? 'border-white/80 shadow-[0_25px_70px_rgba(0,0,0,0.25)]' : 'border-white/60 shadow-[0_18px_50px_rgba(0,0,0,0.18)]'} bg-white`}>
                          <div className="relative">
                            <img src={item.image} alt={item.title} className="h-[180px] md:h-[220px] w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <p className="text-white font-extrabold text-lg line-clamp-1">{item.title}</p>
                              <p className="mt-1 text-white/90 text-sm line-clamp-1">{activeTab.label}</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-[#0c4d3b]">
          {activeStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-sm font-semibold">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <h3 className="text-3xl md:text-4xl font-black text-[#113a2b] mb-10">Tất cả dịch vụ mục {activeTab.label}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {projects.map((item) => {
            const price = getHomeServicePrice(item.pricing?.[0]?.price);

            return (
              <Link
                key={item.id}
                to={`/service/${item.categoryId}/${item.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_6px_16px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform"
              >
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
                <div className="p-5">
                  <h4 className="font-extrabold text-xl text-[#183d2f] line-clamp-1">{item.title}</h4>
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 font-semibold">{price.label}</p>
                    <p className="mt-1 text-base font-extrabold text-[#0f8f77] leading-tight">
                      {price.amount}
                      <span className="text-sm font-semibold text-gray-500">{price.unit}</span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h3 className="text-3xl md:text-4xl font-black text-[#113a2b] mb-12">Khách hàng nói gì về LAVIA</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {REVIEWS.map((review) => (
              <div key={review.name} className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="font-extrabold text-lg">{review.name}</p>
                  <div className="flex text-[#ffb937]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={18} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-base leading-relaxed text-[#213f31]">{review.text}</p>
                <p className="text-[#0f8f77] font-bold text-sm">{review.service}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center">
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f8f77] transition-colors">
              Tìm hiểu thêm về LAVIA <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h3 className="text-3xl md:text-4xl font-black text-[#123b2c] mb-10">
            Sự hài lòng của bạn, <span className="text-[#5c6cff]">được đảm bảo</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl md:text-2xl font-black mb-3">Cam kết hài lòng</h4>
              <p className="text-base text-[#274538]">Nếu bạn chưa hài lòng, đội ngũ sẽ làm lại đến khi đúng ý.</p>
              <div className="mt-4 flex items-center gap-2 text-[#0f8f77] font-bold text-sm">
                <ShieldCheck size={20} />
                <span>Cam kết hài lòng</span>
              </div>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-black mb-3">Cộng tác viên đã xác thực</h4>
              <p className="text-base text-[#274538]">Cộng tác viên đã xác thực, có kỹ năng, có đánh giá thực tế.</p>
            </div>
            <div>
              <h4 className="text-xl md:text-2xl font-black mb-3">Hỗ trợ chuyên trách</h4>
              <p className="text-base text-[#274538]">Hỗ trợ nhanh mỗi ngày để bạn luôn an tâm khi đặt dịch vụ.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffbe9] py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <img src="/images/categories/travel-cover.jpg" alt="Cách hoạt động" className="w-full h-[320px] md:h-[460px] object-cover" />
            <div className="absolute left-4 top-4 md:left-8 md:top-8 bg-white rounded-2xl p-6 md:p-8 max-w-sm">
              <h4 className="text-2xl md:text-3xl font-black text-[#143a2a] mb-6">Cách hoạt động</h4>
              <div className="space-y-5">
                <div className="flex items-start gap-4 text-[#1b3c2e]">
                  <span className="w-10 h-10 rounded-full bg-[#eef0ff] flex items-center justify-center font-black">1</span>
                  <p className="text-base md:text-lg font-semibold">Chọn dịch vụ theo nhu cầu và ngân sách.</p>
                </div>
                <div className="flex items-start gap-4 text-[#1b3c2e]">
                  <span className="w-10 h-10 rounded-full bg-[#fff9df] flex items-center justify-center font-black">2</span>
                  <p className="text-base md:text-lg font-semibold">Đặt lịch xử lý ngay trong hôm nay.</p>
                </div>
                <div className="flex items-start gap-4 text-[#1b3c2e]">
                  <span className="w-10 h-10 rounded-full bg-[#e9ffef] flex items-center justify-center font-black">3</span>
                  <p className="text-base md:text-lg font-semibold">Theo dõi tiến độ, thanh toán và nhận kết quả.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <a
        href="https://zalo.me/0899660847"
        target="_blank"
        rel="noreferrer"
        className="fixed left-4 bottom-5 z-40 bg-[#0f8f77] text-white rounded-full px-5 py-3 shadow-lg inline-flex items-center gap-2 text-sm font-bold"
      >
        <Headset size={16} />
        Hỗ trợ
      </a>
    </main>
  );
};

import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import LegalPage from './pages/LegalPage';
import SitemapPage from './pages/SitemapPage';

// ... (existing imports)

const Footer = () => {
  const footerServiceLabels: Record<string, string> = {
    legal: 'Pháp lý',
    travel: 'Di trú & Du lịch',
    'real-estate': 'Bất động sản',
    family: 'Chăm sóc Gia đình',
    business: 'Giải pháp Doanh nghiệp',
    'design-creative': 'Thiết kế',
    'writing-publishing': 'Soạn thảo',
  };
  const footerServiceTabs = HOME_CATEGORY_TABS.filter((tab) => tab.categoryId);
  return (
    <footer className="relative overflow-hidden bg-white text-lavia-blue border-t border-gray-200 pt-16 pb-8">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-10 w-72 h-72 rounded-full bg-gradient-to-br from-[#60a5fa]/25 to-[#22c55e]/18 blur-2xl" />
        <div className="absolute -right-28 bottom-6 w-80 h-80 rounded-full bg-gradient-to-br from-[#0ea5e9]/20 to-[#14b8a6]/18 blur-2xl" />
        <div className="absolute left-[56%] top-[54%] w-40 h-40 rounded-full border-[6px] border-[#60a5fa]/16" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">HỆ SINH THÁI LAVIA</h4>
            <div className="flex flex-col space-y-3 text-sm text-gray-600">
              <span className="flex items-center gap-2"><Globe size={16}/> Việt Nam</span>
              <a href="tel:0899660847" className="hover:text-lavia-mint transition-colors flex items-center gap-2"><Phone size={16}/> 0899 660 847</a>
              <a href="mailto:lavia.ecosystem@gmail.com" className="hover:text-lavia-mint transition-colors flex items-center gap-2"><Mail size={16}/> lavia.ecosystem@gmail.com</a>
              <a href="https://www.facebook.com/lavia.ecosystem" target="_blank" rel="noreferrer" className="hover:text-lavia-mint transition-colors flex items-center gap-2"><Facebook size={16}/> Lavia - Giải pháp Trợ Giúp Đa Ngành</a>
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Dịch vụ</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              {footerServiceTabs.map((tab) => (
                <li key={tab.id}>
                  <Link
                    to={`/category/${tab.categoryId}`}
                    className="hover:text-lavia-mint transition-colors"
                  >
                    {footerServiceLabels[tab.categoryId as string] || tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Công ty</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-lavia-mint transition-colors">Về LAVIA</Link></li>
              <li><Link to="/careers" className="hover:text-lavia-mint transition-colors">Tuyển dụng</Link></li>
              <li><Link to="/legal" className="hover:text-lavia-mint transition-colors">Pháp lý & Quyền riêng tư</Link></li>
              <li><Link to="/sitemap" className="hover:text-lavia-mint transition-colors">Sitemap</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Đăng ký nhận tin</h4>
            <p className="text-xs text-gray-500 mb-4">
              Cập nhật những thông tin mới nhất về dịch vụ và ưu đãi từ LAVIA.
            </p>
            <div className="flex border-b border-gray-300 pb-2">
              <input 
                type="email" 
                placeholder="Địa chỉ Email" 
                className="bg-transparent border-none outline-none text-lavia-blue w-full placeholder-gray-400 text-sm"
              />
              <button className="text-xs font-bold uppercase tracking-widest hover:text-lavia-mint transition-colors">
                Gửi
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.28em] text-[#e9edf3] select-none">LAVIA</h1>
        </div>
        <div className="text-center mt-4 text-[10px] text-gray-400 uppercase tracking-wider">
          © {new Date().getFullYear()} LAVIA. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
};

import AdminLayout from './components/admin/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import BookingsPage from './pages/admin/BookingsPage';
import ServicesPage from './pages/admin/ServicesPage';
import CustomersPage from './pages/admin/CustomersPage';
import SettingsPage from './pages/admin/SettingsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-white font-sans selection:bg-lavia-mint selection:text-lavia-blue">
            <HomePage />
            <Footer />
          </div>
        } />
        <Route path="/service/:categoryId/:serviceId" element={
          <div className="min-h-screen bg-white font-sans selection:bg-lavia-mint selection:text-lavia-blue">
            <ServiceDetail />
            <Footer />
          </div>
        } />
        <Route path="/category/:categoryId" element={
          <div className="min-h-screen bg-white font-sans selection:bg-lavia-mint selection:text-lavia-blue">
            <CategoryDetail />
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="min-h-screen bg-white font-sans selection:bg-lavia-mint selection:text-lavia-blue">
            <AboutPage />
            <Footer />
          </div>
        } />
        <Route path="/careers" element={
          <div className="min-h-screen bg-white font-sans selection:bg-lavia-mint selection:text-lavia-blue">
            <CareersPage />
            <Footer />
          </div>
        } />
        <Route path="/legal" element={
          <div className="min-h-screen bg-white font-sans selection:bg-lavia-mint selection:text-lavia-blue">
            <LegalPage />
            <Footer />
          </div>
        } />
        <Route path="/sitemap" element={
          <div className="min-h-screen bg-white font-sans selection:bg-lavia-mint selection:text-lavia-blue">
            <SitemapPage />
            <Footer />
          </div>
        } />

        <Route path="/admin" element={<AdminLayout><DashboardHome /></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><BookingsPage /></AdminLayout>} />
        <Route path="/admin/services" element={<AdminLayout><ServicesPage /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><CustomersPage /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
        <Route path="/admin/*" element={<AdminLayout><div className="p-8 text-center text-gray-500">Chức năng đang phát triển</div></AdminLayout>} />
      </Routes>
    </Router>
  );
}
