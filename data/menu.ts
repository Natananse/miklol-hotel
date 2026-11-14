export const categories = ['Breakfast', 'Juices & Shakes', 'Mocktails', 'Salads', 'Italian Dishes', 'Non-fasting', 'Fasting Dishes', 'Pizza', 'Extras'] as const;

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

/** Four selections per printed menu heading, transcribed from the owner's menu photos.
 * Prices are in ETB; handwritten corrections take precedence over printed prices.
 * Photographs are representative stock images, not photos of MIKLOL's dishes.
 */
export const menuItems: MenuItem[] = [
  {
    id: 'lamb-tibs', name: 'Tibs', category: 'Non-fasting', price: 390,
    description: 'Lamb with onion, garlic, green pepper, and rosemary. Served with injera or bread.',
    vegetarian: false, image: '/images/menu/tibs.webp',
    imageAlt: 'Representative photo of cubed meat with onions and peppers in a sizzling pan',
    imagePosition: '50% 68%', note: 'WITH INJERA OR BREAD', signature: true,
  },
  {
    id: 'grilled-tibs', name: 'Grilled Tibs', category: 'Non-fasting', price: 400,
    description: 'Grilled tibs from our traditional Ethiopian menu.',
    vegetarian: false, image: '/images/menu/tibs.webp',
    imageAlt: 'Representative photo of browned meat and vegetables in a hot pan', imagePosition: '50% 68%',
  },
  {
    id: 'kitfo', name: 'Kitfo', category: 'Non-fasting', price: 530,
    description: 'Chopped meat with butter and spices, ayib, and gomen. Served with injera or bread.',
    vegetarian: false, image: '/images/menu/kitfo.webp',
    imageAlt: "Kitfo served in bowls with ayib, greens, and rolls of injera.",
  },
  {
    id: 'quanta-firfir', name: 'Quanta Firfir', category: 'Non-fasting', price: 310,
    description: 'Dried meat, injera, tomato sauce, spices, and egg.',
    vegetarian: false, image: '/images/menu/firfir.webp',
    imageAlt: "Spiced shredded injera fit-fit with green jalapeño peppers on a red plate.",
  },
  {
    id: 'shiro', name: 'Shiro', category: 'Fasting Dishes', price: 140,
    description: 'A traditional Ethiopian fasting stew.',
    vegetarian: true, fasting: true, image: '/images/menu/shiro.webp',
    imageAlt: 'Creamy Ethiopian stew in a black earthenware bowl with a herb garnish',
    imagePosition: '50% 72%', note: 'FASTING FAVOURITE', signature: true,
  },
  {
    id: 'fasting-firfir', name: 'Fasting Firfir', category: 'Fasting Dishes', price: 170,
    description: 'Torn injera in a seasoned sauce, prepared for fasting.',
    vegetarian: true, fasting: true, image: '/images/menu/firfir.webp',
    imageAlt: "Spiced shredded injera fit-fit with green jalapeño peppers on a red plate.",
  },
  {
    id: 'cooked-vegetables', name: 'Cooked Vegetables', category: 'Fasting Dishes', price: 180,
    description: 'Cooked vegetables from our fasting menu.',
    vegetarian: true, fasting: true, image: '/images/menu/cooked-vegetables.webp',
    imageAlt: "Grilled zucchini, peppers, eggplant, and tomatoes with browned edges.",
  },
  {
    id: 'beyaynetu', name: 'Beyaynetu', category: 'Fasting Dishes', price: 220,
    description: 'A selection of Ethiopian fasting dishes with injera.',
    vegetarian: true, fasting: true, image: '/images/menu/beyaynetu.webp',
    imageAlt: 'Rolled injera with red lentils, brown lentils, and cooked greens on a white plate',
    note: 'FASTING PLATTER', signature: true,
  },
  {
    id: 'special-omelet', name: 'Special Omelet', category: 'Breakfast', price: 250,
    description: 'Eggs with chopped meat, cheese, tomato, green pepper, and onion.',
    vegetarian: false, image: '/images/menu/omelet.webp',
    imageAlt: "Omelette topped with tomatoes, olives, and cheese on a plate.",
  },
  {
    id: 'vegetable-wrap', name: 'Vegetable Wrap', category: 'Breakfast', price: 250,
    description: 'Cooked vegetables in chapati, with French fries and ketchup.',
    vegetarian: true, image: '/images/menu/vegetable-wrap.webp',
    imageAlt: "Grilled vegetable wraps arranged on a white plate.",
  },
  {
    id: 'scrambled-eggs', name: 'Scrambled Eggs', category: 'Breakfast', price: 190,
    description: 'Eggs with tomato, green pepper, and onion.',
    vegetarian: true, image: '/images/menu/scrambled-eggs.webp', imagePosition: '68% 68%',
    imageAlt: "Golden scrambled eggs with chopped green onions and buttered toast on a ceramic plate.",
  },
  {
    id: 'pancakes', name: 'Pancakes', category: 'Breakfast', price: 200,
    description: 'A comforting pancake breakfast.',
    vegetarian: true, image: '/images/menu/pancakes.webp',
    imageAlt: 'Representative pancakes topped with blueberries, banana slices, and syrup',
  },
  {
    id: 'avocado-juice', name: 'Avocado Juice', category: 'Juices & Shakes', price: 150,
    description: 'Smooth avocado juice.',
    vegetarian: true, fasting: true, image: '/images/menu/avocado-juice.webp',
    imageAlt: "Pale green avocado drink in a glass with a straw beside fresh avocado.",
  },
  {
    id: 'mango-juice', name: 'Mango Juice', category: 'Juices & Shakes', price: 150,
    description: 'A refreshing glass of mango juice.',
    vegetarian: true, fasting: true, image: '/images/menu/mango-juice.webp',
    imageAlt: "Golden mango drink in a clear glass garnished with mango slices.", signature: true,
  },
  {
    id: 'mixed-juice', name: 'Mixed Juice', category: 'Juices & Shakes', price: 180,
    description: 'A colourful blend of fruit juices.',
    vegetarian: true, fasting: true, image: '/images/menu/mixed-juice.webp', imagePosition: '40% 65%',
    imageAlt: "Mango and orange fruit juice in clear glasses beside fresh fruit.",
  },
  {
    id: 'strawberry-milkshake', name: 'Strawberry Milkshake', category: 'Juices & Shakes', price: 200,
    description: 'A creamy strawberry milkshake.',
    vegetarian: true, image: '/images/menu/strawberry-milkshake.webp',
    imageAlt: "Creamy strawberry milkshake in a glass topped with strawberry pieces.",
  },
  {
    id: 'orange-mocktail', name: 'Orange Mocktail', category: 'Mocktails', price: 140,
    description: 'A refreshing orange mocktail.',
    vegetarian: true, image: '/images/menu/orange-mocktail.webp',
    imageAlt: "Orange citrus drink in a tall glass with orange slices and mint.",
  },
  {
    id: 'watermelon-mocktail', name: 'Watermelon Mocktail', category: 'Mocktails', price: 140,
    description: 'A refreshing watermelon mocktail.',
    vegetarian: true, image: '/images/menu/watermelon-mocktail.webp',
    imageAlt: "Pink watermelon drink with crushed ice and a fresh watermelon wedge.",
  },
  {
    id: 'lemon-mocktail', name: 'Lemon Mocktail', category: 'Mocktails', price: 140,
    description: 'A refreshing lemon mocktail.',
    vegetarian: true, image: '/images/menu/lemon-mocktail.webp', imagePosition: '30% 50%',
    imageAlt: "Iced lemon drink in a glass with fresh lemon slices and mint.",
  },
  {
    id: 'strawberry-mocktail', name: 'Strawberry Mocktail', category: 'Mocktails', price: 140,
    description: 'A refreshing strawberry mocktail.',
    vegetarian: true, image: '/images/menu/strawberry-mocktail.webp',
    imageAlt: "Iced strawberry and lime drink in a tall glass garnished with fresh mint.",
  },
  {
    id: 'tomato-salad', name: 'Tomato Salad', category: 'Salads', price: 180,
    description: 'Tomato, lettuce, green pepper, onion, and garlic with a fresh lemon dressing.',
    vegetarian: true, image: '/images/menu/tomato-salad.webp', imagePosition: '50% 90%',
    imageAlt: "Fresh tomato salad with herbs and pumpkin seeds.",
  },
  {
    id: 'avocado-salad', name: 'Avocado Salad', category: 'Salads', price: 260,
    description: 'Avocado, lettuce, tomato, green pepper, garlic, and onion with lemon or vinegar.',
    vegetarian: true, fasting: true, image: '/images/menu/avocado-salad.webp', imagePosition: '50% 70%',
    imageAlt: "Avocado slices and lettuce in a salad bowl.",
  },
  {
    id: 'chicken-salad', name: 'Chicken Salad', category: 'Salads', price: 350,
    description: 'Grilled chicken, tomato, lettuce, green pepper, onion, garlic, and mayonnaise.',
    vegetarian: false, image: '/images/menu/chicken-salad.webp',
    imageAlt: "Grilled chicken pieces with fresh salad vegetables and dressing.",
  },
  {
    id: 'fruit-salad', name: 'Fruit Salad', category: 'Salads', price: 290,
    description: 'Avocado, mango, papaya, and watermelon with salad vegetables and lemon.',
    vegetarian: true, fasting: true, image: '/images/menu/fruit-salad.webp',
    imageAlt: "Fruit salad with kiwi, pineapple, and strawberries.",
  },
  {
    id: 'spaghetti-bolognese', name: 'Spaghetti Bolognese', category: 'Italian Dishes', price: 265,
    description: 'Spaghetti with meat and tomato sauce.',
    vegetarian: false, image: '/images/menu/spaghetti-bolognese.webp', imagePosition: '65% 65%',
    imageAlt: "Spaghetti topped with Bolognese sauce and parsley.", signature: true,
  },
  {
    id: 'spaghetti-carbonara', name: 'Spaghetti Carbonara', category: 'Italian Dishes', price: 300,
    description: 'Spaghetti with meat, cheese, and egg.',
    vegetarian: false, image: '/images/menu/spaghetti-carbonara.webp',
    imageAlt: "Spaghetti carbonara with creamy sauce and bacon pieces.",
  },
  {
    id: 'vegetable-macaroni', name: 'Macaroni with Vegetables', category: 'Italian Dishes', price: 200,
    description: 'Macaroni tossed with cooked vegetables.',
    vegetarian: true, image: '/images/menu/vegetable-macaroni.webp',
    imageAlt: "Short penne pasta with tomato sauce and herbs.",
  },
  {
    id: 'vegetable-rice', name: 'Rice with Vegetables', category: 'Italian Dishes', price: 200,
    description: 'Rice served with cooked vegetables.',
    vegetarian: true, fasting: true, image: '/images/menu/vegetable-rice.webp',
    imageAlt: "Mixed vegetable rice served in a bowl.",
  },
  {
    id: 'beef-pizza', name: 'Beef Pizza', category: 'Pizza', price: 420,
    description: 'Chopped meat, tomato sauce, and mozzarella.',
    vegetarian: false, image: '/images/menu/beef-pizza.webp',
    imageAlt: "Beef and cheese pizza topped with olives and sauce.", signature: true,
  },
  {
    id: 'margherita', name: 'Margherita Pizza', category: 'Pizza', price: 400,
    description: 'Cheese, tomato sauce, and oregano.',
    vegetarian: true, image: '/images/menu/margherita-pizza.webp',
    imageAlt: "Margherita pizza with melted cheese, tomato sauce, and basil.",
  },
  {
    id: 'chicken-pizza', name: 'Chicken Pizza', category: 'Pizza', price: 500,
    description: 'Chicken, cheese, and tomato sauce.',
    vegetarian: false, image: '/images/menu/chicken-pizza.webp',
    imageAlt: "Pizza topped with chicken, olives, and broccoli on a wooden table.",
  },
  {
    id: 'vegetable-pizza', name: 'Vegetable Pizza', category: 'Pizza', price: 300,
    description: 'Cooked vegetables and tomato sauce.',
    vegetarian: true, image: '/images/menu/vegetable-pizza.webp',
    imageAlt: "Pizza topped with basil, tomato, and eggplant.",
  },
  {
    id: 'extra-bread', name: 'Bread', category: 'Extras', price: 20,
    description: 'An extra serving of bread.',
    vegetarian: true, image: '/images/menu/bread.webp',
    imageAlt: "A slice of crusty artisan bread showing its airy crumb.",
  },
  {
    id: 'extra-injera', name: 'Injera', category: 'Extras', price: 30,
    description: 'One full injera.',
    vegetarian: true, fasting: true, image: '/images/menu/injera.webp',
    imageAlt: "Rolled injera flatbreads stacked in a woven Ethiopian basket.", note: 'FULL INJERA',
  },
  {
    id: 'extra-egg', name: 'Egg', category: 'Extras', price: 25,
    description: 'Add an egg to your meal.',
    vegetarian: true, image: '/images/menu/boiled-egg.webp',
    imageAlt: "Hard-boiled egg pieces sprinkled with black pepper in a white bowl.",
  },
  {
    id: 'extra-cheese', name: 'Cheese', category: 'Extras', price: 90,
    description: 'An extra serving of cheese.',
    vegetarian: true, image: '/images/menu/cheese.webp',
    imageAlt: "White cheese cubes with herbs and basil on a dark serving board.",
  },
];

export const signatureMenuItems = menuItems.filter((item) => item.signature);
export const formatPrice = (price: number) => `${price.toLocaleString('en-US')} ETB`;
