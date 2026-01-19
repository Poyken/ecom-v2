'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import { apiClientFetch } from '@/lib/api-client';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: any[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', content: 'Xin chào! Tôi là trợ lý AI ảo. Tôi có thể giúp bạn tìm kiếm sản phẩm nào?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Keep only last 10 messages for context to save tokens
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      
      const res = await apiClientFetch('/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history })
      });

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.text,
        suggestions: res.suggestedProducts
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { id: Date.now().toString(), role: 'assistant', content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 w-[380px] h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-sm font-bold">Shopping Assistant</div>
                  <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close Chat"
              >
                <X size={18} className="text-zinc-500" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  
                  {/* Product Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 ? (
                    <div className="mt-2 w-full space-y-2">
                       {msg.suggestions.map((product: any) => (
                         <Link 
                           key={product.id}
                           href={`/products/${product.slug}`}
                           className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors group"
                         >
                            <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                <ShoppingBag size={16} className="text-zinc-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold truncate group-hover:text-primary transition-colors">{product.name}</div>
                                <div className="text-[10px] text-zinc-500 font-medium">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.minPrice))}
                                </div>
                            </div>
                         </Link>
                       ))}
                    </div>
                  ) : null}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-center gap-2 text-zinc-400 text-xs pl-2">
                    <Sparkles size={12} className="animate-spin" />
                    Thinking...
                 </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-950">
               <form 
                 onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                 className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-transparent focus-within:border-primary/50 transition-colors"
               >
                 <input 
                   type="text" 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder="Hỏi về sản phẩm..."
                   className="flex-1 bg-transparent border-none outline-hidden px-3 text-sm h-8"
                 />
                 <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  aria-label="Send Message"
                 >
                   <Send size={14} />
                 </button>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto h-14 w-14 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-primary/20 flex items-center justify-center relative group"
        aria-label="Open Chat"
      >
        <AnimatePresence mode="wait">
            {isOpen ? (
                <motion.div 
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <X size={24} />
                </motion.div>
            ) : (
                <motion.div 
                    key="open"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <MessageCircle size={24} className="group-hover:animate-pulse" />
                </motion.div>
            )}
        </AnimatePresence>
        
        {!isOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-black" />
        )}
      </motion.button>
    </div>
  );
}
