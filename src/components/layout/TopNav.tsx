
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Download, 
  Menu, 
  User 
} from 'lucide-react';
import { usePvPanel } from '@/context/PvPanelContext';
import { Switch } from "@/components/ui/switch";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const TopNav = () => {
  const { alerts, isLive, setIsLive, simulateRandomFault } = usePvPanel();
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <header className="h-16 bg-white border-b border-border/40 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center">
        <SidebarTrigger>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SidebarTrigger>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Live Updates:</span>
          <Switch 
            checked={isLive} 
            onCheckedChange={setIsLive} 
            className={isLive ? "bg-status-normal" : ""}
          />
        </div>

        <Button variant="outline" onClick={simulateRandomFault}>
          Simulate Fault
        </Button>

        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Export Data</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unacknowledgedAlerts.length > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1.5 h-5 bg-status-warning">
                  {unacknowledgedAlerts.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-4 py-3 font-medium border-b">
              Notifications
            </div>
            {unacknowledgedAlerts.length > 0 ? (
              unacknowledgedAlerts.slice(0, 5).map(alert => (
                <DropdownMenuItem key={alert.id} className="flex flex-col items-start p-3">
                  <div className="flex items-center w-full">
                    <Badge 
                      className={`
                        ${alert.severity === 'critical' ? 'bg-status-critical' : 
                          alert.severity === 'warning' ? 'bg-status-warning' : 'bg-status-normal'}
                        mr-2
                      `}
                    >
                      {alert.severity}
                    </Badge>
                    <span className="text-sm font-medium">{alert.type.replace('_', ' ')}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs mt-1">{alert.message}</p>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No new notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">User profile</span>
        </Button>
      </div>
    </header>
  );
};

export default TopNav;
