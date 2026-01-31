import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';

const NotificationBell = ({ notifications, onMarkRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-slate-700 text-slate-300 transition-colors"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-slate-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
                    <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <span className="text-xs text-slate-400">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">No notifications</div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${n.read ? 'opacity-50' : 'bg-slate-700/10'}`}
                                    onClick={() => !n.read && onMarkRead(n.id)}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            <div className={`w-2 h-2 rounded-full ${n.read ? 'bg-transparent' : 'bg-indigo-500'}`}></div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-200">{n.message}</p>
                                            <span className="text-xs text-slate-500 mt-1 block">{n.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-2 border-t border-slate-700 bg-slate-800/50 text-center">
                        <button className="text-xs text-indigo-400 hover:text-indigo-300" onClick={() => setIsOpen(false)}>Close Panel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
