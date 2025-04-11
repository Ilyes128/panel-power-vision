
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePvPanel } from '@/context/PvPanelContext';
import { getTheoreticalCurves } from '@/services/pv-data-service';

const prepareChartData = (
  measuredVoltage: number[], 
  measuredCurrent: number[],
  theoreticalVoltage: number[], 
  theoreticalCurrent: number[]
) => {
  // Calculate power
  const measuredPower = measuredVoltage.map((v, i) => v * measuredCurrent[i]);
  const theoreticalPower = theoreticalVoltage.map((v, i) => v * theoreticalCurrent[i]);
  
  // Create data points for chart
  const data = measuredVoltage.map((v, i) => ({
    voltage: v,
    measured: measuredPower[i] || 0,
    theoretical: 0, // Will be populated in the next step
  }));
  
  // Map theoretical data to same voltage points or interpolate
  theoreticalVoltage.forEach((v, i) => {
    // Find the closest voltage point in the measured data
    const closestIndex = data.findIndex(point => point.voltage >= v);
    if (closestIndex >= 0 && closestIndex < data.length) {
      data[closestIndex].theoretical = theoreticalPower[i];
    }
  });
  
  return data;
};

const PVCurveChart: React.FC = () => {
  const { panelState, selectedIrradiance } = usePvPanel();
  
  // Get theoretical curves for comparison
  const theoreticalCurve = useMemo(() => 
    getTheoreticalCurves(selectedIrradiance), 
    [selectedIrradiance]
  );
  
  // Prepare data for the chart
  const chartData = useMemo(() => {
    return prepareChartData(
      panelState.currentData.voltage,
      panelState.currentData.current,
      theoreticalCurve.voltage,
      theoreticalCurve.current
    );
  }, [panelState.currentData, theoreticalCurve]);
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">P-V Curve</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="voltage" 
              label={{ 
                value: 'Voltage (V)', 
                position: 'insideBottomRight', 
                offset: -10 
              }} 
            />
            <YAxis 
              label={{ 
                value: 'Power (W)', 
                angle: -90, 
                position: 'insideLeft', 
                offset: 10 
              }} 
            />
            <Tooltip 
              formatter={(value, name) => [
                `${Number(value).toFixed(2)} W`, 
                name === 'measured' ? 'Measured Power' : 'Theoretical Power'
              ]}
              labelFormatter={(label) => `Voltage: ${Number(label).toFixed(2)} V`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="theoretical" 
              name="STC (Theoretical)"
              stroke="#2563eb" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="measured" 
              name="Measured Power"
              stroke="#d1901f" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PVCurveChart;
