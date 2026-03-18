# 早市摊位分布图 - 项目文档

## 📋 项目概述

早市摊位分布图是一个智能导航系统，帮助用户快速找到早市中的目标摊位，了解各类商品的分布位置，并提供路径规划功能。

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                      前端 (HTML/CSS/JS)                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ 分类浏览 │  │ 摊位列表 │  │ 搜索功能 │  │ 地图展示 │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘ │
└───────┼────────────┼────────────┼────────────┼───────┘
        │            │            │            │
        └────────────┴────────────┴────────────┘
                          │
                    [REST API]
                          │
        ┌─────────────────┴─────────────────┐
        │           Express.js Server        │
        │  ┌──────────┐ ┌──────────┐ ┌─────┐│
        │  │ 路由层   │ │ 服务层   │ │模型层││
        │  └──────────┘ └──────────┘ └─────┘│
        └─────────────────┬─────────────────┘
                          │
                    [sql.js SQLite]
                          │
        ┌─────────────────┴─────────────────┐
        │  categories │ stalls │ map_areas  │
        └───────────────────────────────────┘
```

## 📁 项目结构

```
morning-market-navigator/
├── public/                    # 前端静态资源
│   ├── index.html             # 主页面
│   └── static/
│       └── js/
│           └── main.js        # 前端逻辑
├── src/                       # 后端源代码
│   ├── index.js               # 入口文件
│   ├── models/
│   │   └── db.js              # 数据库模型
│   ├── routes/                # API路由
│   │   ├── stalls.js          # 摊位接口
│   │   ├── categories.js      # 分类接口
│   │   ├── search.js          # 搜索接口
│   │   ├── map.js             # 地图接口
│   │   └── navigation.js      # 导航接口
│   └── scripts/
│       └── initData.js        # 数据初始化脚本
├── data/                      # 数据库文件
├── static/                    # 静态资源（静态部署版本）
│   └── js/
│       └── main.js
├── data.json                  # 静态JSON数据
├── package.json               # 项目配置
├── .gitignore                 # Git忽略配置
└── README.md                  # 项目说明
```

## 🔌 API 接口文档

### 1. 健康检查

**GET** `/api/health`

检查服务是否正常运行。

**响应示例:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-18T04:46:39.519Z"
}
```

---

### 2. 获取分类列表

**GET** `/api/v1/categories`

获取所有摊位分类。

**响应示例:**
```json
[
  {
    "id": "cat_breakfast",
    "name": "早餐",
    "description": "包子、豆浆、油条",
    "icon": "🍔",
    "color": "#f39c12",
    "sort_order": 1
  }
]
```

---

### 3. 获取摊位列表

**GET** `/api/v1/stalls`

获取所有摊位，可选参数过滤。

**参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| category | string | 按分类ID过滤 |
| search | string | 搜索关键词 |
| limit | number | 返回数量限制 |
| offset | number | 偏移量 |

**响应示例:**
```json
[
  {
    "id": "stall_1",
    "category_id": "cat_breakfast",
    "name": "老王包子铺",
    "description": "手工包子，馅足皮薄",
    "price": "2-8元",
    "location_x": 10,
    "location_y": 20,
    "hours": "6:00-10:00",
    "rating": 4.8,
    "status": "open",
    "category_name": "早餐"
  }
]
```

---

### 4. 搜索摊位

**GET** `/api/v1/search?q=关键词`

搜索摊位名称或描述。

**响应示例:**
```json
{
  "success": true,
  "data": [...],
  "total": 1
}
```

---

### 5. 获取地图数据

**GET** `/api/v1/map`

获取完整地图数据，包括区域、分类和摊位。

---

### 6. 路径规划

**POST** `/api/v1/navigation`

计算两点之间的最短路径。

**请求体:**
```json
{
  "start": { "x": 10, "y": 20 },
  "end": { "x": 50, "y": 60 }
}
```

**响应示例:**
```json
{
  "success": true,
  "path": [
    { "x": 10, "y": 20 },
    { "x": 30, "y": 40 },
    { "x": 50, "y": 60 }
  ],
  "distance": 72.1,
  "estimatedTime": 2
}
```

## 🗄️ 数据库设计

### categories (分类表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT PRIMARY KEY | 分类ID |
| name | TEXT | 分类名称 |
| description | TEXT | 分类描述 |
| icon | TEXT | 图标 |
| color | TEXT | 颜色代码 |
| sort_order | INTEGER | 排序 |

### stalls (摊位表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT PRIMARY KEY | 摊位ID |
| category_id | TEXT | 所属分类ID |
| name | TEXT | 摊位名称 |
| description | TEXT | 摊位描述 |
| price | TEXT | 价格区间 |
| location_x | REAL | X坐标 |
| location_y | REAL | Y坐标 |
| hours | TEXT | 营业时间 |
| rating | REAL | 评分 |
| status | TEXT | 状态 |

### map_areas (地图区域表)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT PRIMARY KEY | 区域ID |
| name | TEXT | 区域名称 |
| x | REAL | X坐标 |
| y | REAL | Y坐标 |
| width | REAL | 宽度 |
| height | REAL | 高度 |
| color | TEXT | 颜色 |

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 初始化数据

```bash
npm run init-data
```

### 启动服务

```bash
npm start
```

服务启动后访问: http://localhost:3000

## 🌐 部署

### 本地部署

```bash
# 使用静态版本
# 直接在浏览器打开 index.html
# 或使用任意静态服务器
npx serve .
```

### Docker 部署

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "src/index.js"]
```

## 📊 数据统计

- 分类数量: 6
- 摊位数量: 6
- 地图区域: 5

## 🔧 技术栈

- **后端**: Node.js + Express.js
- **数据库**: sql.js (SQLite in-memory)
- **前端**: Vanilla JavaScript + CSS3
- **部署**: 支持静态部署

## 📝 更新日志

### v1.0.0 (2026-03-18)
- 初始版本发布
- 基础分类浏览功能
- 摊位搜索功能
- 地图可视化
- 路径规划
- 支持静态部署

## 📄 许可证

ISC
