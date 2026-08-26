export type WalkRecord = {
  id: string;
  user_id: string;
  photo_url: string;
  caption: string;
  tags: string[];
  mood: string;
  lat: number;
  lng: number;
  location_name: string | null;
  created_at: string;
};
