import { ILoginPayload } from "../interfaces/User";
import http from "./common.services";

const login = (payload: ILoginPayload) => {
  console.log(payload);
  return http.get("");
};

export { login };
