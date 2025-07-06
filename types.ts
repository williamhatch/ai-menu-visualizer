
export enum AppState {
  START,
  LOADING,
  VISUALIZING,
  ERROR,
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
}
