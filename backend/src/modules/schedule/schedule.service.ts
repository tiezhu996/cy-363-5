import { Op } from "sequelize";
import { Theme } from "../../models/Theme";
import { Schedule } from "../../models/Schedule";
import { Booking } from "../../models/Booking";
import { sequelize } from "../../config/database";

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

export interface ScheduleWithDetails {
  id: number;
  theme_id: number;
  schedule_date: string;
  start_time: string;
  end_time: string;
  max_players: number;
  is_locked: boolean;
  created_at: Date;
  updated_at: Date;
  theme?: Theme;
  booked_count?: number;
  remaining_spots?: number;
  bookings?: Booking[];
}

export class ScheduleService {
  async getThemes() {
    return Theme.findAll({
      where: { is_active: true },
      order: [["created_at", "DESC"]],
    });
  }

  async getSchedulesByDate(date: string): Promise<ScheduleWithDetails[]> {
    const schedules = await Schedule.findAll({
      where: { schedule_date: date },
      include: [
        {
          model: Theme,
          as: "theme",
          attributes: ["id", "name", "type", "difficulty", "duration"],
        },
        {
          model: Booking,
          as: "bookings",
          attributes: ["id", "player_name", "player_count", "status", "created_at"],
        },
      ],
      order: [["start_time", "ASC"]],
    });

    return schedules.map((schedule: Schedule) => {
      const scheduleData = schedule.toJSON() as ScheduleWithDetails;
      const bookedCount = scheduleData.bookings?.reduce(
        (sum: number, b: Booking) => sum + b.player_count,
        0
      ) || 0;
      scheduleData.booked_count = bookedCount;
      scheduleData.remaining_spots = scheduleData.max_players - bookedCount;
      return scheduleData;
    });
  }

  async getScheduleBoard(startDate: string, endDate: string) {
    const schedules = await Schedule.findAll({
      where: {
        schedule_date: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Theme,
          as: "theme",
          attributes: ["id", "name", "type", "difficulty", "duration"],
        },
        {
          model: Booking,
          as: "bookings",
          attributes: ["id", "player_count", "status"],
        },
      ],
      order: [
        ["schedule_date", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    const result = schedules.map((schedule: Schedule) => {
      const scheduleData = schedule.toJSON() as ScheduleWithDetails;
      const bookedCount = scheduleData.bookings?.reduce(
        (sum: number, b: Booking) => sum + b.player_count,
        0
      ) || 0;
      scheduleData.booked_count = bookedCount;
      scheduleData.remaining_spots = Math.max(0, scheduleData.max_players - bookedCount);
      delete scheduleData.bookings;
      return scheduleData;
    });

    const groupedByDate: Record<string, ScheduleWithDetails[]> = {};
    result.forEach((schedule: ScheduleWithDetails) => {
      const date = schedule.schedule_date;
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(schedule);
    });

    return groupedByDate;
  }

  async createSchedule(data: CreateScheduleRequest): Promise<Schedule> {
    const existing = await Schedule.findOne({
      where: {
        theme_id: data.theme_id,
        schedule_date: data.schedule_date,
        start_time: data.start_time,
      },
    });

    if (existing) {
      throw new Error("该主题在同一时间已有排班");
    }

    const theme = await Theme.findByPk(data.theme_id);
    if (!theme) {
      throw new Error("主题不存在");
    }

    return Schedule.create(data as any);
  }

  async updateSchedule(id: number, data: Partial<CreateScheduleRequest>): Promise<Schedule> {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      throw new Error("排班不存在");
    }

    if (data.theme_id || data.schedule_date || data.start_time) {
      const existing = await Schedule.findOne({
        where: {
          id: { [Op.ne]: id },
          theme_id: data.theme_id || schedule.theme_id,
          schedule_date: data.schedule_date || schedule.schedule_date,
          start_time: data.start_time || schedule.start_time,
        },
      });

      if (existing) {
        throw new Error("该主题在同一时间已有排班");
      }
    }

    await schedule.update(data);
    return schedule;
  }

  async deleteSchedule(id: number): Promise<void> {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      throw new Error("排班不存在");
    }

    const bookingCount = await Booking.count({ where: { schedule_id: id } });
    if (bookingCount > 0) {
      throw new Error("该场次已有玩家报名，无法删除");
    }

    await schedule.destroy();
  }

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    const transaction = await sequelize.transaction();

    try {
      const schedule = await Schedule.findByPk(data.schedule_id, {
        include: [
          {
            model: Booking,
            as: "bookings",
            attributes: ["player_count"],
            where: { status: "confirmed" },
            required: false,
          },
        ],
        transaction,
        lock: true,
      });

      if (!schedule) {
        await transaction.rollback();
        throw new Error("场次不存在");
      }

      if (schedule.is_locked) {
        await transaction.rollback();
        throw new Error("该场次已锁定，无法报名");
      }

      const bookedCount = (schedule as any).bookings?.reduce(
        (sum: number, b: Booking) => sum + b.player_count,
        0
      ) || 0;

      const remainingSpots = schedule.max_players - bookedCount;
      if (data.player_count > remainingSpots) {
        await transaction.rollback();
        throw new Error(`剩余空位不足，仅剩 ${remainingSpots} 个名额`);
      }

      const booking = await Booking.create(data as any, { transaction });

      const newBookedCount = bookedCount + data.player_count;
      if (newBookedCount >= schedule.max_players) {
        await schedule.update({ is_locked: true }, { transaction });
      }

      await transaction.commit();
      return booking;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async cancelBooking(bookingId: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const booking = await Booking.findByPk(bookingId, { transaction });
      if (!booking) {
        await transaction.rollback();
        throw new Error("报名记录不存在");
      }

      await booking.update({ status: "cancelled" }, { transaction });

      const schedule = await Schedule.findByPk(booking.schedule_id, {
        include: [
          {
            model: Booking,
            as: "bookings",
            attributes: ["player_count"],
            where: { status: "confirmed" },
            required: false,
          },
        ],
        transaction,
      });

      if (schedule) {
        const bookedCount = (schedule as any).bookings?.reduce(
          (sum: number, b: Booking) => sum + b.player_count,
          0
        ) || 0;

        if (bookedCount < schedule.max_players && schedule.is_locked) {
          await schedule.update({ is_locked: false }, { transaction });
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getBookingsBySchedule(scheduleId: number) {
    return Booking.findAll({
      where: { schedule_id: scheduleId, status: "confirmed" },
      order: [["created_at", "DESC"]],
    });
  }

  async toggleScheduleLock(scheduleId: number, lock: boolean): Promise<Schedule> {
    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      throw new Error("排班不存在");
    }

    await schedule.update({ is_locked: lock });
    return schedule;
  }
}
