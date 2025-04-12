
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  LineChart, 
  AlertTriangle, 
  Settings, 
  Zap, 
  Download 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="flex items-center px-6 py-4">
          <Zap className="h-6 w-6 text-solar-500 mr-2" />
          <span className="text-lg font-bold text-sidebar-foreground">PV Monitor</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="scrollbar-thin">
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className={`flex items-center ${location.pathname === '/' ? 'text-primary font-medium' : ''}`}>
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center">
                    <LineChart className="h-5 w-5 mr-3" />
                    <span>I-V Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-3" />
                    <span>Fault Monitoring</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className="flex items-center">
                    <Download className="h-5 w-5 mr-3" />
                    <span>Import/Export</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings" className={`flex items-center ${location.pathname === '/settings' ? 'text-primary font-medium' : ''}`}>
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-sidebar-foreground/70">
          <p>Panel Power Vision v1.0</p>
          <p className="mt-1">© 2025 Solar Systems Inc.</p>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
