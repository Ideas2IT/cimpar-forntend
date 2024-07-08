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
