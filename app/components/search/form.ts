export interface FormValues {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  minPassengers: number;
  classification: string[];
  make: string[];
  price: number[];
  year?: number;
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