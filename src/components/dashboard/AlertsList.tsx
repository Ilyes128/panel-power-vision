
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { usePvPanel } from '@/context/PvPanelContext';
import { cn } from '@/lib/utils';
import { CheckCheck, AlertTriangle } from 'lucide-react';

const AlertsList: React.FC = () => {
  const { alerts, acknowledgeAlert } = usePvPanel();
  
  // Format date relative to now (e.g., "2 hours ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };
  
  const severityColors = {
    normal: 'bg-status-normal text-white',
    warning: 'bg-status-warning text-white',
    critical: 'bg-status-critical text-white'
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Recent Alerts
        </CardTitle>
        <Badge variant="outline" className="font-normal">
          {alerts.filter(a => !a.acknowledged).length} unresolved
        </Badge>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-1 max-h-[340px] overflow-y-auto scrollbar-thin pr-6 pl-6">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "py-2 px-3 rounded-md flex items-start justify-between gap-2",
                  alert.acknowledged ? "bg-transparent" : "bg-muted/50"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={severityColors[alert.severity]}>
                      {alert.severity}
                    </Badge>
                    <span className="text-sm font-medium">
                      {alert.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatRelativeTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs">{alert.message}</p>
                </div>
                {!alert.acknowledged && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-1 h-8" 
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    <CheckCheck className="h-4 w-4 mr-1" />
                    <span className="text-xs">Acknowledge</span>
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No alerts to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsList;
