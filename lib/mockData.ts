export type Severity = 'low' | 'medium' | 'critical';
export type IncidentStatus = 'pending' | 'assigned' | 'in-progress' | 'resolved';

export interface Incident {
  id: string;
  type: string;
  time: string;
  location: string;
  lat: number;
  lng: number;
  severity: Severity;
  victims: number;
  status: IncidentStatus;
  vehicle: string;
  assigned?: string;
  eta?: string;
}

export const mockIncidents: Incident[] = [
  { id: 'INC-001', type: 'High-Speed Collision', time: '2 min ago', location: 'NH-44, Sriperumbudur', lat: 12.97, lng: 79.99, severity: 'critical', victims: 3, status: 'pending', vehicle: 'Car vs Truck' },
  { id: 'INC-002', type: 'Vehicle Fire', time: '8 min ago', location: 'OMR, Chennai', lat: 12.82, lng: 80.21, severity: 'critical', victims: 1, status: 'assigned', vehicle: 'SUV', assigned: 'AMB-07', eta: '4 min' },
  { id: 'INC-003', type: 'Bike Breakdown', time: '12 min ago', location: 'ECR, Pondicherry', lat: 11.94, lng: 79.80, severity: 'medium', victims: 1, status: 'in-progress', vehicle: 'Motorcycle', assigned: 'PCL-03', eta: '2 min' },
  { id: 'INC-004', type: 'Pedestrian Accident', time: '18 min ago', location: 'GST Road, Tambaram', lat: 12.95, lng: 80.14, severity: 'critical', victims: 2, status: 'resolved', vehicle: 'Car' },
  { id: 'INC-005', type: 'Multi-Car Pileup', time: '22 min ago', location: 'Rajiv Gandhi Salai', lat: 12.87, lng: 80.23, severity: 'critical', victims: 5, status: 'assigned', vehicle: 'Multiple', assigned: 'AMB-02', eta: '6 min' },
  { id: 'INC-006', type: 'Engine Breakdown', time: '30 min ago', location: 'Vandalur, Chennai', lat: 12.89, lng: 80.07, severity: 'low', victims: 0, status: 'in-progress', vehicle: 'Truck' },
  { id: 'INC-007', type: 'Hit & Run', time: '35 min ago', location: 'Anna Salai, Chennai', lat: 13.06, lng: 80.27, severity: 'medium', victims: 1, status: 'pending', vehicle: 'Bike' },
  { id: 'INC-008', type: 'Medical Emergency', time: '41 min ago', location: 'Mount Road, Chennai', lat: 13.07, lng: 80.27, severity: 'critical', victims: 1, status: 'resolved', vehicle: 'Car' },
];

export const officerStats = {
  totalAccidents: 47,
  activeAlerts: 8,
  pendingRequests: 12,
  solvedCases: 31,
  ambulancesActive: 6,
  policeUnitsActive: 14,
  fireRescueActive: 3,
};

export const aiAlerts = [
  { id: 1, msg: 'Critical collision detected — NH-44 near Sriperumbudur', severity: 'critical', time: '2 min ago' },
  { id: 2, msg: 'Possible vehicle fire — OMR near Sholinganallur', severity: 'critical', time: '8 min ago' },
  { id: 3, msg: 'Traffic congestion increasing — GST Road southbound', severity: 'medium', time: '14 min ago' },
  { id: 4, msg: 'Medical emergency suspected — Anna Salai pedestrian crossing', severity: 'medium', time: '20 min ago' },
  { id: 5, msg: 'Heavy rainfall warning — flooding risk in low-lying zones', severity: 'low', time: '25 min ago' },
];

export const notifications = [
  { id: 1, msg: 'New accident detected — NH-44, Sriperumbudur', type: 'alert', time: 'Just now' },
  { id: 2, msg: 'AMB-07 dispatched to OMR vehicle fire', type: 'dispatch', time: '8 min ago' },
  { id: 3, msg: 'Emergency resolved — GST Road, Tambaram', type: 'resolved', time: '18 min ago' },
  { id: 4, msg: 'PCL-03 en route to ECR breakdown case', type: 'dispatch', time: '12 min ago' },
  { id: 5, msg: 'Fire rescue requested — Rajiv Gandhi Salai', type: 'alert', time: '22 min ago' },
];

