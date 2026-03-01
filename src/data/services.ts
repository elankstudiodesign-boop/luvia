import { 
  Plane, Home, Heart, Briefcase, Scale
} from 'lucide-react';

export interface PricingPackage {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface ServiceProcess {
  step: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  detailedDescription?: string;
  features?: string[];
  process?: ServiceProcess[];
  pricing?: PricingPackage[];
  formUrl?: string; // Optional URL for data collection form (Typeform/Tally)
}

export interface ServiceCategory {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  image: string;
  layout: 'full' | 'split' | 'grid';
  items: ServiceItem[];
}

export const categories: ServiceCategory[] = [
  {
    id: 'travel',
    title: 'Dịch vụ Di trú & Di chuyển',
    shortTitle: 'DI TRÚ',
    subtitle: 'TRỢ LÝ DU LỊCH TẬN TÂM',
    description: 'Đội ngũ trợ lý nữ chu đáo hỗ trợ chuẩn bị hồ sơ, đặt vé và sắp xếp lịch trình tỉ mỉ cho từng chuyến đi.',
    image: 'https://picsum.photos/seed/travel_lv/1920/1080',
    layout: 'full',
    items: [
      { 
        id: 'visa-passport',
        title: 'Lý lịch tư pháp & Visa', 
        description: 'Chúng tôi giúp bạn điền tờ khai online chính xác, sắp xếp hồ sơ gọn gàng và thay bạn xếp hàng nộp hồ sơ tại cơ quan nhà nước.', 
        image: 'https://picsum.photos/seed/passport/800/600',
        detailedDescription: 'Dịch vụ trợ lý hồ sơ hành chính tận tâm. Chúng tôi thay bạn thực hiện các công việc tỉ mỉ như điền tờ khai, sắp xếp giấy tờ và kiên nhẫn xếp hàng nộp hồ sơ tại cơ quan nhà nước, giúp bạn tiết kiệm thời gian quý báu.',
        features: [
          'Hỗ trợ điền tờ khai trực tuyến cẩn thận, chính xác',
          'Sắp xếp hồ sơ ngăn nắp, đầy đủ theo hướng dẫn',
          'Thay bạn xếp hàng nộp hồ sơ và nhận kết quả',
          'Giao nhận hồ sơ tận nơi chu đáo'
        ],
        process: [
          { step: '01', title: 'Tư vấn & Tiếp nhận', description: 'Tiếp nhận yêu cầu, tư vấn loại giấy tờ phù hợp và báo giá chi tiết.' },
          { step: '02', title: 'Chuẩn bị hồ sơ', description: 'Thu thập thông tin, điền tờ khai và chuẩn bị bộ hồ sơ hoàn chỉnh.' },
          { step: '03', title: 'Nộp hồ sơ', description: 'Đại diện khách hàng nộp hồ sơ tại cơ quan có thẩm quyền.' },
          { step: '04', title: 'Bàn giao kết quả', description: 'Nhận kết quả và bàn giao tận tay khách hàng.' }
        ],
        pricing: [
          {
            name: 'Cơ bản',
            price: '500.000 VNĐ',
            description: 'Hỗ trợ điền form và hướng dẫn chuẩn bị hồ sơ.',
            features: ['Tư vấn quy trình', 'Điền tờ khai online', 'Hướng dẫn sắp xếp hồ sơ']
          },
          {
            name: 'Tiêu chuẩn',
            price: '1.500.000 VNĐ',
            description: 'Trọn gói nộp và nhận kết quả (khu vực nội thành).',
            features: ['Tư vấn & Điền form', 'Đại diện nộp hồ sơ', 'Nhận kết quả tại nhà', 'Theo dõi tiến độ'],
            recommended: true
          },
          {
            name: 'Hỏa tốc',
            price: '2.500.000 VNĐ',
            description: 'Xử lý hồ sơ ưu tiên và giao nhận nhanh.',
            features: ['Xử lý hồ sơ trong 24h', 'Giao nhận tận nơi', 'Hỗ trợ 24/7', 'Đại diện nộp hồ sơ']
          }
        ]
      },
      {
        id: 'global-booking',
        title: 'Vé máy bay & Khách sạn',
        description: 'Tìm kiếm vé máy bay giá tốt nhất và đặt phòng khách sạn phù hợp ngân sách, giúp bạn có chuyến đi tiết kiệm và thoải mái.',
        image: 'https://picsum.photos/seed/flight_hotel/800/600',
        detailedDescription: 'Dịch vụ đặt vé máy bay và phòng khách sạn trọn gói trên toàn thế giới. Chúng tôi kết nối trực tiếp với các hãng hàng không và hệ thống khách sạn toàn cầu để mang đến cho bạn mức giá cạnh tranh nhất. Dù là chuyến công tác gấp hay kỳ nghỉ dưỡng trong mơ, chúng tôi đều có phương án tối ưu cho bạn.',
        features: [
          'Đại lý cấp 1 của Vietnam Airlines, Vietjet, Bamboo và các hãng quốc tế',
          'Hệ thống đặt phòng 1 triệu+ khách sạn, resort, căn hộ toàn cầu',
          'Hỗ trợ xử lý sự cố bay, đổi vé, mua thêm hành lý 24/7',
          'Xuất hóa đơn đỏ (VAT) nhanh chóng cho khách doanh nghiệp'
        ],
        process: [
          { step: '01', title: 'Tiếp nhận', description: 'Khách hàng cung cấp điểm đến, ngày đi/về và số lượng người.' },
          { step: '02', title: 'Báo giá', description: 'Chúng tôi so sánh giá và gửi 3 phương án tốt nhất (Rẻ nhất - Bay đẹp nhất - Tiện nhất).' },
          { step: '03', title: 'Thanh toán', description: 'Khách hàng chốt phương án và thanh toán chuyển khoản.' },
          { step: '04', title: 'Xuất vé', description: 'Gửi vé điện tử và mã đặt phòng qua Zalo/Email ngay lập tức.' }
        ],
        pricing: [
            {
                name: 'Vé máy bay Lẻ',
                price: '50.000 VNĐ/vé',
                description: 'Phí dịch vụ xuất vé và hỗ trợ thay đổi lịch trình.',
                features: ['Săn vé giá rẻ nhất', 'Hỗ trợ check-in online', 'Xử lý mua thêm hành lý', 'Hỗ trợ đổi ngày/giờ bay']
            },
            {
                name: 'Combo Du lịch',
                price: 'Miễn phí DV',
                description: 'Đặt trọn gói Vé máy bay + Khách sạn.',
                features: ['Giá rẻ hơn đặt lẻ 10-20%', 'Tư vấn lịch trình ăn chơi', 'Hỗ trợ xe đưa đón sân bay', 'Nâng hạng phòng (nếu có)'],
                recommended: true
            },
            {
                name: 'Khách Doanh nghiệp',
                price: 'Hợp đồng',
                description: 'Dành cho công ty đi công tác hoặc du lịch hè.',
                features: ['Xuất hóa đơn VAT nhanh', 'Công nợ theo tháng', 'Nhân viên hỗ trợ 1-1', 'Ưu đãi đoàn đông']
            }
        ]
      },
      { 
        id: 'consular',
        title: 'Hợp pháp hóa lãnh sự', 
        description: 'Nhận hồ sơ tận nhà, mang đi dịch thuật công chứng và đại diện nộp lên Cục Lãnh sự, giúp bạn không phải đi lại nhiều lần.', 
        image: 'https://picsum.photos/seed/consular/800/600',
        detailedDescription: 'Chúng tôi đóng vai trò là người kết nối và chạy việc giúp bạn. Thay vì tự mình tìm kiếm đơn vị dịch thuật và xếp hàng tại Cục Lãnh sự, chúng tôi sẽ thay bạn mang hồ sơ đi dịch thuật tại các văn phòng uy tín và đại diện nộp hồ sơ hợp pháp hóa.',
        features: [
          'Kết nối với các văn phòng dịch thuật công chứng uy tín',
          'Thay bạn đi lại, vận chuyển hồ sơ an toàn',
          'Đại diện xếp hàng nộp hồ sơ tại Cục Lãnh sự',
          'Theo dõi và nhận kết quả bàn giao tận tay'
        ],
        process: [
            { step: '01', title: 'Gửi hồ sơ', description: 'Khách hàng gửi bản scan hoặc ảnh chụp giấy tờ cần xử lý.' },
            { step: '02', title: 'Dịch thuật & Công chứng', description: 'Tiến hành dịch thuật và công chứng tại văn phòng công chứng.' },
            { step: '03', title: 'Hợp pháp hóa', description: 'Nộp hồ sơ lên Cục Lãnh sự để dán tem hợp pháp hóa.' },
            { step: '04', title: 'Trả kết quả', description: 'Gửi trả hồ sơ gốc và bản dịch đã hợp pháp hóa cho khách.' }
        ],
        pricing: [
            {
                name: 'Dịch thuật',
                price: '150.000 VNĐ/trang',
                description: 'Dịch thuật và công chứng tư pháp.',
                features: ['Dịch thuật chuẩn', 'Dấu công chứng', 'Bản mềm PDF']
            },
            {
                name: 'Trọn gói Lãnh sự',
                price: '1.200.000 VNĐ/bộ',
                description: 'Bao gồm dịch thuật, công chứng và tem Cục Lãnh sự.',
                features: ['Dịch thuật & Công chứng', 'Nộp Cục Lãnh sự', 'Phí nhà nước', 'Giao nhận tận nơi'],
                recommended: true
            }
        ]
      },
      { 
        id: 'license',
        title: 'Đổi bằng lái xe (IAA/VN)', 
        description: 'Hướng dẫn thủ tục đổi bằng lái xe quốc tế/nước ngoài sang Việt Nam và ngược lại, hỗ trợ nộp hồ sơ online nhanh chóng.', 
        image: 'https://picsum.photos/seed/license/800/600',
        detailedDescription: 'Hỗ trợ các thủ tục hành chính liên quan đến giấy phép lái xe. Với sự tỉ mỉ và cẩn thận, chúng tôi giúp bạn chuẩn bị hồ sơ, dịch thuật và nộp đơn đề nghị đổi bằng lái một cách chính xác, giúp bạn không phải lo lắng về các thủ tục phức tạp.',
        features: [
          'Hướng dẫn chuẩn bị hồ sơ đơn giản, dễ hiểu',
          'Hỗ trợ nộp hồ sơ online (với bằng quốc tế IAA)',
          'Đồng hành hỗ trợ thủ tục chụp ảnh tại Sở GTVT',
          'Giao nhận kết quả tận nhà tiện lợi'
        ],
        process: [
          { step: '01', title: 'Gửi ảnh hồ sơ', description: 'Chụp ảnh 2 mặt bằng lái, hộ chiếu/CCCD và ảnh chân dung gửi qua Zalo/Email.' },
          { step: '02', title: 'Xử lý & Dịch thuật', description: 'Tiến hành dịch thuật, công chứng và làm đơn đề nghị đổi giấy phép lái xe.' },
          { step: '03', title: 'Đăng ký cấp đổi', description: 'Nộp hồ sơ lên hệ thống IAA (Mỹ) hoặc Sở GTVT (Việt Nam).' },
          { step: '04', title: 'Giao bằng tận tay', description: 'Nhận bằng lái mới và bàn giao tận nhà cho khách hàng.' }
        ],
        pricing: [
            {
                name: 'Đổi bằng Quốc tế IAA',
                price: '1.800.000 VNĐ',
                description: 'Hạn 20 năm, sử dụng tại 196 quốc gia.',
                features: ['Thủ tục online 100%', 'Bằng lái thẻ nhựa', 'Sổ hướng dẫn', 'Giao hàng toàn quốc'],
                recommended: true
            },
            {
                name: 'Đổi bằng VN cho người nước ngoài',
                price: '2.500.000 VNĐ',
                description: 'Trọn gói thủ tục tại Sở GTVT.',
                features: ['Dịch thuật bằng lái', 'Chuẩn bị hồ sơ', 'Dẫn đi chụp ảnh', 'Lấy bằng tại nhà']
            }
        ]
      },
      { 
        id: 'fast-track',
        title: 'Fast-track Sân bay', 
        description: 'Hỗ trợ đặt dịch vụ đón tiễn VIP tại sân bay, giúp bạn làm thủ tục xuất nhập cảnh nhanh chóng mà không cần xếp hàng chờ đợi.', 
        image: 'https://picsum.photos/seed/fasttrack/800/600',
        detailedDescription: 'Dịch vụ đón tiễn ưu tiên tại sân bay (Fast-track) giúp khách hàng bỏ qua nỗi lo xếp hàng chờ đợi. Nhân viên của chúng tôi sẽ đón bạn ngay tại ống lồng/cửa máy bay, hỗ trợ làm thủ tục xuất nhập cảnh và lấy hành lý nhanh nhất.',
        features: [
          'Đón khách ngay tại cửa máy bay',
          'Lối đi riêng VIP, không cần xếp hàng',
          'Hỗ trợ mang vác hành lý',
          'Xe đưa đón riêng từ máy bay vào nhà ga (VIP)'
        ],
        process: [
          { step: '01', title: 'Đặt lịch', description: 'Cung cấp thông tin chuyến bay và danh sách khách đoàn trước 24h.' },
          { step: '02', title: 'Đón khách', description: 'Nhân viên cầm bảng tên đón khách ngay tại cửa ống lồng hoặc vị trí hẹn.' },
          { step: '03', title: 'Thủ tục ưu tiên', description: 'Dẫn khách qua lối đi ưu tiên làm thủ tục xuất nhập cảnh và an ninh.' },
          { step: '04', title: 'Hỗ trợ hành lý', description: 'Hỗ trợ lấy hành lý nhanh chóng và tiễn khách ra xe.' }
        ],
        pricing: [
            {
                name: 'Đón/Tiễn Phổ thông',
                price: '800.000 VNĐ/khách',
                description: 'Hỗ trợ thủ tục nhanh tại quầy và cửa an ninh.',
                features: ['Nhân viên đón tại cửa', 'Lối đi ưu tiên', 'Hỗ trợ hành lý']
            },
            {
                name: 'VIP Fast-track',
                price: '1.500.000 VNĐ/khách',
                description: 'Xe đưa đón tận máy bay và thủ tục riêng biệt.',
                features: ['Xe riêng tại sân đỗ', 'Lối đi VIP riêng', 'Hỗ trợ hành lý', 'Phòng chờ thương gia'],
                recommended: true
            }
        ]
      },
      { 
        id: 'travel-portal',
        title: 'Hồ sơ du lịch cá nhân', 
        description: 'Tạo trang web cá nhân lưu trữ toàn bộ vé máy bay, booking khách sạn và lịch trình, giúp bạn tra cứu dễ dàng ngay cả khi không có mạng.', 
        image: 'https://picsum.photos/seed/travel_portal/800/600',
        detailedDescription: 'Sổ tay du lịch kỹ thuật số "All-in-one" dành cho người hay di chuyển. Chúng tôi số hóa và sắp xếp vé máy bay, booking khách sạn, bảo hiểm và lịch trình vào một đường link bảo mật duy nhất, giúp bạn truy cập mọi lúc mọi nơi ngay cả khi không có internet.',
        features: [
          'Truy cập vé và lịch trình Offline không cần mạng',
          'Tự động đồng bộ múi giờ và nhắc nhở chuyến bay',
          'Lưu trữ bảo mật Passport và giấy tờ tùy thân',
          'Chia sẻ lịch trình dễ dàng cho người thân'
        ],
        pricing: [
            {
                name: 'Gói Chuyến đi',
                price: '300.000 VNĐ/trip',
                description: 'Số hóa toàn bộ giấy tờ cho 1 chuyến đi.',
                features: ['Lưu trữ vé & Booking', 'Lịch trình thông minh', 'Truy cập Offline', 'QR Code check-in']
            }
        ]
      },
      { 
        id: 'agency-web',
        title: 'Quản lý Đại lý vé (B2B)', 
        description: 'Cung cấp hệ thống quản lý khách hàng và vé máy bay đơn giản, giúp các đại lý vé nhỏ lẻ chăm sóc khách hàng chuyên nghiệp hơn.', 
        image: 'https://picsum.photos/seed/agency_web/800/600',
        detailedDescription: 'Giải pháp chuyển đổi số "đo ni đóng giày" cho các đại lý vé máy bay và du lịch vừa và nhỏ. Hệ thống giúp bạn quản lý danh sách khách hàng, tự động hóa quy trình nhắc lịch bay, xuất hóa đơn và theo dõi công nợ một cách chuyên nghiệp.',
        features: [
          'CRM quản lý thông tin khách hàng trọn đời',
          'Tự động gửi tin nhắn nhắc lịch bay qua Zalo',
          'Quản lý công nợ và báo cáo doanh thu thực tế',
          'Giao diện đơn giản, không cần am hiểu công nghệ'
        ],
        pricing: [
            {
                name: 'Khởi nghiệp',
                price: '5.000.000 VNĐ',
                description: 'Thiết lập hệ thống quản lý cơ bản.',
                features: ['Quản lý khách hàng', 'Lưu trữ vé', 'Nhắc lịch bay tự động', 'Báo cáo doanh thu']
            }
        ]
      },
      { 
        id: 'car-check',
        title: 'Đăng kiểm & Quản lý xe', 
        description: 'Nhắc lịch đăng kiểm, bảo hiểm xe và hỗ trợ đặt lịch hẹn đăng kiểm online, giúp bạn tránh bị phạt nguội và tiết kiệm thời gian chờ.', 
        image: 'https://picsum.photos/seed/car_check/800/600',
        detailedDescription: 'Giải pháp hỗ trợ chủ xe bận rộn trong việc đăng kiểm và quản lý giấy tờ xe. Chúng tôi giúp bạn chuẩn bị hồ sơ, đặt lịch hẹn trước để giảm thiểu thời gian chờ đợi, và nhắc nhở các mốc thời gian quan trọng như hạn đăng kiểm, hạn bảo hiểm.',
        features: [
          'Soạn thảo và rà soát hồ sơ đăng kiểm chuẩn xác',
          'Đặt lịch hẹn ưu tiên, không lo xếp hàng lâu',
          'Theo dõi và nhắc hạn đăng kiểm, bảo hiểm, phí đường bộ',
          'Hỗ trợ nộp phạt nguội nhanh chóng'
        ],
        pricing: [
            {
                name: 'Hỗ trợ Đăng kiểm',
                price: '500.000 VNĐ/lần',
                description: 'Hỗ trợ thủ tục và hồ sơ đăng kiểm chuẩn xác.',
                features: ['Soạn hồ sơ đăng kiểm', 'Đặt lịch hẹn trước', 'Giao hồ sơ tận nhà', 'Lái xe hộ: Đang nâng cấp']
            }
        ]
      }
    ]
  },
  {
    id: 'property',
    title: 'Tiện ích Lưu trú & Bất động sản',
    shortTitle: 'BẤT ĐỘNG SẢN',
    subtitle: 'QUẢN GIA TẬN TỤY',
    description: 'Đội ngũ quản gia nữ tỉ mỉ giúp bạn chăm sóc nhà cửa và hỗ trợ cư dân chu đáo.',
    image: 'https://picsum.photos/seed/architecture_lv/1200/1600',
    layout: 'split',
    items: [
      { 
        id: 'residence',
        title: 'Đăng ký Tạm trú / Tạm vắng', 
        description: 'Soạn thảo sẵn các mẫu đơn cư trú và thay mặt bạn đến cơ quan công an để nộp hồ sơ đúng quy định.', 
        image: 'https://picsum.photos/seed/residence/800/600',
        detailedDescription: 'Trợ lý hành chính giúp bạn hoàn thành nghĩa vụ khai báo cư trú. Chúng tôi hỗ trợ chuẩn bị các mẫu đơn, sắp xếp hồ sơ gọn gàng và thay mặt bạn đến cơ quan công an để nộp hồ sơ, giúp bạn tránh những phiền toái không đáng có.',
        features: [
          'Hướng dẫn chuẩn bị giấy tờ đơn giản',
          'Soạn thảo sẵn các mẫu đơn CT01, CT02...',
          'Thay bạn đi lại làm việc với cơ quan chức năng',
          'Bàn giao kết quả tận nơi'
        ],
        process: [
          { step: '01', title: 'Tiếp nhận thông tin', description: 'Khách hàng cung cấp ảnh chụp CCCD và Hợp đồng thuê nhà.' },
          { step: '02', title: 'Soạn hồ sơ', description: 'Chúng tôi điền tờ khai và chuẩn bị bộ hồ sơ đầy đủ theo quy định.' },
          { step: '03', title: 'Nộp hồ sơ', description: 'Nộp hồ sơ qua cổng Dịch vụ công hoặc trực tiếp tại Công an phường.' },
          { step: '04', title: 'Trả kết quả', description: 'Thông báo kết quả đã được cập nhật trên hệ thống VNeID.' }
        ],
        pricing: [
            {
                name: 'Dịch vụ Online',
                price: '300.000 VNĐ',
                description: 'Hỗ trợ khai báo qua cổng dịch vụ công.',
                features: ['Tạo tài khoản DVC', 'Khai báo thông tin', 'Theo dõi kết quả']
            },
            {
                name: 'Trọn gói',
                price: '800.000 VNĐ',
                description: 'Đại diện làm việc trực tiếp với CSKV.',
                features: ['Chuẩn bị hồ sơ', 'Làm việc với CSKV', 'Nhận kết quả', 'Giao tận nơi'],
                recommended: true
            }
        ]
      },
      { 
        id: 'room-hunt',
        title: 'Tìm trọ theo yêu cầu', 
        description: 'Lắng nghe nhu cầu của bạn để tìm kiếm phòng trọ/căn hộ ưng ý nhất và trực tiếp dẫn bạn đi xem, giúp bạn sớm an cư lạc nghiệp.', 
        image: 'https://picsum.photos/seed/room_hunt/800/600',
        detailedDescription: 'Dịch vụ tìm nhà trọ, căn hộ dịch vụ theo yêu cầu riêng biệt. Thay vì mất hàng giờ lướt web ảo, chúng tôi lọc ra những căn phòng "thực" phù hợp nhất với ngân sách và tiêu chí của bạn, sau đó dẫn đi xem trực tiếp.',
        features: [
          'Kho dữ liệu 5000+ phòng xác thực',
          'Lọc phòng theo 10+ tiêu chí (Ban công, Thang máy...)',
          'Dẫn đi xem phòng miễn phí (Xe máy/Hỗ trợ đặt xe)',
          'Hỗ trợ đàm phán giá và check hợp đồng'
        ],
        process: [
          { step: '01', title: 'Nhận yêu cầu', description: 'Ghi nhận chi tiết nhu cầu: Khu vực, ngân sách, tiện ích mong muốn.' },
          { step: '02', title: 'Sàng lọc', description: 'Hệ thống và nhân viên lọc ra 3-5 căn tốt nhất phù hợp tiêu chí.' },
          { step: '03', title: 'Xem thực tế', description: 'Sắp xếp lịch và đưa khách đi xem phòng trực tiếp.' },
          { step: '04', title: 'Chốt & Ký', description: 'Hỗ trợ thương lượng giá, rà soát hợp đồng và bàn giao phòng.' }
        ],
        pricing: [
            {
                name: 'Phí môi giới',
                price: '50% tháng đầu',
                description: 'Chỉ thu phí khi khách chốt thuê phòng.',
                features: ['Lọc phòng theo yêu cầu', 'Dẫn đi xem thực tế', 'Hỗ trợ thương lượng', 'Soạn hợp đồng']
            }
        ]
      },
      { 
        id: 'moving',
        title: 'Chuyển trọ rảnh tay', 
        description: 'Hỗ trợ đóng gói đồ đạc cẩn thận và liên hệ xe ba gác/xe tải giúp bạn, để việc chuyển nhà không còn là nỗi ám ảnh.', 
        image: 'https://picsum.photos/seed/moving/800/600',
        detailedDescription: 'Dịch vụ chuyển nhà trọn gói "Rảnh tay" - Bạn chỉ cần giám sát, mọi việc nặng nhọc đã có chúng tôi lo. Từ tháo dỡ, đóng gói, vận chuyển đến lắp đặt lại tại nhà mới, tất cả đều được thực hiện chuyên nghiệp.',
        features: [
          'Miễn phí thùng carton, băng keo, màng PE',
          'Thợ tháo lắp giường tủ, máy lạnh chuyên nghiệp',
          'Bảo hiểm hàng hóa 100% giá trị',
          'Không phát sinh chi phí sau báo giá'
        ],
        process: [
          { step: '01', title: 'Khảo sát & Báo giá', description: 'Khảo sát lượng đồ đạc (qua ảnh/video hoặc trực tiếp) và báo giá trọn gói.' },
          { step: '02', title: 'Đóng gói', description: 'Nhân viên đến đóng gói đồ đạc, bọc lót cẩn thận đồ dễ vỡ.' },
          { step: '03', title: 'Vận chuyển', description: 'Bốc xếp và hỗ trợ điều phối xe vận chuyển an toàn.' },
          { step: '04', title: 'Lắp đặt', description: 'Lắp ráp lại giường tủ, kê đặt vào vị trí theo yêu cầu.' }
        ],
        pricing: [
            {
                name: 'Gói Tiết kiệm',
                price: 'Từ 400.000 VNĐ',
                description: 'Hỗ trợ đóng gói và bốc xếp (Khách tự gọi xe).',
                features: ['Nhân viên đóng gói', 'Thùng carton miễn phí', 'Hỗ trợ bốc xếp']
            },
            {
                name: 'Trọn gói (Coming Soon)',
                price: 'Liên hệ',
                description: 'Dịch vụ xe tải chuyên dụng đang được nâng cấp.',
                features: ['Xe tải (Đang cập nhật)', 'Đóng gói & Bốc xếp', 'Tháo lắp giường tủ', 'Bảo hiểm trọn gói'],
                recommended: true
            }
        ]
      },
      { 
        id: 'cleaning',
        title: 'Vệ sinh & Dọn dẹp', 
        description: 'Cung cấp dịch vụ dọn dẹp nhà cửa, vệ sinh máy lạnh sạch sẽ, gọn gàng, mang lại không gian sống trong lành cho gia đình bạn.', 
        image: 'https://picsum.photos/seed/cleaning/800/600',
        detailedDescription: 'Dịch vụ vệ sinh công nghiệp và dọn dẹp nhà cửa chuyên sâu. Chúng tôi sử dụng máy móc hiện đại và hóa chất chuyên dụng an toàn để làm sạch mọi ngóc ngách, trả lại không gian sống trong lành cho bạn.',
        features: [
          'Máy hút bụi công nghiệp, máy chà sàn',
          'Hóa chất tẩy rửa chuyên dụng, an toàn',
          'Nhân viên được đào tạo bài bản, lý lịch rõ ràng',
          'Nghiệm thu sạch sẽ mới thu tiền'
        ],
        process: [
          { step: '01', title: 'Đặt lịch', description: 'Khách hàng đặt lịch qua App/Web, chọn gói dịch vụ và thời gian.' },
          { step: '02', title: 'Chuẩn bị', description: 'Nhân viên đến đúng giờ với đầy đủ dụng cụ và hóa chất.' },
          { step: '03', title: 'Thực hiện', description: 'Tiến hành vệ sinh theo quy trình từ trên xuống dưới, từ trong ra ngoài.' },
          { step: '04', title: 'Nghiệm thu', description: 'Khách hàng kiểm tra chất lượng vệ sinh và thanh toán.' }
        ],
        pricing: [
            {
                name: 'Theo giờ',
                price: '80.000 VNĐ/giờ',
                description: 'Dọn dẹp cơ bản, tối thiểu 3 giờ.',
                features: ['Lau chùi sàn nhà', 'Vệ sinh toilet', 'Sắp xếp đồ đạc']
            },
            {
                name: 'Tổng vệ sinh',
                price: '15.000 VNĐ/m2',
                description: 'Vệ sinh công nghiệp sau xây dựng hoặc chuyển nhà.',
                features: ['Máy hút bụi công nghiệp', 'Tẩy rửa chuyên dụng', 'Lau kính', 'Vệ sinh nội thất'],
                recommended: true
            }
        ]
      },
      { 
        id: 'property-mgmt',
        title: 'Quản lý thay mặt chủ nhà', 
        description: 'Thay bạn quản lý phòng trọ: thu tiền nhà, ghi điện nước và giải quyết các vấn đề vặt, giúp bạn thảnh thơi tận hưởng cuộc sống.', 
        image: 'https://picsum.photos/seed/property_mgmt/800/600',
        detailedDescription: 'Dịch vụ Quản gia cao cấp dành cho chủ nhà bận rộn hoặc ở xa. Chúng tôi thay mặt bạn xử lý mọi vấn đề phát sinh tại căn hộ cho thuê: từ việc thu tiền nhà, chốt điện nước đến việc xử lý các sự cố hư hỏng nhỏ, giúp dòng tiền của bạn luôn ổn định.',
        features: [
          'Đại diện thu tiền nhà và nhắc nợ khéo léo',
          'Tiếp nhận và xử lý khiếu nại của khách thuê 24/7',
          'Ghi chỉ số điện nước và tính toán chính xác',
          'Giám sát bảo trì và sửa chữa hư hỏng vặt'
        ],
        pricing: [
            {
                name: 'Phí quản lý',
                price: '10% doanh thu',
                description: 'Quản lý vận hành toàn diện.',
                features: ['Tìm kiếm khách thuê', 'Thu tiền hàng tháng', 'Bảo trì sửa chữa', 'Báo cáo tài chính']
            }
        ]
      },
      { 
        id: 'mini-erp-house',
        title: 'App Quản lý Phòng trọ', 
        description: 'Ứng dụng tính tiền trọ và gửi hóa đơn Zalo tự động, giúp chủ nhà quản lý dễ dàng, minh bạch và không lo sai sót.', 
        image: 'https://picsum.photos/seed/mini_erp_house/800/600',
        detailedDescription: 'Ứng dụng quản lý nhà trọ thông minh trên nền tảng Web/Mobile. Thay thế hoàn toàn sổ sách giấy tờ, giúp chủ nhà tính toán tiền phòng, điện nước chỉ với 1 cú click và gửi hóa đơn tự động qua Zalo cho khách thuê.',
        features: [
          'Tính tiền tự động, không lo sai sót',
          'Gửi hóa đơn và nhắc nợ tự động qua Zalo',
          'Quản lý hợp đồng và thông tin khách thuê',
          'Báo cáo lãi lỗ hàng tháng rõ ràng'
        ],
        pricing: [
            {
                name: 'Gói Cơ bản',
                price: '99.000 VNĐ/tháng',
                description: 'Dành cho chủ nhà dưới 20 phòng.',
                features: ['Quản lý phòng & khách', 'Tính tiền điện nước', 'Xuất hóa đơn', 'Gửi Zalo tự động']
            }
        ]
      },
      { 
        id: 'landing-rent',
        title: 'Landing Page Cho thuê', 
        description: 'Thiết kế website giới thiệu căn hộ với hình ảnh đẹp và tour 360 độ, giúp khách thuê ấn tượng và chốt phòng nhanh hơn.', 
        image: 'https://picsum.photos/seed/landing_rent/800/600',
        detailedDescription: 'Nâng tầm hình ảnh căn hộ của bạn với một website giới thiệu chuyên nghiệp. Tích hợp hình ảnh 360 độ, video tour và thông tin chi tiết, giúp khách thuê hình dung rõ ràng không gian sống và ra quyết định đặt cọc nhanh chóng hơn.',
        features: [
          'Giao diện sang trọng, tôn vinh vẻ đẹp căn hộ',
          'Tích hợp xem phòng 360 độ thực tế ảo',
          'Nút kêu gọi hành động (Đặt lịch/Đặt cọc) nổi bật',
          'Tối ưu hiển thị trên mọi thiết bị di động'
        ],
        pricing: [
            {
                name: 'Thiết kế Web',
                price: '3.000.000 VNĐ',
                description: 'Trang giới thiệu căn hộ chuyên nghiệp.',
                features: ['Giao diện sang trọng', 'Tích hợp hình ảnh 360', 'Form đặt lịch xem', 'Tối ưu SEO']
            }
        ]
      },
      { 
        id: 'resident-service',
        title: 'Tiện ích cư dân', 
        description: 'Thay bạn làm việc với Ban quản lý tòa nhà: đăng ký thẻ cư dân, đăng ký thi công, chuyển đồ... nhanh gọn và đúng quy định.', 
        image: 'https://picsum.photos/seed/resident_service/800/600',
        detailedDescription: 'Trợ lý hành chính cá nhân cho cư dân chung cư. Chúng tôi thay bạn thực hiện các thủ tục hành chính rườm rà với Ban quản lý tòa nhà như đăng ký thẻ cư dân, đăng ký thi công, chuyển đồ, giúp bạn tiết kiệm thời gian quý báu.',
        features: [
          'Soạn thảo và chuẩn bị hồ sơ đúng quy định BQL',
          'Đại diện nộp hồ sơ và làm việc với BQL',
          'Theo dõi tiến độ và nhận kết quả bàn giao tận tay',
          'Tư vấn quy định thi công và nội quy tòa nhà'
        ],
        pricing: [
            {
                name: 'Phí dịch vụ',
                price: '200.000 VNĐ/lần',
                description: 'Hỗ trợ thực hiện các thủ tục hành chính chung cư.',
                features: ['Đăng ký thẻ cư dân', 'Đăng ký thi công', 'Giám sát thợ thầu']
            }
        ]
      }
    ]
  },
  {
    id: 'family',
    title: 'Quản trị Gia đình & Cá nhân',
    shortTitle: 'GIA ĐÌNH',
    subtitle: 'NGƯỜI BẠN ĐỒNG HÀNH',
    description: 'Sự chăm sóc ân cần từ những người phụ nữ của gia đình, giúp bạn an tâm công tác.',
    image: 'https://picsum.photos/seed/family_lv/1600/900',
    layout: 'grid',
    items: [
      { 
        id: 'insurance',
        title: 'Hồ sơ BHXH & Thai sản', 
        description: 'Hỗ trợ mẹ bỉm sữa làm hồ sơ thai sản, BHXH: điền đơn, nộp hồ sơ và nhận tiền trợ cấp giúp bạn, không cần lo thủ tục.', 
        image: 'https://picsum.photos/seed/insurance/800/800',
        detailedDescription: 'Dịch vụ hỗ trợ nộp hồ sơ BHXH dành cho các mẹ bỉm sữa bận rộn. Chúng tôi giúp bạn điền các mẫu đơn phức tạp, sắp xếp hồ sơ và thay bạn đến cơ quan BHXH để nộp và nhận kết quả, giúp bạn có thêm thời gian nghỉ ngơi.',
        features: [
          'Hỗ trợ điền mẫu đơn chính xác',
          'Sắp xếp hồ sơ gọn gàng, đầy đủ',
          'Thay bạn xếp hàng nộp hồ sơ',
          'Nhận kết quả và giao tận nhà'
        ],
        pricing: [
            {
                name: 'Dịch vụ nộp hộ',
                price: '500.000 VNĐ',
                description: 'Hỗ trợ nộp hồ sơ và nhận kết quả BHXH.',
                features: ['Rà soát hồ sơ', 'Nộp tại cơ quan BHXH', 'Theo dõi kết quả', 'Giao tận nhà']
            }
        ]
      },
      { 
        id: 'tax',
        title: 'Nộp thuế nhà đất', 
        description: 'Nhận ủy quyền thay bạn đi nộp thuế nhà đất, thuế phi nông nghiệp tại kho bạc, giúp bạn không phải xin nghỉ làm để đi xếp hàng.', 
        image: 'https://picsum.photos/seed/tax/800/800',
        detailedDescription: 'Giải pháp nộp thuế nhà đất và thuế phi nông nghiệp "không chờ đợi". Bạn chỉ cần ủy quyền, chúng tôi sẽ thay bạn đến kho bạc hoặc ngân hàng để thực hiện nghĩa vụ thuế, đảm bảo đúng hạn và lưu trữ biên lai cẩn thận.',
        features: [
          'Không cần xếp hàng tại Kho bạc/Ngân hàng',
          'Đảm bảo nộp thuế đúng hạn, tránh phạt chậm nộp',
          'Lưu trữ và số hóa biên lai thuế giúp dễ dàng tra cứu',
          'Bảo mật thông tin tài sản tuyệt đối'
        ],
        pricing: [
            {
                name: 'Phí dịch vụ',
                price: '300.000 VNĐ/lần',
                description: 'Đại diện đi đóng thuế tại kho bạc/ngân hàng.',
                features: ['Nhận thông báo thuế', 'Đi đóng tiền', 'Gửi lại biên lai', 'Lưu trữ hồ sơ']
            }
        ]
      },
      { 
        id: 'land-cert',
        title: 'Sang tên Sổ đỏ', 
        description: 'Thay bạn đi sớm lấy số thứ tự, nộp hồ sơ sang tên sổ đỏ và đi đóng thuế, giúp bạn tiết kiệm thời gian chờ đợi mệt mỏi.', 
        image: 'https://picsum.photos/seed/land_cert/800/800',
        detailedDescription: 'Trợ lý hành chính hỗ trợ các thủ tục nộp hồ sơ nhà đất. Chúng tôi không tư vấn pháp lý chuyên sâu mà tập trung vào việc hỗ trợ bạn đi lại, lấy số thứ tự, nộp hồ sơ và đóng thuế theo hướng dẫn của cơ quan chức năng, giúp bạn đỡ vất vả.',
        features: [
          'Hỗ trợ đi sớm lấy số thứ tự ưu tiên',
          'Thay bạn xếp hàng nộp hồ sơ tại bộ phận một cửa',
          'Đi đóng thuế hộ tại ngân hàng/kho bạc',
          'Nhận kết quả và bàn giao tận tay'
        ],
        process: [
          { step: '01', title: 'Kiểm tra pháp lý', description: 'Kiểm tra sổ đỏ thật/giả, tình trạng tranh chấp và quy hoạch.' },
          { step: '02', title: 'Công chứng', description: 'Hỗ trợ các bên ký kết hợp đồng tại Văn phòng công chứng.' },
          { step: '03', title: 'Kê khai nghĩa vụ', description: 'Kê khai thuế thu nhập cá nhân và lệ phí trước bạ.' },
          { step: '04', title: 'Đăng bộ & Nhận sổ', description: 'Nộp hồ sơ đăng ký biến động và nhận sổ mới về cho khách.' }
        ],
        pricing: [
            {
                name: 'Tư vấn & Sắp xếp',
                price: '1.000.000 VNĐ',
                description: 'Chuẩn bị hồ sơ chuẩn chỉnh để khách tự đi nộp.',
                features: ['Kiểm tra pháp lý', 'Soạn thảo hợp đồng', 'Sắp xếp hồ sơ', 'Hướng dẫn nộp']
            },
            {
                name: 'Trọn gói Sang tên',
                price: '5.000.000 VNĐ',
                description: 'Đại diện thực hiện toàn bộ quy trình sang tên.',
                features: ['Công chứng hợp đồng', 'Kê khai thuế', 'Nộp hồ sơ sang tên', 'Nhận sổ mới'],
                recommended: true
            }
        ]
      },
      { 
        id: 'elderly-care',
        title: 'Chăm sóc người già từ xa', 
        description: 'Thay bạn ghé thăm, trò chuyện và đưa bố mẹ đi khám bệnh định kỳ, giúp người già vui vẻ và con cái yên tâm công tác xa.', 
        image: 'https://picsum.photos/seed/elderly_care/800/800',
        detailedDescription: 'Người bạn đồng hành tin cậy chăm sóc cha mẹ già khi bạn ở xa. Chúng tôi không chỉ hỗ trợ mua sắm nhu yếu phẩm mà còn đóng vai trò như một người con, người cháu: trò chuyện, đưa đi dạo và đồng hành cùng các cụ trong các buổi khám bệnh định kỳ.',
        features: [
          'Nhân viên được đào tạo kỹ năng chăm sóc người cao tuổi',
          'Đồng hành đi khám bệnh, hỗ trợ làm thủ tục y tế',
          'Mua sắm và sơ chế thực phẩm theo chế độ dinh dưỡng',
          'Cập nhật tình hình sức khỏe và hình ảnh cho con cái'
        ],
        pricing: [
            {
                name: 'Gói Thăm hỏi',
                price: '2.000.000 VNĐ/tháng',
                description: 'Thăm hỏi và hỗ trợ nhu cầu cơ bản hàng tuần.',
                features: ['4 lần thăm/tháng', 'Mua sắm nhu yếu phẩm', 'Trò chuyện bầu bạn', 'Báo cáo tình hình']
            }
        ]
      },
      { 
        id: 'family-tree',
        title: 'Gia phả Điện tử', 
        description: 'Thiết kế website gia phả dòng họ hiện đại, lưu giữ hình ảnh và tiểu sử tổ tiên để con cháu đời sau luôn ghi nhớ cội nguồn.', 
        image: 'https://picsum.photos/seed/family_tree/800/800',
        detailedDescription: 'Lưu giữ cội nguồn gia đình với website Gia phả dòng họ hiện đại. Kết hợp giữa truyền thống và công nghệ, chúng tôi giúp bạn xây dựng cây gia phả tương tác, lưu trữ tiểu sử, hình ảnh và video của từng thành viên, để con cháu đời sau luôn nhớ về tổ tiên.',
        features: [
          'Cây gia phả trực quan, dễ dàng cập nhật thành viên mới',
          'Lưu trữ không giới hạn hình ảnh, video tư liệu dòng họ',
          'Phân quyền truy cập bảo mật cho từng chi, từng nhánh',
          'Thông báo ngày giỗ, ngày họp mặt dòng họ tự động'
        ],
        pricing: [
            {
                name: 'Thiết kế Gia phả',
                price: '5.000.000 VNĐ',
                description: 'Xây dựng website gia phả dòng họ.',
                features: ['Cây gia phả tương tác', 'Lưu trữ tiểu sử', 'Thư viện ảnh/video', 'Bảo mật riêng tư']
            }
        ]
      },
      { 
        id: 'asset-vault',
        title: 'Két sắt tài sản số', 
        description: 'Hệ thống két sắt số bảo mật giúp bạn thống kê và lưu trữ thông tin tài sản, giấy tờ quan trọng của gia đình một cách an toàn.', 
        image: 'https://picsum.photos/seed/asset_vault/800/800',
        detailedDescription: 'Két sắt số bảo mật tuyệt đối dành cho tài sản gia đình. Nơi lưu trữ và thống kê toàn bộ thông tin về bất động sản, sổ tiết kiệm, hợp đồng bảo hiểm... giúp bạn quản lý tài sản tập trung và có kế hoạch thừa kế rõ ràng.',
        features: [
          'Mã hóa dữ liệu chuẩn quân sự, bảo mật 2 lớp',
          'Thống kê tổng tài sản và phân loại danh mục rõ ràng',
          'Tính năng "Di chúc số": Chỉ định người thừa kế khi cần',
          'Truy cập mọi lúc mọi nơi, ngay cả khi mất giấy tờ gốc'
        ],
        pricing: [
            {
                name: 'Phí duy trì',
                price: '500.000 VNĐ/năm',
                description: 'Hệ thống lưu trữ bảo mật cao.',
                features: ['Mã hóa dữ liệu', 'Truy cập 2 lớp', 'Phân quyền thừa kế', 'Backup định kỳ']
            }
        ]
      },
      { 
        id: 'medical-assistant',
        title: 'Trợ lý Y tế & Khám bệnh', 
        description: 'Hỗ trợ lấy số thứ tự khám bệnh từ sáng sớm và hướng dẫn quy trình khám, giúp bạn giảm bớt mệt mỏi khi đi bệnh viện.', 
        image: 'https://picsum.photos/seed/medical_assistant/800/800',
        detailedDescription: 'Trợ lý y tế cá nhân giúp việc khám chữa bệnh trở nên nhẹ nhàng hơn. Chúng tôi hỗ trợ lấy số thứ tự khám bệnh từ sáng sớm, mua sổ khám bệnh và hướng dẫn quy trình, giúp bạn tiết kiệm hàng giờ đồng hồ chờ đợi mệt mỏi tại bệnh viện.',
        features: [
          'Lấy số khám bệnh sớm nhất, không cần dậy sớm xếp hàng',
          'Tư vấn quy trình khám tại các bệnh viện lớn',
          'Hỗ trợ mua sổ, đóng viện phí (nếu yêu cầu)',
          'Quản lý lịch sử khám bệnh và đơn thuốc online'
        ],
        pricing: [
            {
                name: 'Lấy số khám bệnh',
                price: '200.000 VNĐ/lần',
                description: 'Xếp hàng lấy số sớm tại các bệnh viện lớn.',
                features: ['Lấy số thứ tự', 'Hướng dẫn quy trình', 'Mua sổ khám bệnh']
            }
        ]
      },
      { 
        id: 'shopper',
        title: 'Mua sắm & Giao quà', 
        description: 'Tư vấn và tìm mua quà tặng, đồ hiệu theo yêu cầu, đóng gói đẹp mắt và giao tận tay người nhận, giúp bạn trao gửi yêu thương.', 
        image: 'https://picsum.photos/seed/shopper/800/800',
        detailedDescription: 'Dịch vụ mua sắm cá nhân (Personal Shopper) chuyên nghiệp. Dù là món quà sinh nhật ý nghĩa hay món đồ hiệu khó tìm, chúng tôi sẽ thay bạn tìm kiếm, mua hàng chính hãng, đóng gói sang trọng và trao tận tay người nhận với thông điệp yêu thương.',
        features: [
          'Tìm kiếm sản phẩm theo yêu cầu (kể cả hàng hiếm)',
          'Tư vấn quà tặng phù hợp với đối tượng và ngân sách',
          'Đóng gói quà tặng nghệ thuật và viết thiệp tay',
          'Giao hàng bất ngờ tạo niềm vui cho người nhận'
        ],
        pricing: [
            {
                name: 'Phí mua hộ',
                price: '10% giá trị',
                description: 'Tối thiểu 100.000 VNĐ/đơn.',
                features: ['Tìm kiếm sản phẩm', 'Mua hàng chính hãng', 'Đóng gói quà tặng', 'Giao tận tay']
            }
        ]
      },
      { 
        id: 'memories',
        title: 'Số hóa Kỷ niệm', 
        description: 'Phục hồi ảnh cũ và biên tập thành video câu chuyện gia đình, giúp lưu giữ những khoảnh khắc quý giá không bị phai mờ theo thời gian.', 
        image: 'https://picsum.photos/seed/memories/800/800',
        detailedDescription: 'Phục dựng và lưu giữ những ký ức vô giá của gia đình. Chúng tôi số hóa những bức ảnh cũ ố vàng, phục hồi màu sắc và biên tập lại thành những câu chuyện, video clip cảm động để lưu giữ mãi mãi trên không gian số.',
        features: [
          'Công nghệ AI phục hồi ảnh cũ sắc nét',
          'Biên tập video câu chuyện gia đình chuyên nghiệp',
          'Lưu trữ trên Cloud riêng tư, không lo thất lạc',
          'In ấn thành sách ảnh (Photobook) cao cấp'
        ],
        pricing: [
            {
                name: 'Gói Kỷ niệm',
                price: '3.000.000 VNĐ',
                description: 'Số hóa và phục hồi ảnh cũ.',
                features: ['Scan 100 ảnh chất lượng cao', 'Phục hồi ảnh hư hỏng', 'Tạo album online', 'Video trình chiếu']
            }
        ]
      }
    ]
  },
  {
    id: 'business',
    title: 'Giải pháp Doanh nghiệp & Số hóa',
    shortTitle: 'DOANH NGHIỆP',
    subtitle: 'TRỢ LÝ ẢO ĐA NĂNG',
    description: 'Đội ngũ trợ lý ảo hỗ trợ các công việc hành chính văn phòng, giúp doanh nghiệp vận hành trơn tru.',
    image: 'https://picsum.photos/seed/business_lv/1920/1080',
    layout: 'full',
    items: [
      { 
        id: 'qr-menu',
        title: 'Menu QR Code', 
        description: 'Tạo menu điện tử quét mã QR cho quán, khách tự gọi món trên điện thoại giúp giảm tải cho nhân viên và không lo in lại menu.', 
        image: 'https://picsum.photos/seed/qr_menu/800/600',
        formUrl: 'https://tally.so/r/w7XjK9', // Example form URL
        detailedDescription: 'Giải pháp Menu điện tử thông minh cho quán Cafe, Nhà hàng. Khách hàng chỉ cần quét mã QR tại bàn để xem thực đơn và gọi món, giúp giảm tải cho nhân viên phục vụ và mang lại trải nghiệm hiện đại, chuyên nghiệp.',
        features: [
          'Menu hình ảnh trực quan, kích thích vị giác',
          'Cập nhật món và giá tức thì, không cần in lại',
          'Khách tự gọi món, giảm sai sót order',
          'Tiết kiệm chi phí in ấn menu giấy'
        ],
        pricing: [
            {
                name: 'Gói Khởi tạo',
                price: '1.500.000 VNĐ',
                description: 'Thiết lập menu điện tử trọn gói.',
                features: ['Thiết kế giao diện', 'Nhập liệu món ăn', 'Tạo mã QR để bàn', 'Hướng dẫn sử dụng']
            }
        ]
      },
      { 
        id: 'landing-sales',
        title: 'Landing Page Bán hàng', 
        description: 'Thiết kế trang web bán hàng đơn giản hoặc thiệp cưới online đẹp mắt, dễ dàng chia sẻ qua Zalo/Facebook để mời khách.', 
        image: 'https://picsum.photos/seed/landing_sales/800/600',
        detailedDescription: 'Website bán hàng và giới thiệu sản phẩm tinh gọn, hiệu quả. Phù hợp cho các shop online, mẹ bỉm sữa kinh doanh muốn có một "cửa hàng online" chuyên nghiệp để tăng uy tín và tỷ lệ chốt đơn mà không tốn quá nhiều chi phí.',
        features: [
          'Giao diện đẹp mắt, tối ưu cho điện thoại',
          'Tích hợp nút "Mua ngay" liên kết về Zalo/Messenger',
          'Hiển thị thông tin sản phẩm và feedback khách hàng',
          'Dễ dàng chia sẻ link trên mạng xã hội'
        ],
        pricing: [
            {
                name: 'Web Thiệp cưới',
                price: '500.000 VNĐ',
                description: 'Thiệp cưới online sang trọng.',
                features: ['Giao diện đẹp', 'Album ảnh cưới', 'Bản đồ tiệc cưới', 'Lời chúc mừng']
            },
            {
                name: 'Web Bán hàng',
                price: '2.000.000 VNĐ',
                description: 'Trang bán hàng đơn giản, chốt đơn nhanh.',
                features: ['Giới thiệu sản phẩm', 'Nút mua hàng', 'Liên kết Zalo/Mess', 'Tối ưu mobile']
            }
        ]
      },
      { 
        id: 'google-maps',
        title: 'Google Maps Business', 
        description: 'Đưa cửa hàng của bạn lên bản đồ Google, xác minh chính chủ và chụp ảnh đẹp để khách hàng dễ dàng tìm thấy và tin tưởng.', 
        image: 'https://picsum.photos/seed/google_maps/800/600',
        detailedDescription: 'Đưa thương hiệu của bạn lên bản đồ Google Maps một cách chuyên nghiệp. Chúng tôi giúp xác minh địa điểm, tối ưu hóa thông tin và hình ảnh, giúp khách hàng dễ dàng tìm thấy cửa hàng của bạn khi tìm kiếm trên Google.',
        features: [
          'Xác minh chủ sở hữu địa điểm (Tick xanh)',
          'Tối ưu từ khóa để lên Top tìm kiếm khu vực',
          'Đăng tải hình ảnh không gian và sản phẩm đẹp mắt',
          'Tăng độ uy tín và lượt khách ghé thăm thực tế'
        ],
        pricing: [
            {
                name: 'Xác minh Map',
                price: '1.000.000 VNĐ',
                description: 'Đưa doanh nghiệp lên Google Maps.',
                features: ['Xác minh chính chủ', 'Cập nhật thông tin', 'Đăng tải hình ảnh', 'Tối ưu từ khóa']
            }
        ]
      },
      { 
        id: 'mini-erp',
        title: 'Mini-ERP cho Shop', 
        description: 'Cài đặt ứng dụng quản lý kho và thu chi trên điện thoại, giúp chủ shop nhỏ kiểm soát hàng hóa và tiền nong dễ dàng.', 
        image: 'https://picsum.photos/seed/mini_erp/800/600',
        detailedDescription: 'Phần mềm quản lý bán hàng "bỏ túi" dành cho chủ shop nhỏ. Quản lý kho hàng, theo dõi thu chi, công nợ và đơn hàng mọi lúc mọi nơi ngay trên chiếc điện thoại của bạn, giúp việc kinh doanh trở nên nhẹ nhàng và kiểm soát tốt hơn.',
        features: [
          'Quản lý tồn kho chính xác theo thời gian thực',
          'Theo dõi doanh thu, lãi lỗ hàng ngày',
          'Quản lý công nợ khách hàng và nhà cung cấp',
          'Quét mã vạch sản phẩm bằng camera điện thoại'
        ],
        pricing: [
            {
                name: 'Triển khai',
                price: '3.000.000 VNĐ',
                description: 'Cài đặt và hướng dẫn sử dụng phần mềm.',
                features: ['Cài đặt hệ thống', 'Thiết lập danh mục', 'Đào tạo nhân viên', 'Hỗ trợ 1 tháng']
            }
        ]
      },
      { 
        id: 'loyalty',
        title: 'Loyalty Web', 
        description: 'Tạo thẻ thành viên tích điểm online qua số điện thoại, giúp giữ chân khách quen mà không cần in thẻ cứng tốn kém.', 
        image: 'https://picsum.photos/seed/loyalty/800/600',
        detailedDescription: 'Hệ thống chăm sóc khách hàng thân thiết thời đại 4.0. Tích điểm, đổi quà và gửi ưu đãi cho khách hàng qua Zalo/QR Code mà không cần phát hành thẻ cứng hay yêu cầu khách tải App phức tạp.',
        features: [
          'Tích điểm tự động theo số điện thoại',
          'Gửi tin nhắn chúc mừng sinh nhật, khuyến mãi',
          'Phân hạng thành viên (Bạc, Vàng, Kim Cương)',
          'Giữ chân khách hàng cũ hiệu quả'
        ],
        pricing: [
            {
                name: 'Gói Thành viên',
                price: '5.000.000 VNĐ',
                description: 'Hệ thống CSKH thân thiết.',
                features: ['Tích điểm đổi quà', 'Quản lý thành viên', 'Gửi tin nhắn ưu đãi', 'Báo cáo khách hàng']
            }
        ]
      },
      { 
        id: 'freelancer-admin',
        title: 'Admin cho Freelancer', 
        description: 'Trợ lý ảo giúp freelancer soạn hợp đồng, nhắc khách thanh toán đúng hạn và ghi chép thu chi rõ ràng.', 
        image: 'https://picsum.photos/seed/freelancer_admin/800/600',
        detailedDescription: 'Trợ lý ảo hành chính dành riêng cho Freelancer và người làm tự do. Chúng tôi giúp bạn xử lý các công việc "không tên" nhưng tốn thời gian như soạn hợp đồng, nhắc nợ khách hàng, theo dõi thu chi cá nhân, để bạn tập trung hoàn toàn vào chuyên môn.',
        features: [
          'Soạn thảo hợp đồng dịch vụ chặt chẽ',
          'Nhắc lịch thanh toán cho khách hàng một cách tinh tế',
          'Theo dõi dòng tiền và xuất báo cáo thu nhập',
          'Lưu trữ hồ sơ dự án khoa học'
        ],
        pricing: [
            {
                name: 'Trợ lý ảo',
                price: '1.000.000 VNĐ/tháng',
                description: 'Hỗ trợ các công việc hành chính.',
                features: ['Soạn thảo hợp đồng', 'Nhắc lịch thanh toán', 'Theo dõi công nợ', 'Báo cáo tài chính']
            }
        ]
      }
    ]
  },
  {
    id: 'legal',
    title: 'Thủ tục Hành chính & Pháp lý',
    shortTitle: 'PHÁP LÝ',
    subtitle: 'HỖ TRỢ HÀNH CHÍNH',
    description: 'Dịch vụ hỗ trợ thực hiện các thủ tục hành chính, giấy tờ với sự tận tâm và bảo mật.',
    image: 'https://picsum.photos/seed/legal_lv/1200/1600',
    layout: 'split',
    items: [
      { 
        id: 'business-license',
        title: 'Giấy phép kinh doanh', 
        description: 'Chuẩn bị bộ hồ sơ đăng ký kinh doanh hộ cá thể, điền sẵn thông tin và thay bạn đi nộp để sớm có giấy phép hoạt động.', 
        image: 'https://picsum.photos/seed/business_license/800/600',
        detailedDescription: 'Hỗ trợ nộp hồ sơ đăng ký kinh doanh cho hộ cá thể và doanh nghiệp nhỏ. Chúng tôi giúp bạn chuẩn bị bộ hồ sơ theo mẫu có sẵn, điền thông tin và thay mặt nộp tại cơ quan đăng ký kinh doanh, giúp bạn khởi đầu thuận lợi.',
        features: [
          'Cung cấp biểu mẫu đăng ký chuẩn',
          'Hỗ trợ điền thông tin vào hồ sơ',
          'Thay bạn đi nộp hồ sơ và nhận kết quả',
          'Hỗ trợ các thủ tục khắc dấu (qua đối tác)'
        ],
        process: [
          { step: '01', title: 'Tư vấn', description: 'Tư vấn loại hình doanh nghiệp và các thông tin cần thiết.' },
          { step: '02', title: 'Soạn & Ký hồ sơ', description: 'Soạn thảo hồ sơ và gửi khách hàng ký (hoặc ký số).' },
          { step: '03', title: 'Nộp hồ sơ', description: 'Nộp hồ sơ lên Sở Kế hoạch & Đầu tư.' },
          { step: '04', title: 'Bàn giao', description: 'Bàn giao Giấy phép kinh doanh và Con dấu tại nhà.' }
        ],
        pricing: [
            {
                name: 'Hộ kinh doanh',
                price: '1.500.000 VNĐ',
                description: 'Đăng ký kinh doanh hộ cá thể.',
                features: ['Soạn hồ sơ', 'Nộp tại UBND Quận', 'Nhận giấy phép', 'Đăng ký mã số thuế']
            },
            {
                name: 'Thành lập Công ty',
                price: '4.500.000 VNĐ',
                description: 'Thành lập công ty TNHH/Cổ phần.',
                features: ['Giấy phép kinh doanh', 'Con dấu tròn', 'Công bố mẫu dấu', 'Khai thuế ban đầu'],
                recommended: true
            }
        ]
      },
      { 
        id: 'legal-draft',
        title: 'Soạn thảo đơn từ', 
        description: 'Đánh máy và soạn thảo các loại đơn từ, văn bản hành chính theo mẫu chuẩn, trình bày đẹp và rõ ràng nội dung bạn mong muốn.', 
        image: 'https://picsum.photos/seed/legal_draft/800/600',
        detailedDescription: 'Dịch vụ hỗ trợ đánh máy và soạn thảo văn bản hành chính theo mẫu. Nếu bạn không rành vi tính hoặc không biết trình bày văn bản, chúng tôi sẽ giúp bạn soạn thảo các lá đơn, công văn dựa trên nội dung bạn cung cấp một cách chỉn chu nhất.',
        features: [
          'Đánh máy văn bản nhanh, chuẩn chính tả',
          'Trình bày văn bản đẹp, đúng thể thức hành chính',
          'Tìm kiếm các mẫu đơn từ phổ biến giúp bạn',
          'In ấn và đóng quyển hồ sơ đẹp mắt'
        ],
        pricing: [
            {
                name: 'Soạn đơn',
                price: '500.000 VNĐ/văn bản',
                description: 'Soạn thảo các loại đơn từ hành chính.',
                features: ['Tư vấn nội dung', 'Soạn thảo đúng luật', 'Hướng dẫn gửi đơn']
            }
        ]
      },
      { 
        id: 'verification',
        title: 'Chuyển phát & Xác minh', 
        description: 'Thay bạn đến tận nơi để gửi đơn từ, chụp ảnh hiện trạng nhà đất hoặc xác minh địa chỉ thực tế một cách khách quan.', 
        image: 'https://picsum.photos/seed/verification/800/600',
        detailedDescription: 'Dịch vụ xác minh thực địa và thu thập thông tin theo yêu cầu. Chúng tôi thay bạn đến tận nơi để kiểm tra hiện trạng nhà đất, xác minh địa chỉ, hoặc thu thập các bằng chứng hình ảnh/video cần thiết một cách khách quan và bảo mật.',
        features: [
          'Nhân viên đến tận nơi xác minh nhanh chóng',
          'Cung cấp hình ảnh, video, ghi âm thực tế',
          'Báo cáo trung thực, khách quan',
          'Giữ bí mật tuyệt đối về nhiệm vụ'
        ],
        pricing: [
            {
                name: 'Phí thực hiện',
                price: '1.000.000 VNĐ/lần',
                description: 'Xác minh thực địa theo yêu cầu.',
                features: ['Đến tận nơi', 'Chụp ảnh/Quay phim', 'Ghi âm (nếu cần)', 'Báo cáo chi tiết']
            }
        ]
      },
      { 
        id: 'school-admin',
        title: 'Hồ sơ nhập học hộ', 
        description: 'Đại diện phụ huynh đến trường nộp hồ sơ nhập học, rút học bạ hoặc đóng học phí, giúp cha mẹ yên tâm làm việc.', 
        image: 'https://picsum.photos/seed/school_admin/800/600',
        detailedDescription: 'Hỗ trợ phụ huynh bận rộn trong các thủ tục nhập học và hành chính tại trường. Chúng tôi đại diện nộp hồ sơ, đóng học phí, rút học bạ hoặc xác minh văn bằng, giúp bạn tiết kiệm thời gian đi lại trong giờ hành chính.',
        features: [
          'Rà soát hồ sơ nhập học đầy đủ, đúng hạn',
          'Đại diện làm việc với phòng đào tạo/ban giám hiệu',
          'Đóng học phí và các khoản thu hộ',
          'Gửi biên nhận và kết quả về tận nhà'
        ],
        pricing: [
            {
                name: 'Phí dịch vụ',
                price: '500.000 VNĐ/hồ sơ',
                description: 'Đại diện nộp hồ sơ nhập học.',
                features: ['Kiểm tra hồ sơ', 'Nộp tại trường', 'Đóng học phí hộ', 'Gửi biên nhận']
            }
        ]
      },
      { 
        id: 'school-track',
        title: 'Lộ trình chuyển trường', 
        description: 'Lên danh sách các giấy tờ cần thiết để chuyển trường và nhắc lịch nộp hồ sơ, đảm bảo con bạn nhập học đúng hạn.', 
        image: 'https://picsum.photos/seed/school_track/800/600',
        detailedDescription: 'Người bạn đồng hành trong hành trình chuyển trường cho con. Chúng tôi xây dựng lộ trình chi tiết, lên danh sách hồ sơ cần thiết và theo dõi sát sao tiến độ xử lý, đảm bảo việc chuyển trường diễn ra suôn sẻ và đúng quy định.',
        features: [
          'Lên checklist hồ sơ chuyển trường chi tiết',
          'Tìm kiếm trường học phù hợp với nhu cầu',
          'Theo dõi deadline nộp hồ sơ và nhập học',
          'Tư vấn giải quyết các vướng mắc hồ sơ'
        ],
        pricing: [
            {
                name: 'Tư vấn lộ trình',
                price: '2.000.000 VNĐ',
                description: 'Lên kế hoạch chuyển trường chi tiết.',
                features: ['Đánh giá hồ sơ', 'Tìm trường phù hợp', 'Lên checklist giấy tờ', 'Theo dõi deadline']
            }
        ]
      },
      { 
        id: 'vehicle-paper',
        title: 'Hồ sơ Sang tên xe', 
        description: 'Hướng dẫn chuẩn bị hồ sơ sang tên xe và hỗ trợ nộp thuế, giúp bạn hoàn tất thủ tục pháp lý mà không cần lo lắng về giấy tờ phức tạp.', 
        image: 'https://picsum.photos/seed/vehicle_paper/800/600',
        detailedDescription: 'Dịch vụ hỗ trợ thủ tục giấy tờ sang tên đổi chủ phương tiện (Ô tô, Xe máy). Chúng tôi hướng dẫn bạn chuẩn bị hồ sơ, soạn thảo hợp đồng mua bán và hỗ trợ nộp thuế trước bạ, giúp quá trình sang tên diễn ra thuận lợi.',
        features: [
          'Soạn thảo hợp đồng mua bán xe chuẩn pháp lý',
          'Hướng dẫn thủ tục cà số khung, số máy',
          'Hỗ trợ kê khai và nộp thuế trước bạ online',
          'Tư vấn quy trình rút hồ sơ gốc (nếu cần)'
        ],
        process: [
          { step: '01', title: 'Chuẩn bị hồ sơ', description: 'Hướng dẫn khách hàng chuẩn bị giấy tờ và cà số khung số máy.' },
          { step: '02', title: 'Soạn thảo', description: 'Soạn thảo hợp đồng mua bán và các tờ khai thuế, đăng ký xe chuẩn xác.' },
          { step: '03', title: 'Nộp thuế Online', description: 'Hỗ trợ kê khai và nộp thuế trước bạ qua cổng Dịch vụ công Quốc gia.' },
          { step: '04', title: 'Hoàn tất', description: 'Hướng dẫn khách hàng nộp hồ sơ tại cơ quan công an để bấm biển.' }
        ],
        pricing: [
            {
                name: 'Gói Hồ sơ Xe máy',
                price: '500.000 VNĐ',
                description: 'Soạn thảo trọn bộ hồ sơ sang tên.',
                features: ['Hợp đồng mua bán', 'Tờ khai sang tên', 'Kê khai thuế Online', 'Hướng dẫn nộp']
            },
            {
                name: 'Gói Hồ sơ Ô tô',
                price: '1.000.000 VNĐ',
                description: 'Soạn thảo và hỗ trợ thủ tục thuế.',
                features: ['Hợp đồng công chứng', 'Tờ khai đăng ký', 'Nộp thuế trước bạ', 'Tư vấn quy trình'],
                recommended: true
            }
        ]
      }
    ]
  }
];
