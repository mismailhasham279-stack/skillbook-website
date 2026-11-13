import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ==========================================
// 0. SUPABASE CLOUD CLIENT INITIALIZATION
// ==========================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ==========================================
// 1. DATA CONTRACTS & TYPE DEFINITIONS
// ==========================================
export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

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
  reviewsList: ProductReview[];
}

export interface OrderReceipt {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryCity: string;
  deliveryAddress: string;
  items: (ProductItem & { quantity: number })[];
  totalPKR: number;
  date: string;
}

// ==========================================
// 2. CONTACT CONSTANTS
// ==========================================
const OFFICIAL_WHATSAPP_INT = "923400207828";
const OFFICIAL_EMAIL = "skillbook786@gmail.com";

// ==========================================
// 3. ROBUST ASSET PATH CONSTANTS
// ==========================================
const IMG_HP_SILVER = "/635711303697425507.jfif";
const IMG_MAC_TOP = "/1071575305106958970.jfif";
const IMG_MAC_SIDE = "/1144055111600740759.jfif";
const IMG_DELL_XPS = "/Dell%20XPS%2015%202-in-1%20review.jfif";
const IMG_HP_PROBOOK_440 = "/HP%20ProBook%20440%20G11_Processor_Intel%20Core%20Ultra%207...%20(1).jfif";
const IMG_HP_PROBOOK_450 = "/Hp%20ProBook%20450%20G8_%20Processor%20Corei%207%2011th....jfif";

const FALLBACK_LAPTOP = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80";
const FALLBACK_MACBOOK = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80";
const FALLBACK_DELL = "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80";
const FALLBACK_HP = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=700&q=80";

// ==========================================
// 4. HERO SLIDES DATA
// ==========================================
const HERO_SLIDES = [
  {
    id: 1,
    tag: 'Verified Hardware Inventory',
    title: 'Certified Enterprise Laptops &',
    highlight: 'Performance Workstations.',
    subtitle: 'Tested commercial HP EliteBooks, Dell Latitudes, and ZBooks inspected component-by-component for durable daily work and programming.',
    image: IMG_HP_PROBOOK_440,
    fallbackImage: FALLBACK_HP,
    buttonText: 'View All Laptops',
    targetCategory: 'Laptops'
  },
  {
    id: 2,
    tag: 'Authentic Silicon Stock',
    title: 'Apple MacBook Pro &',
    highlight: 'Liquid Retina Displays.',
    subtitle: 'Genuine M-Series MacBooks with healthy battery cycles, verified displays, and complete local testing warranty coverage.',
    image: IMG_MAC_TOP,
    fallbackImage: FALLBACK_MACBOOK,
    buttonText: 'Browse MacBooks',
    targetCategory: 'MacBooks'
  },
  {
    id: 3,
    tag: 'Tested Power Accessories',
    title: 'Precision Productivity &',
    highlight: 'Fast GaN Charging.',
    subtitle: 'Original GaN wall chargers, ergonomic multi-device mice, and tested hubs for reliable workstation performance.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80',
    buttonText: 'Browse Accessories',
    targetCategory: 'Accessories'
  },
  {
    id: 4,
    tag: 'Certified Flagship Models',
    title: 'Inspected Smartphones &',
    highlight: 'Hardware Essentials.',
    subtitle: 'Original smartphones checked for battery health, genuine displays, and secure nationwide courier dispatch.',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=80',
    buttonText: 'Explore Smartphones',
    targetCategory: 'Smartphones'
  }
];

