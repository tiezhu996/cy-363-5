import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Typography,
  DatePicker,
  Button,
  Space,
  Progress,
  Empty,
  Skeleton,
  Tooltip,
  Badge,
  message,
} from "antd";
import {
  ReloadOutlined,
  LockOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { fetchScheduleBoard } from "../api/client";
import type { Schedule, ScheduleBoard } from "../types";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ScheduleBoardProps {
  onBook?: (schedule: Schedule) => void;
}

export function ScheduleBoard({ onBook }: ScheduleBoardProps) {
  const [board, setBoard] = useState<ScheduleBoard>({});
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs(),
    dayjs().add(6, "day"),
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBoard();
  }, [dateRange]);

  const loadBoard = async () => {
    try {
      setLoading(true);
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");
      const data = await fetchScheduleBoard(startDate, endDate);
      setBoard(data);
    } catch (error) {
      message.error("加载看板失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = dayjs(dateStr);
    const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return {
      full: date.format("YYYY-MM-DD"),
      short: date.format("MM/DD"),
      weekday: weekdays[date.day()],
      isToday: date.isSame(dayjs(), "day"),
      isPast: date.isBefore(dayjs(), "day"),
    };
  };

  const getDifficultyStars = (difficulty: number) => {
    return "★".repeat(difficulty) + "☆".repeat(5 - difficulty);
  };

  const renderScheduleCard = (schedule: Schedule) => {
    const remaining = schedule.remaining_spots ?? 0;
    const booked = schedule.booked_count ?? 0;
    const total = schedule.max_players;
    const occupancyRate = Math.round((booked / total) * 100);
    const dateInfo = formatDate(schedule.schedule_date);

    const getStatusColor = () => {
      if (schedule.is_locked) return "red";
      if (remaining === 0) return "orange";
      if (occupancyRate >= 80) return "gold";
      return "green";
    };

    const getStatusText = () => {
      if (schedule.is_locked) return "已锁定";
      if (remaining === 0) return "满员";
      if (remaining <= 2) return "即将满员";
      return "开放中";
    };

    return (
      <Col xs={24} sm={12} md={8} lg={6} xl={4} key={schedule.id}>
        <Card
          size="small"
          className={`schedule-card ${schedule.is_locked ? "locked" : ""}`}
          style={{
            marginBottom: 16,
            opacity: schedule.is_locked ? 0.8 : 1,
          }}
          actions={[
            onBook && !schedule.is_locked && remaining > 0 ? (
              <Button
                type="primary"
                size="small"
                onClick={() => onBook(schedule)}
              >
                立即报名
              </Button>
            ) : (
              <span />
            ),
          ]}
        >
          <div style={{ position: "relative" }}>
            {schedule.is_locked && (
              <Badge.Ribbon
                text="已锁定"
                color="red"
                style={{ position: "absolute", top: -5, right: -5 }}
              />
            )}
            {remaining === 0 && !schedule.is_locked && (
              <Badge.Ribbon
                text="满员"
                color="orange"
                style={{ position: "absolute", top: -5, right: -5 }}
              />
            )}

            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              <div>
                <Tag color="blue" style={{ marginBottom: 4 }}>
                  {schedule.theme?.name}
                </Tag>
                <Tag>{schedule.theme?.type}</Tag>
              </div>

              <Text type="secondary" style={{ fontSize: 12 }}>
                {getDifficultyStars(schedule.theme?.difficulty || 1)}
              </Text>

              <Space size="small">
                <CalendarOutlined style={{ color: "#888" }} />
                <Text>
                  {dateInfo.short} {dateInfo.weekday}
                  {dateInfo.isToday && <Tag color="green" style={{ marginLeft: 4 }}>今天</Tag>}
                </Text>
              </Space>

              <Space size="small">
                <ClockCircleOutlined style={{ color: "#888" }} />
                <Text>
                  {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
                </Text>
              </Space>

              <Space size="small">
                <TeamOutlined style={{ color: "#888" }} />
                <Text>{schedule.theme?.duration} 分钟</Text>
              </Space>

              <div style={{ marginTop: 8 }}>
                <Space style={{ width: "100%", marginBottom: 4, justifyContent: "space-between" }}>
                  <Space size="small">
                    <UserOutlined style={{ color: "#888" }} />
                    <Text>
                      已报 <strong>{booked}</strong> / {total} 人
                    </Text>
                  </Space>
                  <Text
                    strong
                    style={{
                      color: getStatusColor() === "red" ? "#ff4d4f" :
                             getStatusColor() === "orange" ? "#fa8c16" :
                             getStatusColor() === "gold" ? "#faad14" : "#52c41a",
                    }}
                  >
                    剩 {remaining} 位
                  </Text>
                </Space>

                <Tooltip title={`上座率 ${occupancyRate}%`}>
                  <Progress
                    percent={occupancyRate}
                    size="small"
                    showInfo={false}
                    strokeColor={
                      getStatusColor() === "red" ? "#ff4d4f" :
                      getStatusColor() === "orange" ? "#fa8c16" :
                      getStatusColor() === "gold" ? "#faad14" : "#52c41a"
                    }
                  />
                </Tooltip>
              </div>

              <Tag
                color={getStatusColor()}
                style={{ textAlign: "center", width: "100%", margin: 0 }}
              >
                {getStatusText()}
              </Tag>
            </Space>
          </div>
        </Card>
      </Col>
    );
  };

  const sortedDates = Object.keys(board).sort();

  return (
    <div className="schedule-board">
      <div className="board-header" style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          场次看板
        </Title>
        <Space wrap>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            allowClear={false}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={loadBoard}
          >
            刷新
          </Button>
          <Space size="small">
            <Tag color="green">开放中</Tag>
            <Tag color="gold">即将满员</Tag>
            <Tag color="orange">满员</Tag>
            <Tag color="red">已锁定</Tag>
          </Space>
        </Space>
      </div>

      {loading ? (
        <Skeleton active />
      ) : sortedDates.length === 0 ? (
        <Empty description="暂无排班" />
      ) : (
        <div>
          {sortedDates.map((date) => {
            const dateInfo = formatDate(date);
            const schedules = board[date];
            const totalSpots = schedules.reduce((sum, s) => sum + s.max_players, 0);
            const totalBooked = schedules.reduce((sum, s) => sum + (s.booked_count || 0), 0);

            return (
              <div key={date} style={{ marginBottom: 32 }}>
                <Card
                  size="small"
                  title={
                    <Space>
                      <Text strong style={{ fontSize: 16 }}>
                        {dateInfo.full} {dateInfo.weekday}
                        {dateInfo.isToday && (
                          <Tag color="green" style={{ marginLeft: 8 }}>
                            今天
                          </Tag>
                        )}
                      </Text>
                      <Text type="secondary">
                        共 {schedules.length} 场 · 已报 {totalBooked}/{totalSpots} 人
                      </Text>
                    </Space>
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Row gutter={[16, 16]}>
                    {schedules.map(renderScheduleCard)}
                  </Row>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
