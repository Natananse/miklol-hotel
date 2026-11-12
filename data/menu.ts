export const categories = ['Coffee', 'Breakfast', 'Pasta', 'Pizza', 'Burgers', 'Desserts'] as const;

export type MenuCategory = (typeof categories)[number];

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  vegetarian: boolean;
  image: string;
  imageAlt: string;
  note?: string;
}

/** Illustrative menu and prices. Replace these with MIKLOL's confirmed offering. */
export const menuItems: MenuItem[] = [
  { id: 'house-espresso', name: 'The House Espresso', description: 'A short espresso with cocoa notes and a bright finish.', price: 140, category: 'Coffee', vegetarian: true, image: '/images/coffee/espresso.jpg', imageAlt: "Espresso in a black cup on a dark table", note: 'ESPRESSO' },
  { id: 'iced-latte', name: 'Caramel Cloud Latte', description: 'Espresso over cold milk, finished with caramel and cream.', price: 240, category: 'Coffee', vegetarian: true, image: '/images/coffee/iced-latte.jpg', imageAlt: "Iced coffee and milk swirling in a tall glass" },
  { id: 'avocado-toast', name: 'Good Morning Toast', description: 'Sourdough with avocado, a poached egg, and chili crunch.', price: 380, category: 'Breakfast', vegetarian: true, image: '/images/food/avocado-toast.jpg', imageAlt: "Avocado toast topped with a fried egg on a white plate" },
  { id: 'pancakes', name: 'Slow Sunday Pancakes', description: 'Pancakes with seasonal berries and maple syrup.', price: 420, category: 'Breakfast', vegetarian: true, image: '/images/food/pancakes.jpg', imageAlt: "Pancakes with blueberries, banana slices, and syrup" },
  { id: 'pesto-pasta', name: 'Garden Pesto Pasta', description: 'Pasta with basil pesto, cherry tomatoes, parmesan, and seeds.', price: 520, category: 'Pasta', vegetarian: true, image: '/images/food/pasta.jpg', imageAlt: "Pesto farfalle with cherry tomatoes and basil" },
  { id: 'chicken-pasta', name: 'Creamy Chicken Alfredo', description: 'Fettuccine with grilled chicken and a creamy sauce.', price: 580, category: 'Pasta', vegetarian: false, image: '/images/food/pasta.jpg', imageAlt: "Pesto farfalle with cherry tomatoes and basil" },
  { id: 'margherita', name: 'The Margherita', description: 'Tomato, mozzarella, and basil on a pizza base.', price: 550, category: 'Pizza', vegetarian: true, image: '/images/food/pizza.jpg', imageAlt: "Cheese and mushroom pizza on a wooden board" },
  { id: 'smoky-pizza', name: 'Smoky Chicken Pizza', description: 'Roast chicken, smoked cheese, peppers, and heat.', price: 620, category: 'Pizza', vegetarian: false, image: '/images/food/pizza.jpg', imageAlt: "Cheese and mushroom pizza on a wooden board" },
  { id: 'house-burger', name: 'The MIKLOL Burger', description: 'Beef, cheddar, pickles, and house sauce.', price: 590, category: 'Burgers', vegetarian: false, image: '/images/food/burger.jpg', imageAlt: "Beef cheeseburger with lettuce, onion, pickles, and sauce", note: 'BEEF BURGER' },
  { id: 'garden-burger', name: 'The Garden Burger', description: 'Chickpea patty, greens, and lemon tahini.', price: 480, category: 'Burgers', vegetarian: true, image: '/images/food/burger.jpg', imageAlt: "Beef cheeseburger with lettuce, onion, pickles, and sauce" },
  { id: 'chocolate-cake', name: 'Chocolate After Hours', description: 'Chocolate layers with a ganache finish.', price: 320, category: 'Desserts', vegetarian: true, image: '/images/food/cake.jpg', imageAlt: "Chocolate cake with piped frosting and ganache" },
  { id: 'butter-croissant', name: 'Golden Butter Croissant', description: 'A butter croissant with crisp edges and flaky layers.', price: 220, category: 'Desserts', vegetarian: true, image: '/images/food/croissant.jpg', imageAlt: "Croissants dusted with flour on a dark surface" },
];

export const formatPrice = (price: number) => `${price.toLocaleString('en-US')} ETB`;
