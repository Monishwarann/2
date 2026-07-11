import React from 'react';
import { useMineStore } from '../../stores/mineStore';
import { 
  Boxes, Users, BarChart3, Map, History, 
  Cpu, Activity, RefreshCw, FileText, Settings, 
  Bot, PhoneCall, LogOut 
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage } = useMineStore();

  const menuItems: MenuItem[] = [
    { id: 'Twin', label: '3D Digital Twin', icon: <Boxes className="w-5 h-5" /> },
    { id: 'Workers', label: 'Worker Tracking', icon: <Users className="w-5 h-5" /> },
    { id: 'Analytics', label: 'AI Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'Heatmap', label: 'SIHM Heat Map', icon: <Map className="w-5 h-5" /> },
    { id: 'Replay', label: 'Incident Replay', icon: <History className="w-5 h-5" /> },
    { id: 'Robots', label: 'Rescue Robots', icon: <Bot className="w-5 h-5" /> },
    { id: 'Maintenance', label: 'Predictive Maint.', icon: <Settings className="w-5 h-5" /> },
    { id: 'Federated', label: 'TinyML Federated', icon: <Cpu className="w-5 h-5" /> },
    { id: 'Reports', label: 'Safety Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'Admin', label: 'User Management', icon: <Activity className="w-5 h-5" /> },
    { id: 'Assistant', label: 'AI Q&A Assistant', icon: <RefreshCw className="w-5 h-5" /> },
    { id: 'MobileApp', label: 'Worker Mobile App', icon: <PhoneCall className="w-5 h-5" /> }
  ];

  return (
    <div className="w-64 min-h-screen glass-card-premium border-r border-[rgba(0,212,255,0.15)] flex flex-col justify-between shrink-0">
      {/* Header */}
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-[rgba(0,212,255,0.1)]">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#00D4FF] to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-glowCyan">
            MG
          </div>
          <div>
            <h1 className="text-sm font-extrabold uppercase tracking-widest text-[#E8F4FD]">
              MineGuardian X
            </h1>
            <span className="text-[10px] text-mine-cyan tracking-wider font-mono uppercase">
              CMARI Control Room
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[rgba(0,212,255,0.15)] to-transparent text-[#00D4FF] border-l-2 border-[#00D4FF]' 
                    : 'text-[#8BA5BC] hover:text-[#E8F4FD] hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[rgba(0,212,255,0.1)]">
        <button
          onClick={() => setCurrentPage('Login')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-mine-red hover:bg-[rgba(255,59,48,0.05)] transition-all"
        >
          <LogOut className="w-5 h-5" />
          Disconnect Session
        </button>
      </div>
    </div>
  );
};
