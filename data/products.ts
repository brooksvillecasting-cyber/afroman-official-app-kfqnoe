
import { Product } from '@/types/Product';

export const PRODUCTS: Product[] = [
  {
    id: 'tshirt',
    name: 'Classic Afroman T-Shirt',
    description: 'Official Afroman merchandise. Premium quality cotton t-shirt featuring iconic Afroman graphics. Available in sizes S through 5X. Sizes 4X and 5X include an additional $2 charge for extended sizing.',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'clothing',
    sizes: ['S', 'M', 'L', 'XL', '2X', '3X', '4X', '5X'],
    stripeUrl: 'https://buy.stripe.com/bJe00l77D5xC49DeG96Na0a',
  },
  {
    id: 'hoodie',
    name: 'Afroman Hoodie',
    description: 'Stay warm in style with the official Afroman hoodie. Premium fleece material with bold Afroman branding. Available in sizes S through 5X. Sizes 4X and 5X include an additional $2 charge for extended sizing.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    category: 'clothing',
    sizes: ['S', 'M', 'L', 'XL', '2X', '3X', '4X', '5X'],
    stripeUrl: 'https://buy.stripe.com/cNiaEZ9fLf8c9tXapT6Na0b',
  },
  {
    id: 'movie',
    name: 'Happily Divorced - Digital Movie',
    description: 'Purchase and stream Afroman\'s exclusive movie "Happily Divorced" instantly. This is a digital purchase - you will receive access to stream the movie after completing your purchase through our secure payment system. One-time purchase for unlimited streaming access.',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    category: 'movie',
    stripeUrl: 'https://buy.stripe.com/9B6cN7bnT6BG49DbtX6Na09',
  },
];

export const MUSIC_VIDEOS = [
  {
    id: 'because-i-got-high',
    title: 'Because I Got High',
    youtubeId: 'WeYsTmIzjkw',
    thumbnail: 'https://img.youtube.com/vi/WeYsTmIzjkw/maxresdefault.jpg',
    description: 'The Grammy-nominated hit that made Afroman a household name. Watch this iconic music video that has been viewed millions of times worldwide.',
  },
  {
    id: 'crazy-rap',
    title: 'Crazy Rap (Colt 45 & 2 Zig Zags)',
    youtubeId: 'Tg3C0nvenro',
    thumbnail: 'https://img.youtube.com/vi/Tg3C0nvenro/maxresdefault.jpg',
    description: 'The iconic track that showcases Afroman\'s unique style and storytelling ability. A fan favorite that defined an era.',
  },
];
