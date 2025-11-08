
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
}

export interface Expense {
  id: string;
  month: string;
  supplier: string;
  description: string;
  cost: number;
}
