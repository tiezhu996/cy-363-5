import { localFeatures, localKpis, operationRecords } from "../data/workbench";
import type { OverviewResponse } from "../types";
import { APP_CODE, APP_NAME } from "../constants/app";

export function createFallbackOverview(): OverviewResponse {
  return {
    appName: APP_NAME,
    appCode: APP_CODE,
    description: "面向密室逃脱线下门店，提供主题房间管理、场次预约、道具库存和玩家战绩追踪等运营工具。",
    features: localFeatures,
    kpis: localKpis,
    records: operationRecords,
  };
}
