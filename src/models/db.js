/**
 * 数据库模型 - 使用 sql.js (纯 JavaScript SQLite)
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
let dbPath = path.join(__dirname, '../../data/market.db');

// 初始化数据库
async function initDB() {
  const SQL = await initSqlJs();
  
  // 确保 data 目录存在
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // 尝试加载现有数据库
  if (fs.existsSync(dbPath)) {
    try {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log('✅ 已加载现有数据库');
    } catch (e) {
      db = new SQL.Database();
      console.log('⚠️ 加载数据库失败，创建新数据库');
    }
  } else {
    db = new SQL.Database();
  }
  
  // 创建表
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      color TEXT,
      sort_order INTEGER DEFAULT 0
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS stalls (
      id TEXT PRIMARY KEY,
      category_id TEXT,
      name TEXT NOT NULL,
      description TEXT,
      price TEXT,
      location_x REAL,
      location_y REAL,
      hours TEXT,
      phone TEXT,
      rating REAL DEFAULT 5.0,
      status TEXT DEFAULT 'open',
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS map_areas (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      x REAL,
      y REAL,
      width REAL,
      height REAL,
      color TEXT
    )
  `);
  
  console.log('✅ 数据库表创建完成');
  
  // 保存数据库
  saveDB();
  
  return db;
}

// 保存数据库到文件
function saveDB() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// 获取分类列表
async function getCategories() {
  const results = db.exec('SELECT * FROM categories ORDER BY sort_order');
  if (results.length === 0) return [];
  return resultsToObjects(results[0]);
}

// 获取摊位列表
async function getStalls(filters = {}) {
  let sql = 'SELECT s.*, c.name as category_name FROM stalls s LEFT JOIN categories c ON s.category_id = c.id WHERE 1=1';
  const params = [];
  
  if (filters.category) {
    sql += ' AND s.category_id = ?';
    params.push(filters.category);
  }
  if (filters.search) {
    sql += ' AND (s.name LIKE ? OR s.description LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  
  sql += ' ORDER BY s.name';
  
  const results = db.exec(sql, params);
  if (results.length === 0) return [];
  return resultsToObjects(results[0]);
}

// 获取地图区域
async function getMapAreas() {
  const results = db.exec('SELECT * FROM map_areas ORDER BY name');
  if (results.length === 0) return [];
  return resultsToObjects(results[0]);
}

// 批量插入数据
async function bulkInsertCategories(categories) {
  const stmt = db.prepare('INSERT OR REPLACE INTO categories (id, name, description, icon, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
  for (const cat of categories) {
    stmt.run([cat.id, cat.name, cat.description, cat.icon, cat.color, cat.sort_order || 0]);
  }
  stmt.free();
  saveDB();
}

async function bulkInsertStalls(stalls) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO stalls 
    (id, category_id, name, description, price, location_x, location_y, hours, rating, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const stall of stalls) {
    stmt.run([
      stall.id || `stall_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stall.category_id,
      stall.name,
      stall.description,
      stall.price,
      stall.location_x,
      stall.location_y,
      stall.hours,
      stall.rating || 5.0,
      stall.status || 'open'
    ]);
  }
  stmt.free();
  saveDB();
}

async function bulkInsertMapAreas(areas) {
  const stmt = db.prepare('INSERT OR REPLACE INTO map_areas (id, name, x, y, width, height, color) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const area of areas) {
    stmt.run([area.id, area.name, area.x, area.y, area.width, area.height, area.color]);
  }
  stmt.free();
  saveDB();
}

// 辅助函数：将 sql.js 结果转换为对象数组
function resultsToObjects(result) {
  const columns = result.columns;
  return result.values.map(row => {
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

module.exports = {
  initDB,
  getCategories,
  getStalls,
  getMapAreas,
  bulkInsertCategories,
  bulkInsertStalls,
  bulkInsertMapAreas
};
