/**
 * 地图路由 - 获取早市整体布局
 */

const express = require('express');
const router = express.Router();
const db = require('../models/db');

/**
 * GET /api/v1/map
 * 获取完整地图数据
 */
router.get('/', async (req, res) => {
  try {
    const areas = await db.getMapAreas();
    const categories = await db.getCategories();
    const stalls = await db.getStalls();
    
    res.json({
      success: true,
      data: {
        areas,
        categories,
        stalls,
        meta: {
          width: 800,
          height: 600,
          centerX: 400,
          centerY: 300
        }
      }
    });
  } catch (error) {
    console.error('获取地图数据失败:', error);
    res.status(500).json({ success: false, error: '获取地图数据失败' });
  }
});

module.exports = router;
