
export interface PredictRBRequest {
  age: number;
  off_line_rank: number;
  games_vs_top_ten: number;
  games_vs_bottom_ten: number;
  opponent_avg_madden_rating: number;
}

export interface PredictRBResponse {
  prediction: number;
  confidence?: number;
}

export interface TrainRBResponse {
  status: string;
  model_type: string;
  model_path: string;
  train_r2: number;
  test_r2: number;
  feature_importance: {
    age: number;
    off_line_rank: number;
    games_vs_top_ten: number;
    games_vs_bottom_ten: number;
    opponent_avg_madden_rating: number;
    tough_schedule_ratio: number;
    is_prime_age: number;
    is_rookie_contract: number;
  };
}