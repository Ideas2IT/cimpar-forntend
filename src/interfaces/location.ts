import { IPagination } from "./immunization";

export interface ICreateLocationPayload {
  center_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  opening_time: string;
  closing_time: string;
  working_days: string[];
  holiday: string;
}

export interface ILocation extends ICreateLocationPayload {
  id: string;
}

export interface IGetLocationPayload {
  active: boolean;
  page: number;
  page_size: number;
}

export interface ILocationResponse {
  data: ILocation[];
  pagination: IPagination;
}

export interface IToggleLocationStatusPayload {
  status: string;
  resourceId: string;
}

export type TServiceLocationType = "home" | "service center";
