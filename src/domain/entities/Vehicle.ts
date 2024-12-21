import { VehicleClassification } from '../value-objects/VehicleClassification';

export type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'MAINTENANCE' | 'RETIRED';

interface VehicleProps {
  id?: string;
  model: string;
  plate: string;
  year: number;
  status: VehicleStatus;
  classification: VehicleClassification;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Vehicle {
  private _id: string;
  private _model: string;
  private _plate: string;
  private _year: number;
  private _status: VehicleStatus;
  private _classification: VehicleClassification;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: VehicleProps) {
    this._id = props.id || crypto.randomUUID();
    this._model = props.model;
    this._plate = props.plate;
    this._year = props.year;
    this._status = props.status;
    this._classification = props.classification;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id(): string {
    return this._id;
  }

  get model(): string {
    return this._model;
  }

  get plate(): string {
    return this._plate;
  }

  get year(): number {
    return this._year;
  }

  get status(): VehicleStatus {
    return this._status;
  }

  get classification(): VehicleClassification {
    return this._classification;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  changeStatus(newStatus: VehicleStatus): void {
    this._status = newStatus;
    this._updatedAt = new Date();
  }

  changeClassification(newClassification: VehicleClassification): void {
    this._classification = newClassification;
    this._updatedAt = new Date();
  }
} 