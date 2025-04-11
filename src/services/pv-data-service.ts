
import { MeasurementData, PanelState, FaultAlert, TheoreticalCurveData, IrradianceLevel, FaultType } from "@/types";

// Function to generate a random number within a range
const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate I-V curve data based on irradiance level
const generateIVCurve = (
  irradiance: number,
  temperature: number,
  faultType: FaultType = 'normal'
): { voltage: number[]; current: number[] } => {
  // Constants for a typical PV panel
  const voc = 40 * (1 - 0.0025 * (temperature - 25)); // Voc decreases with temperature
  const isc = 10 * (irradiance / 1000); // Isc proportional to irradiance
  
  // Generate voltage points
  const voltagePoints = 50;
  const voltage: number[] = Array.from({ length: voltagePoints }, (_, i) => (i / (voltagePoints - 1)) * voc);
  
  // Generate current points based on a simplified diode model
  let current: number[] = voltage.map(v => {
    if (v >= voc) return 0;
    
    // Simplified model: I = Isc * (1 - e^((V-Voc)/a))
    const a = 0.7; // Curve factor
    return isc * (1 - Math.exp((v - voc) / a));
  });
  
  // Apply fault effects
  switch (faultType) {
    case 'cell_crack':
      // Cell crack reduces Isc
      current = current.map(i => i * 0.85); // 15% reduction
      break;
    case 'hot_spot':
      // Hot spot causes irregular curve with voltage drop
      if (temperature > 40) {
        const hotSpotIndex = Math.floor(voltagePoints * 0.7);
        for (let i = hotSpotIndex; i < voltagePoints; i++) {
          current[i] *= (1 - 0.3 * ((i - hotSpotIndex) / (voltagePoints - hotSpotIndex)));
        }
      }
      break;
    case 'shading':
      // Shading causes steps in the I-V curve
      const shadingStart = Math.floor(voltagePoints * 0.3);
      const shadingEnd = Math.floor(voltagePoints * 0.6);
      for (let i = shadingStart; i < shadingEnd; i++) {
        current[i] *= 0.6; // 40% reduction in the shaded region
      }
      break;
    default:
      // No faults, normal curve
      break;
  }
  
  return { voltage, current };
};

// Calculate power from voltage and current
const calculatePower = (voltage: number[], current: number[]): number[] => {
  return voltage.map((v, i) => v * current[i]);
};

// Detect faults in the I-V curve
const detectFaults = (
  data: MeasurementData,
  theoreticalData: TheoreticalCurveData
): { type: FaultType; severity: 'normal' | 'warning' | 'critical'; message: string } => {
  // Extract theoretical values for the same irradiance level
  const closestTheoreticalLevel = [200, 400, 600, 800, 1000].reduce((prev, curr) => {
    return Math.abs(curr - data.irradiance) < Math.abs(prev - data.irradiance) ? curr : prev;
  }, 1000) as IrradianceLevel;
  
  // Get theoretical values
  const theoretical = getTheoreticalCurves(closestTheoreticalLevel);
  
  // Calculate maximum current (Isc) from measured data
  const measuredIsc = Math.max(...data.current);
  const theoreticalIsc = Math.max(...theoretical.current);
  
  // Calculate the Isc drop as a percentage
  const iscDropPercent = ((theoreticalIsc - measuredIsc) / theoreticalIsc) * 100;
  
  // Calculate maximum voltage (Voc) from measured data
  const measuredVoc = data.voltage[data.current.findIndex(i => i <= 0.05) || data.voltage.length - 1];
  const theoreticalVoc = theoretical.voltage[theoretical.current.findIndex(i => i <= 0.05) || theoretical.voltage.length - 1];
  
  // Calculate the Voc deviation as a percentage
  const vocDeviationPercent = Math.abs((theoreticalVoc - measuredVoc) / theoreticalVoc) * 100;
  
  // Check for shading (steps in the I-V curve)
  const derivativeChanges = data.current.slice(1).map((c, i) => 
    Math.abs((c - data.current[i]) / (data.voltage[i + 1] - data.voltage[i]))
  );
  const maxDerivativeChange = Math.max(...derivativeChanges);
  const hasSharpSteps = maxDerivativeChange > 0.5; // Threshold for detecting sharp steps
  
  // Determine fault type and severity
  if (iscDropPercent > 10 && iscDropPercent <= 20) {
    return {
      type: 'cell_crack',
      severity: 'warning',
      message: `Possible cell crack detected. Current (Isc) is ${iscDropPercent.toFixed(1)}% below expected value.`
    };
  } else if (iscDropPercent > 20) {
    return {
      type: 'cell_crack',
      severity: 'critical',
      message: `Severe cell crack detected. Current (Isc) is ${iscDropPercent.toFixed(1)}% below expected value.`
    };
  } else if (vocDeviationPercent > 5 && data.temperature > 40) {
    return {
      type: 'hot_spot',
      severity: vocDeviationPercent > 10 ? 'critical' : 'warning',
      message: `Hot spot detected. Voltage deviation ${vocDeviationPercent.toFixed(1)}% with high temperature (${data.temperature.toFixed(1)}°C).`
    };
  } else if (hasSharpSteps) {
    return {
      type: 'shading',
      severity: 'warning',
      message: 'Partial shading detected. Step-like pattern observed in I-V curve.'
    };
  }
  
  return {
    type: 'normal',
    severity: 'normal',
    message: 'Panel operating normally.'
  };
};

