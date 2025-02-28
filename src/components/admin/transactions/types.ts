
export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'game_win' | 'game_loss';
  status: string;
  created_at: string;
  updated_at: string;
  metadata: {
    method?: string;
    phone_number?: string;
    transaction_id?: string;
    provider?: string;
    notes?: string;
  };
  profiles?: {
    username: string;
  };
};
