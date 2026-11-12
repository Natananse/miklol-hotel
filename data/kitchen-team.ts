/**
 * The single source for kitchen images across the team, story, hero and gallery.
 * Add an original photograph to public/images/team and change only its filename
 * below. A `.placeholder.svg` suffix marks an empty slot automatically.
 * Keep alt/caption accurate; record any stock photograph's credit in CREDITS.md.
 * No stock photograph has yet passed the full sourcing brief.
 */
export type KitchenPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  shot: string;
  credit?: { photographer: string; source: string; license: string };
};

export const kitchenPhotos: KitchenPhoto[] = [
  {
    id: 'injera',
    src: '/images/team/injera.placeholder.svg',
    alt: 'A woman in a chef uniform pouring injera batter onto a hot mitad.',
    caption: 'Injera, made by hand',
    shot: 'Making injera',
  },
  {
    id: 'buna',
    src: '/images/team/buna.placeholder.svg',
    alt: 'A woman in a chef uniform pouring coffee from a jebena into small cups.',
    caption: 'Buna from the jebena',
    shot: 'Pouring buna',
  },
  {
    id: 'doro-wat',
    src: '/images/team/doro-wat.placeholder.svg',
    alt: 'A woman in a chef uniform stirring a pot of doro wat on the stove.',
    caption: 'Doro wat, slow cooked',
    shot: 'Stirring doro wat',
  },
  {
    id: 'ingredients',
    src: '/images/team/ingredients.placeholder.svg',
    alt: 'A woman in a chef uniform chopping fresh vegetables on a kitchen board.',
    caption: 'Fresh ingredients, carefully prepared',
    shot: 'Preparing ingredients',
  },
  {
    id: 'plating',
    src: '/images/team/plating.placeholder.svg',
    alt: 'A woman in a chef uniform arranging vegetables and stew on an injera platter.',
    caption: 'The finishing touches',
    shot: 'Plating a meal',
  },
  {
    id: 'serving',
    src: '/images/team/serving.placeholder.svg',
    alt: 'A woman in a chef uniform serving a freshly prepared meal from the kitchen.',
    caption: 'Ready to share',
    shot: 'Serving with care',
  },
];

export const isKitchenPlaceholder = (photo: KitchenPhoto) => photo.src.endsWith('.placeholder.svg');
export const availableKitchenPhotos = kitchenPhotos.filter(photo => !isKitchenPlaceholder(photo));
export const storyKitchenPhoto = availableKitchenPhotos[0] ?? kitchenPhotos[0];
export const heroKitchenPhoto = availableKitchenPhotos.find(photo => photo.id === 'buna') ?? availableKitchenPhotos[0];
