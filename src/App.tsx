import { useState, useMemo } from "react";
import {
  Search,
  ShoppingCart,
  PhoneCall,
  User,
  ChevronRight,
  ChevronDown,
  X,
  SlidersHorizontal,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Package,
  Layers,
  Cpu,
  Sparkles,
  Info
} from "lucide-react";
import { INVENTORY_PRODUCTS, PHONE_PRODUCTS, CHROMEBOOK_PRODUCTS, ACCESSORY_PRODUCTS, ALL_PRODUCTS, LAPTOP_SERIES, type ShopLaptop } from "./data/shopData";

type SortOption = "featured" | "price-asc" | "price-desc";

type SimpleCardProps = {
  item: ShopLaptop;
  addToCart: (item: ShopLaptop) => void;
  handleWhatsAppOrder: (item: ShopLaptop) => void;
};

function SimpleCard({ item, addToCart, handleWhatsAppOrder }: SimpleCardProps) {
  const isLaptop = item.category === "laptop" || !item.category;
  const displayTitle = isLaptop
    ? item.title
    : `${item.title} - ${item.ram} - ${item.storage} - ${item.display}`;
  const discount = item.originalPrice && item.originalPrice > item.price
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col h-full">
      <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden mb-3">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded">Sale -{discount}%</span>
        )}
      </div>
      <h3 title={displayTitle} className="text-sm font-semibold text-black line-clamp-2 min-h-[2.5rem] leading-snug mb-2">
        {displayTitle}
      </h3>
      <p className="text-sm text-slate-600 mb-2">
        <span className="text-amber-500 font-bold">★ {item.rating.toFixed(1)}</span> <span>({item.reviewsCount})</span> <span className="text-slate-400">• {item.condition}</span>
      </p>
      <div className="mt-auto pt-2 border-t border-slate-200">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-black">Rs {item.price.toLocaleString()}</span>
          {item.originalPrice && (
            <span className="text-sm text-slate-400 line-through">Rs {item.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => addToCart(item)} className="w-full py-2.5 bg-white border border-slate-300 text-black rounded-lg text-sm font-bold flex items-center justify-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
          </button>
          <button onClick={() => handleWhatsAppOrder(item)} className="w-full py-2.5 bg-[#00A8CC] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-1">
            <PhoneCall className="w-4 h-4" />
            <span>Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedSeries, setSelectedSeries] = useState<string>("All Laptops");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [cartItems, setCartItems] = useState<{ laptop: ShopLaptop; qty: number }[]>([]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.qty * item.laptop.price, 0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Memoized Filter Pipeline
  const filteredLaptops = useMemo(() => {
    const list = INVENTORY_PRODUCTS.filter((item: ShopLaptop) => {
      const matchSeries =
        selectedSeries === "All Laptops" ||
        (selectedSeries === "HP EliteBook" && item.series === "EliteBook") ||
        (selectedSeries === "HP ProBook" && item.series === "ProBook") ||
        (selectedSeries === "HP ZBook Workstations" && item.series === "ZBook") ||
        (selectedSeries === "Dell Latitude" && item.series === "Latitude") ||
        (selectedSeries === "Dell Precision Workstations" && item.series === "Precision");

      const matchBrand = selectedBrand === "All" || item.brand === selectedBrand;
      const matchBudget = item.price <= maxPrice;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        item.title.toLowerCase().includes(q) ||
        item.processor.toLowerCase().includes(q) ||
        item.display.toLowerCase().includes(q) ||
        item.generation.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q);

      return matchSeries && matchBrand && matchBudget && matchSearch;
    });

    if (sortBy === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [selectedSeries, selectedBrand, maxPrice, searchQuery, sortBy]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const matchSearch = (item: ShopLaptop) => {
    const q = searchQuery.toLowerCase().trim();
    if (q === "") return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.processor.toLowerCase().includes(q) ||
      item.display.toLowerCase().includes(q) ||
      item.generation.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.ram.toLowerCase().includes(q) ||
      item.storage.toLowerCase().includes(q)
    );
  };

  const filteredPhones = PHONE_PRODUCTS.filter(matchSearch);
  const filteredChromebooks = CHROMEBOOK_PRODUCTS.filter(matchSearch);
  const filteredAccessories = ACCESSORY_PRODUCTS.filter(matchSearch);
  const filteredDeals = ALL_PRODUCTS.filter((item) => item.originalPrice && item.originalPrice > item.price && matchSearch(item))
    .sort((a, b) => (b.originalPrice! - b.price) / b.originalPrice! - (a.originalPrice! - a.price) / a.originalPrice!)
    .slice(0, 8);

  // WhatsApp Order Trigger with exact product details
  const handleWhatsAppOrder = (laptop: ShopLaptop) => {
    const phone = "923368936528";
    const text = `Assalam-o-Alaikum SKILLBOOK,\n\nI want to order this laptop:\n*Model:* ${laptop.title}\n*SKU:* ${laptop.sku}\n*Processor:* ${laptop.processor}\n*RAM/SSD:* ${laptop.ram} / ${laptop.storage}\n*Display:* ${laptop.display}\n*Price:* Rs ${laptop.price.toLocaleString()}\n*Condition:* ${laptop.condition}\n\nPlease confirm stock availability and dispatch procedure.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleResetFilters = () => {
    setSelectedSeries("All Laptops");
    setSelectedBrand("All");
    setMaxPrice(300000);
    setSearchQuery("");
    setSortBy("featured");
  };

  const addToCart = (laptop: ShopLaptop) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.laptop.id === laptop.id);
      if (existing) return prev.map((item) => item.laptop.id === laptop.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { laptop, qty: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCartItems((prev) => prev.map((item) => item.laptop.id === id ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0));
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.laptop.id !== id));
  };

  const handleCartWhatsAppCheckout = () => {
    const lines = cartItems.map((item, index) => `${index + 1}. ${item.laptop.title} (SKU: ${item.laptop.sku}) - ${item.qty} x Rs ${item.laptop.price.toLocaleString()} = Rs ${(item.qty * item.laptop.price).toLocaleString()}`).join("\n");
    const text = `Assalam-o-Alaikum SKILLBOOK,\n\nI want to order these laptops:\n${lines}\n\nTotal: Rs ${cartTotal.toLocaleString()}\n\nPlease confirm stock availability and dispatch procedure.`;
    window.open(`https://wa.me/923368936528?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      {/* ================= 1. REFINED TOP NOTIFICATION STRIP ================= */}
      <div className="bg-white text-black text-sm py-2 px-4 border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <p className="font-medium text-black">
              Verified Laptops, Phones, Chromebooks & Accessories in Pakistan — Cash on Delivery across Pakistan
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-teal-200/90 font-medium">
            <span>UAN: +92 336 8936528</span>
            <span className="text-teal-800">|</span>
            <span>Karachi Warehouse: Model Colony</span>
          </div>
        </div>
      </div>

      {/* ================= 2. STORE MASTER HEADER ================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Logo with Metallic Brand Icon and Clean Vector SVG Fallback */}
          <div 
            onClick={handleResetFilters}
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <div className="h-11 w-11 rounded-xl bg-[#0E4B5E] p-0.5 flex items-center justify-center">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 36 36" fill="none" className="h-7 w-7">
                  <rect x="5" y="7" width="26" height="17" rx="2" fill="#0E4B5E" />
                  <path d="M8 21L14 15L20 19L27 12" stroke="#00A8CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 27C7 25 14 24.5 18 27C22 24.5 29 25 33 27L31 29C27 27.5 22 27 18 29C14 27 9 27.5 5 29L3 27Z" fill="#F59E0B" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[22px] font-black tracking-tight text-slate-900 leading-none">
                SKILL<span className="text-[#00A8CC]">BOOK</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Verified Hardware Importers
              </span>
            </div>
          </div>

          {/* Integrated Search Bar with Quick Dropdown */}
          <div className="hidden md:flex flex-1 max-w-2xl items-center border border-slate-300 rounded-lg overflow-hidden bg-white focus-within:border-[#00A8CC] focus-within:ring-2 focus-within:ring-[#00A8CC]/10 transition-all">
            <div className="relative border-r border-slate-200 bg-slate-50 text-slate-700 px-3.5 py-2.5 text-xs font-semibold flex items-center gap-1.5 shrink-0">
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="bg-transparent text-xs text-slate-700 outline-none cursor-pointer pr-4 font-medium"
              >
                {LAPTOP_SERIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            <input
              type="text"
              placeholder="Search laptops, phones, chromebooks, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="pr-3 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}

            <button className="bg-[#00A8CC] hover:bg-[#0E4B5E] text-white px-5 py-2.5 transition-colors flex items-center justify-center font-semibold text-xs">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Header Action Desk */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveModal("account")}
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-[#00A8CC] transition-colors rounded-lg hover:bg-slate-50"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>My Account</span>
            </button>

            <button
              onClick={() => setActiveModal("cart")}
              className="flex items-center gap-2 bg-[#00A8CC] text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-xs hover:bg-[#0E4B5E] transition-colors active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white/20 text-white text-[11px] px-1.5 py-0.5 rounded-full font-bold ml-0.5">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Row */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="bg-slate-50 text-slate-700 px-2 py-2 text-xs font-semibold outline-none cursor-pointer border-r border-slate-200 max-w-[110px]"
              aria-label="Select laptop series"
            >
              {LAPTOP_SERIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search laptops, phones, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-xs text-slate-800 outline-none"
            />
            <button className="bg-[#00A8CC] text-white px-4 py-2">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= 3. SUB-BAR (Breadcrumbs & Results Count) ================= */}
      <div className="bg-white border-b border-slate-200 py-3 px-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-400">Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0E4B5E] font-bold">Laptops Inventory</span>
            <span className="text-slate-400">({filteredLaptops.length} Models Ready for Dispatch)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#00A8CC]" />
              <span>Filters</span>
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1 font-semibold text-slate-700 text-xs outline-none cursor-pointer"
              >
                <option value="featured">Featured / Stock Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Simple category boxes */}
      <section id="categories" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-black text-left mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => scrollToSection("shop-laptops")} className="bg-white border border-slate-200 rounded-lg p-4 text-left flex flex-col h-full">
            <span className="text-base font-bold text-black mb-1">Laptops</span>
            <span className="text-sm text-slate-600 mb-3">Verified business laptops and workstations.</span>
            <span className="text-sm font-bold text-[#00A8CC] mt-auto">Shop Laptops</span>
          </button>
          <button onClick={() => scrollToSection("shop-phones")} className="bg-white border border-slate-200 rounded-lg p-4 text-left flex flex-col h-full">
            <span className="text-base font-bold text-black mb-1">Mobile Phones</span>
            <span className="text-sm text-slate-600 mb-3">iPhone, Pixel, Samsung, Tecno and Realme.</span>
            <span className="text-sm font-bold text-[#00A8CC] mt-auto">Shop Phones</span>
          </button>
          <button onClick={() => scrollToSection("shop-chromebooks")} className="bg-white border border-slate-200 rounded-lg p-4 text-left flex flex-col h-full">
            <span className="text-base font-bold text-black mb-1">Chromebooks</span>
            <span className="text-sm text-slate-600 mb-3">Simple, light laptops for study and work.</span>
            <span className="text-sm font-bold text-[#00A8CC] mt-auto">Shop Chromebooks</span>
          </button>
          <button onClick={() => scrollToSection("shop-accessories")} className="bg-white border border-slate-200 rounded-lg p-4 text-left flex flex-col h-full">
            <span className="text-base font-bold text-black mb-1">Accessories</span>
            <span className="text-sm text-slate-600 mb-3">Chargers, bags, mouse, keyboard and more.</span>
            <span className="text-sm font-bold text-[#00A8CC] mt-auto">Shop Accessories</span>
          </button>
        </div>
      </section>

      {/* ================= 4. MAIN STOREFRONT (2-COLUMN ARCHITECTURE) ================= */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="flex gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white border border-slate-200 rounded-xl p-5 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-[#0E4B5E] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#00A8CC]" />
                Refine Selection
              </h3>
              {(selectedSeries !== "All Laptops" || selectedBrand !== "All" || maxPrice < 300000 || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-[#00A8CC] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Brand Filter */}
            <div className="mb-5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Manufacturer</h4>
              <div className="flex gap-2">
                {["All", "HP", "Dell"].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedBrand === b
                        ? "bg-[#0E4B5E] text-white border-[#0E4B5E]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Series Tree Filter */}
            <div className="mb-6 border-t border-slate-100 pt-4">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Series & Family</h4>
              <ul className="space-y-1">
                {LAPTOP_SERIES.map((s) => {
                  const active = selectedSeries === s;
                  return (
                    <li key={s}>
                      <button
                        onClick={() => setSelectedSeries(s)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                          active
                            ? "bg-teal-50 text-[#00A8CC] font-bold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <span className="truncate">{s}</span>
                        {active && <CheckCircle2 className="w-3.5 h-3.5 text-[#00A8CC] shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Slider */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Max Budget</h4>
                <span className="text-xs font-black text-[#0E4B5E]">Rs {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="45000"
                max="300000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#00A8CC] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>Rs 45,000</span>
                <span>Rs 300,000</span>
              </div>
            </div>

            {/* Quality Assurance Badge */}
            <div className="mt-6 border-t border-slate-100 pt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-tight">
                  <strong className="text-slate-900 block mb-0.5">Physical Store Tested</strong>
                  All machines benchmarked with genuine chargers included.
                </p>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT PRODUCT GRID ================= */}
          <section id="shop-laptops" className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-black text-left mb-4">Laptops</h2>
            {filteredLaptops.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
                <h3 className="text-base font-bold text-black">No laptops match your filters</h3>
                <p className="text-sm text-slate-600 mt-1">Try a different search or clear the filters.</p>
                <button onClick={handleResetFilters} className="mt-4 px-4 py-2.5 bg-[#00A8CC] text-white rounded-lg text-sm font-bold">Reset All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredLaptops.map((laptop: ShopLaptop) => (
                  <SimpleCard key={laptop.id} item={laptop} addToCart={addToCart} handleWhatsAppOrder={handleWhatsAppOrder} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Simple grouped product sections */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 w-full">
        {filteredPhones.length > 0 && (
          <section id="shop-phones" className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-black text-left mb-4">Mobile Phones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredPhones.map((item: ShopLaptop) => (
                <SimpleCard key={item.id} item={item} addToCart={addToCart} handleWhatsAppOrder={handleWhatsAppOrder} />
              ))}
            </div>
          </section>
        )}
        {filteredChromebooks.length > 0 && (
          <section id="shop-chromebooks" className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-black text-left mb-4">Chromebooks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredChromebooks.map((item: ShopLaptop) => (
                <SimpleCard key={item.id} item={item} addToCart={addToCart} handleWhatsAppOrder={handleWhatsAppOrder} />
              ))}
            </div>
          </section>
        )}
        {filteredAccessories.length > 0 && (
          <section id="shop-accessories" className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-black text-left mb-4">Accessories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredAccessories.map((item: ShopLaptop) => (
                <SimpleCard key={item.id} item={item} addToCart={addToCart} handleWhatsAppOrder={handleWhatsAppOrder} />
              ))}
            </div>
          </section>
        )}
        {filteredDeals.length > 0 && (
          <section id="deals" className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-black text-left mb-4">Deals and Discounts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDeals.map((item: ShopLaptop) => (
                <SimpleCard key={item.id} item={item} addToCart={addToCart} handleWhatsAppOrder={handleWhatsAppOrder} />
              ))}
            </div>
          </section>
        )}
        {/* SAMPLE REVIEWS - replace with real customer reviews before launch */}
        <section id="reviews" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-black text-left mb-4">Customer Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col h-full">
              <p className="text-sm text-black mb-3">Good laptop, checked before delivery, and Cash on Delivery was easy.</p>
              <p className="text-sm font-bold text-black mt-auto">Verified Buyer, Karachi</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col h-full">
              <p className="text-sm text-black mb-3">Order on WhatsApp was simple and the price was clear.</p>
              <p className="text-sm font-bold text-black mt-auto">Verified Buyer, Lahore</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col h-full">
              <p className="text-sm text-black mb-3">Phone arrived in good condition with charger included.</p>
              <p className="text-sm font-bold text-black mt-auto">Verified Buyer, Islamabad</p>
            </div>
          </div>
        </section>
        <section id="why-choose-us" className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-black text-left mb-4">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col h-full">
              <h3 className="text-base font-bold text-black mb-1">Verified Stock</h3>
              <p className="text-sm text-slate-600">Every product is checked before dispatch.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col h-full">
              <h3 className="text-base font-bold text-black mb-1">100% Benchmarked</h3>
              <p className="text-sm text-slate-600">Machines are tested and benchmarked.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col h-full">
              <h3 className="text-base font-bold text-black mb-1">Cash on Delivery</h3>
              <p className="text-sm text-slate-600">Pay when your order arrives, across Pakistan.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col h-full">
              <h3 className="text-base font-bold text-black mb-1">7-Day Checking Warranty</h3>
              <p className="text-sm text-slate-600">Check your product and get help if there is a problem.</p>
            </div>
          </div>
        </section>
        <section id="contact" className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-black text-left mb-4">Contact Us</h2>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-black mb-1">WhatsApp / Phone: +92 336 8936528</p>
            <p className="text-sm text-black mb-1">Email: support@skillbook.pk</p>
            <p className="text-sm text-black mb-3">Address: Near Bank Alfalah, Model Colony, Karachi, Pakistan</p>
            <a href="https://wa.me/923368936528" target="_blank" rel="noreferrer" className="inline-block px-4 py-2.5 bg-[#00A8CC] text-white rounded-lg text-sm font-bold">Order on WhatsApp</a>
          </div>
        </section>
      </div>

      {/* ================= 5. FULLY CLICKABLE MULTI-COLUMN FOOTER ================= */}
      <footer className="bg-[#0E4B5E] text-white pt-14 pb-8 border-t border-teal-900 mt-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-teal-700/60">
            
            {/* Col 1: Brand Info with Clean In-line Vector Logo */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-9 w-9 rounded-lg bg-white p-1 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" fill="none" className="h-6 w-6">
                    <rect x="5" y="7" width="26" height="17" rx="2" fill="#0E4B5E" />
                    <path d="M8 21L14 15L20 19L27 12" stroke="#00A8CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 27C7 25 14 24.5 18 27C22 24.5 29 25 33 27L31 29C27 27.5 22 27 18 29C14 27 9 27.5 5 29L3 27Z" fill="#F59E0B" />
                  </svg>
                </div>
                <span className="text-xl font-black text-white">
                  SKILL<span className="text-[#00A8CC]">BOOK</span>
                </span>
              </div>
              <p className="text-xs text-teal-100/80 leading-relaxed">
                Direct importers of business laptops, HP EliteBook, ZBook, and Dell Precision workstations. Every unit verified before customer dispatch.
              </p>
            </div>

            {/* Col 2: Information (Clickable with Modals) */}
            <div>
              <h4 className="text-sm font-bold tracking-wide uppercase text-white pb-2 border-b-2 border-[#00A8CC] inline-block mb-4">
                Information
              </h4>
              <ul className="space-y-2.5 text-xs text-teal-100/80">
                <li>
                  <button
                    onClick={() => setActiveModal("privacy")}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("terms")}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("delivery")}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> Delivery Information
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("warranty")}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> Checking & Return Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Categories (Clickable Filters) */}
            <div>
              <h4 className="text-sm font-bold tracking-wide uppercase text-white pb-2 border-b-2 border-[#00A8CC] inline-block mb-4">
                Categories
              </h4>
              <ul className="space-y-2.5 text-xs text-teal-100/80">
                <li>
                  <button
                    onClick={() => { setSelectedSeries("HP EliteBook"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> HP EliteBook (G4-G11)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSelectedSeries("HP ProBook"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> HP ProBook Fleet
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSelectedSeries("HP ZBook Workstations"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> HP ZBook Fury & Firefly
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSelectedSeries("Dell Latitude"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> Dell Latitude 5000 Series
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSelectedSeries("Dell Precision Workstations"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> Dell Precision 3571
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: My Account (Clickable Portals) */}
            <div>
              <h4 className="text-sm font-bold tracking-wide uppercase text-white pb-2 border-b-2 border-[#00A8CC] inline-block mb-4">
                My Account
              </h4>
              <ul className="space-y-2.5 text-xs text-teal-100/80">
                <li>
                  <button
                    onClick={() => setActiveModal("cart")}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> Shopping Cart ({cartCount})
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("account")}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> Customer Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { handleResetFilters(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> View Complete Catalog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("track")}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#00A8CC]" /> Track Order Dispatch
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: Contact Info */}
            <div>
              <h4 className="text-sm font-bold tracking-wide uppercase text-white pb-2 border-b-2 border-[#00A8CC] inline-block mb-4">
                Contact Us
              </h4>
              <div className="space-y-2 text-xs text-teal-100/80">
                <p className="flex items-start gap-2">
                  <PhoneCall className="w-4 h-4 text-[#00A8CC] shrink-0 mt-0.5" />
                  <a href="https://wa.me/923368936528" target="_blank" rel="noreferrer" className="font-bold text-white hover:underline">
                    +92 336 8936528
                  </a>
                </p>
                <p className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-[#00A8CC] shrink-0 mt-0.5" />
                  <span>support@skillbook.pk</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#00A8CC] shrink-0 mt-0.5" />
                  <span>Near Bank Alfalah, Model Colony, Karachi, Pakistan</span>
                </p>
              </div>
            </div>
          </div>

          {/* Copyright Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-200/60 gap-4">
            <p>© {new Date().getFullYear()} SKILLBOOK. All Rights Reserved.</p>
            <p>
              Engineered by <span className="font-bold text-white">CRAFTLOGIC Studio</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ================= 6. FLOATING WHATSAPP BUTTON ================= */}
      <a
        href="https://wa.me/923368936528"
        target="_blank"
        rel="noreferrer"
        aria-label="Direct WhatsApp Contact"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.16 7.62C8.97 7.62 8.78 7.62 8.6 7.71C8.38 7.82 8.1 8.08 8.1 8.67C8.1 9.27 8.54 10.45 9.38 11.66C10.22 12.87 11.66 14.48 13.91 15.34C16.15 16.2 16.5 15.93 16.94 15.89C17.38 15.85 18.35 15.32 18.55 14.75C18.75 14.19 18.75 13.7 18.69 13.61C18.63 13.52 18.47 13.46 18.23 13.34C17.98 13.22 16.8 12.64 16.58 12.56C16.36 12.48 16.2 12.44 16.04 12.68C15.88 12.93 15.42 13.46 15.28 13.62C15.14 13.78 15 13.8 14.76 13.68C14.51 13.56 13.73 13.3 12.8 12.47C12.08 11.83 11.59 11.03 11.45 10.79C11.31 10.55 11.43 10.42 11.55 10.3C11.66 10.19 11.8 10.01 11.92 9.87C12.04 9.73 12.08 9.63 12.16 9.47C12.24 9.31 12.2 9.17 12.14 9.05C12.08 8.93 11.62 7.8 11.42 7.33C11.23 6.87 11.04 6.93 10.89 6.92C10.75 6.91 10.59 6.91 10.43 6.91C10.27 6.91 10.01 6.97 9.79 7.21C9.57 7.45 9.16 7.62 9.16 7.62Z" />
        </svg>
      </a>

      {/* ================= 7. INTERACTIVE POLICY & ACCOUNT MODALS ================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === "privacy" && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Privacy & Buyer Data Protection</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  SKILLBOOK only utilizes buyer contact details for courier dispatch and invoice generation. We never share customer phone numbers or addresses with third-party advertising brokers.
                </p>
              </div>
            )}

            {activeModal === "terms" && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Terms & Ordering Guidelines</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All items are tested prior to courier pickup. Cash on Delivery is available across Pakistan. Customers are requested to inspect the seal and serial number upon delivery.
                </p>
              </div>
            )}

            {activeModal === "delivery" && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Nationwide Courier Delivery</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Orders in Karachi are delivered within 24 hours. For Lahore, Islamabad, Peshawar, Quetta, and other cities, delivery takes 2 to 3 business days via TCS / Leopard with tracking IDs.
                </p>
              </div>
            )}

            {activeModal === "warranty" && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Checking & Replacement Warranty</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every laptop carries a 7-day complete physical and motherboard checking warranty. Any hardware fault reported within 7 days qualifies for direct replacement or technical service.
                </p>
              </div>
            )}

            {activeModal === "cart" && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Shopping Cart ({cartCount} Items)</h3>
                {cartItems.length === 0 ? (
                  <p className="text-xs text-slate-600 mb-4">
                    Your cart is currently empty. Click 'Cart' on any machine to add it here, or 'Order' on any machine to proceed directly via WhatsApp.
                  </p>
                ) : (
                  <div>
                    <ul className="space-y-3 mb-4">
                      {cartItems.map((item) => (
                        <li key={item.laptop.id} className="flex items-center gap-3 border border-slate-100 rounded-lg p-2">
                          <img src={item.laptop.image} alt={item.laptop.title} className="h-12 w-12 object-cover rounded shrink-0" loading="lazy" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{item.laptop.title}</p>
                            <p className="text-[11px] text-slate-500">Rs {item.laptop.price.toLocaleString()} each</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => updateCartQty(item.laptop.id, -1)} className="px-2 py-1 bg-slate-100 rounded text-xs font-bold" aria-label="Decrease quantity">-</button>
                            <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                            <button onClick={() => updateCartQty(item.laptop.id, 1)} className="px-2 py-1 bg-slate-100 rounded text-xs font-bold" aria-label="Increase quantity">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.laptop.id)} className="text-slate-400 hover:text-red-600 shrink-0" aria-label="Remove from cart">
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between mb-4 text-sm font-bold text-slate-900">
                      <span>Total</span>
                      <span>Rs {cartTotal.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleCartWhatsAppCheckout}
                      className="w-full py-2.5 bg-[#00A8CC] text-white rounded-lg text-xs font-bold"
                    >
                      Checkout Selected Machines via WhatsApp
                    </button>
                    <button
                      onClick={() => setCartItems([])}
                      className="w-full mt-2 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeModal === "account" && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Client Portal & Order Invoicing</h3>
                <p className="text-xs text-slate-600 mb-4">
                  B2B corporate accounts and recurring buyers can login or request official GST invoices through our direct WhatsApp helpline.
                </p>
                <a
                  href="https://wa.me/923368936528?text=Assalam-o-Alaikum, I want to setup a corporate buyer account."
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center w-full py-2.5 bg-[#0E4B5E] text-white rounded-lg text-xs font-bold"
                >
                  Contact Desk for Account Setup
                </a>
              </div>
            )}

            {activeModal === "track" && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Track Your Courier Consignment</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your CN / Tracking number provided on your WhatsApp dispatch receipt on the Leopard or TCS tracking portal to view real-time location.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 8. MOBILE RESPONSIVE DRAWER ================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileDrawerOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <span className="font-bold text-sm text-slate-900">Filter Laptops</span>
              <button onClick={() => setMobileDrawerOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Brand</span>
              <div className="flex gap-2">
                {["All", "HP", "Dell"].map((b) => (
                  <button
                    key={b}
                    onClick={() => { setSelectedBrand(b); setMobileDrawerOpen(false); }}
                    className={`flex-1 py-1 text-xs font-bold rounded border ${
                      selectedBrand === b ? "bg-[#0E4B5E] text-white" : "text-slate-700 border-slate-300"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Series</span>
              <ul className="space-y-1">
                {LAPTOP_SERIES.map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => { setSelectedSeries(s); setMobileDrawerOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg ${
                        selectedSeries === s ? "bg-[#00A8CC] text-white font-bold" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Max Budget</span>
                <span className="text-xs font-black text-[#0E4B5E]">Rs {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="45000"
                max="300000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#00A8CC] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                aria-label="Maximum budget"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>Rs 45,000</span>
                <span>Rs 300,000</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-2.5 py-2 font-semibold text-slate-700 text-xs outline-none cursor-pointer"
                aria-label="Sort laptops"
              >
                <option value="featured">Featured / Stock Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2 bg-[#00A8CC] text-white rounded-lg text-xs font-bold"
              >
                Show {filteredLaptops.length} Results
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}