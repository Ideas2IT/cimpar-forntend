declare module "redux-mock-store" {
  import { Store, Action, AnyAction, Middleware } from "redux";

  interface MockStoreCreator {
    <S>(state?: S): MockStoreEnhanced<S, AnyAction>;
    <S>(state?: S, middlewares?: Middleware[]): MockStoreEnhanced<S, AnyAction>;
  }

  export type MockStoreEnhanced<S = {}, A extends Action = AnyAction> = Store<
    S,
    A
  > & {
    getActions(): A[];
    clearActions(): void;
  };

  const configureMockStore: (middlewares?: Middleware[]) => MockStoreCreator;

  export default configureMockStore;
}
