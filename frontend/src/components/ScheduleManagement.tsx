import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  InputNumber,
  Select,
  Tag,
  Space,
  message,
  Popconfirm,
  Typography,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  fetchThemes,
  fetchSchedulesByDate,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  toggleScheduleLock,
} from "../api/client";
import type { Schedule, Theme } from "../types";

const { Title } = Typography;
const { Option } = Select;

interface ScheduleFormData {
  theme_id: number;
  schedule_date: Dayjs;
  start_time: Dayjs;
  end_time: Dayjs;
  max_players: number;
}

export function ScheduleManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form] = Form.useForm<ScheduleFormData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadThemes();
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [selectedDate]);

  const loadThemes = async () => {
    try {
      const data = await fetchThemes();
      setThemes(data);
    } catch (error) {
      message.error("加载主题列表失败");
    }
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const data = await fetchSchedulesByDate(dateStr);
      setSchedules(data);
    } catch (error) {
      message.error("加载排班列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    form.resetFields();
    form.setFieldsValue({
      schedule_date: selectedDate,
      max_players: 4,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    form.setFieldsValue({
      theme_id: schedule.theme_id,
      schedule_date: dayjs(schedule.schedule_date),
      start_time: dayjs(schedule.start_time, "HH:mm:ss"),
      end_time: dayjs(schedule.end_time, "HH:mm:ss"),
      max_players: schedule.max_players,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSchedule(id);
      message.success("删除成功");
      loadSchedules();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const handleToggleLock = async (schedule: Schedule, lock: boolean) => {
    try {
      await toggleScheduleLock(schedule.id, lock);
      message.success(lock ? "场次已锁定" : "场次已解锁");
      loadSchedules();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const handleSubmit = async (values: ScheduleFormData) => {
    try {
      const scheduleData = {
        theme_id: values.theme_id,
        schedule_date: values.schedule_date.format("YYYY-MM-DD"),
        start_time: values.start_time.format("HH:mm:ss"),
        end_time: values.end_time.format("HH:mm:ss"),
        max_players: values.max_players,
      };

      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, scheduleData);
        message.success("更新成功");
      } else {
        await createSchedule(scheduleData);
        message.success("创建成功");
      }

      setIsModalOpen(false);
      loadSchedules();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const columns: ColumnsType<Schedule> = [
    {
      title: "主题",
      dataIndex: ["theme", "name"],
      key: "theme",
      render: (_, record) => (
        <Space>
          <Tag color="blue">{record.theme?.name}</Tag>
          <Tag>{record.theme?.type}</Tag>
        </Space>
      ),
    },
    {
      title: "时间",
      key: "time",
      render: (_, record) => (
        <Space>
          <ClockCircleOutlined />
          <span>
          {record.start_time.substring(0, 5)} - {record.end_time.substring(0, 5)}
        </span>
        </Space>
      ),
    },
    {
      title: "人数上限",
      dataIndex: "max_players",
      key: "max_players",
      render: (value) => <span>{value} 人</span>,
    },
    {
      title: "已报名",
      dataIndex: "booked_count",
      key: "booked_count",
      render: (value, record) => (
        <Space>
          <TeamOutlined />
          <span>{value || 0} / {record.max_players} 人</span>
        </Space>
      ),
    },
    {
      title: "剩余空位",
      key: "remaining_spots",
      render: (_, record) => {
        const remaining = record.remaining_spots ?? 0;
        const isFull = remaining === 0;
        return (
          <Badge
            count={remaining}
            showZero
            color={isFull ? "red" : "green"}
            offset={[0, 0]}
          />
        );
      },
    },
    {
      title: "状态",
      dataIndex: "is_locked",
      key: "status",
      render: (value, record) => {
        const isFull = (record.remaining_spots ?? 0) === 0;
        if (value) {
          return <Tag color="red">已锁定</Tag>;
        }
        if (isFull) {
          return <Tag color="orange">满员</Tag>;
        }
        return <Tag color="green">开放中</Tag>;
      },
    },
    {
      title: "操作",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个场次吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
          {record.is_locked ? (
            <Button
              type="link"
              icon={<UnlockOutlined />}
              onClick={() => handleToggleLock(record, false)}
            >
              解锁
            </Button>
          ) : (
            <Button
              type="link"
              icon={<LockOutlined />}
              onClick={() => handleToggleLock(record, true)}
            >
              锁定
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="schedule-management">
      <div className="schedule-header">
        <Title level={3}>场次排班管理</Title>
        <Space>
          <DatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加场次
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={schedules}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={editingSchedule ? "编辑场次" : "添加场次"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="theme_id"
            label="主题"
            rules={[{ required: true, message: "请选择主题" }]}
          >
            <Select placeholder="请选择主题">
              {themes.map((theme) => (
                <Option key={theme.id} value={theme.id}>
                  {theme.name} ({theme.type} - {theme.duration}分钟
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="schedule_date"
            label="日期"
            rules={[{ required: true, message: "请选择日期" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="时间">
            <Space style={{ width: "100%" }}>
              <Form.Item
                name="start_time"
                noStyle
                rules={[{ required: true, message: "请选择开始时间" }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ flex: 1 }}
                />
              </Form.Item>
              <span>至</span>
              <Form.Item
                name="end_time"
                noStyle
                rules={[{ required: true, message: "请选择结束时间" }]}
              >
                <TimePicker
                  format="HH:mm"
                  style={{ flex: 1 }}
                />
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item
            name="max_players"
            label="人数上限"
            rules={[{ required: true, message: "请输入人数上限" }]}
          >
            <InputNumber min={1} max={20} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingSchedule ? "更新" : "创建"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
