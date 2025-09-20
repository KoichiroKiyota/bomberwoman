
export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
  WIN,
}

export enum CellType {
  EMPTY,
  SOFT_BLOCK,
  HARD_BLOCK,
  BOMB,
  EXPLOSION,
  EXIT,
}

export type Position = {
  row: number;
  col: number;
};

export interface Enemy {
  id: number;
  position: Position;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface Bomb {
  position: Position;
  timer: number;
  range: number;
}
