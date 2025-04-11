
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricsCard from '@/components/dashboard/MetricsCard';
import PanelStatus from '@/components/dashboard/PanelStatus';
import AlertsList from '@/components/dashboard/AlertsList';
import IVCurveChart from '@/components/charts/IVCurveChart';
import PVCurveChart from '@/components/charts/PVCurveChart';
import { PvPanelProvider, usePvPanel } from '@/context/PvPanelContext';
import { Sun, Thermometer, Zap, PercentIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { panelState } = usePvPanel();
  const { irradiance, temperature, power, efficiency } = panelState.currentData;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">PV Panel Monitoring Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and fault detection for photovoltaic panels.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Irradiance"
          value={`${irradiance.toFixed(1)} W/m²`}
          icon={<Sun className="h-4 w-4" />}
          trend={{
            value: 2.5,
            isPositive: true
          }}
          description="vs. previous hour"
        />
        <MetricsCard
          title="Temperature"
          value={`${temperature.toFixed(1)} °C`}
          icon={<Thermometer className="h-4 w-4" />}
          trend={{
            value: 1.2,
            isPositive: false
          }}
          description="vs. previous hour"
        />
        <MetricsCard
          title="Power Output"
          value={`${power.toFixed(1)} W`}
          icon={<Zap className="h-4 w-4" />}
          trend={{
            value: 3.1,
            isPositive: true
          }}
          description="vs. previous hour"
        />
        <MetricsCard
          title="Efficiency"
          value={`${efficiency.toFixed(1)}%`}
          icon={<PercentIcon className="h-4 w-4" />}
          description="Current conversion efficiency"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <IVCurveChart />
          <PVCurveChart />
        </div>
        <div className="space-y-6">
          <PanelStatus />
          <AlertsList />
        </div>
      </div>
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <PvPanelProvider>
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    </PvPanelProvider>
  );
};

export default IndexPage;
