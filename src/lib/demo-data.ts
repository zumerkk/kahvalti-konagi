// Mock Data shared between Admin and Public pages for Demo Mode
import { ShoppingCart, Flame, Salad, Cherry, Coffee, CakeSlice, Milk } from "lucide-react";

export const demoCategories = [
  { id: "all", name: "Tümü", icon: ShoppingCart },
  { id: "sicak", name: "Sıcak Çeşitler", icon: Flame, description: "Sahanda yumurta, omlet, sucuklu yumurta", sortOrder: 1, color: "from-amber-500/15 to-orange-500/5 border-amber-500/15" },
  { id: "peynir", name: "Peynir & Şarküteri", icon: Salad, description: "Beyaz peynir, kaşar, tulum peyniri", sortOrder: 2, color: "from-yellow-500/15 to-amber-500/5 border-yellow-500/15" },
  { id: "recel", name: "Reçeller", icon: Cherry, description: "Çilek, kayısı, vişne, gül reçeli", sortOrder: 3, color: "from-rose-500/15 to-pink-500/5 border-rose-500/15" },
  { id: "icecek", name: "İçecekler", icon: Coffee, description: "Çay, kahve, taze meyve suyu", sortOrder: 4, color: "from-sky-500/15 to-cyan-500/5 border-sky-500/15" },
  { id: "tatli", name: "Tatlılar", icon: CakeSlice, description: "Tiramisu, ekler, trileçe", sortOrder: 5, color: "from-violet-500/15 to-purple-500/5 border-violet-500/15" },
  { id: "diger", name: "Genel / Diğer", icon: Milk, description: "Kahvaltı tabakları, ekstralar", sortOrder: 6, color: "from-emerald-500/15 to-green-500/5 border-emerald-500/15" },
];

export const demoProducts = [
  { id: "1", name: "Sahanda Yumurta", category: "sicak", price: 85, inStock: true, isActive: true, barcode: "8690000000001", description: "Tereyağlı taze çiftlik yumurtası." },
  { id: "2", name: "Menemen", category: "sicak", price: 95, inStock: true, isActive: true, barcode: "8690000000002", description: "Domates ve sivri biber ile." },
  { id: "3", name: "Sucuklu Yumurta", category: "sicak", price: 110, inStock: true, isActive: true, barcode: "8690000000003", description: "Kayseri ev sucuğu ile." },
  { id: "4", name: "Beyaz Peynir Tabağı", category: "peynir", price: 65, inStock: true, isActive: true, barcode: "8690000000004", description: "Ezine beyaz peynir." },
  { id: "5", name: "Kaşar Peyniri", category: "peynir", price: 55, inStock: true, isActive: true, barcode: "8690000000005", description: "Eski ve taze kaşar." },
  { id: "6", name: "Çilek Reçeli", category: "recel", price: 30, inStock: true, isActive: true, barcode: "8690000000006", description: "Ev yapımı organik çilek." },
  { id: "10", name: "Türk Kahvesi", category: "icecek", price: 60, inStock: true, isActive: true, barcode: "8690000000010", description: "Çifte kavrulmuş." },
  { id: "11", name: "Taze Portakal Suyu", category: "icecek", price: 75, inStock: true, isActive: true, barcode: "8690000000011", description: "Sıkma portakal suyu." },
  { id: "12", name: "Tiramisu", category: "tatli", price: 120, inStock: true, isActive: true, barcode: "8690000000012", description: "Özel İtalyan tarifi." },
  { id: "23", name: "Açık Büfe Kahvaltı", category: "diger", price: 450, inStock: true, isActive: true, barcode: "8691234567890", description: "Sınırsız açık büfe kahvaltı." },
];

export const demoTables = [
  { id: "1", name: "M-1", isActive: true, area: "Salon", capacity: 4 },
  { id: "2", name: "M-2", isActive: true, area: "Salon", capacity: 4 },
  { id: "3", name: "M-3", isActive: true, area: "Salon", capacity: 6 },
  { id: "4", name: "M-4", isActive: true, area: "Salon", capacity: 4 },
  { id: "5", name: "M-5", isActive: false, area: "Salon", capacity: 2 },
  { id: "6", name: "VIP-1", isActive: true, area: "VIP", capacity: 8 },
  { id: "7", name: "Bahçe-1", isActive: true, area: "Bahçe", capacity: 6 },
  { id: "8", name: "Bahçe-2", isActive: true, area: "Bahçe", capacity: 4 },
];
