import { ToolkitStore } from '@reduxjs/toolkit';
import axios, { AxiosInstance } from 'axios';

let store: ToolkitStore;
export const injectStore = (_store: ToolkitStore) => {
  store = _store;
};
