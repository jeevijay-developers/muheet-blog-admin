import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar = ({ activeTab, onTabChange, onLogout }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'blogs', label: 'All Blogs', icon: FileText },
    { id: 'create', label: 'Create Blog', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-admin-sidebar border-r border-admin-border min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-admin-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Muheet Bharti</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start space-x-3 h-11",
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground shadow-soft" 
                  : "hover:bg-secondary"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <Button 
          variant="outline" 
          className="w-full justify-start space-x-3"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;