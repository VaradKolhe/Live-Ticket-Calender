import { NavLink } from 'react-router-dom';
import { Calendar, Bookmark, Bell, Settings, MoreHorizontal, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  
  const navItems = [
    { name: 'Calendar', path: '/', icon: Calendar },
    { name: 'My Events', path: '/my-events', icon: Bookmark },
    { name: 'Reminders', path: '/reminders', icon: Bell },
  ];

  return (
    <div className="w-64 h-screen bg-[#0e0e11] border-r border-border flex flex-col justify-between p-4 flex-shrink-0">
      
      {/* Top section */}
      <div>
        <div className="flex items-center gap-2 px-3 py-4 mb-4">
          <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">eventflow</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive 
                    ? 'bg-panel text-white border border-border' 
                    : 'text-textSecondary hover:text-white hover:bg-panel/50'
                }`
              }
            >
              <item.icon size={18} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="space-y-4">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-textSecondary hover:text-white hover:bg-panel/50 transition-colors w-full">
          <Settings size={18} />
          <span className="font-medium">Settings</span>
        </button>

        <div className="flex items-center justify-between px-3 py-2 mt-4 hover:bg-panel/50 rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
              {user?.name?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-white leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="text-xs text-textSecondary">Personal space</span>
            </div>
          </div>
          <MoreHorizontal size={16} className="text-textSecondary" />
        </div>
      </div>
      
    </div>
  );
}
