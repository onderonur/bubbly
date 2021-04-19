import React, { useContext } from 'react';
import useSwr from 'swr';
import { Maybe, ID } from '@shared/SharedTypes';
import { api } from '@src/modules/shared/SharedUtils';

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

export async function fetchTopics() {
  const topics = await api.get<Topic[]>('/api/topics');
  return topics;
}

type TopicsProviderProps = React.PropsWithChildren<{
  initialData: Topic[];
}>;

function TopicsProvider({ children, initialData }: TopicsProviderProps) {
  const { data, error } = useSwr<Topic[]>('/api/topics', api.get, {
    initialData,
  });

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <TopicsContext.Provider value={data}>{children}</TopicsContext.Provider>
  );
}

export default TopicsProvider;
