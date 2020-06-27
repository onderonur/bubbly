import { useState, useCallback } from 'react';
import { ChatNotification } from '../types';
import { useSocketListener } from 'contexts/SocketContext';
import produce from 'immer';
import { nanoid } from 'nanoid';

function useChatNotifications() {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);

  const handleNotification = useCallback((notification: string) => {
    setNotifications(
      produce((draft: ChatNotification[]) => {
        draft.push({
          id: nanoid(),
          body: notification,
          timestamp: Date.now(),
        });
      })
    );
  }, []);

  useSocketListener('notification', handleNotification);

  return notifications;
}

export default useChatNotifications;
