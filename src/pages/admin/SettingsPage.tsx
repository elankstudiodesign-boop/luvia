import React, { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

const SettingsPage = () => {
  const [settings, setSettings] = useState<any>({
    site_info: {
      name: '',
      phone: '',
      email: '',
      address: '',
      zaloUrl: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.site_info) {
          setSettings(data);
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (section: string, field: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_info',
          value: settings.site_info
        }),
      });
      alert('Đã lưu cài đặt thành công!');
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt Hệ thống</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-luvia-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Lưu thay đổi
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Thông tin Liên hệ (Hiển thị trên web)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Website / Thương hiệu</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue"
              value={settings.site_info.name}
              onChange={(e) => handleChange('site_info', 'name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại Hotline</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue"
              value={settings.site_info.phone}
              onChange={(e) => handleChange('site_info', 'phone', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue"
              value={settings.site_info.email}
              onChange={(e) => handleChange('site_info', 'email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Zalo</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue"
              value={settings.site_info.zaloUrl}
              onChange={(e) => handleChange('site_info', 'zaloUrl', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue"
              value={settings.site_info.address}
              onChange={(e) => handleChange('site_info', 'address', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Tài khoản Quản trị</h2>
        <p className="text-sm text-gray-500 mb-4">Để đổi mật khẩu, vui lòng liên hệ bộ phận kỹ thuật hoặc chỉnh sửa trực tiếp trong cơ sở dữ liệu để đảm bảo an toàn.</p>
        <button className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed">
          Đổi mật khẩu (Đang bảo trì)
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
