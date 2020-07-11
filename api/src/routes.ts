import { Router } from 'express';
import { ThemedRoom } from './types';

const themedRooms: ThemedRoom[] = [
  { title: 'Random Chat', slug: 'random-chat' },
  { title: 'Music', slug: 'music' },
  { title: 'Movies', slug: 'movies' },
  { title: 'Comics', slug: 'comics' },
  { title: 'Games', slug: 'games' },
  { title: 'Books', slug: 'books' },
  { title: 'Anime & Manga', slug: 'anime-and-manga' },
  { title: 'Arts & Creativity', slug: 'arts-and-creativity' },
  { title: 'Technology', slug: 'technology' },
];

const router = Router();

router.get('/rooms/themed', (req, res) => {
  res.json(themedRooms);
});

export default router;
