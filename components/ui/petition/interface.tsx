export interface Petition {
    id: string;
    title: string;
    description: string;
    location:string;
    latitude: number;
    longitude: number;
    signatures: number;
    goal: number;
    image: string;
    created_at: string;
  }