/**
 * 分类路由
 */

const express = require('express');
const router = express.Router();
const db = require('../models/db');

/**
 * GET /api/v1/categories
 * 获取分类列表
 */
router.get('/', async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
