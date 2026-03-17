/**
 * 摊位路由
 */

const express = require('express');
const router = express.Router();
const db = require('../models/db');

/**
 * GET /api/v1/stalls
 * 获取摊位列表
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (search) filters.search = search;
    
    const stalls = await db.getStalls(filters);
    res.json(stalls);
  } catch (error) {
    console.error('Error fetching stalls:', error);
    res.status(500).json({ error: 'Failed to fetch stalls' });
  }
});

/**
 * GET /api/v1/stalls/:id
 * 获取单个摊位详情
 */
router.get('/:id', async (req, res) => {
  try {
    const stalls = await db.getStalls();
    const stall = stalls.find(s => s.id === req.params.id);
    if (!stall) {
      return res.status(404).json({ error: 'Stall not found' });
    }
    res.json(stall);
  } catch (error) {
    console.error('Error fetching stall:', error);
    res.status(500).json({ error: 'Failed to fetch stall details' });
  }
});

module.exports = router;
