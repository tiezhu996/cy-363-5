import { API_BASE_URL } from "../constants/app";
import type {
  OverviewResponse,
  Theme,
  Schedule,
  ScheduleBoard,
  Booking,
  CreateScheduleRequest,
  CreateBookingRequest,
} from "../types";

export async function fetchOverview(): Promise<OverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

export async function fetchThemes(): Promise<Theme[]> {
  const response = await fetch(`${API_BASE_URL}/themes`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Themes request failed: ${response.status}`);
  }

  return response.json() as Promise<Theme[]>;
}

export async function fetchSchedulesByDate(date: string): Promise<Schedule[]> {
  const response = await fetch(`${API_BASE_URL}/schedules?date=${date}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Schedules request failed: ${response.status}`);
  }

  return response.json() as Promise<Schedule[]>;
}

export async function fetchScheduleBoard(startDate: string, endDate: string): Promise<ScheduleBoard> {
  const response = await fetch(
    `${API_BASE_URL}/board?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(`Schedule board request failed: ${response.status}`);
  }

  return response.json() as Promise<ScheduleBoard>;
}

export async function createSchedule(data: CreateScheduleRequest): Promise<Schedule> {
  const response = await fetch(`${API_BASE_URL}/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Create schedule failed: ${response.status}`);
  }

  return response.json() as Promise<Schedule>;
}

export async function updateSchedule(id: number, data: CreateScheduleRequest): Promise<Schedule> {
  const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Update schedule failed: ${response.status}`);
  }

  return response.json() as Promise<Schedule>;
}

export async function deleteSchedule(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Delete schedule failed: ${response.status}`);
  }
}

export async function createBooking(data: CreateBookingRequest): Promise<Booking> {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Create booking failed: ${response.status}`);
  }

  return response.json() as Promise<Booking>;
}

export async function cancelBooking(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Cancel booking failed: ${response.status}`);
  }
}

export async function fetchBookingsBySchedule(scheduleId: number): Promise<Booking[]> {
  const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}/bookings`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Bookings request failed: ${response.status}`);
  }

  return response.json() as Promise<Booking[]>;
}

export async function toggleScheduleLock(id: number, lock: boolean): Promise<Schedule> {
  const response = await fetch(`${API_BASE_URL}/schedules/${id}/lock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ lock }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `Toggle lock failed: ${response.status}`);
  }

  return response.json() as Promise<Schedule>;
}

