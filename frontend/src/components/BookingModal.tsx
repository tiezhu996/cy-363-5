import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Typography,
  Tag,
  message,
  Descriptions,
  Alert,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { createBooking } from "../api/client";
import type { Schedule, CreateBookingRequest } from "../types";

const { Title, Text } = Typography;

interface BookingModalProps {
  open: boolean;
  schedule: Schedule | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function BookingModal({
  open,
  schedule,
  onCancel,
  onSuccess,
}: BookingModalProps) {
  const [form] = Form.useForm<CreateBookingRequest>();
  const [loading, setLoading] = useState(false);

  const maxPlayers = schedule?.remaining_spots ?? 1;

  const handleSubmit = async (values: CreateBookingRequest) => {
    if (!schedule) return;

    try {
      setLoading(true);
      await createBooking({
        ...values,
        schedule_id: schedule.id,
      });
      message.success("报名成功！");
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  if (!schedule) return null;

  return (
    <Modal
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            报名预约
          </Title>
          <Tag color="blue">{schedule.theme?.name}</Tag>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={500}
    >
      {schedule.is_locked ? (
        <Alert
          message="场次已锁定"
          description="该场次已满员或已被锁定，无法报名。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : (
        <>
          <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item
              label={
                <Space>
                  <CalendarOutlined /> 日期
                </Space>
              }
            >
              {schedule.schedule_date}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <ClockCircleOutlined /> 时间
                </Space>
              }
            >
              {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <TeamOutlined /> 剩余空位
                </Space>
              }
            >
              <Text strong type="success">
                {schedule.remaining_spots} / {schedule.max_players} 位
              </Text>
            </Descriptions.Item>
          </Descriptions>

          <Alert
            message="拼团说明"
            description="您可以单人报名加入拼团，也可以一次性报满整队。报名人数不能超过剩余空位。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="player_name"
              label={
                <Space>
                  <UserOutlined /> 玩家姓名
                </Space>
              }
              rules={[
                { required: true, message: "请输入玩家姓名" },
                { min: 1, max: 80, message: "姓名长度不能超过80个字符" },
              ]}
            >
              <Input placeholder="请输入玩家姓名" maxLength={80} />
            </Form.Item>

            <Form.Item
              name="player_phone"
              label={
                <Space>
                  <PhoneOutlined /> 联系电话
                </Space>
              }
              rules={[
                { max: 20, message: "电话长度不能超过20个字符" },
              ]}
            >
              <Input placeholder="请输入联系电话（选填）" maxLength={20} />
            </Form.Item>

            <Form.Item
              name="player_count"
              label={
                <Space>
                  <TeamOutlined /> 报名人数
                </Space>
              }
              rules={[
                { required: true, message: "请输入报名人数" },
                {
                  type: "number",
                  min: 1,
                  max: maxPlayers,
                  message: `报名人数必须在 1-${maxPlayers} 之间`,
                },
              ]}
              initialValue={1}
            >
              <InputNumber
                min={1}
                max={maxPlayers}
                style={{ width: "100%" }}
                placeholder={`请输入报名人数（最多 ${maxPlayers} 人）`}
              />
            </Form.Item>

            {maxPlayers > 1 && (
              <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                提示：如果您是组队报名，请填写实际人数。单人报名请填写 1。
              </Text>
            )}

            <Form.Item style={{ marginBottom: 0 }}>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={handleCancel}>取消</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  disabled={schedule.is_locked || (schedule.remaining_spots ?? 0) === 0}
                >
                  确认报名
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
}
