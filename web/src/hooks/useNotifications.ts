
import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { apiClientFetch } from '@/lib/api-client';

export type NotificationType = 'SYSTEM' | 'ORDER' | 'PROMOTION' | 'LOYALTY';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  params: {
      page: number;
      limit: number;
      totalPages: number;
  };
  isLoading: boolean;
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  socketConnected: boolean;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 10, totalPages: 1 });

  // 1. Fetch Initial Data
  const fetchNotifications = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await apiClientFetch<any>(`/notifications?page=${page}&limit=${params.limit}`);
      if (res) {
          if (page === 1) {
              setNotifications(res.items);
          } else {
              setNotifications(prev => [...prev, ...res.items]);
          }
          setParams(prev => ({ ...prev, page, totalPages: res.meta.totalPages }));
          setUnreadCount(res.meta.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
    }
  }, [params.limit]);

  // 2. Socket Connection
  useEffect(() => {
    const socket: Socket = io(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Prioritize websocket
    });

    socket.on('connect', () => {
      console.log('Socket Connected:', socket.id);
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket Disconnected');
      setSocketConnected(false);
    });

    socket.on('notification:new', (newNotification: Notification) => {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast(newNotification.title, {
          description: newNotification.body,
          action: {
              label: 'View',
              onClick: () => console.log('View notification', newNotification)
          }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 3. Initial Fetch on Mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 4. Actions
  const markAsRead = async (id: string) => {
    try {
        await apiClientFetch(`/notifications/${id}/read`, { method: 'PATCH' });
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
        console.error('Failed to mark read', e);
    }
  };

  const markAllAsRead = async () => {
    try {
        await apiClientFetch(`/notifications/read-all`, { method: 'PATCH' });
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    } catch (e) {
        console.error('Failed to mark all read', e);
    }
  };

  return {
    notifications,
    unreadCount,
    params,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    socketConnected
  };
};
