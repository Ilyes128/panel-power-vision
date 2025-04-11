
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePvPanel } from '@/context/PvPanelContext';
import { getTheoreticalCurves, availableIrradianceLevels } from '@/services/pv-data-service';
import { Download } from 'lucide-react';

const prepareChartData = (
  measuredVoltage: number[], 
  measuredCurrent: number[],
  theoreticalVoltage: number[], 
  theoreticalCurrent: number[]
) => {
  // Create data points for chart
  const data = measuredVoltage.map((v, i) => ({
    voltage: v,
    measured: measuredCurrent[i] || 0,
    theoretical: 0, // Will be populated in the next step
  }));
  
  // Map theoretical data to same voltage points or interpolate
  theoreticalVoltage.forEach((v, i) => {
    // Find the closest voltage point in the measured data
    const closestIndex = data.findIndex(point => point.voltage >= v);
    if (closestIndex >= 0 && closestIndex < data.length) {
      data[closestIndex].theoretical = theoreticalCurrent[i];
    }
  });
  
  return data;
};

const IVCurveChart: React.FC = () => {
  const { panelState, selectedIrradiance, setSelectedIrradiance } = usePvPanel();
  
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
  
  const handleExportData = () => {
    try {
      // Convert data to CSV format
      const headers = ['Voltage', 'Measured Current', 'Theoretical Current'];
      const csvContent = [
        headers.join(','),
        ...chartData.map(point => 
          `${point.voltage},${point.measured},${point.theoretical}`
        )
      ].join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `iv-curve-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-0 flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-lg">I-V Curve</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={selectedIrradiance.toString()}
            onValueChange={(value) => setSelectedIrradiance(Number(value) as typeof availableIrradianceLevels[number])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Irradiance" />
            </SelectTrigger>
            <SelectContent>
              {availableIrradianceLevels.map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  {level} W/m²
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-1" />
            <span className="text-xs">Export</span>
          </Button>
        </div>
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
                value: 'Current (A)', 
                angle: -90, 
                position: 'insideLeft', 
                offset: 10 
              }} 
            />
            <Tooltip 
              formatter={(value, name) => [
                `${Number(value).toFixed(2)} A`, 
                name === 'measured' ? 'Measured Current' : 'Theoretical Current'
              ]}
              labelFormatter={(label) => `Voltage: ${Number(label).toFixed(2)} V`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="theoretical" 
              name="STC (Theoretical)"
              stroke="#8884d8" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="measured" 
              name="Measured Current"
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

export default IVCurveChart;
