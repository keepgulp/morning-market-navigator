/**
 * 初始化市场数据脚本
 */

const db = require('../models/db');

const categories = [
  { id: 'cat_breakfast', name: '早餐', description: '包子、豆浆、油条', icon: '🍔', color: '#f39c12', sort_order: 1 },
  { id: 'cat_vegetables', name: '蔬菜', description: '新鲜蔬菜、水果', icon: '🥬', color: '#27ae60', sort_order: 2 },
  { id: 'cat_meat', name: '肉类', description: '猪肉、牛肉、羊肉', icon: '🥩', color: '#e74c3c', sort_order: 3 },
  { id: 'cat_seafood', name: '水产', description: '鱼、虾、蟹', icon: '🦐', color: '#3498db', sort_order: 4 },
  { id: 'cat_cooked', name: '熟食', description: '凉菜、卤味', icon: '🍖', color: '#9b59b6', sort_order: 5 },
  { id: 'cat_spices', name: '调料', description: '油盐酱醋', icon: '🧂', color: '#95a5a6', sort_order: 6 }
];

const stalls = [
  { category_id: 'cat_breakfast', name: '老王包子铺', description: '手工包子，馅足皮薄', price: '2-8元', location_x: 10, location_y: 20, hours: '6:00-10:00', rating: 4.8 },
  { category_id: 'cat_breakfast', name: '张记豆浆', description: '现磨豆浆，油条酥脆', price: '3-10元', location_x: 15, location_y: 25, hours: '5:30-10:30', rating: 4.6 },
  { category_id: 'cat_vegetables', name: '李婶蔬菜摊', description: '本地蔬菜，每日直供', price: '1-15元/斤', location_x: 30, location_y: 40, hours: '6:00-14:00', rating: 4.9 },
  { category_id: 'cat_meat', name: '王哥肉铺', description: '新鲜猪肉，品质保证', price: '25-45元/斤', location_x: 50, location_y: 60, hours: '6:00-18:00', rating: 4.7 },
  { category_id: 'cat_seafood', name: '赵记海鲜', description: '活鲜现杀，价格实惠', price: '15-80元/斤', location_x: 70, location_y: 80, hours: '5:30-13:00', rating: 4.5 },
  { category_id: 'cat_cooked', name: '刘嫂熟食', description: '传统卤味，口感醇厚', price: '18-35元/斤', location_x: 40, location_y: 90, hours: '7:00-20:00', rating: 4.8 }
];

const mapAreas = [
  { id: 'area_a', name: '早餐区', x: 0, y: 0, width: 100, height: 50, color: '#f39c12' },
  { id: 'area_b', name: '蔬菜区', x: 0, y: 50, width: 100, height: 40, color: '#27ae60' },
  { id: 'area_c', name: '肉类区', x: 0, y: 90, width: 50, height: 30, color: '#e74c3c' },
  { id: 'area_d', name: '水产区', x: 50, y: 90, width: 50, height: 30, color: '#3498db' },
  { id: 'area_e', name: '熟食区', x: 0, y: 120, width: 100, height: 30, color: '#9b59b6' }
];

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    await db.initDB();
    
    // 清空旧数据
    await db.bulkInsertCategories(categories);
    console.log(`✅ 已插入 ${categories.length} 个分类`);
    
    await db.bulkInsertStalls(stalls);
    console.log(`✅ 已插入 ${stalls.length} 个摊位`);
    
    await db.bulkInsertMapAreas(mapAreas);
    console.log(`✅ 已插入 ${mapAreas.length} 个地图区域`);
    
    console.log('🎉 数据库初始化完成!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
