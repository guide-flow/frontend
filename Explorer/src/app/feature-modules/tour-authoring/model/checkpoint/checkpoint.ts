export interface Checkpoint {
  id?: number;
  title: string;
  description: string;
  longitude: number;
  latitude: number;
  imageUrl?: string;
  imageBase64?: string;
  tourId: number;
}
