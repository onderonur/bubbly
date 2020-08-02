import { Router } from 'express';
import { Topic } from './types';

const topics: Topic[] = [
  { title: 'Random Chat', roomId: 'random-chat' },
  { title: 'Music', roomId: 'music' },
  { title: 'Movies', roomId: 'movies' },
  { title: 'Comics', roomId: 'comics' },
  { title: 'Games', roomId: 'games' },
  { title: 'Books', roomId: 'books' },
  { title: 'Anime & Manga', roomId: 'anime-and-manga' },
  { title: 'Arts & Creativity', roomId: 'arts-and-creativity' },
  { title: 'Technology', roomId: 'technology' },
];

const router = Router();

router.get('/topics', (req, res) => {
  res.json(topics);
});

export default router;
