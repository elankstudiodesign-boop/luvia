import React from 'react';

const UtilityBar = () => {
  return (
    <div className="bg-lavia-light text-xs py-2 px-6 flex justify-between items-center border-b border-gray-200 hidden md:flex">
      <div className="flex gap-6 text-gray-600">
        <span className="cursor-pointer hover:text-lavia-blue">Giao hàng tại: Việt Nam</span>
        <span className="cursor-pointer hover:text-lavia-blue">Tiếng Việt</span>
      </div>
      <div className="flex gap-6 text-gray-600">
        <span className="cursor-pointer hover:text-lavia-blue">Bản tin</span>
        <span className="cursor-pointer hover:text-lavia-blue">Liên hệ</span>
        <span className="cursor-pointer hover:text-lavia-blue">Tuyển dụng</span>
      </div>
    </div>
  );
};

export default UtilityBar;
