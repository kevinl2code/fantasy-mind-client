import { PredictRBRequest, PredictRBResponse, TrainRBResponse } from './types/network';


export const predictRB = async (data: PredictRBRequest): Promise<PredictRBResponse> => {
  const response = await fetch('/api/train/predict/rb', {  // ← Now uses rewrite
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const trainRB = async (): Promise<TrainRBResponse> => {
  const response = await fetch('/api/train/rb', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error(`Training failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};