// Generate theoretical I-V and P-V curves for different irradiance levels
export const getTheoreticalCurves = (irradiance: IrradianceLevel): TheoreticalCurveData => {
  // Generate ideal I-V curve at 25°C (standard temperature)
  const { voltage, current } = generateIVCurve(irradiance, 25, 'normal');
  const power = calculatePower(voltage, current);
  
  return {
    irradiance,
    voltage,
    current,
    power
  };
};

// Initial panel data with default values
export const initialPanelState: PanelState = {
  id: "panel-001",
  name: "PV Array 1",
  location: "Roof - South Facing",
  status: 'normal',
  statusMessage: 'Operating normally',
  installedDate: new Date(2023, 0, 15), // January 15, 2023
  lastMaintenance: new Date(2024, 2, 10), // March 10, 2024
  currentData: {
    time: new Date(),
    irradiance: 800, // W/m²
    temperature: 30, // °C
    power: 3200, // W
    efficiency: 17.5, // %
    voltage: [],
    current: []
  }
};

// Generate a new data point for real-time simulation
export const generateNewDataPoint = (
  previousData: MeasurementData,
  faultProbability = 0.1
): { data: MeasurementData; fault: { type: FaultType; severity: 'normal' | 'warning' | 'critical'; message: string } } => {
  // Randomly adjust irradiance (with some temporal consistency)
  const irradianceDelta = randomInRange(-50, 50);
  const newIrradiance = Math.max(100, Math.min(1000, previousData.irradiance + irradianceDelta));
  
  // Randomly adjust temperature (with some temporal consistency)
  const temperatureDelta = randomInRange(-1, 1);
  const newTemperature = Math.max(10, Math.min(70, previousData.temperature + temperatureDelta));
  
  // Determine if a fault should be simulated
  let faultType: FaultType = 'normal';
  if (Math.random() < faultProbability) {
    const faultTypes: FaultType[] = ['cell_crack', 'hot_spot', 'shading'];
    faultType = faultTypes[Math.floor(Math.random() * faultTypes.length)];
  }
  
  // Generate I-V curve with possible fault
  const { voltage, current } = generateIVCurve(newIrradiance, newTemperature, faultType);
  
  // Calculate power from I-V curve
  const power = Math.max(...calculatePower(voltage, current));
  
  // Calculate efficiency (simplified model)
  const panelArea = 1.7; // m²
  const efficiency = (power / (newIrradiance * panelArea)) * 100;
  
  // Create new data point
  const newData: MeasurementData = {
    time: new Date(),
    irradiance: newIrradiance,
    temperature: newTemperature,
    power,
    efficiency,
    voltage,
    current
  };
  
  // Detect faults based on the new data
  const closestIrradiance = [200, 400, 600, 800, 1000].reduce((prev, curr) => {
    return Math.abs(curr - newIrradiance) < Math.abs(prev - newIrradiance) ? curr : prev;
  }, 1000) as IrradianceLevel;
  
  const fault = detectFaults(newData, getTheoreticalCurves(closestIrradiance));
  
  return { data: newData, fault };
};

// Generate a list of historical alerts
export const generateHistoricalAlerts = (panelId: string, count = 5): FaultAlert[] => {
  const alerts: FaultAlert[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.floor(randomInRange(1, 24 * 7)); // Up to a week ago
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    const faultTypes: FaultType[] = ['cell_crack', 'hot_spot', 'shading', 'normal'];
    const type = faultTypes[Math.floor(Math.random() * faultTypes.length)];
    
    let severity: 'normal' | 'warning' | 'critical';
    let message: string;
    
    switch (type) {
      case 'cell_crack':
        severity = Math.random() > 0.5 ? 'warning' : 'critical';
        message = severity === 'critical' 
          ? 'Severe cell crack detected. Immediate inspection recommended.'
          : 'Possible cell crack detected. Schedule maintenance.';
        break;
      case 'hot_spot':
        severity = Math.random() > 0.7 ? 'critical' : 'warning';
        message = severity === 'critical'
          ? 'Critical hot spot detected. Risk of permanent damage.'
          : 'Hot spot detected. Temperature above threshold.';
        break;
      case 'shading':
        severity = 'warning';
        message = 'Partial shading detected affecting performance.';
        break;
      default:
        severity = 'normal';
        message = 'Panel operating within normal parameters.';
    }
    
    if (type !== 'normal' || Math.random() > 0.7) { // Add some normal alerts too
      alerts.push({
        id: `alert-${panelId}-${i}`,
        panelId,
        timestamp,
        type,
        severity,
        message,
        acknowledged: Math.random() > 0.3 // 70% of alerts are acknowledged
      });
    }
  }
  
  // Sort by timestamp, most recent first
  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Export available irradiance levels for UI selection
export const availableIrradianceLevels: IrradianceLevel[] = [200, 400, 600, 800, 1000];
