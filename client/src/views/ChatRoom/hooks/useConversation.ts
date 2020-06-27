import { useCallback, useState, useMemo } from 'react';
import { useSocketListener } from 'contexts/SocketContext';
import { ChatMessage } from '../types';
import { SocketUser } from 'types';
// https://material.io/design/sound/sound-resources.html#
// TODO: Will fix the type error here
// @ts-ignore
import notificationWav from 'views/ChatRoom/sounds/notification.wav';
import useWindowFocus from '../hooks/useWindowFocus';
import { useSettings } from 'contexts/SettingsContext';
import { produce } from 'immer';

const notificationSound = new Audio(notificationWav);

function useConversation() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const isFocused = useWindowFocus();
  const {
    settings: { volume },
  } = useSettings();

  const receiveMessage = useCallback(
    (message: ChatMessage) => {
      setMessages((current) => [...current, message]);
      // TODO
      // if (viewer) {
      //   io?.emit('received message', roomId, message.id, viewer.id);
      // }
      if (!isFocused && volume) {
        notificationSound.play();
      }
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

  const result = useMemo(() => ({ messages, setMessages, receiveMessage }), [
    messages,
    receiveMessage,
  ]);

  return result;
}

export default useConversation;
