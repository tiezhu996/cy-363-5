export const overviewData = {
  "appName": "密室逃脱门店管理系统",
  "appCode": "ldescaperoom",
  "description": "面向密室逃脱线下门店，提供主题房间管理、场次预约、道具库存和玩家战绩追踪等运营工具。",
  "features": [
    {
      "id": 1,
      "title": "主题房间与难度分级",
      "description": "录入密室主题信息（名称、类型、难度星级、建议人数、时长、剧情简介），上传主题海报与场景图，支持恐怖/悬疑/科幻等分类标签管理。",
      "status": "已上线",
      "metric": "88%"
    },
    {
      "id": 2,
      "title": "场次预约与拼团",
      "description": "门店设置每日开放场次，每场显示已报名人数和剩余空位，玩家可单人报名加入拼团或自行组满队伍，满员后锁定场次。",
      "status": "排期中",
      "metric": "31 单"
    },
    {
      "id": 3,
      "title": "线索道具库存管理",
      "description": "管理各主题所需线索道具（如钥匙、密码箱、机关零件），记录道具使用损耗情况，库存不足时提醒补充，维护道具维修记录。",
      "status": "巡检中",
      "metric": "10 项"
    },
    {
      "id": 4,
      "title": "玩家通关时长排行榜",
      "description": "记录每支队伍的通关时长、提示使用次数、逃脱成功与否，生成各主题的历史最快通关排行榜，玩家可查看自己的历史战绩。",
      "status": "优化中",
      "metric": "4 级"
    },
    {
      "id": 5,
      "title": "营收与上座率分析",
      "description": "管理员查看每日/周/月营收报表、各主题上座率与复购率排行、高峰时段分析，支持按日期范围导出营业数据。",
      "status": "可导出",
      "metric": "28 条"
    }
  ],
  "kpis": [
    {
      "label": "今日处理",
      "value": "100",
      "trend": "+12%",
      "tone": "primary"
    },
    {
      "label": "预约/订单",
      "value": "34",
      "trend": "+8%",
      "tone": "warm"
    },
    {
      "label": "履约率",
      "value": "90%",
      "trend": "+3%",
      "tone": "cool"
    },
    {
      "label": "待处理",
      "value": "7",
      "trend": "需跟进",
      "tone": "neutral"
    }
  ],
  "records": [
    {
      "key": "ldescaperoom-1",
      "name": "主题房间与难度分级",
      "owner": "运营组",
      "status": "已上线",
      "metric": "88%",
      "priority": "高"
    },
    {
      "key": "ldescaperoom-2",
      "name": "场次预约与拼团",
      "owner": "管理员",
      "status": "排期中",
      "metric": "31 单",
      "priority": "中"
    },
    {
      "key": "ldescaperoom-3",
      "name": "线索道具库存管理",
      "owner": "服务台",
      "status": "巡检中",
      "metric": "10 项",
      "priority": "低"
    },
    {
      "key": "ldescaperoom-4",
      "name": "玩家通关时长排行榜",
      "owner": "财务组",
      "status": "优化中",
      "metric": "4 级",
      "priority": "高"
    },
    {
      "key": "ldescaperoom-5",
      "name": "营收与上座率分析",
      "owner": "审核组",
      "status": "可导出",
      "metric": "28 条",
      "priority": "中"
    }
  ]
};
