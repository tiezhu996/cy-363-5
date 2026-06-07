import type { Request, Response } from "express";
import { body, validationResult, param, query } from "express-validator";
import { ScheduleService } from "./schedule.service";

const service = new ScheduleService();

export const validateCreateSchedule = [
  body("theme_id").isInt().withMessage("主题ID必须是整数"),
  body("schedule_date").isISO8601().withMessage("日期格式不正确"),
  body("start_time").matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage("开始时间格式不正确"),
  body("end_time").matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage("结束时间格式不正确"),
  body("max_players").isInt({ min: 1, max: 20 }).withMessage("人数上限必须在1-20之间"),
];

export const validateCreateBooking = [
  body("schedule_id").isInt().withMessage("场次ID必须是整数"),
  body("player_name").isLength({ min: 1, max: 80 }).withMessage("玩家姓名不能为空"),
  body("player_phone").optional().isLength({ max: 20 }).withMessage("手机号格式不正确"),
  body("player_count").isInt({ min: 1, max: 20 }).withMessage("报名人数必须在1-20之间"),
];

export const validateDateParam = [
  query("date").optional().isISO8601().withMessage("日期格式不正确"),
];

export const validateDateRange = [
  query("start_date").isISO8601().withMessage("开始日期格式不正确"),
  query("end_date").isISO8601().withMessage("结束日期格式不正确"),
];

export const validateIdParam = [
  param("id").isInt().withMessage("ID必须是整数"),
];

function handleValidationErrors(request: Request, response: Response): boolean {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
}

export async function getThemes(_request: Request, response: Response) {
  try {
    const themes = await service.getThemes();
    response.json(themes);
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
}

export async function getSchedulesByDate(request: Request, response: Response) {
  if (handleValidationErrors(request, response)) return;

  try {
    const date = request.query.date as string || new Date().toISOString().split("T")[0];
    const schedules = await service.getSchedulesByDate(date);
    response.json(schedules);
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
}

export async function getScheduleBoard(request: Request, response: Response) {
  if (handleValidationErrors(request, response)) return;

  try {
    const startDate = request.query.start_date as string;
    const endDate = request.query.end_date as string;
    const board = await service.getScheduleBoard(startDate, endDate);
    response.json(board);
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
}

export async function createSchedule(request: Request, response: Response) {
  if (handleValidationErrors(request, response)) return;

  try {
    const schedule = await service.createSchedule(request.body);
    response.status(201).json(schedule);
  } catch (error) {
    response.status(400).json({ error: (error as Error).message });
  }
}

export async function updateSchedule(request: Request, response: Response) {
  if (handleValidationErrors(request, response)) return;

  try {
    const id = parseInt(String(request.params.id));
    const schedule = await service.updateSchedule(id, request.body);
    response.json(schedule);
  } catch (error) {
    response.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteSchedule(request: Request, response: Response) {
  if (handleValidationErrors(request, response)) return;

  try {
    const id = parseInt(String(request.params.id));
    await service.deleteSchedule(id);
    response.json({ message: "删除成功" });
  } catch (error) {
    response.status(400).json({ error: (error as Error).message });
  }
}

export async function createBooking(request: Request, response: Response) {
  if (handleValidationErrors(request, response)) return;

  try {
    const booking = await service.createBooking(request.body);
    response.status(201).json(booking);
  } catch (error) {
    response.status(400).json({ error: (error as Error).message });
  }
}

export async function cancelBooking(request: Request, response: Response) {
  if (handleValidationErrors(request, response)) return;

  try {
    const id = parseInt(String(request.params.id));
    await service.cancelBooking(id);
    response.json({ message: "取消成功" });
  } catch (error) {
    response.status(400).json({ error: (error as Error).message });
  }
}

export async function getBookingsBySchedule(request: Request, response: Response) {
  if (handleValidationErrors(request, response)) return;

  try {
    const scheduleId = parseInt(String(request.params.scheduleId));
    const bookings = await service.getBookingsBySchedule(scheduleId);
    response.json(bookings);
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
}

export async function toggleScheduleLock(request: Request, response: Response) {
  if (handleValidationErrors(request, response)) return;

  try {
    const id = parseInt(String(request.params.id));
    const lock = request.body.lock === true;
    const schedule = await service.toggleScheduleLock(id, lock);
    response.json(schedule);
  } catch (error) {
    response.status(400).json({ error: (error as Error).message });
  }
}
