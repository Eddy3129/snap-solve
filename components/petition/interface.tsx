//components\ui\petition\interface.tsx

export interface Petition {
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  image: string;
  target: number;
  votes: number;
  creator: string;
  createdAt: string;
  transaction_hash: string;
  petition_id: string;
}

export interface VoteAccount {
  signed: boolean;
}

