import { useEffect, useState, useCallback } from "react";
import {
  Button,
  ConfigProvider,
  Layout,
  Typography,
  theme,
  Tabs,
  message,
} from "antd";
import { ApiOutlined, DashboardOutlined, ScheduleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { fetchOverview } from "./api/client";
import { APP_CODE, APP_NAME, APP_THEME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { createFallbackOverview } from "./state/dashboard";
import type { OverviewResponse, Schedule } from "./types";
import { FeatureStrip } from "./components/FeatureStrip";
import { MetricGrid } from "./components/MetricGrid";
import { OperationsTable } from "./components/OperationsTable";
import { ScheduleManagement } from "./components/ScheduleManagement";
import { ScheduleBoard } from "./components/ScheduleBoard";
import { BookingModal } from "./components/BookingModal";

const { Header, Content } = Layout;
const { Title } = Typography;

type TabKey = "overview" | "board" | "management";

export default function App() {
  const [overview, setOverview] = useState<OverviewResponse>(createFallbackOverview());
  const [notice, setNotice] = useState(REQUEST_MESSAGES.overviewFallback);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [boardRefreshKey, setBoardRefreshKey] = useState(0);

  useEffect(() => {
    fetchOverview()
      .then((payload) => {
        setOverview(payload);
        setNotice("后端服务已联通，当前展示实时接口数据。");
      })
      .catch(() => setNotice(REQUEST_MESSAGES.overviewFallback));
  }, []);

  const handleBook = useCallback((schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setBookingModalVisible(true);
  }, []);

  const handleBookingSuccess = useCallback(() => {
    setBookingModalVisible(false);
    setSelectedSchedule(null);
    setBoardRefreshKey((prev) => prev + 1);
    message.success("报名成功，场次状态已更新");
  }, []);

  const handleBookingCancel = useCallback(() => {
    setBookingModalVisible(false);
    setSelectedSchedule(null);
  }, []);

  const tabItems = [
    {
      key: "overview",
      label: (
        <span>
          <DashboardOutlined />
          总览
        </span>
      ),
    },
    {
      key: "board",
      label: (
        <span>
          <ScheduleOutlined />
          场次看板
        </span>
      ),
    },
    {
      key: "management",
      label: (
        <span>
          <UnorderedListOutlined />
          排班管理
        </span>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: APP_THEME.accent,
          colorText: APP_THEME.ink,
          colorBgBase: APP_THEME.paper,
          borderRadius: 8,
        },
      }}
    >
      <Layout className="app-shell">
        <Header className="topbar">
          <div className="brand-block">
            <span className="brand-code">{APP_CODE}</span>
            <h1 className="brand-title">{APP_NAME}</h1>
          </div>
          <Button type="primary" icon={<ApiOutlined />} href={REQUEST_MESSAGES.healthPath}>
            API Health
          </Button>
        </Header>
        <Content className="workspace">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as TabKey)}
            items={tabItems}
            style={{ marginBottom: 16 }}
          />

          {activeTab === "overview" && (
            <>
              <section className="lead-grid">
                <article className="hero-panel">
                  <span className="pill">{notice}</span>
                  <Title level={2}>{overview.appName}</Title>
                  <p>{overview.description}</p>
                </article>
                <MetricGrid items={overview.kpis} />
              </section>
              <FeatureStrip items={overview.features} />
              <section className="work-panel">
                <Title level={3}>运营任务流</Title>
                <OperationsTable records={overview.records} />
              </section>
            </>
          )}

          {activeTab === "board" && (
            <div key={boardRefreshKey}>
              <ScheduleBoard onBook={handleBook} />
            </div>
          )}

          {activeTab === "management" && (
            <div>
              <ScheduleManagement />
            </div>
          )}
        </Content>

        <BookingModal
          open={bookingModalVisible}
          schedule={selectedSchedule}
          onCancel={handleBookingCancel}
          onSuccess={handleBookingSuccess}
        />
      </Layout>
    </ConfigProvider>
  );
}
