
'use client';

import { Bell, Check, Info, Package, Sparkles } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export const NotificationBell = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    isLoading 
  } = useNotifications();
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Package className="w-4 h-4 text-blue-500" />;
      case 'PROMOTION': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'LOYALTY': return <Sparkles className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none">
          <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white dark:border-black">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 sm:w-96 p-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/10">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => markAllAsRead()}
              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:bg-transparent"
            >
              <Check className="w-3 h-3" /> Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="h-[60vh]">
          {isLoading && notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
               No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {notifications.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => !item.isRead && markAsRead(item.id)}
                  className={`p-4 flex gap-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors ${
                    !item.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className={`mt-1 flex-shrink-0 p-2 rounded-full ${!item.isRead ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                        <p className={`text-sm ${!item.isRead ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                            {item.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {item.body}
                    </p>
                  </div>
                  {!item.isRead && (
                    <div className="self-center w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {/* Footer */}
        <div className="p-2 border-t border-black/5 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 text-center">
            <Button variant="link" className="text-xs text-gray-500 h-auto p-0 hover:text-gray-800 dark:hover:text-gray-200">
                View All Activity
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
