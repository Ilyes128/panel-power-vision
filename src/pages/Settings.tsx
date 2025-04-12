
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your PV monitoring system preferences.
          </p>
        </div>
        
        <div className="grid gap-6">
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-medium mb-4">System Configuration</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Configure your PV panel monitoring system settings.
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Measurement Interval</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="5">Every 5 minutes</option>
                    <option value="10">Every 10 minutes</option>
                    <option value="15">Every 15 minutes</option>
                    <option value="30">Every 30 minutes</option>
                    <option value="60">Every hour</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alert Threshold</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="low">Low (Minor Issues)</option>
                    <option value="medium">Medium (Default)</option>
                    <option value="high">High (Critical Issues Only)</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4">
                <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
