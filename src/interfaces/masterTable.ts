export interface ICreateLabTest {
  tableName: string;
  code: string;
  display: string;
  service_type: string;
  center_price: number;
  home_price: number;
  currency_symbol: string;
  is_active: boolean;
  is_telehealth_required: boolean;
  is_lab: boolean;
}

export interface IUpdatePricingPayload {
  tableName: string;
  resource_id: string;
  center_price: string;
  home_price: string;
}

export interface IMasterUrl {
  url: string;
  category: string;
  name: string;
  description: string;
  id: string;
}
