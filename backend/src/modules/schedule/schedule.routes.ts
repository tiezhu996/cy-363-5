import { Router } from "express";
import {
  getThemes,
  getSchedulesByDate,
  getScheduleBoard,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  createBooking,
  cancelBooking,
  getBookingsBySchedule,
  toggleScheduleLock,
  validateCreateSchedule,
  validateCreateBooking,
  validateDateParam,
  validateDateRange,
  validateIdParam,
} from "./schedule.controller";

export const scheduleRouter = Router();

scheduleRouter.get("/themes", getThemes);
scheduleRouter.get("/schedules", validateDateParam, getSchedulesByDate);
scheduleRouter.get("/board", validateDateRange, getScheduleBoard);
scheduleRouter.post("/schedules", validateCreateSchedule, createSchedule);
scheduleRouter.put("/schedules/:id", validateIdParam, validateCreateSchedule, updateSchedule);
scheduleRouter.delete("/schedules/:id", validateIdParam, deleteSchedule);
scheduleRouter.post("/bookings", validateCreateBooking, createBooking);
scheduleRouter.delete("/bookings/:id", validateIdParam, cancelBooking);
scheduleRouter.get("/schedules/:scheduleId/bookings", getBookingsBySchedule);
scheduleRouter.patch("/schedules/:id/lock", validateIdParam, toggleScheduleLock);
