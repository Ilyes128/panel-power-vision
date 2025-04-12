
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
import { Separator } from "@/components/ui/separator";

const SettingsContent = () => {
  const { panelState, setSelectedIrradiance } = usePvPanel();
  const { toast } = useToast();
  
  const [measurementInterval, setMeasurementInterval] = useState("5");
  const [alertThreshold, setAlertThreshold] = useState("medium");
  
  const form = useForm({
    defaultValues: {
      panelPower: "320",
      powerTolerance: "±3",
      maxPower: "320",
      panelEfficiency: "17.5",
      vmp: "36.7", // Voltage at maximum power
      imp: "8.72", // Current at maximum power
      voc: "45.5", // Open circuit voltage
      isc: "9.18", // Short circuit current
      vocIscTolerance: "±5",
      maxSystemVoltage: "1000",
      maxSeriesFuse: "15",
      operatingTemp: "-40~+85",
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
                  <label className="text-sm font-medium leading-none">Measurement Interval</label>
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
                  <label className="text-sm font-medium leading-none">Alert Threshold</label>
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
              Configure detailed electrical characteristics of your PV panel under Standard Test Conditions (STC).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Electrical Characteristics */}
                <div>
                  <h3 className="text-base font-medium mb-2">Power Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="maxPower"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Power (Pmax) [W]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum power output at STC
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="powerTolerance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Power Tolerance [%]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Acceptable power range (e.g., ±3%)
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="panelEfficiency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Panel Efficiency [%]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Efficiency at standard test conditions
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Maximum Power Point Characteristics */}
                <div>
                  <h3 className="text-base font-medium mb-2">Maximum Power Point Characteristics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vmp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voltage at Max Power (Vmp) [V]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Voltage at maximum power point
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current at Max Power (Imp) [A]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Current at maximum power point
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Open/Short Circuit Characteristics */}
                <div>
                  <h3 className="text-base font-medium mb-2">Circuit Characteristics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="voc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Open Circuit Voltage (Voc) [V]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Open circuit voltage
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Circuit Current (Isc) [A]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Short circuit current
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="vocIscTolerance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voc & Isc Tolerance [%]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Tolerance for Voc and Isc values
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* System Specifications */}
                <div>
                  <h3 className="text-base font-medium mb-2">System Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="maxSystemVoltage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum System Voltage [V]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum DC system voltage
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maxSeriesFuse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Series Fuse Rating [A]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum series fuse rating
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="operatingTemp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating Temperature [°C]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Operating temperature range
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Temperature Coefficients */}
                <div>
                  <h3 className="text-base font-medium mb-2">Temperature Coefficients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cellTemperatureCoefficient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Power Temperature Coefficient [%/°C]</FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>
                          <FormDescription>
                            Power temperature coefficient (e.g., -0.0025)
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="mt-4">Save Panel Characteristics</Button>
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
