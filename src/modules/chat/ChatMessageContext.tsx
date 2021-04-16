import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useContext,
  useRef,
} from 'react';
import { useSocketListener } from '@src/modules/socket-io/SocketIoContext';
import { ChatMessage } from './ChatTypes';
import { ID } from '@shared/SharedTypes';
// https://material.io/design/sound/sound-resources.html#
import useWindowFocus from './useWindowFocus';
import { useSettings } from '@src/modules/settings/SettingsContext';
import { produce } from 'immer';
import { ChatEvent, UsersEvent } from '@shared/SocketIoEvents';
import { SocketUser } from '@src/modules/shared/SharedTypes';
import { useViewer } from '../viewer/ViewerContext';

interface ChatMessageContextValue {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  receiveMessage: (message: ChatMessage) => void;
}

const ChatMessageContext = React.createContext<ChatMessageContextValue>(
  {} as ChatMessageContextValue,
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
    settings: { isSoundOn },
  } = useSettings();

  const audioRef = useRef<HTMLAudioElement>(null);

  const { viewer } = useViewer();

  const receiveMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
      if (viewer?.id !== message.author.id && !isFocused && isSoundOn) {
        const audio = audioRef.current;
        if (audio) {
          // Stop and rewind the audio before playing.
          // Or while this audio is already playing, the new one will not be played.
          // https://stackoverflow.com/a/14836099/10876256
          audio.pause();
          audio.currentTime = 0;
          audio.play();
        }
      }
      // TODO: May add this feature later.
      // if (viewer) {
      //   socket.emit('received message', roomId, message.id, viewer.id);
      // }
    },
    [isFocused, isSoundOn],
  );

  useSocketListener(ChatEvent.CHAT_MESSAGE, receiveMessage);

  const handleEditUser = useCallback((editedUser: SocketUser) => {
    setMessages(
      produce((draft: ChatMessage[]) => {
        draft.forEach((message) => {
          if (message.author.id === editedUser.id) {
            message.author = editedUser;
          }
        });
      }),
    );
  }, []);

  useSocketListener(UsersEvent.EDIT_USER, handleEditUser);

  const contextValue = useMemo(
    () => ({ messages, setMessages, receiveMessage }),
    [messages, receiveMessage],
  );

  return (
    <ChatMessageContext.Provider value={contextValue}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef}>
        <source src="/notification.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      {children}
    </ChatMessageContext.Provider>
  );
}

export default ChatMessageProvider;