// ==========================================
// 5. BASE MASTER INVENTORY DATA
// ==========================================
const BASE_INVENTORY: ProductItem[] = [
  {
    id: 'macbook-pro-14-m3',
    name: 'Apple MacBook Pro 14" (Apple M3 Pro Chip)',
    category: 'MacBooks',
    brand: 'Apple',
    pricePKR: 510000,
    originalPricePKR: 540000,
    rating: 4.9,
    reviewsCount: 14,
    condition: 'Brand New (Box Pack)',
    image: IMG_MAC_TOP,
    galleryImages: [IMG_MAC_TOP, IMG_MAC_SIDE, FALLBACK_MACBOOK],
    description: 'High-speed professional Apple Silicon M3 Pro laptop with up to 18 hours battery backup for developers and creators.',
    highlights: ['Apple M3 Pro 11-Core CPU', 'Liquid Retina XDR 120Hz Display', 'MagSafe 3 Fast Charging'],
    specs: { cpu: 'Apple M3 Pro (11-Core)', ram: '18GB Unified RAM', storage: '512GB Ultra-Fast NVMe SSD', screen: '14.2" 120Hz ProMotion XDR', ports: '3x Thunderbolt 4, HDMI, MagSafe 3' },
    stockCount: 3,
    featured: true,
    reviewsList: []
  },
  {
    id: 'macbook-air-13-m2',
    name: 'Apple MacBook Air 13.6" Liquid Retina M2',
    category: 'MacBooks',
    brand: 'Apple',
    pricePKR: 255000,
    originalPricePKR: 275000,
    rating: 4.9,
    reviewsCount: 22,
    condition: 'Brand New (Box Pack)',
    image: IMG_MAC_SIDE,
    galleryImages: [IMG_MAC_SIDE, IMG_MAC_TOP],
    description: 'Ultra-thin, silent fanless laptop powered by Apple M2 chip for students and mobile professionals.',
    highlights: ['Silent Fanless Architecture', '1080p FaceTime HD Camera', 'MagSafe 3 Charging'],
    specs: { cpu: 'Apple M2 Chip', ram: '8GB Unified RAM', storage: '256GB Fast PCIe SSD', screen: '13.6" Liquid Retina True Tone' },
    stockCount: 6,
    featured: false,
    reviewsList: []
  },
  {
    id: 'dell-xps-15-9530',
    name: 'Dell XPS 15 2-in-1 Creator Edition Touch',
    category: 'Laptops',
    brand: 'Dell',
    pricePKR: 285000,
    originalPricePKR: 310000,
    rating: 4.8,
    reviewsCount: 16,
    condition: 'Certified Refurbished',
    image: IMG_DELL_XPS,
    galleryImages: [IMG_DELL_XPS, FALLBACK_DELL],
    description: 'Foldable touchscreen workstation with InfinityEdge display and premium CNC aluminum chassis.',
    highlights: ['360 Convertible 2-in-1 Hinge', 'Touchscreen InfinityEdge', 'Machined Aluminum Finish'],
    specs: { cpu: 'Intel Core i7 10th Gen', ram: '16GB DDR4', storage: '512GB M.2 PCIe NVMe', screen: '15.6" Touch Display', gpu: 'Dedicated Graphics' },
    stockCount: 3,
    featured: true,
    reviewsList: []
  },
  {
    id: 'hp-probook-440-g11-ultra7',
    name: 'HP ProBook 440 G11 (Intel Core Ultra 7)',
    category: 'Laptops',
    brand: 'HP',
    pricePKR: 185000,
    originalPricePKR: 205000,
    rating: 4.9,
    reviewsCount: 8,
    condition: 'Brand New (Box Pack)',
    image: IMG_HP_PROBOOK_440,
    galleryImages: [IMG_HP_PROBOOK_440, FALLBACK_HP],
    description: 'Modern architecture Intel Core Ultra 7 processor with dedicated AI NPU acceleration.',
    highlights: ['Intel Core Ultra 7 Processor', 'DDR5 5600MHz High-Speed Architecture', 'Spill-Resistant Backlit Keyboard'],
    specs: { cpu: 'Intel Core Ultra 7 (Series 1)', ram: '16GB DDR5 5600MHz', storage: '512GB PCIe Gen4 NVMe', screen: '14.0" WUXGA IPS 300 nits', ports: '2x USB-C, HDMI 2.1, RJ-45' },
    stockCount: 4,
    featured: true,
    reviewsList: []
  },
  {
    id: 'hp-probook-450-g8-i7',
    name: 'HP ProBook 450 G8 (Core i7 11th Gen)',
    category: 'Laptops',
    brand: 'HP',
    pricePKR: 98000,
    originalPricePKR: 110000,
    rating: 4.7,
    reviewsCount: 19,
    condition: 'Certified Refurbished',
    image: IMG_HP_PROBOOK_450,
    galleryImages: [IMG_HP_PROBOOK_450, FALLBACK_HP],
    description: 'Durable 15.6-inch business workhorse with dedicated numpad, Core i7 11th Gen, and 16GB RAM.',
    highlights: ['Intel Core i7 11th Gen', '15.6 Full HD Screen with Numpad', 'A Grade Tested Unit with Original Charger'],
    specs: { cpu: 'Intel Core i7 11th Gen (1165G7)', ram: '16GB DDR4 High-Speed', storage: '512GB Fast NVMe SSD', screen: '15.6" Full HD Anti-Glare', ports: 'USB-C, 3x USB-A, HDMI' },
    stockCount: 5,
    featured: true,
    reviewsList: []
  },
  {
    id: 'hp-elitebook-840-g10-ddr5',
    name: 'HP EliteBook 840 G10 (DDR5 NVMe)',
    category: 'Laptops',
    brand: 'HP',
    pricePKR: 122000,
    rating: 4.9,
    reviewsCount: 10,
    condition: 'Certified Refurbished',
    image: IMG_HP_SILVER,
    galleryImages: [IMG_HP_SILVER, FALLBACK_HP],
    description: 'Core i5 13th Gen with 16GB DDR5 RAM, 256GB NVMe SSD, backlit keyboard, and Type-C fast charging.',
    highlights: ['16GB DDR5 RAM', 'NVMe High-Speed SSD', 'Original Type-C Charger Included'],
    specs: { cpu: 'Core i5 13th Gen', ram: '16GB RAM DDR5', storage: '256GB NVMe SSD', screen: '14.1" Full HD Resolution' },
    stockCount: 6,
    featured: true,
    reviewsList: []
  },
  {
    id: 'hp-830-g10-ddr5-openbox',
    name: 'HP EliteBook 830 G10 (DDR5 512GB)',
    category: 'Laptops',
    brand: 'HP',
    pricePKR: 128000,
    originalPricePKR: 140000,
    rating: 5.0,
    reviewsCount: 15,
    condition: 'Brand New (Box Pack)',
    image: IMG_HP_SILVER,
    galleryImages: [IMG_HP_SILVER],
    description: 'Open box like-new condition compact business notebook with 13th Gen Core i5 and DDR5 memory.',
    highlights: ['Open Box Like New', '16GB DDR5 RAM + 512GB SSD', 'Original Type-C Charger'],
    specs: { cpu: 'Core i5 13th Gen', ram: '16GB RAM DDR5', storage: '512GB SSD', screen: '13.3" Full HD Display' },
    stockCount: 4,
    featured: true,
    reviewsList: []
  },
  {
    id: 'hp-840-g4-i5',
    name: 'HP EliteBook 840 G4 Workhorse',
    category: 'Laptops',
    brand: 'HP',
    pricePKR: 38500,
    rating: 4.5,
    reviewsCount: 18,
    condition: 'Certified Refurbished',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=700&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=700&q=80'],
    description: 'Budget office workhorse with Core i5 7th Gen, 8GB RAM, and 14.1" LED screen. Includes camera and original charger.',
    highlights: ['Core i5 7th Gen', 'A Grade Tested Stock', 'Original HP Charger'],
    specs: { cpu: 'Core i5 7th Gen', ram: '8GB RAM', storage: '256GB SSD', screen: '14.1" LED Display' },
    stockCount: 7,
    featured: false,
    reviewsList: []
  },
  {
    id: 'hp-840-g5-i7',
    name: 'HP EliteBook 840 G5 (i7 Backlit)',
    category: 'Laptops',
    brand: 'HP',
    pricePKR: 54000,
    rating: 4.7,
    reviewsCount: 25,
    condition: 'Certified Refurbished',
    image: IMG_HP_SILVER,
    galleryImages: [IMG_HP_SILVER],
    description: '14.1" Full HD laptop featuring Core i7 8th Gen, illuminated backlit keyboard, webcam, and original charger.',
    highlights: ['Backlit Keyboard', 'Full HD 1080p Resolution', 'A Grade Tested Stock'],
    specs: { cpu: 'Core i7 8th Gen', ram: '8GB RAM', storage: '256GB SSD', screen: '14.1" Full HD LED' },
    stockCount: 8,
    featured: false,
    reviewsList: []
  },
  {
    id: 'hp-850-g5-i7-gpu',
    name: 'HP EliteBook 850 G5 Touch (i7 + 2GB Card)',
    category: 'Laptops',
    brand: 'HP',
    pricePKR: 62000,
    rating: 4.8,
    reviewsCount: 20,
    condition: 'Certified Refurbished',
    image: IMG_HP_SILVER,
    galleryImages: [IMG_HP_SILVER],
    description: 'Core i7 8th Gen with 15.6" Full HD Touch Screen and dedicated 2GB card for graphics and editing.',
    highlights: ['Touch Screen Display', '2GB Dedicated Card', 'A Grade Stock'],
    specs: { cpu: 'Core i7 8th Gen', ram: '8GB RAM', storage: '256GB SSD', screen: '15.6" Full HD Touch Screen', gpu: '2GB Dedicated Card' },
    stockCount: 4,
    featured: false,
    reviewsList: []
  },
  {
    id: 'hp-830-g8-i7',
    name: 'HP EliteBook 830 G8 (i7 11th Gen)',
    category: 'Laptops',
    brand: 'HP',
    pricePKR: 78000,
    rating: 4.8,
    reviewsCount: 16,
    condition: 'Certified Refurbished',
    image: IMG_HP_SILVER,
    galleryImages: [IMG_HP_SILVER],
    description: 'High-speed 11th Gen Core i7 laptop with 16GB RAM, backlit keyboard, and compact 13.3" Full HD display.',
    highlights: ['16GB RAM + Core i7 11th Gen', 'Backlit Keyboard', 'A Grade Fresh Stock'],
    specs: { cpu: 'Core i7 11th Gen', ram: '16GB RAM', storage: '256GB SSD', screen: '13.3" Full HD LED' },
    stockCount: 5,
    featured: false,
    reviewsList: []
  },
  {
    id: 'thinkpad-x1-carbon-gen11',
    name: 'Lenovo ThinkPad X1 Carbon Gen 11 Ultrabook',
    category: 'Laptops',
    brand: 'Lenovo',
    pricePKR: 320000,
    originalPricePKR: 350000,
    rating: 4.8,
    reviewsCount: 9,
    condition: 'Brand New (Box Pack)',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80'],
    description: 'Ultralight carbon-fiber business notebook with Intel Core i7 13th Gen vPro and spill-resistant keyboard.',
    highlights: ['Ultra-light 1.12kg Chassis', 'Spill-resistant Keyboard', 'Core i7 13th Gen vPro'],
    specs: { cpu: 'Intel Core i7-1365U vPro', ram: '16GB LPDDR5 6400MHz', storage: '1TB Gen4 Performance NVMe', screen: '14.0" WUXGA Anti-Glare IPS', ports: '2x Thunderbolt 4, 2x USB-A' },
    stockCount: 5,
    featured: true,
    reviewsList: []
  },
  {
    id: 'dell-latitude-5520',
    name: 'Dell Latitude 5520 Backlit Professional',
    category: 'Laptops',
    brand: 'Dell',
    pricePKR: 68000,
    rating: 4.7,
    reviewsCount: 15,
    condition: 'Certified Refurbished',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80'],
    description: 'Core i5 11th Gen with 16GB RAM, 256GB SSD, backlit keyboard, camera, and 15.6" Full HD display.',
    highlights: ['Core i5 11th Gen', 'Backlit Keyboard', 'A Grade Tested Stock'],
    specs: { cpu: 'Core i5 11th Gen', ram: '16GB RAM', storage: '256GB SSD', screen: '15.6" Full HD LED' },
    stockCount: 6,
    featured: false,
    reviewsList: []
  },
  {
    id: 'dell-latitude-5400',
    name: 'Dell Latitude 5400 (Core i7 8th Gen)',
    category: 'Laptops',
    brand: 'Dell',
    pricePKR: 48000,
    rating: 4.6,
    reviewsCount: 19,
    condition: 'Certified Refurbished',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80'],
    description: 'Core i7 8th Gen with 8GB RAM, 256GB SSD, camera, charger, and 14.1" Full HD display.',
    highlights: ['Core i7 8th Gen', 'Full HD 1080p Screen', 'A Grade Tested Stock'],
    specs: { cpu: 'Core i7 8th Gen', ram: '8GB RAM', storage: '256GB SSD', screen: '14.1" Full HD LED' },
    stockCount: 7,
    featured: false,
    reviewsList: []
  },
  {
    id: 'hp-zbook-fury-15-g8-4k',
    name: 'HP ZBook Fury 15 G8 4K Touch Workstation',
    category: 'Laptops',
    brand: 'HP',
    pricePKR: 155000,
    originalPricePKR: 170000,
    rating: 5.0,
    reviewsCount: 11,
    condition: 'Certified Refurbished',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80'],
    description: 'Heavy duty CAD/3D workstation. Core i7 11850H, 4K Gorilla Glass Touchscreen, and 4GB NVIDIA T1200 graphics.',
    highlights: ['4K Gorilla Glass Touch', '4GB Dedicated Graphics (T1200)', 'Core i7 11850H Performance'],
    specs: { cpu: 'Core i7 11th Gen (11850H)', ram: '16GB RAM', storage: '512GB SSD', screen: '15.6" 4K Gorilla Glass Touch', gpu: '4GB Graphics (T1200)' },
    stockCount: 2,
    featured: true,
    reviewsList: []
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra 5G (PTA Approved)',
    category: 'Smartphones',
    brand: 'Samsung',
    pricePKR: 345000,
    originalPricePKR: 370000,
    rating: 4.9,
    reviewsCount: 31,
    condition: 'Brand New (Box Pack)',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=700&q=80'],
    description: 'Official PTA Approved flagship phone with Titanium frame, built-in S-Pen, and 200MP camera.',
    highlights: ['Aerospace Grade Titanium Frame', '200MP Camera with 100x Zoom', 'Built-in S-Pen Stylus'],
    specs: { cpu: 'Snapdragon 8 Gen 3', ram: '12GB LPDDR5X', storage: '512GB Fast UFS 4.0', screen: '6.8" Dynamic AMOLED 2X 120Hz' },
    stockCount: 4,
    featured: true,
    reviewsList: []
  },
  {
    id: 'anker-prime-charger',
    name: 'Anker Prime 100W GaN Fast Charger',
    category: 'Accessories',
    brand: 'Anker',
    pricePKR: 18500,
    originalPricePKR: 22000,
    rating: 4.8,
    reviewsCount: 44,
    condition: 'Brand New (Box Pack)',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80'],
    description: 'Universal 3-port fast wall charger with GaN technology for MacBooks and smartphones.',
    highlights: ['100W Max Output', 'ActiveShield 2.0 Temperature Protection', 'Compact Travel Size'],
    specs: { cpu: 'GaN Technology 2.0', ram: 'N/A', storage: '2x USB-C + 1x USB-A Ports', screen: 'N/A' },
    stockCount: 14,
    featured: false,
    reviewsList: []
  },
  {
    id: 'logitech-mx-master-3s',
    name: 'Logitech MX Master 3S Wireless Mouse',
    category: 'Accessories',
    brand: 'Logitech',
    pricePKR: 24500,
    originalPricePKR: 28000,
    rating: 4.9,
    reviewsCount: 88,
    condition: 'Brand New (Box Pack)',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=80'],
    description: 'Ergonomic precision mouse with MagSpeed electromagnetic scroll and 90% quieter clicks.',
    highlights: ['MagSpeed 1,000 lines/sec Scroll', 'Quiet clicks reduce noise', 'Works on glass'],
    specs: { cpu: '8000 DPI Darkfield Sensor', ram: 'N/A', storage: 'N/A', screen: 'N/A' },
    stockCount: 11,
    featured: false,
    reviewsList: []
  }
];

