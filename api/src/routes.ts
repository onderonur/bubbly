import { Router } from 'express';
import { ID } from './types';
import { addCacheControl, hoursToSeconds } from './utils';

interface Topic {
  roomId: ID;
  title: string;
}

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
  addCacheControl(res, { maxAge: hoursToSeconds(24) });
  res.json(topics);
});

export default router;
