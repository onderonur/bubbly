import { NextApiHandler } from 'next';
import { Topic } from '@shared/SharedTypes';

const handler: NextApiHandler = (req, res) => {
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
  res.json(topics);
};

export default handler;
