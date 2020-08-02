import React, { useContext } from 'react';
import useSwr from 'swr';
import { Maybe, ID } from 'types';

interface Topic {
  title: string;
  roomId: ID;
}

type TopicsContextValue = Maybe<Topic[]>;

const TopicsContext = React.createContext<TopicsContextValue>(null);

export function useTopics() {
  const value = useContext(TopicsContext);
  return value;
}

type TopicsProviderProps = React.PropsWithChildren<{}>;

const fetcher = (url: string) => fetch(url).then((response) => response.json());

function TopicsProvider({ children }: TopicsProviderProps) {
  const { data } = useSwr<Topic[]>('/api/topics', fetcher);

  return (
    <TopicsContext.Provider value={data}>{children}</TopicsContext.Provider>
  );
}

export default TopicsProvider;
