export interface ErrorResponse {
  message: string;
  response: number | string;
}

export interface IOption {
  display: string;
  system: string;
  code: string;
}

export interface ICommonDropdown {
  code: string;
  id: string;
  display: string;
}
export interface IOptionValue {
  code: string;
  id: string;
  display: string;
}

export interface IEntity {
  code: string;
  description: string;
}

export interface IAllTestspayload {
  page_size: number;
  page?: number;
  code?: string;
  display?: string;
  tableName: string;
  service_type?: string;
  all_records?: boolean;
}

export interface IToggleRecordStatusPayload {
  tableName: string;
  resourceId: string;
  is_active: boolean;
}

export interface IUpdateMasterRecordPayload {
  tableName: string;
  resourceId: string;
  display: string;
  code: string;
  is_active?: boolean;
  is_lab: boolean;
  is_telehealth_required: boolean;
  center_price: string;
  home_price: string;
  service_type: string;
}

export interface IAddMasterRecordPayload {
  is_active: boolean;
  code?: string;
  display?: string;
  tableName: string;
}

export interface ILabService {
  serviceName: string;
  code: string;
  centerPricing: string;
  homePricing: string;
  currency_symbol: string;
}

export interface ILabTestService {
  center_price: string;
  code: string;
  display: string;
  home_price: string;
  id: string;
  is_active: boolean;
  is_telehealth_required: boolean;
  service_type: string;
  currency_symbol: string;
}
