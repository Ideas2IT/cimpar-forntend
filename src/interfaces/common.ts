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
  code?: string;
  display?: string;
  tableName: string;
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
}

export interface IAddMasterRecordPayload extends IAllTestspayload {
  is_active: boolean;
}
