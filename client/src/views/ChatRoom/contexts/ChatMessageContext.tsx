import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useContext,
} from 'react';
import { useSocketListener } from 'contexts/SocketIoContext';
import { ChatMessage } from '../types';
import { SocketUser, ID } from 'types';
// https://material.io/design/sound/sound-resources.html#
// TODO: Will fix the type error here
// @ts-ignore
import notificationWav from 'views/ChatRoom/sounds/notification.wav';
import useWindowFocus from '../hooks/useWindowFocus';
import { useSettings } from 'contexts/SettingsContext';
import { produce } from 'immer';

const notificationSound = new Audio(notificationWav);

interface ChatMessageContextValue {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  receiveMessage: (message: ChatMessage) => void;
}

const ChatMessageContext = React.createContext<ChatMessageContextValue>(
  {} as ChatMessageContextValue
);

export function useChatMessages() {
  const value = useContext(ChatMessageContext);
  return value;
}

type ChatMessageProviderProps = React.PropsWithChildren<{
  roomId: ID;
}>;

function ChatMessageProvider({ roomId, children }: ChatMessageProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, [roomId]);

  const isFocused = useWindowFocus();
  const {
    settings: { volume },
  } = useSettings();

  const receiveMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
      if (!isFocused && volume) {
        notificationSound.play();
      }
      // TODO
      // if (viewer) {
      //   io?.emit('received message', roomId, message.id, viewer.id);
      // }
    },
    [isFocused, volume]
  );

  useSocketListener('chat message', receiveMessage);

  const handleEditUser = useCallback((editedUser: SocketUser) => {
    setMessages(
      produce((draft: ChatMessage[]) => {
        draft.forEach((message) => {
          if (message.author.id === editedUser.id) {
            message.author = editedUser;
          }
        });
      })
    );
  }, []);

  useSocketListener('edit user', handleEditUser);

  const contextValue = useMemo(
    () => ({ messages, setMessages, receiveMessage }),
    [messages, receiveMessage]
  );

  return (
    <ChatMessageContext.Provider value={contextValue}>
      {children}
    </ChatMessageContext.Provider>
  );
}

export default ChatMessageProvider;
