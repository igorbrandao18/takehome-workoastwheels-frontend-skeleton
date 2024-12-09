export interface FormValues {
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  minPassengers: number;
  classification: string[];
  make: string[];
  price: number[];
  year?: number;
  doors?: number;
  page: number;
}

export const defaultValues: FormValues = {
  startDate: new Date(),
  endDate: new Date(),
  startTime: '',
  endTime: '',
  minPassengers: 1,
  classification: [],
  make: [],
  price: [10, 100],
  page: 1,
}; 