//components\ui\petition\interface.tsx

export interface Petition {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  signatures: number;
  goal: number;
  image: string;
  createdAt: string;
  isActive: boolean;
  expiry: number;
}
