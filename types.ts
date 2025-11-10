// types.ts
export interface TruckLog {
  id: string;
  truckModel: string;
  licensePlate: string;
  month: string;
  initialKm: number;
  finalKm: number;
  fuelPricePerLiter: number;
  litersFueled: number;
  idealKmLRoute: number;
  route: string;
  gasStation: string;
  createdAt?: string; // Adicionado
  updatedAt?: string; // Adicionado
}

export interface Expense {
  id: string;
  month: string;
  supplier: string;
  description: string;
  cost: number;
  createdAt?: string; // Adicionado
  updatedAt?: string; // Adicionado
}
