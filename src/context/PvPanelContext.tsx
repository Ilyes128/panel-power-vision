
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PanelState, MeasurementData, FaultAlert, IrradianceLevel, FaultType } from '@/types';
import { initialPanelState, generateNewDataPoint, generateHistoricalAlerts, availableIrradianceLevels } from '@/services/pv-data-service';
import { useToast } from '@/components/ui/use-toast';

interface PvPanelContextType {
  panelState: PanelState;
  selectedIrradiance: IrradianceLevel;
  setSelectedIrradiance: (level: IrradianceLevel) => void;
  alerts: FaultAlert[];
  acknowledgeAlert: (alertId: string) => void;
  isLive: boolean;
  setIsLive: (isLive: boolean) => void;
  simulateRandomFault: () => void;
}

const PvPanelContext = createContext<PvPanelContextType | undefined>(undefined);

export const usePvPanel = () => {
  const context = useContext(PvPanelContext);
  if (!context) {
    throw new Error('usePvPanel must be used within a PvPanelProvider');
  }
  return context;
};

interface PvPanelProviderProps {
  children: ReactNode;
}

export const PvPanelProvider: React.FC<PvPanelProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [panelState, setPanelState] = useState<PanelState>(initialPanelState);
  const [selectedIrradiance, setSelectedIrradiance] = useState<IrradianceLevel>(800);
  const [alerts, setAlerts] = useState<FaultAlert[]>(generateHistoricalAlerts(initialPanelState.id));
  const [isLive, setIsLive] = useState(true);
  
  // Function to acknowledge an alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };
  
  // Function to simulate a random fault
  const simulateRandomFault = () => {
    const faultTypes: FaultType[] = ['cell_crack', 'hot_spot', 'shading'];
    const randomFault = faultTypes[Math.floor(Math.random() * faultTypes.length)];
    
    // Generate new data with the fault
    const { data, fault } = generateNewDataPoint(panelState.currentData, 1);
    
    // Update panel state
    setPanelState(prev => ({
      ...prev,
      currentData: data,
      status: fault.severity,
      statusMessage: fault.message
    }));
    
    // Add new alert
    const newAlert: FaultAlert = {
      id: `alert-${panelState.id}-${Date.now()}`,
      panelId: panelState.id,
      timestamp: new Date(),
      type: fault.type,
      severity: fault.severity,
      message: fault.message,
      acknowledged: false
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    // Show toast for the new fault
    toast({
      title: `${fault.severity.charAt(0).toUpperCase() + fault.severity.slice(1)} Alert`,
      description: fault.message,
      variant: fault.severity === 'critical' ? 'destructive' : 
               fault.severity === 'warning' ? 'default' : 'default'
    });
  };
  
  // Effect for updating data in real-time
  useEffect(() => {
    if (!isLive) return;
    
    const intervalId = setInterval(() => {
      const { data, fault } = generateNewDataPoint(panelState.currentData);
      
      // Update panel state
      setPanelState(prev => ({
        ...prev,
        currentData: data,
        status: fault.severity,
        statusMessage: fault.message
      }));
      
      // Add a new alert if there's a fault
      if (fault.type !== 'normal') {
        const newAlert: FaultAlert = {
          id: `alert-${panelState.id}-${Date.now()}`,
          panelId: panelState.id,
          timestamp: new Date(),
          type: fault.type,
          severity: fault.severity,
          message: fault.message,
          acknowledged: false
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        
        // Show toast for new faults
        toast({
          title: `${fault.severity.charAt(0).toUpperCase() + fault.severity.slice(1)} Alert`,
          description: fault.message,
          variant: fault.severity === 'critical' ? 'destructive' : 
                  fault.severity === 'warning' ? 'default' : 'default'
        });
      }
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [isLive, panelState.currentData, toast]);
  
  return (
    <PvPanelContext.Provider 
      value={{ 
        panelState, 
        selectedIrradiance, 
        setSelectedIrradiance, 
        alerts, 
        acknowledgeAlert,
        isLive,
        setIsLive,
        simulateRandomFault
      }}
    >
      {children}
    </PvPanelContext.Provider>
  );
};
