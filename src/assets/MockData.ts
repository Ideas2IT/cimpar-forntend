import { IItem } from "../components/appointmentForm/AppointmentForm";

export const countryCodes = [
  {
    name: "+1-US",
    value: "+1-US",
  },
  {
    name: "+10-ME",
    value: "+10-ME",
  },
  {
    name: "+61-AU",
    value: "+61-AU",
  },
  {
    name: "+55-BR",
    value: "+55-BR",
  },
];

export const genders = [
  { name: "Male", value: "male" },
  { name: "Female", value: "female" },
  { name: "Other", value: "other" },
];

export const zipCodes = [
  { name: "123212", value: "123212" },
  { name: "112233", value: "112233" },
  { name: "121212", value: "121212" },
  { name: "ZY-1232", value: "zy-1232" },
];

export const countries = [
  {
    name: "USA",
    value: "USA",
  },
  {
    name: "Alaska",
    value: "Alaska",
  },
  {
    name: "Arizona",
    value: "Arizona",
  },
  {
    name: "Delaware",
    value: "Delaware",
  },
  {
    name: "Colorado",
    value: "Colorado",
  },
];

export const states = [
  {
    name: "Alabama",
    value: "Alabama",
  },
  {
    name: "Alaska",
    value: "Alaska",
  },
  {
    name: "Arizona",
    value: "Arizona",
  },
  {
    name: "Delaware",
    value: "Delaware",
  },
  {
    name: "Colorado",
    value: "Colorado",
  },
];

export interface ITest {
  id: number;
  name: string;
}

export const tests: ITest[] = [
  { id: 1, name: "LFT" },
  { id: 4, name: "spanish flu or Influenza" },
  { id: 2, name: "Bubonic Plague" },
  { id: 3, name: "Coronavirus" },
  { id: 5, name: "hIV/AIDS" },
  { id: 6, name: "Cholera" },
];

export const medicalConditons: IItem[] = [
  { id: 1, name: "dfdfbc" },
  { id: 4, name: "panish flu or Influenza" },
  { id: 2, name: "Bubonic Plague" },
  { id: 3, name: "Coronavirus" },
  { id: 5, name: "hIV/AIDS" },
  { id: 6, name: "Cholera" },
];

export const raceList = [
  { name: "White", value: "white" },
  { name: "Black", value: "black" },
  { name: "Asian", value: "Asian" },
  { name: "African", value: "african" },
];

export const ethnicities = [
  "Italian",
  "Swedish",
  "Chinese",
  "Indian",
  "Arabic",
];

export const insuranceCompanies = [
  { id: 1, value: "Medicate" },
  { name: 2, value: "Cure All" },
  { name: 3, value: "Health care" },
  { name: 4, value: "Live long" },
];
