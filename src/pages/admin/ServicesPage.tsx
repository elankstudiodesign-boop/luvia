import React, { useEffect, useState } from 'react';
import { Edit, Eye, Upload, X, Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  category_id: string;
  title: string;
  description: string;
  image: string;
  content: any;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingService(null);
    setIsModalOpen(false);
  };

  const updatePricing = (index: number, field: string, value: string) => {
    if (!editingService) return;
    const newPricing = [...(editingService.content.pricing || [])];
    newPricing[index] = { ...newPricing[index], [field]: value };
    
    setEditingService({
      ...editingService,
      content: { ...editingService.content, pricing: newPricing }
    });
  };

  const addPricingPackage = () => {
    if (!editingService) return;
    const newPricing = [...(editingService.content.pricing || []), { title: 'Gói mới', price: '0đ', features: [] }];
    setEditingService({
      ...editingService,
      content: { ...editingService.content, pricing: newPricing }
    });
  };

  const removePricingPackage = (index: number) => {
    if (!editingService) return;
    const newPricing = [...(editingService.content.pricing || [])];
    newPricing.splice(index, 1);
    setEditingService({
      ...editingService,
      content: { ...editingService.content, pricing: newPricing }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (editingService) {
        setEditingService({ ...editingService, image: data.url });
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveService = async () => {
    if (!editingService) return;

    try {
      await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });
      alert('Cập nhật dịch vụ thành công!');
      fetchServices();
      handleCloseModal();
    } catch (error) {
      console.error('Update failed', error);
      alert('Cập nhật thất bại');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Dịch vụ</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mô tả ngắn</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Đang tải...</td></tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{service.title}</div>
                      <div className="text-xs text-gray-500">ID: {service.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(service)}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa Dịch vụ</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh đại diện</label>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={editingService.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors w-fit">
                      <Upload size={16} />
                      <span className="text-sm font-medium">Tải ảnh lên</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Hỗ trợ JPG, PNG. Kích thước tối đa 5MB.</p>
                    {uploading && <p className="text-xs text-blue-500 mt-1">Đang tải lên...</p>}
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue"
                    value={editingService.title}
                    onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue"
                    rows={3}
                    value={editingService.description}
                    onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  />
                </div>
              </div>

              {/* Pricing Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Bảng giá dịch vụ (Cập nhật theo thị trường)</label>
                  <button 
                    onClick={addPricingPackage}
                    className="text-xs flex items-center gap-1 text-luvia-blue hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                  >
                    <Plus size={14} /> Thêm gói
                  </button>
                </div>
                <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {(!editingService.content.pricing || editingService.content.pricing.length === 0) && (
                    <p className="text-sm text-gray-400 text-center py-2">Chưa có gói dịch vụ nào.</p>
                  )}
                  {editingService.content.pricing?.map((pkg: any, index: number) => (
                    <div key={index} className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tên gói</label>
                        <input 
                          type="text"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-luvia-blue"
                          value={pkg.title}
                          onChange={(e) => updatePricing(index, 'title', e.target.value)}
                          placeholder="Ví dụ: Gói Cơ bản"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Giá (VNĐ)</label>
                        <input 
                          type="text"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm font-bold text-luvia-blue focus:outline-none focus:border-luvia-blue"
                          value={pkg.price}
                          onChange={(e) => updatePricing(index, 'price', e.target.value)}
                          placeholder="1.000.000đ"
                        />
                      </div>
                      <button 
                        onClick={() => removePricingPackage(index)}
                        className="mt-6 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Xóa gói này"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Content (Simplified for now) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết (Mô tả dài)</label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-luvia-blue"
                  rows={5}
                  value={editingService.content.detailedDescription || ''}
                  onChange={(e) => setEditingService({
                    ...editingService, 
                    content: { ...editingService.content, detailedDescription: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSaveService}
                className="px-6 py-2 bg-luvia-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
