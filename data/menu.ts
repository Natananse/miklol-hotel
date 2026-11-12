export const categories = ['Ethiopian', 'Breakfast', 'Pasta & Pizza', 'Burgers', 'Desserts', 'Buna & Coffee'] as const;

export type MenuCategory = (typeof categories)[number];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  vegetarian: boolean;
  fasting?: boolean;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  note?: string;
  signature?: boolean;
}

/** Preview offering and SAMPLE prices in ETB. The owner must confirm before launch. */
export const menuItems: MenuItem[] = [
  { id: 'beef-tibs', name: 'Beef Tibs', description: 'Sizzling beef, onion, peppers, and warm Ethiopian spices.', price: 680, category: 'Ethiopian', vegetarian: false, image: '/images/menu/tibs.webp', imageAlt: 'Sizzling beef with onions and red and green peppers in a cast-iron pan', imagePosition: '50% 68%', note: 'HOT FROM THE PAN', signature: true },
  { id: 'beyaynetu', name: 'Yetsom Beyaynetu', description: 'Injera with lentils, slow-cooked greens, and vegetable stews.', price: 390, category: 'Ethiopian', vegetarian: true, fasting: true, image: '/images/menu/beyaynetu.webp', imageAlt: 'Rolled injera with red lentils, brown lentils, and cooked greens on a white plate', note: 'FASTING PLATTER', signature: true },
  { id: 'shiro', name: 'Shiro', description: 'Chickpea stew with berbere and vegetable oil, served with injera.', price: 300, category: 'Ethiopian', vegetarian: true, fasting: true, image: '/images/menu/shiro.webp', imageAlt: 'Creamy Ethiopian stew in a black earthenware bowl with a fresh herb garnish', imagePosition: '50% 72%', note: 'WITH INJERA', signature: true },
  { id: 'pancakes', name: 'Berry Pancakes', description: 'Warm pancakes with berries, banana, and syrup.', price: 420, category: 'Breakfast', vegetarian: true, image: '/images/menu/pancakes.webp', imageAlt: 'Pancakes topped with blueberries, banana slices, and syrup' },
  { id: 'avocado-toast', name: 'Egg & Avocado Toast', description: 'Avocado on toast, finished with an egg and a little heat.', price: 380, category: 'Breakfast', vegetarian: true, image: '/images/menu/avocado-toast.webp', imageAlt: 'Avocado toast topped with a fried egg on a white plate' },
  { id: 'pesto-pasta', name: 'Garden Pesto Pasta', description: 'Farfalle, basil pesto, cherry tomatoes, and parmesan.', price: 520, category: 'Pasta & Pizza', vegetarian: true, image: '/images/menu/pasta.webp', imageAlt: 'Pesto farfalle with cherry tomatoes and fresh basil', note: 'BASIL & PARMESAN', signature: true },
  { id: 'margherita', name: 'Mushroom & Cheese Pizza', description: 'Mushrooms, tomato, and melted cheese on a crisp base.', price: 550, category: 'Pasta & Pizza', vegetarian: true, image: '/images/menu/pizza.webp', imageAlt: 'Cheese and mushroom pizza on a wooden board' },
  { id: 'house-burger', name: 'The MIKLOL Burger', description: 'Beef, cheddar, lettuce, pickles, and house sauce.', price: 590, category: 'Burgers', vegetarian: false, image: '/images/menu/burger.webp', imageAlt: 'Beef cheeseburger with lettuce, onion, pickles, and sauce', note: 'BEEF & CHEDDAR', signature: true },
  { id: 'chocolate-cake', name: 'Chocolate Cake', description: 'Rich chocolate layers with a smooth ganache finish.', price: 320, category: 'Desserts', vegetarian: true, image: '/images/menu/cake.webp', imageAlt: 'Chocolate cake with piped chocolate frosting and ganache' },
  { id: 'butter-croissant', name: 'Butter Croissant', description: 'Crisp edges, flaky layers. Pair it with a cup of buna.', price: 220, category: 'Desserts', vegetarian: true, image: '/images/menu/croissant.webp', imageAlt: 'Golden croissants on a dark surface' },
  { id: 'jebena-buna', name: 'Jebena Buna', description: 'Ethiopian coffee poured from a clay jebena. Take your time.', price: 90, category: 'Buna & Coffee', vegetarian: true, fasting: true, image: '/images/menu/buna.webp', imageAlt: 'Coffee being poured from a brown clay Ethiopian jebena into a small white cup', note: 'POURED FROM A JEBENA', signature: true },
  { id: 'house-espresso', name: 'House Espresso', description: 'A short, full-bodied espresso with cocoa notes.', price: 140, category: 'Buna & Coffee', vegetarian: true, fasting: true, image: '/images/menu/espresso.webp', imageAlt: 'Espresso in a black cup on a dark table', note: 'ESPRESSO' },
  { id: 'iced-latte', name: 'Iced Latte', description: 'Espresso over cold milk and ice.', price: 240, category: 'Buna & Coffee', vegetarian: true, image: '/images/menu/iced-latte.webp', imageAlt: 'Iced coffee and milk swirling in a tall glass' },
];

export const signatureMenuItems = menuItems.filter((item) => item.signature);
export const formatPrice = (price: number) => `${price.toLocaleString('en-US')} ETB`;
