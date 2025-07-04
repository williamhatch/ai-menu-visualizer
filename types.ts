export interface MenuItem {
  name: string;
  imageUrl: string;
}

export enum AppState {
  IDLE,
  IMAGE_SELECTED,
  ANALYZING,
  GENERATING_IMAGES,
  RESULTS,
  FINISHED,
  ERROR,
}
