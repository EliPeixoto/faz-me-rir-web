
import { 
  LayoutDashboard, 
  TrendingDown, 
  TrendingUp, 
  Settings, 
  LogOut,
  DollarSign,
  PieChart,
  Repeat
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ currentView, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'receitas', label: 'Receitas', icon: TrendingUp },
    { id: 'despesas', label: 'Despesas', icon: TrendingDown },
    { id: 'recorrentes', label: 'Despesas Fixas', icon: Repeat },
    { id: 'planejamento', label: 'Planejamento', icon: PieChart },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-green)] flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900">Controla Dindin</h2>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[var(--primary-green-light)] text-[var(--primary-green-dark)]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}