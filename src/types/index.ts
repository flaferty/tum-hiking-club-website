export type Difficulty = "easy" | "moderate" | "hard" | "expert";
export type HikeStatus = "upcoming" | "completed";
export type WaypointType = "start" | "end" | "overnight_stop";
export type UserRole = "admin" | "organizer" | "member";

export interface Hike {
  id: string;
  name: string;
  date: string;
  end_date: string | null;
  location_name: string;
  location_lat: number;
  location_lng: number;
  difficulty: Difficulty;
  distance: number;
  elevation: number;
  duration: string;
  description: string | null;
  image_url: string | null;
  max_participants: number;
  organizer_name: string;
  organizer_id: string | null;
  status: HikeStatus;
  created_at: string;
  updated_at: string;
  enrollment_count?: number;
  current_participants?: number;
  waypoints?: Waypoint[];
  images?: HikeImage[];
}

export interface HikeEnrollment {
  id: string;
  hike_id: string;
  user_id: string;
  status: string;
  enrolled_at: string;
}

export interface HikeImage {
  id: string;
  hike_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface Waypoint {
  id: string;
  hike_id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: WaypointType;
  day_number: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface DAVHut {
  id: string;
  name: string;
  elevation: number;
  latitude: number;
  longitude: number;
  region: string;
  link: string;
}

export interface Organizer {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface UserStats {
  hikesCompleted: number;
  totalElevation: number;
  totalDistance: number;
  badgesEarned: number;
}
