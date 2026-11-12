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
  note?: string;
}

/** Illustrative menu and prices. Replace these with MIKLOL's confirmed offering. */
export const menuItems: MenuItem[] = [
  { id: 'house-espresso', name: 'The House Espresso', description: 'Deep cocoa notes. A bright finish. Your new daily ritual.', price: 140, category: 'Coffee', vegetarian: true, image: '/images/coffee/espresso.jpg', note: 'HOUSE FAVORITE' },
  { id: 'iced-latte', name: 'Caramel Cloud Latte', description: 'Espresso, cold milk, caramel, and a cloud of cream.', price: 240, category: 'Coffee', vegetarian: true, image: '/images/coffee/iced-latte.jpg' },
  { id: 'avocado-toast', name: 'Good Morning Toast', description: 'Smashed avocado, sourdough, poached egg, chili crunch.', price: 380, category: 'Breakfast', vegetarian: true, image: '/images/food/avocado-toast.jpg' },
  { id: 'pancakes', name: 'Slow Sunday Pancakes', description: 'Fluffy stacks, seasonal berries, and warm maple syrup.', price: 420, category: 'Breakfast', vegetarian: true, image: '/images/food/pancakes.jpg' },
  { id: 'pesto-pasta', name: 'Garden Pesto Pasta', description: 'Basil pesto, cherry tomatoes, parmesan, toasted seeds.', price: 520, category: 'Pasta', vegetarian: true, image: '/images/food/pasta.jpg' },
  { id: 'chicken-pasta', name: 'Creamy Chicken Alfredo', description: 'Silky cream sauce, grilled chicken, fresh fettuccine.', price: 580, category: 'Pasta', vegetarian: false, image: '/images/food/pasta.jpg' },
  { id: 'margherita', name: 'The Margherita', description: 'Slow-fermented dough, tomato, mozzarella, fresh basil.', price: 550, category: 'Pizza', vegetarian: true, image: '/images/food/pizza.jpg' },
  { id: 'smoky-pizza', name: 'Smoky Chicken Pizza', description: 'Roast chicken, smoked cheese, peppers, a little heat.', price: 620, category: 'Pizza', vegetarian: false, image: '/images/food/pizza.jpg' },
  { id: 'house-burger', name: 'The MIKLOL Burger', description: 'Juicy beef, aged cheddar, pickles, our secret sauce.', price: 590, category: 'Burgers', vegetarian: false, image: '/images/food/burger.jpg', note: 'CHEF’S PICK' },
  { id: 'garden-burger', name: 'The Garden Burger', description: 'A spiced chickpea patty, crunchy greens, lemon tahini.', price: 480, category: 'Burgers', vegetarian: true, image: '/images/food/burger.jpg' },
  { id: 'chocolate-cake', name: 'Chocolate After Hours', description: 'Rich chocolate layers with a soft ganache finish.', price: 320, category: 'Desserts', vegetarian: true, image: '/images/food/cake.jpg' },
  { id: 'butter-croissant', name: 'Golden Butter Croissant', description: 'Delicate layers, golden edges, baked for slow mornings.', price: 220, category: 'Desserts', vegetarian: true, image: '/images/food/croissant.jpg' },
];

export const formatPrice = (price: number) => `${price.toLocaleString('en-US')} ETB`;
