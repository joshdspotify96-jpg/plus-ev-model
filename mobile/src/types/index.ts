export interface Game {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
}

export interface Edge {
  player_name: string;
  team: string;
  prop_type: string;
  line: number;
  side: string;
  edge: number;
  model_prob: number;
  market_prob: number;
  odds: number;
  book: string;
  kelly: number;
  ev: number;
}

export interface Prop {
  player: string;
  line: number;
  odds: string;
  side: string;
  book: string;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  games?: T;
  edges?: T;
  props?: T;
  odds?: T;
}
