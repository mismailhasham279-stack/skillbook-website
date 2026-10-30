export interface HardwareProduct {
  id: string
  sku: string
  title: string
  category: 'macbook' | 'laptop' | 'pc' | 'chromebook' | 'mobile' | 'accessories'
  price: number
  originalPrice?: number
  chipset: string
  condition: 'Certified Brand New' | 'Enterprise Pristine' | 'Factory Sealed'
  specs: string[]
  stockCount: number
  featured?: boolean
  image: string
}

export const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'MacBooks & Apple', value: 'macbook' },
  { label: 'Performance Laptops', value: 'laptop' },
  { label: 'Workstations & Gaming PCs', value: 'pc' },
  { label: 'Chromebook Fleets', value: 'chromebook' },
  { label: 'Smartphones', value: 'mobile' },
  { label: 'Peripherals', value: 'accessories' },
] as const

export const HARDWARE_INVENTORY: HardwareProduct[] = [
  {
    id: 'tg-1042',
    sku: 'MBP-16-M3M-48-1TB',
    title: 'MacBook Pro 16″ · M3 Max',
    category: 'macbook',
    price: 3299,
    originalPrice: 3799,
    chipset: 'APPLE M3 MAX · 16-CORE CPU',
    condition: 'Certified Brand New',
    specs: ['48GB unified memory', '1TB SSD · 40-core GPU', '16.2″ Liquid Retina XDR'],
    stockCount: 4,
    featured: true,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'tg-1043',
    sku: 'TP-P1G6-I9-64-2TB',
    title: 'ThinkPad P1 Gen 6',
    category: 'laptop',
    price: 2799,
    chipset: 'INTEL CORE i9-13900H · vPRO',
    condition: 'Enterprise Pristine',
    specs: ['64GB DDR5 memory', 'RTX 4080 · 12GB GDDR6', '16″ UHD+ OLED · 2TB NVMe'],
    stockCount: 3,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'tg-1044',
    sku: 'WS-4090-7950X-64-4TB',
    title: 'RTX 4090 Creator Workstation',
    category: 'pc',
    price: 4899,
    chipset: 'AMD RYZEN 9 7950X · 5.7GHz',
    condition: 'Certified Brand New',
    specs: ['RTX 4090 · 24GB GDDR6X', '64GB DDR5 · 4TB Gen4 NVMe', '360mm liquid cooling · 1000W'],
    stockCount: 2,
    featured: true,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'tg-1045',
    sku: 'HP-EDF-CP-I7-16-512',
    title: 'HP Elite Dragonfly Chromebook',
    category: 'chromebook',
    price: 1149,
    chipset: 'INTEL CORE i7-1265U · vPRO',
    condition: 'Enterprise Pristine',
    specs: ['16GB memory · 512GB NVMe', '13.5″ 3:2 touch display', 'Wi-Fi 6E · fingerprint reader'],
    stockCount: 8,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'tg-1046',
    sku: 'MBP-14-M3P-36-1TB',
    title: 'MacBook Pro 14″ · M3 Pro',
    category: 'macbook',
    price: 2199,
    chipset: 'APPLE M3 PRO · 12-CORE CPU',
    condition: 'Factory Sealed',
    specs: ['36GB unified memory', '1TB SSD · 18-core GPU', '14.2″ Liquid Retina XDR'],
    stockCount: 5,
    image: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'tg-1047',
    sku: 'CAL-TS4-DOCK-18P',
    title: 'CalDigit TS4 Thunderbolt Dock',
    category: 'accessories',
    price: 379,
    chipset: 'THUNDERBOLT 4 · 98W PD',
    condition: 'Factory Sealed',
    specs: ['18 ports · single cable setup', '2.5GbE · UHS-II SD / microSD', 'Dual 4K / single 8K display'],
    stockCount: 12,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'tg-1048',
    sku: 'SM-S24U-512-TI',
    title: 'Galaxy S24 Ultra · 512GB',
    category: 'mobile',
    price: 1199,
    chipset: 'SNAPDRAGON 8 GEN 3 · GALAXY',
    condition: 'Factory Sealed',
    specs: ['512GB storage · 12GB memory', '6.8″ QHD+ Dynamic AMOLED 2X', '200MP main camera · S Pen'],
    stockCount: 7,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=82',
  },
  {
    id: 'tg-1049',
    sku: 'AS-PG-G14-R9-32-1TB',
    title: 'ROG Zephyrus G14',
    category: 'laptop',
    price: 1999,
    chipset: 'AMD RYZEN 9 8945HS · 5.2GHz',
    condition: 'Certified Brand New',
    specs: ['32GB DDR5 · 1TB Gen4 NVMe', 'RTX 4070 · 8GB GDDR6', '14″ 3K OLED · 120Hz'],
    stockCount: 3,
    featured: true,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=900&q=82',
  },
]
