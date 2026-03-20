import { MenuItem } from './types';

export const SIZE_MULTIPLIERS = {
  'S': 1,
  'M': 1.2,
  'L': 1.5
};

const coffeeItems = [
  { name: 'Cà phê phin sữa', price: 15000 },
  { name: 'Cà phê phin đen', price: 15000 },
  { name: 'Cà phê ép sữa', price: 15000 },
  { name: 'Cà phê ép đen', price: 15000 },
  { name: 'Cà phê sữa đá', price: 18000 },
  { name: 'Cà phê đen đá', price: 15000 },
  { name: 'Cà phê sữa tươi', price: 20000 },
  { name: 'Cà phê muối', price: 25000 },
  { name: 'Bạc xỉu đá', price: 18000 },
  { name: 'Bạc xỉu nóng', price: 18000 },
  { name: 'Bạc xỉu kem', price: 25000 },
  { name: 'Cacao đá', price: 20000 },
  { name: 'Cacao nóng', price: 20000 },
  { name: 'Cacao kem', price: 25000 },
  { name: 'Milo dầm', price: 20000 }
].map((item, index) => ({
  id: `coffee-${index}`,
  name: item.name,
  basePrice: item.price,
  category: 'Coffee',
  imageUrl: `https://picsum.photos/seed/coffee-${index}/400/400`
}));

const teaItems = [
  { name: 'Chanh đá', price: 15000 },
  { name: 'Chanh nóng', price: 15000 },
  { name: 'Trà đào đá', price: 20000 },
  { name: 'Trà đào nóng', price: 20000 },
  { name: 'Trà đào cam sả', price: 30000 },
  { name: 'Trà vải đá', price: 20000 },
  { name: 'Trà đào tắc', price: 20000 },
  { name: 'Trà lipton sữa', price: 25000 },
  { name: 'Trà dâu', price: 20000 },
  { name: 'Trà ổi', price: 20000 },
  { name: 'Trà việt quất', price: 20000 },
  { name: 'Trà xoài', price: 20000 },
  { name: 'Trà gừng', price: 20000 },
  { name: 'Trà gừng lipton', price: 25000 },
  { name: 'Trà lipton đá', price: 25000 },
  { name: 'Trà lipton nóng', price: 25000 },
  { name: 'Trà tắc xí muội', price: 15000 },
  { name: 'Trà tắc thái xanh', price: 10000 },
  { name: 'Trà chanh nóng', price: 15000 },
  { name: 'Trà chanh đá', price: 20000 },
  { name: 'Trà trái cây nhiệt đới', price: 20000 }
].map((item, index) => ({
  id: `tea-${index}`,
  name: item.name,
  basePrice: item.price,
  category: 'Trà',
  imageUrl: `https://picsum.photos/seed/tea-${index}/400/400`
}));

const yogurtItems = [
  { name: 'Sữa chua nếp cẩm', price: 20000 },
  { name: 'Sữa chua việt quất', price: 20000 },
  { name: 'Sữa chua cam', price: 20000 },
  { name: 'Sữa chua dâu tây', price: 20000 },
  { name: 'Sữa chua kiwi', price: 20000 },
  { name: 'Sữa chua đào', price: 20000 },
  { name: 'Sữa chua đá', price: 20000 },
  { name: 'Sữa chua thạch', price: 20000 },
  { name: 'Sữa chua hạt đác', price: 25000 },
  { name: 'Sữa chua hũ', price: 10000 },
  { name: 'Sữa chua chanh dây', price: 20000 },
  { name: 'Sữa chua xoài', price: 20000 },
  { name: 'Sữa chua khoai môn', price: 20000 }
].map((item, index) => ({
  id: `yogurt-${index}`,
  name: item.name,
  basePrice: item.price,
  category: 'Sữa chua',
  imageUrl: `https://picsum.photos/seed/yogurt-${index}/400/400`
}));

const milkTeaItems = [
  { name: 'Trà sữa thái xanh', price: 15000 },
  { name: 'Trà sữa khoai môn', price: 20000 },
  { name: 'Trà sữa socola', price: 15000 },
  { name: 'Trà sữa bạc hà', price: 15000 },
  { name: 'Trà sữa dâu', price: 15000 },
  { name: 'Trà sữa kem trứng', price: 20000 },
  { name: 'Trà sữa matcha', price: 15000 },
  { name: 'Matcha trà xanh', price: 15000 },
  { name: 'Matcha latte', price: 20000 },
  { name: 'Matcha latte kem muối', price: 25000 },
  { name: 'Sữa tươi trân châu đường đen', price: 15000 }
].map((item, index) => ({
  id: `milktea-${index}`,
  name: item.name,
  basePrice: item.price,
  category: 'Trà sữa',
  imageUrl: `https://picsum.photos/seed/milktea-${index}/400/400`
}));

const sodaItems = [
  'Soda chanh', 'Soda bạc hà', 'Soda dâu', 'Soda việt quất', 'Soda biển xanh', 
  'Soda táo xanh', 'Soda đào', 'Soda dưa lưới', 'Soda nho', 'Soda cam'
].map((name, index) => ({
  id: `soda-${index}`,
  name,
  basePrice: 18000,
  category: 'Soda',
  imageUrl: `https://picsum.photos/seed/soda-${index}/400/400`
}));

const juiceItems = [
  { name: 'Nước ép ổi', price: 20000 },
  { name: 'Nước ép dưa hấu', price: 20000 },
  { name: 'Nước ép dứa', price: 25000 },
  { name: 'Nước ép cam', price: 20000 },
  { name: 'Nước ép cà chua', price: 20000 },
  { name: 'Nước ép cà rốt', price: 20000 },
  { name: 'Nước ép táo', price: 20000 },
  { name: 'Nước dừa', price: 20000 }
].map((item, index) => ({
  id: `juice-${index}`,
  name: item.name,
  basePrice: item.price,
  category: 'Nước ép',
  imageUrl: `https://picsum.photos/seed/juice-${index}/400/400`
}));

const dessertItems = [
  { name: 'Kem plan', price: 18000 },
  { name: 'Kem ly', price: 15000 },
  { name: 'Kem trộn', price: 18000 },
  { name: 'Kem plan trân châu', price: 15000 },
  { name: 'Chè dưỡng nhan', price: 20000 }
].map((item, index) => ({
  id: `dessert-${index}`,
  name: item.name,
  basePrice: item.price,
  category: 'Kem – chè',
  imageUrl: `https://picsum.photos/seed/dessert-${index}/400/400`
}));

const snackItems = [
  { name: 'Hạt dưa đỏ', price: 15000 },
  { name: 'Hạt hướng dương', price: 15000 },
  { name: 'Hạt hướng dương tẩm vị', price: 15000 }
].map((item, index) => ({
  id: `snack-${index}`,
  name: item.name,
  basePrice: item.price,
  category: 'Hạt dưa – hạt hướng dương',
  imageUrl: `https://picsum.photos/seed/snack-${index}/400/400`
}));

export const MENU_ITEMS: MenuItem[] = [
  ...coffeeItems,
  ...teaItems,
  ...yogurtItems,
  ...milkTeaItems,
  ...sodaItems,
  ...juiceItems,
  ...dessertItems,
  ...snackItems
];
