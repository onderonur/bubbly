import { useState, useCallback, useEffect } from 'react';
import { ChatNotification } from './ChatTypes';
import { useSocketListener } from 'modules/socket-io/SocketIoContext';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { ID } from 'modules/shared/SharedTypes';

function useChatNotifications(roomId: ID) {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);

  useEffect(() => {
    return () => {
      setNotifications([]);
    };
  }, [roomId]);

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
