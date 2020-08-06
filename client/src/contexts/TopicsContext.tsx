import React, { useContext } from 'react';
import useSwr from 'swr';
import { Maybe, ID } from 'types';
import { api } from 'utils';

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

function TopicsProvider({ children }: TopicsProviderProps) {
  const { data, error } = useSwr<Topic[]>('/api/topics', api.get);

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <TopicsContext.Provider value={data}>{children}</TopicsContext.Provider>
  );
}

export default TopicsProvider;
