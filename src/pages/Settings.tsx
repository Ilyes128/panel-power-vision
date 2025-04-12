
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PvPanelProvider, usePvPanel } from '@/context/PvPanelContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SettingsContent = () => {
  const { panelState, setSelectedIrradiance } = usePvPanel();
  const { toast } = useToast();
  
  const [measurementInterval, setMeasurementInterval] = useState("5");
  const [alertThreshold, setAlertThreshold] = useState("medium");
  
  const form = useForm({
    defaultValues: {
      panelPower: "320",
      panelEfficiency: "17.5",
      nominalVoltage: "40",
      nominalCurrent: "8",
      cellTemperatureCoefficient: "-0.0025"
    }
  });
  
  const onSubmit = (data) => {
    console.log("Panel characteristics updated:", data);
    toast({
      title: "Settings updated",
      description: "Panel characteristics have been updated successfully.",
    });
  };
  
  const handleSystemSettingsSubmit = () => {
    console.log("System settings updated:", { measurementInterval, alertThreshold });
    toast({
      title: "System settings updated",
      description: "Your monitoring system settings have been saved successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your PV monitoring system preferences.
        </p>
      </div>
      
      <div className="grid gap-6">
        {/* System Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>
              Configure your PV panel monitoring system settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Measurement Interval</FormLabel>
                  <Select 
                    value={measurementInterval} 
                    onValueChange={setMeasurementInterval}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Every 5 minutes</SelectItem>
                      <SelectItem value="10">Every 10 minutes</SelectItem>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                      <SelectItem value="60">Every hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Alert Threshold</FormLabel>
                  <Select 
                    value={alertThreshold} 
                    onValueChange={setAlertThreshold}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Minor Issues)</SelectItem>
                      <SelectItem value="medium">Medium (Default)</SelectItem>
                      <SelectItem value="high">High (Critical Issues Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSystemSettingsSubmit}>
                  Save System Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Panel Characteristics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Panel Characteristics</CardTitle>
            <CardDescription>
              Modify the electrical characteristics of your PV panel for more accurate I-V curve simulations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="panelPower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nominal Power (W)</FormLabel>
                        <FormControl>
                          <Input type="number" min="50" max="1000" {...field} />
                        </FormControl>
                        <FormDescription>
                          Rated power output of the panel in Watts
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="panelEfficiency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Panel Efficiency (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="5" max="30" step="0.1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Efficiency percentage at standard test conditions
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nominalVoltage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open Circuit Voltage - Voc (V)</FormLabel>
                        <FormControl>
                          <Input type="number" min="10" max="100" step="0.1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Open circuit voltage at standard test conditions
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="nominalCurrent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Circuit Current - Isc (A)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="20" step="0.1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Short circuit current at standard test conditions
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="cellTemperatureCoefficient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature Coefficient (%/°C)</FormLabel>
                      <FormControl>
                        <Input type="number" min="-0.01" max="0" step="0.0001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Power temperature coefficient (negative value)
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <Button type="submit">Save Panel Characteristics</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Settings = () => {
  return (
    <PvPanelProvider>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </PvPanelProvider>
  );
};

export default Settings;
