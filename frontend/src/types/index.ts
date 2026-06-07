export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  status: string;
  metric: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend: string;
  tone: string;
}

export interface OperationRecord {
  key: string;
  name: string;
  owner: string;
  status: string;
  metric: string;
  priority: string;
}

export interface OverviewResponse {
  appName: string;
  appCode: string;
  description: string;
  features: FeatureItem[];
  kpis: KpiItem[];
  records: OperationRecord[];
}

export interface Theme {
  id: number;
  name: string;
  type: string;
  difficulty: number;
  suggested_players: number;
  duration: number;
  description: string;
  poster_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  schedule_id: number;
  player_name: string;
  player_phone: string | null;
  player_count: number;
  status: string;
  created_at: string;
}

export interface Schedule {
  id: number;
  theme_id: number;
  schedule_date: string;
  start_time: string;
  end_time: string;
  max_players: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  theme?: Theme;
  booked_count?: number;
  remaining_spots?: number;
  bookings?: Booking[];
}

export interface ScheduleBoard {
  [date: string]: Schedule[];
}

export interface CreateScheduleRequest {
  theme_id: number;
  schedule_date: string;
  start_time: string;
  end_time: string;
  max_players: number;
}

export interface CreateBookingRequest {
  schedule_id: number;
  player_name: string;
  player_phone?: string;
  player_count: number;
}
