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
    imageAlt: 'Representative photo of Ethiopian kitfo with traditional accompaniments',
  },
  {
    id: 'quanta-firfir', name: 'Quanta Firfir', category: 'Non-fasting', price: 310,
    description: 'Dried meat, injera, tomato sauce, spices, and egg.',
    vegetarian: false, image: '/images/menu/firfir.webp',
    imageAlt: 'Representative photo of Ethiopian firfir made with torn injera',
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
    imageAlt: 'Representative photo of torn injera tossed in a spiced sauce',
  },
  {
    id: 'cooked-vegetables', name: 'Cooked Vegetables', category: 'Fasting Dishes', price: 180,
    description: 'Cooked vegetables from our fasting menu.',
    vegetarian: true, fasting: true, image: '/images/menu/cooked-vegetables.webp',
    imageAlt: 'Representative photo of cooked vegetables served Ethiopian style',
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
    imageAlt: 'Representative photo of a golden omelet on a breakfast plate',
  },
  {
    id: 'vegetable-wrap', name: 'Vegetable Wrap', category: 'Breakfast', price: 250,
    description: 'Cooked vegetables in chapati, with French fries and ketchup.',
    vegetarian: true, image: '/images/menu/vegetable-wrap.webp',
    imageAlt: 'Representative photo of a vegetable-filled wrap',
  },
  {
    id: 'chechebsa', name: 'Chechebsa', category: 'Breakfast', price: 200,
    description: 'A traditional Ethiopian breakfast with spices and honey.',
    vegetarian: true, image: '/images/menu/chechebsa.webp',
    imageAlt: 'Representative photo of Ethiopian chechebsa made with torn flatbread',
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
    imageAlt: 'Representative photo of a thick green avocado drink',
  },
  {
    id: 'mango-juice', name: 'Mango Juice', category: 'Juices & Shakes', price: 150,
    description: 'A refreshing glass of mango juice.',
    vegetarian: true, fasting: true, image: '/images/menu/mango-juice.webp',
    imageAlt: 'Representative photo of golden mango juice in a glass',
  },
  {
    id: 'mixed-juice', name: 'Mixed Juice', category: 'Juices & Shakes', price: 180,
    description: 'A colourful blend of fruit juices.',
    vegetarian: true, fasting: true, image: '/images/menu/mixed-juice.webp',
    imageAlt: 'Representative photo of a mixed fruit drink',
  },
  {
    id: 'strawberry-milkshake', name: 'Strawberry Milkshake', category: 'Juices & Shakes', price: 200,
    description: 'A creamy strawberry milkshake.',
    vegetarian: true, image: '/images/menu/strawberry-milkshake.webp',
    imageAlt: 'Representative photo of a pink strawberry milkshake',
  },
  {
    id: 'orange-mocktail', name: 'Orange Mocktail', category: 'Mocktails', price: 140,
    description: 'A refreshing orange mocktail.',
    vegetarian: true, image: '/images/menu/orange-mocktail.webp',
    imageAlt: 'Representative photo of an orange drink with a citrus garnish',
  },
  {
    id: 'watermelon-mocktail', name: 'Watermelon Mocktail', category: 'Mocktails', price: 140,
    description: 'A refreshing watermelon mocktail.',
    vegetarian: true, image: '/images/menu/watermelon-mocktail.webp',
    imageAlt: 'Representative photo of a red watermelon drink',
  },
  {
    id: 'lemon-mocktail', name: 'Lemon Mocktail', category: 'Mocktails', price: 140,
    description: 'A refreshing lemon mocktail.',
    vegetarian: true, image: '/images/menu/lemon-mocktail.webp',
    imageAlt: 'Representative photo of a chilled lemon drink',
  },
  {
    id: 'strawberry-mocktail', name: 'Strawberry Mocktail', category: 'Mocktails', price: 140,
    description: 'A refreshing strawberry mocktail.',
    vegetarian: true, image: '/images/menu/strawberry-mocktail.webp',
    imageAlt: 'Representative photo of a red strawberry drink',
  },
  {
    id: 'tomato-salad', name: 'Tomato Salad', category: 'Salads', price: 180,
    description: 'Tomato, lettuce, green pepper, onion, and garlic with a fresh lemon dressing.',
    vegetarian: true, image: '/images/menu/tomato-salad.webp',
    imageAlt: 'Representative photo of a fresh tomato salad',
  },
  {
    id: 'avocado-salad', name: 'Avocado Salad', category: 'Salads', price: 260,
    description: 'Avocado, lettuce, tomato, green pepper, garlic, and onion with lemon or vinegar.',
    vegetarian: true, fasting: true, image: '/images/menu/avocado-salad.webp',
    imageAlt: 'Representative photo of avocado and fresh vegetables in a salad',
  },
  {
    id: 'chicken-salad', name: 'Chicken Salad', category: 'Salads', price: 350,
    description: 'Grilled chicken, tomato, lettuce, green pepper, onion, garlic, and mayonnaise.',
    vegetarian: false, image: '/images/menu/chicken-salad.webp',
    imageAlt: 'Representative photo of grilled chicken with salad greens',
  },
  {
    id: 'fruit-salad', name: 'Fruit Salad', category: 'Salads', price: 290,
    description: 'Avocado, mango, papaya, and watermelon with salad vegetables and lemon.',
    vegetarian: true, fasting: true, image: '/images/menu/fruit-salad.webp',
    imageAlt: 'Representative photo of a colourful mixed fruit salad',
  },
  {
    id: 'spaghetti-bolognese', name: 'Spaghetti Bolognese', category: 'Italian Dishes', price: 265,
    description: 'Spaghetti with meat and tomato sauce.',
    vegetarian: false, image: '/images/menu/spaghetti-bolognese.webp',
    imageAlt: 'Representative photo of spaghetti topped with meat and tomato sauce', signature: true,
  },
  {
    id: 'spaghetti-carbonara', name: 'Spaghetti Carbonara', category: 'Italian Dishes', price: 300,
    description: 'Spaghetti with meat, cheese, and egg.',
    vegetarian: false, image: '/images/menu/spaghetti-carbonara.webp',
    imageAlt: 'Representative photo of spaghetti carbonara in a creamy egg and cheese sauce',
  },
  {
    id: 'vegetable-macaroni', name: 'Macaroni with Vegetables', category: 'Italian Dishes', price: 200,
    description: 'Macaroni tossed with cooked vegetables.',
    vegetarian: true, image: '/images/menu/vegetable-macaroni.webp',
    imageAlt: 'Representative photo of macaroni with vegetables',
  },
  {
    id: 'vegetable-rice', name: 'Rice with Vegetables', category: 'Italian Dishes', price: 200,
    description: 'Rice served with cooked vegetables.',
    vegetarian: true, fasting: true, image: '/images/menu/vegetable-rice.webp',
    imageAlt: 'Representative photo of rice with colourful cooked vegetables',
  },
  {
    id: 'beef-pizza', name: 'Beef Pizza', category: 'Pizza', price: 420,
    description: 'Chopped meat, tomato sauce, and mozzarella.',
    vegetarian: false, image: '/images/menu/beef-pizza.webp',
    imageAlt: 'Representative photo of a meat and cheese pizza', signature: true,
  },
  {
    id: 'margherita', name: 'Margherita Pizza', category: 'Pizza', price: 400,
    description: 'Cheese, tomato sauce, and oregano.',
    vegetarian: true, image: '/images/menu/margherita-pizza.webp',
    imageAlt: 'Representative photo of a cheese and tomato margherita pizza',
  },
  {
    id: 'chicken-pizza', name: 'Chicken Pizza', category: 'Pizza', price: 500,
    description: 'Chicken, cheese, and tomato sauce.',
    vegetarian: false, image: '/images/menu/chicken-pizza.webp',
    imageAlt: 'Representative photo of chicken and cheese pizza',
  },
  {
    id: 'vegetable-pizza', name: 'Vegetable Pizza', category: 'Pizza', price: 300,
    description: 'Cooked vegetables and tomato sauce.',
    vegetarian: true, image: '/images/menu/vegetable-pizza.webp',
    imageAlt: 'Representative photo of a pizza topped with vegetables',
  },
  {
    id: 'extra-bread', name: 'Bread', category: 'Extras', price: 20,
    description: 'An extra serving of bread.',
    vegetarian: true, image: '/images/menu/bread.webp',
    imageAlt: 'Representative photo of fresh bread',
  },
  {
    id: 'extra-injera', name: 'Injera', category: 'Extras', price: 30,
    description: 'One full injera.',
    vegetarian: true, fasting: true, image: '/images/menu/injera.webp',
    imageAlt: 'Representative photo of traditional Ethiopian injera flatbread', note: 'FULL INJERA',
  },
  {
    id: 'extra-egg', name: 'Egg', category: 'Extras', price: 25,
    description: 'Add an egg to your meal.',
    vegetarian: true, image: '/images/menu/boiled-egg.webp',
    imageAlt: 'Representative photo of a boiled egg',
  },
  {
    id: 'extra-cheese', name: 'Cheese', category: 'Extras', price: 90,
    description: 'An extra serving of cheese.',
    vegetarian: true, image: '/images/menu/cheese.webp',
    imageAlt: 'Representative photo of cheese',
  },
];

export const signatureMenuItems = menuItems.filter((item) => item.signature);
export const formatPrice = (price: number) => `${price.toLocaleString('en-US')} ETB`;
