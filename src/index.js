/**
 * 早市摊位分布图 - 主入口文件
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入路由
const stallsRouter = require('./routes/stalls');
const categoriesRouter = require('./routes/categories');
const searchRouter = require('./routes/search');
const navigationRouter = require('./routes/navigation');
const mapRouter = require('./routes/map');

// 导入数据库
const db = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API 路由 (v1)
app.use('/api/v1/stalls', stallsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/navigation', navigationRouter);
app.use('/api/v1/map', mapRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 前端页面路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 初始化数据库并启动服务器
async function startServer() {
  try {
    await db.initDB();
    console.log('✅ 数据库初始化完成');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔═══════════════════════════════════════════╗
║   🏪 早市指南服务器已启动                  ║
║   端口: ${PORT}                             ║
║   本地: http://localhost:${PORT}              ║
╚═══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

startServer();
