
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePvPanel } from '@/context/PvPanelContext';
import { cn } from '@/lib/utils';
import { PanelState } from '@/types';

const statusColors = {
  normal: 'text-status-normal',
  warning: 'text-status-warning',
  critical: 'text-status-critical'
};

const statusBgColors = {
  normal: 'bg-status-normal/10',
  warning: 'bg-status-warning/10',
  critical: 'bg-status-critical/10'
};

const statusIcons = {
  normal: '🟢',
  warning: '🟠',
  critical: '🔴'
};

const formatDate = (date: Date | null) => {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const PanelStatus: React.FC = () => {
  const { panelState } = usePvPanel();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Panel Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{panelState.name}</h3>
              <p className="text-sm text-muted-foreground">{panelState.location}</p>
            </div>
            <div 
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5", 
                statusBgColors[panelState.status],
                statusColors[panelState.status]
              )}
            >
              <span>{statusIcons[panelState.status]}</span>
              <span>{panelState.status.charAt(0).toUpperCase() + panelState.status.slice(1)}</span>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="font-medium mb-1">Status Message:</h4>
            <p className="text-sm">{panelState.statusMessage}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Installed</p>
              <p className="font-medium">{formatDate(panelState.installedDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Maintenance</p>
              <p className="font-medium">{formatDate(panelState.lastMaintenance)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PanelStatus;
