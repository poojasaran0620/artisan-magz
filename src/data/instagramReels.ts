export interface InstagramReel {
  id: string;
  reelCode: string;
  url: string;
  embedUrl: string;
  videoUrl: string;
  poster: string;
  title: string;
  tag: string;
  sequence: number;
}

export const INSTAGRAM_HANDLE = 'artisan.magz';
export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/artisan.magz?stkn=bXVmN2RsanZlMGdp';

export const BEST_PERFORMING_REELS: InstagramReel[] = [
  {
    id: 'reel-1',
    reelCode: 'DJn07B_Tdld',
    url: 'https://www.instagram.com/reel/DJn07B_Tdld/?stkn=bjZkbTdzaDB5ZWk5',
    embedUrl: 'https://www.instagram.com/reel/DJn07B_Tdld/embed/',
    videoUrl: '/reels/reel-1.mp4',
    poster: '/reels/reel-1.jpg',
    title: 'Custom Keepsake Magazine Flip',
    tag: '#ArtisanMagazine',
    sequence: 1,
  },
  {
    id: 'reel-2',
    reelCode: 'DNQodZTxIEw',
    url: 'https://www.instagram.com/reel/DNQodZTxIEw/?stkn=b3JqMTJreG9kbWpx',
    embedUrl: 'https://www.instagram.com/reel/DNQodZTxIEw/embed/',
    videoUrl: '/reels/reel-2.mp4',
    poster: '/reels/reel-2.jpg',
    title: 'Personalized Memories & Polaroid Pages',
    tag: '#KeepsakeGifts',
    sequence: 2,
  },
  {
    id: 'reel-3',
    reelCode: 'DaFOiWXItUf',
    url: 'https://www.instagram.com/reel/DaFOiWXItUf/?stkn=MXZ2MmxheHdoaHV3eQ==',
    embedUrl: 'https://www.instagram.com/reel/DaFOiWXItUf/embed/',
    videoUrl: '/reels/reel-3.mp4',
    poster: '/reels/reel-3.jpg',
    title: 'Special Anniversary & Couple Edition',
    tag: '#CoupleMagazine',
    sequence: 3,
  },
  {
    id: 'reel-4',
    reelCode: 'DaQBGNOoio3',
    url: 'https://www.instagram.com/reel/DaQBGNOoio3/?stkn=OG43NHdwNWFjZnQ5',
    embedUrl: 'https://www.instagram.com/reel/DaQBGNOoio3/embed/',
    videoUrl: '/reels/reel-4.mp4',
    poster: '/reels/reel-4.jpg',
    title: 'Wax Seal & Luxury Hamper Unboxing',
    tag: '#CuratedHamper',
    sequence: 4,
  },
  {
    id: 'reel-5',
    reelCode: 'DQ3UwnqCA-M',
    url: 'https://www.instagram.com/reel/DQ3UwnqCA-M/?stkn=MWd1OW1odGliMnVucA==',
    embedUrl: 'https://www.instagram.com/reel/DQ3UwnqCA-M/embed/',
    videoUrl: '/reels/reel-5.mp4',
    poster: '/reels/reel-5.jpg',
    title: 'Studio Behind the Scenes Handcrafting',
    tag: '#HandmadeWithLove',
    sequence: 5,
  },
  {
    id: 'reel-6',
    reelCode: 'DUk5HOukvTm',
    url: 'https://www.instagram.com/reel/DUk5HOukvTm/?stkn=MWdmdmxwNmpldXIzbw==',
    embedUrl: 'https://www.instagram.com/reel/DUk5HOukvTm/embed/',
    videoUrl: '/reels/reel-6.mp4',
    poster: '/reels/reel-6.jpg',
    title: 'Customer Reaction & Unboxing Moments',
    tag: '#ArtisanMagzMoments',
    sequence: 6,
  },
];