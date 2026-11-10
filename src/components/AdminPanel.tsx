import React, { useState } from 'react';

export interface ProductItem {
  id: string;
  name: string;
  category: 'Laptops' | 'MacBooks' | 'Chromebooks' | 'Smartphones' | 'Accessories';
  brand: 'Apple' | 'Lenovo' | 'Dell' | 'HP' | 'Samsung' | 'Anker' | 'Logitech';
  pricePKR: number;
  originalPricePKR?: number;
  rating: number;
  reviewsCount: number;
  condition: 'Brand New (Box Pack)' | 'Certified Refurbished';
  image: string;
  galleryImages: string[];
  description: string;
  highlights: string[];
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    screen: string;
    gpu?: string;
    ports?: string;
  };
  stockCount: number;
  featured?: boolean;
  reviewsList: any[];
}

interface AdminPanelProps {
  products: ProductItem[];
  onAddProduct: (newProduct: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products = [],
  onAddProduct,
  onDeleteProduct,
  onClose
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState<'HP' | 'Dell' | 'Lenovo' | 'Apple' | 'Samsung'>('HP');
  const [category, setCategory] = useState<'Laptops' | 'MacBooks' | 'Accessories'>('Laptops');
  const [price, setPrice] = useState<number | string>('');
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [screen, setScreen] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Tasveer ka size 3MB se zyada hai. Choti image select karein.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !imagePreview) {
      alert('Product Name, Price aur Image lazmi add karein.');
      return;
    }

    const newProd: ProductItem = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      brand: brand as any,
      category: category as any,
      pricePKR: Number(price) || 0,
      rating: 5.0,
      reviewsCount: 1,
      condition: 'Certified Refurbished',
      image: imagePreview,
      galleryImages: [imagePreview],
      description: `Tested Grade-A ${brand} corporate device configured for office productivity and programming.`,
      highlights: ['Diagnostic Tested', 'Original Screen', 'Tested Battery Cycles'],
      specs: {
        cpu: cpu.trim() || 'Core i5 Processor',
        ram: ram.trim() || '16GB RAM',
        storage: storage.trim() || '512GB NVMe SSD',
        screen: screen.trim() || '14.1" Full HD'
      },
      stockCount: 5,
      featured: true,
      reviewsList: []
    };

    onAddProduct(newProd);
    alert('Product store mein add ho gayi!');

    setName('');
    setPrice('');
    setCpu('');
    setRam('');
    setStorage('');
    setScreen('');
    setImagePreview('');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `skillbook-inventory-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Safe list checking
  const safeProductsList = Array.isArray(products) ? products.filter(Boolean) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              SkillBook Inventory Manager
            </h2>
            <p className="text-xs text-slate-500">
              Yahan se product details aur real photos upload/manage karein.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700">1. Product Details & Photo</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Product Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. HP EliteBook 840 G8 Core i7"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Price (PKR)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 78000"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as any)}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-600 bg-white"
              >
                <option value="HP">HP</option>
                <option value="Dell">Dell</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-600 bg-white"
              >
                <option value="Laptops">Laptops</option>
                <option value="MacBooks">MacBooks</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <input
              type="text"
              value={cpu}
              onChange={(e) => setCpu(e.target.value)}
              placeholder="CPU (e.g. Core i7 11th)"
              className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
            />
            <input
              type="text"
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              placeholder="RAM (e.g. 16GB DDR4)"
              className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
            />
            <input
              type="text"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
              placeholder="SSD (e.g. 512GB SSD)"
              className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
            />
            <input
              type="text"
              value={screen}
              onChange={(e) => setScreen(e.target.value)}
              placeholder="Display (e.g. 14.1 Full HD)"
              className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
            />
          </div>

          <div className="p-3.5 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
            <label className="text-xs font-bold text-slate-800 block mb-1">Upload Real Photo (Phone / PC File)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[11px] text-emerald-600 font-bold">✓ Selected Photo Preview:</span>
                <img src={imagePreview} alt="Preview" className="h-16 w-20 object-contain bg-white rounded-lg p-1 border border-slate-200" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition active:scale-95 shadow-sm"
          >
            + Add Product to Store
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Inventory ({safeProductsList.length} Items)
            </h3>
            <button
              type="button"
              onClick={handleExportJSON}
              className="text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1.5 rounded-xl hover:bg-sky-100 transition"
            >
              📥 Export Inventory JSON
            </button>
          </div>

          <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
            {safeProductsList.length === 0 ? (
              <p className="text-xs text-slate-400 p-2 text-center">Koi custom products nahi hain.</p>
            ) : (
              safeProductsList.map((p) => {
                const displayPrice = typeof p?.pricePKR === 'number' 
                  ? p.pricePKR.toLocaleString('en-PK') 
                  : (p?.pricePKR || '0');

                return (
                  <div key={p?.id || Math.random().toString()} className="py-2 flex items-center justify-between text-xs px-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img 
                        src={p?.image || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=100&q=80'} 
                        alt={p?.name || 'Item'} 
                        className="h-8 w-8 object-contain rounded bg-white p-0.5 border" 
                      />
                      <span className="truncate font-semibold text-slate-800 max-w-[200px]">{p?.name || 'Unnamed Device'}</span>
                      <span className="text-sky-700 font-bold">Rs. {displayPrice}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => p?.id && onDeleteProduct(p.id)}
                      className="text-rose-500 hover:text-rose-700 font-bold px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};