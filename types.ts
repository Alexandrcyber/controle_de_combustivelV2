
export interface TruckLog {
  id: string;
  truckModel: string;
  licensePlate: string;
  month: string;
  initialKm: number;
  finalKm: number;
  fuelPricePerLiter: number;
  totalFuelCost: number;
  idealKmLRoute: number;
  route: string;
  gasStation: string;
  date: string;
  driver: string;
  truck: string;
  start_km: number;
  end_km: number;
  fuel_consumed: number;
}

export interface Expense {
  id: string;
  month: string;
  supplier: string;
  description: string;
  cost: number;
  date: string;
  driver: string;
  truck: string;
  value: number;
}
