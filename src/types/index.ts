
export type IrradianceLevel = 200 | 400 | 600 | 800 | 1000;

export interface MeasurementData {
  time: Date;
  irradiance: number; // W/m²
  temperature: number; // °C
  power: number; // W
  efficiency: number; // %
  voltage: number[]; // Array of voltage values for I-V curve
  current: number[]; // Array of current values for I-V curve
}

export interface PanelState {
  id: string;
  name: string;
  location: string;
  status: 'normal' | 'warning' | 'critical';
  statusMessage: string;
  installedDate: Date;
  lastMaintenance: Date | null;
  currentData: MeasurementData;
}

export type FaultType = 'cell_crack' | 'hot_spot' | 'shading' | 'normal';

export interface FaultAlert {
  id: string;
  panelId: string;
  timestamp: Date;
  type: FaultType;
  severity: 'normal' | 'warning' | 'critical';
  message: string;
  acknowledged: boolean;
}

export interface TheoreticalCurveData {
  irradiance: IrradianceLevel;
  voltage: number[];
  current: number[];
  power: number[];
}
