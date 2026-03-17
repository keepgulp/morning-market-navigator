/**
 * 搜索路由
 */

const express = require('express');
const router = express.Router();
const db = require('../models/db');

/**
 * GET /api/v1/search
 * 搜索摊位
 */
router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    if (!q && !category) {
      return res.status(400).json({ error: 'Missing search query' });
    }
    
    const filters = {};
    if (q) filters.search = q;
    if (category) filters.category = category;
    
    const stalls = await db.getStalls(filters);
    res.json({ success: true, data: stalls, total: stalls.length });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