// Government dashboard data
export const govStats = {
  totalAccidents: 2847,
  solvedCases: 2614,
  pendingCases: 233,
  monthlyCount: 214,
  yearlyTrend: '+8.3%',
  responseRate: '91.8%',
};

export const monthlyAccidents = [
  { month: 'Jan', accidents: 198, solved: 181, response: 8.2 },
  { month: 'Feb', accidents: 176, solved: 162, response: 7.9 },
  { month: 'Mar', accidents: 221, solved: 204, response: 8.5 },
  { month: 'Apr', accidents: 189, solved: 175, response: 8.1 },
  { month: 'May', accidents: 214, solved: 196, response: 7.6 },
  { month: 'Jun', accidents: 243, solved: 222, response: 8.8 },
  { month: 'Jul', accidents: 267, solved: 241, response: 9.2 },
  { month: 'Aug', accidents: 258, solved: 234, response: 9.0 },
  { month: 'Sep', accidents: 231, solved: 215, response: 8.4 },
  { month: 'Oct', accidents: 249, solved: 228, response: 8.7 },
  { month: 'Nov', accidents: 218, solved: 203, response: 8.3 },
  { month: 'Dec', accidents: 214, solved: 196, response: 7.8 },
];

export const yearlyTrend = [
  { year: '2021', accidents: 2241, resolved: 1987 },
  { year: '2022', accidents: 2389, resolved: 2143 },
  { year: '2023', accidents: 2556, resolved: 2334 },
  { year: '2024', accidents: 2701, resolved: 2489 },
  { year: '2025', accidents: 2847, resolved: 2614 },
];

export const accidentTypes = [
  { name: 'Collision', value: 38, color: '#ef4444' },
  { name: 'Breakdown', value: 24, color: '#3b82f6' },
  { name: 'Pedestrian', value: 18, color: '#f59e0b' },
  { name: 'Fire/Hazard', value: 10, color: '#f97316' },
  { name: 'Medical', value: 10, color: '#8b5cf6' },
];

export const districtData = [
  { district: 'Chennai North', accidents: 412, risk: 92 },
  { district: 'Chennai South', accidents: 387, risk: 88 },
  { district: 'Kancheepuram', accidents: 298, risk: 71 },
  { district: 'Tiruvallur', accidents: 264, risk: 65 },
  { district: 'Chengalpattu', accidents: 231, risk: 58 },
  { district: 'Vellore', accidents: 187, risk: 47 },
];

export const hotspots = [
  { id: 1, road: 'NH-44, Sriperumbudur Junction', riskScore: 94, accidents: 87, peak: '7PM–10PM', severity: 'critical' as Severity },
  { id: 2, road: 'OMR, Sholinganallur Flyover', riskScore: 89, accidents: 73, peak: '8AM–10AM', severity: 'critical' as Severity },
  { id: 3, road: 'GST Road, Tambaram Signal', riskScore: 82, accidents: 68, peak: '6PM–9PM', severity: 'critical' as Severity },
  { id: 4, road: 'ECR, Mahabalipuram Stretch', riskScore: 74, accidents: 54, peak: '5PM–8PM', severity: 'medium' as Severity },
  { id: 5, road: 'Anna Salai, Gemini Flyover', riskScore: 68, accidents: 49, peak: '9AM–11AM', severity: 'medium' as Severity },
  { id: 6, road: 'Rajiv Gandhi Salai, SIPCOT', riskScore: 61, accidents: 41, peak: '7PM–9PM', severity: 'medium' as Severity },
  { id: 7, road: 'Poonamallee High Road', riskScore: 52, accidents: 33, peak: '8AM–9AM', severity: 'low' as Severity },
  { id: 8, road: 'Mount Road, Thousand Lights', riskScore: 44, accidents: 27, peak: '6PM–8PM', severity: 'low' as Severity },
];