const FEATURED_STREAM_LAPTOPS = [
  { id: 'm-dell-xps', name: 'Dell XPS 15 2-in-1', image: IMG_DELL_XPS, fallback: FALLBACK_DELL },
  { id: 'm-mac-top', name: 'Apple MacBook Pro', image: IMG_MAC_TOP, fallback: FALLBACK_MACBOOK },
  { id: 'm-hp-pro440', name: 'HP ProBook 440 G11', image: IMG_HP_PROBOOK_440, fallback: FALLBACK_HP },
  { id: 'm-mac-side', name: 'Apple MacBook Air M2', image: IMG_MAC_SIDE, fallback: FALLBACK_MACBOOK },
  { id: 'm-hp-pro450', name: 'HP ProBook 450 G8', image: IMG_HP_PROBOOK_450, fallback: FALLBACK_HP },
  { id: 'm-hp-silver', name: 'HP EliteBook 840 Silver', image: IMG_HP_SILVER, fallback: FALLBACK_HP },
  { id: 'm-thinkpad', name: 'Lenovo ThinkPad X1 Carbon', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=700&q=80', fallback: FALLBACK_LAPTOP },
  { id: 'm-dell-workstation', name: 'Dell Precision Mobile', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=700&q=80', fallback: FALLBACK_DELL }
];

const FEATURED_STREAM_ACCESSORIES = [
  { id: 'acc-anker', name: 'Anker GaN Charger', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=700&q=80' },
  { id: 'acc-logitech', name: 'Logitech MX Master 3S', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=80' },
  { id: 'acc-headphone', name: 'Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80' },
  { id: 'acc-keyboard', name: 'Mechanical Keyboard', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80' },
  { id: 'acc-earbuds', name: 'Wireless Earbuds', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80' },
  { id: 'acc-speaker', name: 'Bluetooth Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80' }
];

const CATEGORIES = ['All', 'Laptops', 'MacBooks', 'Smartphones', 'Accessories'];
const BRANDS = ['Apple', 'Lenovo', 'Dell', 'HP', 'Samsung', 'Anker', 'Logitech'];

const formatPKR = (amount: number | undefined): string => {
  if (typeof amount !== 'number') return 'Rs. 0';
  return 'Rs. ' + amount.toLocaleString('en-PK');
};

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.127-.521-1.625-.675-2.671-2.316-2.752-2.424-.081-.108-.66-.879-.66-1.677 0-.798.417-1.191.564-1.353.147-.162.324-.202.433-.202.108 0 .216.002.311.006.104.004.24-.039.375.285.14.336.478 1.162.52 1.248.042.086.07.187.012.302-.058.115-.087.187-.173.289l-.26.307c-.086.101-.177.21-.076.384.101.174.449.741.964 1.201.663.591 1.222.774 1.396.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.174.232-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.203.043.072.043.419-.101.824zM12 2C6.477 2 2 6.477 2 12c0 1.819.49 3.524 1.344 4.992L2 22l5.16-1.328A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.634 0-3.15-.466-4.44-1.272l-.318-.198-3.067.789.819-2.991-.218-.337A8.223 8.223 0 013.75 12c0-4.549 3.701-8.25 8.25-8.25s8.25 3.701 8.25 8.25c0 4.549-3.701 8.25-8.25 8.25z" />
  </svg>
);

// ==========================================
// 6. CLOUD-SYNCED ADMIN PANEL
// ==========================================
function EmbeddedAdminModal({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onClose
}: {
  products: ProductItem[];
  onAddProduct: (newProduct: ProductItem) => Promise<void>;
  onUpdateProduct: (updatedProduct: ProductItem) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onClose: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState<'HP' | 'Dell' | 'Lenovo' | 'Apple' | 'Samsung'>('HP');
  const [category, setCategory] = useState<'Laptops' | 'MacBooks' | 'Accessories'>('Laptops');
  const [price, setPrice] = useState<number | string>('');
  const [cpu, setCpu] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [screen, setScreen] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleStartEdit = (product: ProductItem) => {
    setEditingId(product.id);
    setName(product.name || '');
    setBrand((product.brand as 'HP' | 'Dell' | 'Lenovo' | 'Apple' | 'Samsung') || 'HP');
    setCategory((product.category as 'Laptops' | 'MacBooks' | 'Accessories') || 'Laptops');
    setPrice(product.pricePKR || '');
    setCpu(product.specs?.cpu || '');
    setRam(product.specs?.ram || '');
    setStorage(product.specs?.storage || '');
    setScreen(product.specs?.screen || '');
    setImagePreview(product.image || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setCpu('');
    setRam('');
    setStorage('');
    setScreen('');
    setImagePreview('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      alert('Cloud Storage configured nahi hai (.env keys check karein).');
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setImagePreview(data.publicUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown upload error';
      alert('Tasveer upload fail ho gayi: ' + message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      alert('Tasveer abhi cloud par upload ho rahi hai, 2 second intezar karein.');
      return;
    }
    if (!name.trim() || !price || !imagePreview) {
      alert('Product Name, Price aur Image lazmi add karein.');
      return;
    }

    try {
      setIsSaving(true);
      if (editingId) {
        const existingProduct = products.find(p => p.id === editingId);
        const updatedProd: ProductItem = {
          id: editingId,
          name: name.trim(),
          brand: brand,
          category: category,
          pricePKR: Number(price) || 0,
          originalPricePKR: existingProduct?.originalPricePKR,
          rating: existingProduct?.rating || 5.0,
          reviewsCount: existingProduct?.reviewsCount || 1,
          condition: existingProduct?.condition || 'Certified Refurbished',
          image: imagePreview,
          galleryImages: [imagePreview],
          description: existingProduct?.description || `Tested Grade-A ${brand} corporate device.`,
          highlights: existingProduct?.highlights || ['Diagnostic Tested', 'Original Screen'],
          specs: {
            cpu: cpu.trim() || existingProduct?.specs?.cpu || 'Core i5',
            ram: ram.trim() || existingProduct?.specs?.ram || '16GB RAM',
            storage: storage.trim() || existingProduct?.specs?.storage || '512GB SSD',
            screen: screen.trim() || existingProduct?.specs?.screen || '14.1" Full HD'
          },
          stockCount: existingProduct?.stockCount || 5,
          featured: existingProduct?.featured ?? true,
          reviewsList: existingProduct?.reviewsList || []
        };

        await onUpdateProduct(updatedProd);
        alert('✓ Live Storefront par product aur photo update ho gayi!');
        handleCancelEdit();
      } else {
        const newProd: ProductItem = {
          id: `prod-${Date.now()}`,
          name: name.trim(),
          brand: brand,
          category: category,
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

        await onAddProduct(newProd);
        alert('✓ Nayi product live website par publish ho gayi!');
        handleCancelEdit();
      }
    } finally {
      setIsSaving(false);
    }
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

  const safeProductsList = Array.isArray(products) ? products.filter(Boolean) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                SkillBook Cloud Inventory Manager
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${supabase ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'}`}>
                {supabase ? '● Live Cloud Connected' : '○ Offline'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Yahan se ki gayi har tabdeeli foran sab mobiles aur laptops par live update hoti hai.
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
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-700">
              {editingId ? '✏️ 1. Edit / Update Selected Product' : '➕ 1. Nayi Product Live Publish Karein'}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Cancel Edit Mode
              </button>
            )}
          </div>
          
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
                onChange={(e) => setBrand(e.target.value as 'HP' | 'Dell' | 'Lenovo' | 'Apple' | 'Samsung')}
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
                onChange={(e) => setCategory(e.target.value as 'Laptops' | 'MacBooks' | 'Accessories')}
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
            <label className="text-xs font-bold text-slate-800 block mb-1">
              {editingId ? 'Photo Change Karein (Cloud Upload):' : 'Upload Real Photo (Phone Camera / Gallery):'}
            </label>
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleImageUpload}
              className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer disabled:opacity-50"
            />
            {isUploading && (
              <p className="mt-2 text-xs font-bold text-sky-600 animate-pulse">
                ⏳ Tasveer cloud server par upload ho rahi hai...
              </p>
            )}
            {imagePreview && !isUploading && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[11px] text-emerald-600 font-bold">✓ Cloud Photo Ready:</span>
                <img src={imagePreview} alt="Preview" className="h-16 w-20 object-contain bg-white rounded-lg p-1 border border-slate-200" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUploading || isSaving}
            className={`w-full py-2.5 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm text-white disabled:opacity-50 ${
              editingId ? 'bg-sky-600 hover:bg-sky-500' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isSaving ? 'Saving to Cloud...' : editingId ? '✓ Update Live Product' : '+ Publish Product to Live Store'}
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
              📥 Export Backup JSON
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
            {safeProductsList.length === 0 ? (
              <p className="text-xs text-slate-400 p-2 text-center">Koi products nahi hain.</p>
            ) : (
              safeProductsList.map((p) => {
                const displayPrice = typeof p?.pricePKR === 'number' 
                  ? p.pricePKR.toLocaleString('en-PK') 
                  : (p?.pricePKR || '0');

                return (
                  <div key={p?.id || Math.random().toString()} className="py-2.5 flex items-center justify-between text-xs px-2 hover:bg-white rounded-xl transition">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={p?.image || FALLBACK_LAPTOP} 
                        alt={p?.name || 'Item'} 
                        className="h-9 w-9 object-contain rounded bg-white p-0.5 border" 
                      />
                      <div className="truncate max-w-[180px] sm:max-w-xs">
                        <span className="font-semibold text-slate-800 block truncate">{p?.name || 'Unnamed Device'}</span>
                        <span className="text-[10px] text-slate-400">{p?.brand} • {p?.specs?.cpu || ''}</span>
                      </div>
                      <span className="text-sky-700 font-bold ml-2">Rs. {displayPrice}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(p)}
                        className="text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 font-bold px-2.5 py-1 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Kya aap "${p.name}" ko live store se delete karna chahte hain?`)) {
                            await onDeleteProduct(p.id);
                          }
                        }}
                        className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold px-2.5 py-1 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. MAIN APPLICATION ROOT COMPONENT
// ==========================================
export default function App() {
  const [products, setProducts] = useState<ProductItem[]>(BASE_INVENTORY);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  // Fetch & Merge Live Cloud Products on Mount
  useEffect(() => {
    const syncCloudProducts = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const cloudItems = data as ProductItem[];
          const cloudIds = new Set(cloudItems.map(item => item.id));
          const remainingBase = BASE_INVENTORY.filter(
            baseItem => !cloudIds.has(baseItem.id) && !deletedIds.includes(baseItem.id)
          );
          setProducts([...cloudItems, ...remainingBase]);
        }
      } catch (err) {
        console.error('Cloud sync failed, showing base catalog:', err);
      }
    };

    syncCloudProducts();
  }, [deletedIds]);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(600000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      const pin = prompt('Enter Secure Admin PIN:');
      if (pin === '786') {
        setIsAdminOpen(true);
      } else if (pin !== null) {
        alert('Invalid Admin PIN.');
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const pin = prompt('Enter Secure Admin PIN:');
        if (pin === '786') {
          setIsAdminOpen(true);
        } else if (pin !== null) {
          alert('Invalid Admin PIN.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareId1, setCompareId1] = useState<string>('hp-probook-440-g11-ultra7');
  const [compareId2, setCompareId2] = useState<string>('dell-xps-15-9530');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'warranty' | 'reviews'>('overview');
  const [selectedImage, setSelectedImage] = useState<string>('');

  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState<number>(5);
  const [reviewerComment, setReviewerComment] = useState('');

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState<OrderReceipt | null>(null);

  const handleAddProduct = async (newProd: ProductItem) => {
    setProducts(prev => [newProd, ...prev]);
    if (supabase) {
      const { error } = await supabase.from('products').insert([newProd]);
      if (error) {
        alert('Cloud database save error: ' + error.message);
      }
    }
  };

  const handleUpdateProduct = async (updatedProduct: ProductItem) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    if (supabase) {
      const { error } = await supabase.from('products').upsert([updatedProduct]);
      if (error) {
        alert('Cloud database update error: ' + error.message);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setDeletedIds(prev => [...prev, id]);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert('Cloud delete error: ' + error.message);
      }
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (!item) return false;
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(item.brand);
      const matchPrice = (item.pricePKR || 0) <= maxPrice;
      const matchSearch =
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.specs?.cpu || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchBrand && matchPrice && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.pricePKR || 0) - (b.pricePKR || 0);
      if (sortBy === 'price-high') return (b.pricePKR || 0) - (a.pricePKR || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedBrands, maxPrice, searchQuery, sortBy]);

  const compProduct1 = useMemo(() => products.find((p) => p.id === compareId1) || products[0] || BASE_INVENTORY[0], [products, compareId1]);
  const compProduct2 = useMemo(() => products.find((p) => p.id === compareId2) || products[1] || BASE_INVENTORY[1], [products, compareId2]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const addToCart = (product: ProductItem) => {
    if (!product?.id) return;
    setCart((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      return;
    }
    setCart((prev) => ({ ...prev, [id]: qty }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const totalCartCount = useMemo(() => Object.values(cart).reduce((sum, count) => sum + count, 0), [cart]);

  const cartItems = useMemo(() => {
    return Object.keys(cart)
      .map((id) => {
        const item = products.find((p) => p.id === id);
        if (!item) return null;
        return { ...item, quantity: cart[id] };
      })
      .filter((item): item is ProductItem & { quantity: number } => item !== null);
  }, [cart, products]);

  const subtotalPKR = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.pricePKR || 0) * item.quantity, 0);
  }, [cartItems]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);
  };

  const openProductDetails = (product: ProductItem) => {
    setActiveProduct(product);
    setSelectedImage(product.image);
    setActiveTab('overview');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !reviewerName.trim() || !reviewerComment.trim()) return;

    const newRev: ProductReview = {
      id: 'rev-' + Date.now(),
      userName: reviewerName.trim(),
      rating: reviewerRating,
      date: 'Just now',
      comment: reviewerComment.trim(),
    };

    const updatedList = [newRev, ...(activeProduct.reviewsList || [])];
    const newRating = Number((updatedList.reduce((acc, r) => acc + r.rating, 0) / updatedList.length).toFixed(1));

    const updatedProduct = {
      ...activeProduct,
      rating: newRating,
      reviewsCount: updatedList.length,
      reviewsList: updatedList,
    };

    setActiveProduct(updatedProduct);
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    setReviewerName('');
    setReviewerComment('');
    setReviewerRating(5);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerCity.trim() || !customerAddress.trim()) {
      alert('Meharbani karke Apna Naam, Phone Number, City, aur Complete Delivery Address likhein.');
      return;
    }

    const orderId = 'SKILL-' + Math.floor(100000 + Math.random() * 900000);
    const orderData: OrderReceipt = {
      orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryCity: customerCity.trim(),
      deliveryAddress: customerAddress.trim(),
      items: cartItems,
      totalPKR: subtotalPKR,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    const emailSubject = encodeURIComponent(`New COD Order: ${orderId} - ${customerName.trim()}`);
    const itemsListText = cartItems.map(item => `- ${item.name} (Qty: ${item.quantity}) - Rs. ${((item.pricePKR || 0) * item.quantity).toLocaleString('en-PK')}`).join('\n');
    const emailBody = encodeURIComponent(
      `NEW CUSTOMER ORDER RECEIVED ON SKILLBOOK\n` +
      `=========================================\n\n` +
      `Order ID: ${orderId}\n` +
      `Customer Name: ${customerName.trim()}\n` +
      `Contact Phone: ${customerPhone.trim()}\n` +
      `City: ${customerCity.trim()}\n` +
      `Delivery Address: ${customerAddress.trim()}\n\n` +
      `ORDERED ITEMS:\n` +
      `${itemsListText}\n\n` +
      `TOTAL AMOUNT DUE (COD): Rs. ${subtotalPKR.toLocaleString('en-PK')}\n` +
      `Date: ${orderData.date}\n\n` +
      `Please verify customer on WhatsApp and dispatch parcel.`
    );

    window.open(`mailto:${OFFICIAL_EMAIL}?subject=${emailSubject}&body=${emailBody}`, '_blank');

    setOrderConfirmed(orderData);
    setCart({});
    setShowCheckoutForm(false);
    setIsCartOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrands([]);
    setMaxPrice(600000);
    setSearchQuery('');
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20 md:pb-12 antialiased font-sans">
      <div className="hidden md:block bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-3">
            <span>✉️ Order Desk: <strong className="text-sky-400">{OFFICIAL_EMAIL}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">✓ Tested Hardware Verification</span>
          </div>
          <div className="flex items-center gap-3">
            <span>⚡ Nationwide Delivery Across Pakistan (COD Available)</span>
            <span className="text-slate-600">|</span>
            <span className="text-sky-400 font-semibold">✓ 7-Day Testing Warranty</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div onClick={resetFilters} className="flex items-center cursor-pointer select-none -ml-2 sm:-ml-1 group shrink-0">
            <div className="relative h-11 sm:h-13 w-auto flex items-center overflow-visible">
              <img 
                src="/skillbook.png" 
                alt="SKILLBOOK" 
                className="h-full w-auto max-w-[140px] sm:max-w-[200px] object-contain scale-125 origin-left transition duration-200 group-hover:scale-130"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('skillbook-logo')) {
                    target.src = '/skillbook-logo.png';
                  }
                }}
              />
            </div>
          </div>

          <div className="flex-1 max-w-[260px] sm:max-w-md mx-1 sm:mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search MacBook, ThinkPad, Core i7..."
                className="w-full bg-slate-100/90 border border-slate-200/90 rounded-xl pl-3 pr-3 py-1.5 text-[11px] sm:text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-sky-600 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-sky-600/30 bg-sky-50 text-sky-800 px-3 py-2 text-xs font-bold hover:bg-sky-100 transition shadow-xs"
            >
              <span>Compare Laptops</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold shadow-sm active:scale-95 transition shrink-0"
            >
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="bg-sky-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="store-hero pt-2 pb-6 md:py-12 px-4 border-b border-slate-200/80 overflow-hidden">
        <div className="store-hero__inner !p-0 md:!p-6">
          <div className="store-hero__content !min-h-0 gap-3 md:gap-8">
            <div key={`hero-copy-track-${currentSlide.id}`} className="store-hero__copy space-y-2 md:space-y-3 text-center md:text-left mx-auto md:mx-0">
              <div className="anim-step anim-badge inline-block">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200/80 text-sky-800 text-[10px] md:text-[11px] font-bold rounded-full uppercase tracking-wider shadow-2xs">
                  <span>🏷️</span>
                  <span>{currentSlide.tag}</span>
                </span>
              </div>
              
              <h1 className="anim-step anim-heading text-[24px] sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
                {currentSlide.title}{' '}
                <span className="text-[#0d6b94] block sm:inline">{currentSlide.highlight}</span>
              </h1>

              <p className="anim-step anim-desc text-[11px] sm:text-sm text-slate-600 max-w-md mx-auto md:mx-0 font-normal leading-relaxed">
                {currentSlide.subtitle}
              </p>

              <div className="anim-step anim-cta pt-0.5">
                <button
                  onClick={() => setSelectedCategory(currentSlide.targetCategory)}
                  className="store-hero__button !min-h-[40px] md:!min-h-[48px] !px-5 md:!px-6 !text-xs md:!text-sm"
                >
                  <span>{currentSlide.buttonText}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <div key={`hero-img-track-${currentSlide.id}`} className="store-hero__visual flex flex-col items-center anim-step anim-image mt-1 md:mt-0">
              <div className="store-hero__image-wrap w-full max-w-[280px] sm:max-w-md bg-white/70 backdrop-blur-xs rounded-2xl p-3 md:p-4 flex items-center justify-center border border-slate-200/90 shadow-xs">
                <img 
                  src={currentSlide.image} 
                  alt={currentSlide.title} 
                  className="h-full w-full object-contain" 
                  loading="eager" 
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (currentSlide.fallbackImage) target.src = currentSlide.fallbackImage;
                  }}
                />
              </div>
            </div>
          </div>

          <div className="store-hero__dots !mt-2.5 md:!mt-5" role="group">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={currentSlideIndex === idx ? 'is-active' : ''}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-5 w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center sm:text-left">
            <h4 className="text-xs font-bold text-slate-900">🚚 Free Fast Delivery</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500">All Pakistan 24-48h dispatch</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center sm:text-left">
            <h4 className="text-xs font-bold text-slate-900">🛡️ 1-Year Hardware Cover</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Component testing support</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center sm:text-left">
            <h4 className="text-xs font-bold text-slate-900">🔄 7-Day Replacement</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Hassle-free hardware check</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center sm:text-left">
            <h4 className="text-xs font-bold text-slate-900">📦 Open Box Inspection</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Check device before payment</p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-1 max-w-6xl mx-auto w-full">
        <div className="rounded-2xl bg-white p-3 border border-slate-200/80 shadow-xs overflow-hidden">
          <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider block mb-2">Featured Hardware Collection</span>
          
          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Verified Laptops</span>
          <div className="overflow-hidden w-full relative mb-3">
            <div className="animate-marquee-left flex gap-3">
              {[...FEATURED_STREAM_LAPTOPS, ...FEATURED_STREAM_LAPTOPS].map((item, idx) => (
                <div key={idx} className="h-24 w-52 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 p-2 sm:h-28 sm:w-56 flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="h-full w-full object-contain hover:scale-105 transition duration-500" 
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (item.fallback) target.src = item.fallback;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Accessories & Adapters</span>
          <div className="overflow-hidden w-full relative">
            <div className="animate-marquee-right flex gap-3">
              {[...FEATURED_STREAM_ACCESSORIES, ...FEATURED_STREAM_ACCESSORIES].map((item, idx) => (
                <div key={idx} className="h-28 w-48 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 p-2 sm:h-32 sm:w-52 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain hover:scale-105 transition duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-5 max-w-7xl mx-auto w-full">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                selectedCategory === cat ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main id="catalog" className="px-4 pt-5 max-w-7xl mx-auto w-full flex-1">
        <div className="flex items-center justify-between gap-4 pb-4">
          <span className="text-xs font-medium text-slate-500">
            Showing <strong className="text-slate-900 font-semibold">{filteredProducts.length}</strong> available devices
          </span>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Budget Filter (PKR)</span>
                <button onClick={resetFilters} className="text-[11px] font-semibold text-sky-600 hover:underline">Clear All</button>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Max Budget</span>
                  <span className="font-bold text-slate-900">{formatPKR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="600000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-2 w-full accent-sky-600"
                />
              </div>

              <div className="mt-6">
                <span className="text-xs font-semibold text-slate-700 block mb-2.5">Select Brand</span>
                <div className="space-y-2">
                  {BRANDS.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map((p) => (
                <article key={p.id} className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white transition hover:border-slate-300 hover:shadow-sm overflow-hidden relative">
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute right-2.5 top-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs"
                  >
                    <span className={wishlist.includes(p.id) ? 'text-rose-500' : 'text-slate-400'}>♥</span>
                  </button>

                  <div onClick={() => openProductDetails(p)} className="relative aspect-4/3 w-full bg-slate-50 p-4 sm:p-6 flex items-center justify-center cursor-pointer">
                    <span className="absolute left-2.5 top-2.5 bg-white px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-slate-600 border border-slate-200 rounded">
                      {p.brand}
                    </span>
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      loading="lazy" 
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105" 
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (p.galleryImages && p.galleryImages[1]) {
                          target.src = p.galleryImages[1];
                        } else {
                          target.src = FALLBACK_LAPTOP;
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                      <span className="text-amber-500 font-medium">★ {p.rating} ({p.reviewsCount})</span>
                      <span className="text-[10px] font-medium text-emerald-600">Stock: {p.stockCount}</span>
                    </div>

                    <h3 onClick={() => openProductDetails(p)} className="font-semibold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-sky-600 transition">
                      {p.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-1 text-[9px] sm:text-[10px] text-slate-500">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium">{p.specs?.cpu}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium">{p.specs?.ram}</span>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs sm:text-base font-bold text-slate-900 block leading-tight">{formatPKR(p.pricePKR)}</span>
                      <button
                        onClick={() => addToCart(p)}
                        className="rounded-xl bg-slate-900 px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-xs font-semibold text-white hover:bg-slate-800 transition active:scale-95"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full border-t border-slate-200 mt-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Transparent Standards
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-slate-900">
            Why buyers trust SkillBook
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Every machine is individually stress-tested, thermal-checked, and accurately graded before being listed.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:text-left shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 mx-auto sm:mx-0 font-bold">
              🔍
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Multi-Point Diagnostic Check</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Display panels, battery health percentage, SSD endurance, and thermals are verified on professional diagnostic tools.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:text-left shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 mx-auto sm:mx-0 font-bold">
              📦
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Check Before Payment</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Open parcel inspection upon delivery ensures complete peace of mind before paying cash to the courier.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center sm:text-left shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 mx-auto sm:mx-0 font-bold">
              🤝
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Direct Founder & Support Help</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              No automated chatbots. Chat directly on WhatsApp for authentic photos, battery health screenshots, and spec guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">
              About SkillBook
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Reliable computing hardware without the gray-market confusion.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              SkillBook is dedicated to delivering grade-A tested enterprise laptops, genuine MacBooks, and high-performance charging accessories. We focus on component transparency, honest grading, and straightforward customer service across Pakistan.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
              <div>
                <span className="text-lg sm:text-xl font-bold text-white">100% Genuine</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Original Chargers & Units</p>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold text-white">7-Day</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Testing Warranty</p>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold text-white">Direct</span>
                <p className="text-[11px] text-slate-400 mt-0.5">WhatsApp Assistance</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-sm font-semibold text-white">Need Spec Advice or Live Video?</h3>
            <p className="mt-1 text-xs text-slate-400">
              Message us to get real live videos, battery health reports, and personalized recommendations for your workflow.
            </p>
            <a
              href={`https://wa.me/${OFFICIAL_WHATSAPP_INT}?text=Hello%20SkillBook,%20I%20want%20to%20see%20live%20pictures%20and%20specs%20of%20available%20laptops.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 w-full border-t border-slate-200 mt-10">
        <span className="text-center block text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
          Hardware Platforms Supported
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70">
          <span className="text-xl font-extrabold tracking-tight text-slate-800">HP</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">DELL</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">LENOVO</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">APPLE</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">SAMSUNG</span>
          <span className="text-xl font-extrabold tracking-tight text-slate-800">ANKER</span>
        </div>
      </section>

      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-5 border border-slate-200 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Side-by-Side Laptop Comparison</h3>
              <button onClick={() => setIsCompareModalOpen(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Laptop 1:</label>
                <select value={compareId1} onChange={(e) => setCompareId1(e.target.value)} className="w-full text-xs border rounded-xl p-2 bg-slate-50">
                  {products.filter(p => p.category === 'Laptops' || p.category === 'MacBooks').map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Laptop 2:</label>
                <select value={compareId2} onChange={(e) => setCompareId2(e.target.value)} className="w-full text-xs border rounded-xl p-2 bg-slate-50">
                  {products.filter(p => p.category === 'Laptops' || p.category === 'MacBooks').map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
              <div className="border rounded-xl p-3 bg-slate-50">
                <img src={compProduct1.image} alt={compProduct1.name} className="h-28 mx-auto object-contain" />
                <h4 className="font-bold mt-2 truncate">{compProduct1.name}</h4>
                <p className="font-bold text-sky-700">{formatPKR(compProduct1.pricePKR)}</p>
                <p className="mt-2 text-slate-500">CPU: {compProduct1.specs?.cpu}</p>
                <p className="text-slate-500">RAM: {compProduct1.specs?.ram}</p>
                <p className="text-slate-500">SSD: {compProduct1.specs?.storage}</p>
              </div>
              <div className="border rounded-xl p-3 bg-slate-50">
                <img src={compProduct2.image} alt={compProduct2.name} className="h-28 mx-auto object-contain" />
                <h4 className="font-bold mt-2 truncate">{compProduct2.name}</h4>
                <p className="font-bold text-sky-700">{formatPKR(compProduct2.pricePKR)}</p>
                <p className="mt-2 text-slate-500">CPU: {compProduct2.specs?.cpu}</p>
                <p className="text-slate-500">RAM: {compProduct2.specs?.ram}</p>
                <p className="text-slate-500">SSD: {compProduct2.specs?.storage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeProduct && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-5 border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                {activeProduct.brand} • {activeProduct.category}
              </span>
              <button onClick={() => setActiveProduct(null)} className="text-slate-400 font-bold p-1 text-sm hover:text-slate-700">✕</button>
            </div>

            <div className="aspect-video bg-slate-50 rounded-xl my-3 p-3 flex items-center justify-center">
              <img src={selectedImage || activeProduct.image} alt={activeProduct.name} className="h-full object-contain" />
            </div>

            <h2 className="text-base font-bold text-slate-900">{activeProduct.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-slate-900">{formatPKR(activeProduct.pricePKR)}</span>
              <span className="text-[10px] font-bold bg-sky-50 text-sky-800 px-2 py-0.5 rounded">{activeProduct.condition}</span>
            </div>

            <div className="flex gap-4 border-b border-slate-200 mt-4 text-xs font-semibold overflow-x-auto pb-1">
              <button onClick={() => setActiveTab('overview')} className={`pb-2 ${activeTab === 'overview' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>Overview</button>
              <button onClick={() => setActiveTab('specs')} className={`pb-2 ${activeTab === 'specs' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>Tech Specs</button>
              <button onClick={() => setActiveTab('warranty')} className={`pb-2 ${activeTab === 'warranty' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>Warranty & Delivery</button>
              <button onClick={() => setActiveTab('reviews')} className={`pb-2 ${activeTab === 'reviews' ? 'border-b-2 border-slate-900 text-slate-900' : 'text-slate-400'}`}>Reviews ({activeProduct.reviewsCount})</button>
            </div>

            <div className="mt-3.5 text-xs">
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <p className="text-slate-600 leading-relaxed text-xs">{activeProduct.description}</p>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5">Key Highlights:</h4>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      {(activeProduct.highlights || []).map((h, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">✓ {h}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Processor (CPU)</span>
                    <span className="font-semibold text-slate-800">{activeProduct.specs?.cpu || 'Standard Processor'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">RAM Memory</span>
                    <span className="font-semibold text-slate-800">{activeProduct.specs?.ram || '16GB'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Storage (SSD / ROM)</span>
                    <span className="font-semibold text-slate-800">{activeProduct.specs?.storage || '512GB SSD'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Display Screen</span>
                    <span className="font-semibold text-slate-800">{activeProduct.specs?.screen || '14.1 Full HD'}</span>
                  </div>
                </div>
              )}

              {activeTab === 'warranty' && (
                <div className="p-3 bg-sky-50 text-sky-900 rounded-xl text-xs space-y-1">
                  <p className="font-bold">✓ 7-Day Testing Warranty</p>
                  <p className="text-[11px]">Covers motherboard, battery, screen panel, and power adapters across Pakistan with free nationwide parcel inspection.</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <form onSubmit={handleAddReview} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 text-xs block">Write a Review</span>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs bg-white focus:outline-none"
                    />
                    <textarea
                      required
                      rows={2}
                      value={reviewerComment}
                      onChange={(e) => setReviewerComment(e.target.value)}
                      placeholder="Share your experience with this device..."
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs bg-white focus:outline-none"
                    />
                    <button type="submit" className="bg-slate-900 text-white rounded-lg px-3 py-1 text-xs font-semibold">Submit Review</button>
                  </form>
                </div>
              )}
            </div>

            <div className="mt-4 pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => { addToCart(activeProduct); setActiveProduct(null); setIsCartOpen(true); }}
                className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs active:scale-95 transition"
              >
                Add to Cart • {formatPKR(activeProduct.pricePKR)}
              </button>

              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_INT}?text=${encodeURIComponent(`Hello SkillBook, I want to order ${activeProduct.name} for ${formatPKR(activeProduct.pricePKR)}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition"
                title="Inquire on WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Your Cart ({totalCartCount})</h3>
                <button onClick={() => { setIsCartOpen(false); setShowCheckoutForm(false); }} className="text-slate-400 font-bold">✕</button>
              </div>

              {showCheckoutForm ? (
                <form onSubmit={handlePlaceOrder} className="mt-4 space-y-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-[11px] leading-tight">
                    Order confirmation will be routed directly to <strong>{OFFICIAL_EMAIL}</strong>.
                  </div>

                  <h4 className="font-bold text-xs uppercase text-slate-900">Cash on Delivery (Pakistan)</h4>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full border rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="WhatsApp Phone Number"
                    className="w-full border rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="Your City"
                    className="w-full border rounded-xl px-3 py-2 text-xs"
                  />
                  <textarea
                    required
                    rows={3}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Complete Delivery Address (House/Shop #, Street, Area)"
                    className="w-full border rounded-xl p-2.5 text-xs"
                  />
                  <button type="submit" className="w-full bg-sky-600 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-sky-500 transition shadow-sm">
                    Confirm Order & Dispatch Email ({formatPKR(subtotalPKR)})
                  </button>
                </form>
              ) : (
                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[55vh] mt-2">
                  {cartItems.length === 0 ? (
                    <div className="py-20 text-center text-xs text-slate-400">Your cart is empty.</div>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="py-2.5 flex justify-between items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-slate-50 p-1 rounded" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold truncate text-slate-800">{item.name}</h4>
                          <span className="text-xs font-bold">{formatPKR(item.pricePKR)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-5 h-5 border rounded text-xs">-</button>
                          <span className="text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-5 h-5 border rounded text-xs">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-rose-500 ml-1">🗑️</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {!showCheckoutForm && cartItems.length > 0 && (
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Total Amount:</span>
                  <span>{formatPKR(subtotalPKR)}</span>
                </div>
                <button
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition"
                >
                  Proceed to Checkout (COD)
                </button>
                <a
                  href={`https://wa.me/${OFFICIAL_WHATSAPP_INT}?text=${encodeURIComponent(`Hello SkillBook, I want to order:\n${cartItems.map(i => `${i.name} (x${i.quantity})`).join('\n')}\n\nTotal: ${formatPKR(subtotalPKR)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full border border-emerald-500/40 bg-emerald-50 text-emerald-800 py-2 rounded-xl text-xs font-bold hover:bg-emerald-100 transition"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
                  <span>Send Cart to WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 font-bold text-lg">✓</div>
            <h3 className="font-bold text-base text-slate-900">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-500 mt-0.5">Order ID: <strong>{orderConfirmed.orderId}</strong></p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-left space-y-1.5">
              <p><strong>Customer:</strong> {orderConfirmed.customerName} ({orderConfirmed.customerPhone})</p>
              <p><strong>City / Address:</strong> {orderConfirmed.deliveryAddress}, {orderConfirmed.deliveryCity}</p>
              <p><strong>Order Routing:</strong> {OFFICIAL_EMAIL}</p>
              <div className="border-t pt-1.5 flex justify-between font-bold">
                <span>Total Due:</span>
                <span>{formatPKR(orderConfirmed.totalPKR)}</span>
              </div>
            </div>

            <button onClick={() => setOrderConfirmed(null)} className="mt-4 w-full bg-slate-900 text-white py-2 rounded-xl text-xs font-semibold">
              Continue Browsing
            </button>
          </div>
        </div>
      )}

      <aside aria-label="Support WhatsApp" className="fixed bottom-6 right-4 z-20">
        <a
          href={`https://wa.me/${OFFICIAL_WHATSAPP_INT}?text=Hello%20SkillBook,%20I%20have%20an%20inquiry%20regarding%20a%20laptop.`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#20ba59] transition shadow-emerald-600/30 active:scale-95 hover:scale-105"
          title="Direct WhatsApp Chat"
        >
          <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </a>
      </aside>

      {isAdminOpen && (
        <EmbeddedAdminModal
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      <footer className="mt-auto bg-[#1b4353] text-white pt-12 pb-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          <div>
            <span className="font-bold text-lg text-white block">SKILLBOOK</span>
            <p className="mt-2 text-slate-300 text-[11px] leading-relaxed">
              Transparent hardware procurement for individuals and companies across Pakistan. Verified grade-A testing, honest component checks, and tested warranties.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Inventory Categories</h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li><a href="#catalog" className="hover:text-white">Business Laptops</a></li>
              <li><a href="#catalog" className="hover:text-white">Apple MacBooks</a></li>
              <li><a href="#catalog" className="hover:text-white">ThinkPad Series</a></li>
              <li><button onClick={() => setIsCompareModalOpen(true)} className="hover:text-white text-left">Compare Hardware</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Customer Commitments</h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li><span>Component Diagnostic Testing</span></li>
              <li><span>7-Day Replacement Policy</span></li>
              <li><span>Open Parcel Inspection on Delivery</span></li>
              <li><span>Safe Nationwide Shipping</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Direct Contact Desk</h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              ✉️ Official Email: <strong className="text-sky-300">{OFFICIAL_EMAIL}</strong> <br />
              📦 Fulfillment: Nationwide Courier Shipping Across Pakistan
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-2">
          <p>© 2026 SkillBook. All Rights Reserved. Built with Quality Hardware Standards.</p>
          <div className="flex items-center gap-4">
            <span>Verified Testing</span>
            <span>Open Parcel Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}