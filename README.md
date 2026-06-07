# 密室逃脱门店管理系统

面向密室逃脱线下门店，提供主题房间管理、场次预约、道具库存和玩家战绩追踪等运营工具。

## Docker Compose 快速启动

首次启动前复制环境变量文件：

```bash
cp .env.example .env
docker compose up -d
```

访问地址：

- 前端：http://localhost:28503
- 后端健康检查：http://localhost:29503/health
- API 示例：http://localhost:28503/api/overview

## 项目主要功能

- 主题房间与难度分级：录入密室主题信息（名称、类型、难度星级、建议人数、时长、剧情简介），上传主题海报与场景图，支持恐怖/悬疑/科幻等分类标签管理。
- 场次预约与拼团：门店设置每日开放场次，每场显示已报名人数和剩余空位，玩家可单人报名加入拼团或自行组满队伍，满员后锁定场次。
- 线索道具库存管理：管理各主题所需线索道具（如钥匙、密码箱、机关零件），记录道具使用损耗情况，库存不足时提醒补充，维护道具维修记录。
- 玩家通关时长排行榜：记录每支队伍的通关时长、提示使用次数、逃脱成功与否，生成各主题的历史最快通关排行榜，玩家可查看自己的历史战绩。
- 营收与上座率分析：管理员查看每日/周/月营收报表、各主题上座率与复购率排行、高峰时段分析，支持按日期范围导出营业数据。

## 本地开发方式

前端：

```bash
cd frontend
npm install
npm run dev
```

后端：

```bash
cd backend
npm install
npm run dev
```

## 技术栈

| 分层 | 技术 |
| --- | --- |
| 前端 | React 18 + TypeScript、Ant Design、Vite |
| 后端 | Node.js + Express + TypeScript |
| 数据库 | MySQL 8.0 |
| 认证 | JWT |
| 依赖 | Sequelize、bcryptjs、express-validator |

## 项目目录结构

```text
.
├── backend/              # 后端服务
├── database/             # 数据库脚本
├── frontend/             # 前端应用
├── docker-compose.yml    # 一键部署编排
├── .env.example          # 环境变量示例
└── README.md
```

## 环境变量说明

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| COMPOSE_PROJECT_NAME | Compose 项目名，避免中文目录名导致项目名为空 | ldescaperoom |
| DB_NAME | 数据库名称 | app |
| DB_USER | 数据库用户 | app |
| DB_PASSWORD | 数据库密码 | app_pwd |
| DB_ROOT_PASSWORD | 数据库 root 密码 | root_pwd |
| JWT_SECRET | JWT 签名密钥 | change_me_to_a_long_random_string |
| FRONTEND_PORT | 前端宿主机端口 | 28503 |
| BACKEND_PORT | 后端宿主机端口 | 29503 |
| DB_PORT | 数据库宿主机端口 | 3306 |

## Docker 部署说明

- 使用 `docker compose up -d` 启动，不需要额外传入 `-p`。
- `docker-compose.yml` 顶层已声明 `name: ldescaperoom`，并且 `.env` 包含 `COMPOSE_PROJECT_NAME=ldescaperoom`，可在中文目录名下启动。
- 数据库数据保存在命名卷 `db_data` 中，不依赖当前目录名。
- 前端容器由 Nginx 托管静态资源，并把 `/api/` 反向代理到 `backend:29503`。
- 若本地端口冲突，可修改 `.env` 中的 `FRONTEND_PORT`、`BACKEND_PORT`、`DB_PORT`。

常用命令：

```bash
docker compose config --quiet
docker compose ps
docker compose down
```

## License

MIT
