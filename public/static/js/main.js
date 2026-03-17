// 早市摊位分布图 - 前端主脚本

const API_BASE = '/api/v1';

// 状态
let categories = [];
let stalls = [];
let selectedCategory = null;

// 初始化
async function init() {
  await loadCategories();
  await loadStalls();
}

// 加载分类
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    categories = await res.json();
    renderCategories();
  } catch (error) {
    console.error('加载分类失败:', error);
    document.getElementById('categoryList').innerHTML = '<div class="empty-state">加载失败</div>';
  }
}

// 加载摊位
async function loadStalls() {
  try {
    const url = selectedCategory 
      ? `${API_BASE}/stalls?category=${selectedCategory}`
      : `${API_BASE}/stalls`;
    const res = await fetch(url);
    stalls = await res.json();
    renderStalls();
    renderMap();
  } catch (error) {
    console.error('加载摊位失败:', error);
  }
}

// 渲染分类
function renderCategories() {
  const container = document.getElementById('categoryList');
  if (categories.length === 0) {
    container.innerHTML = '<div class="empty-state">暂无分类</div>';
    return;
  }
  
  container.innerHTML = `
    <div class="category-item ${!selectedCategory ? 'active' : ''}" onclick="selectCategory(null)">
      <span>全部</span>
      <span>${stalls.length}</span>
    </div>
    ${categories.map(cat => `
      <div class="category-item ${selectedCategory === cat.id ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
        <span>${cat.name}</span>
        <span>${cat.description || ''}</span>
      </div>
    `).join('')}
  `;
}

// 渲染摊位
function renderStalls() {
  const container = document.getElementById('stallList');
  if (stalls.length === 0) {
    container.innerHTML = '<div class="empty-state">暂无摊位</div>';
    return;
  }
  
  container.innerHTML = stalls.map(stall => `
    <div class="stall-item" onclick="showStallDetail('${stall.id}')">
      <div class="stall-name">${stall.name}</div>
      <div class="stall-info">${stall.description || ''}</div>
      <div class="stall-info">💰 ${stall.price || '面议'} | 🕐 ${stall.hours || '待定'}</div>
      <div class="stall-rating">⭐ ${stall.rating || '5.0'}</div>
    </div>
  `).join('');
}

// 渲染地图
function renderMap() {
  const svg = document.getElementById('mapSvg');
  if (!stalls.length) return;
  
  // 计算缩放比例
  const maxX = Math.max(...stalls.map(s => s.location_x || 0), 100);
  const maxY = Math.max(...stalls.map(s => s.location_y || 0), 100);
  const scaleX = 700 / maxX;
  const scaleY = 300 / maxY;
  
  let html = `<rect x="0" y="0" width="800" height="400" fill="#f8f9fa"/>`;
  
  // 绘制摊位点
  stalls.forEach((stall, i) => {
    const x = (stall.location_x || 0) * scaleX + 50;
    const y = (stall.location_y || 0) * scaleY + 50;
    const colors = ['#667eea', '#f39c12', '#27ae60', '#e74c3c', '#9b59b6', '#3498db'];
    const color = colors[i % colors.length];
    
    html += `
      <circle cx="${x}" cy="${y}" r="15" fill="${color}" opacity="0.8">
        <title>${stall.name}</title>
      </circle>
      <text x="${x}" y="${y + 30}" text-anchor="middle" font-size="10" fill="#333">${stall.name}</text>
    `;
  });
  
  svg.innerHTML = html;
}

// 选择分类
function selectCategory(categoryId) {
  selectedCategory = categoryId;
  loadStalls();
  renderCategories();
}

// 搜索
async function search() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;
  
  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    stalls = data.data || [];
    selectedCategory = null;
    renderCategories();
    renderStalls();
    renderMap();
  } catch (error) {
    console.error('搜索失败:', error);
  }
}

// 显示详情
function showStallDetail(id) {
  const stall = stalls.find(s => s.id === id);
  if (stall) {
    alert(`${stall.name}\n\n📍 地址: ${stall.location_x}:${stall.location_y}\n💰 价格: ${stall.price}\n🕐 时间: ${stall.hours}\n⭐ 评分: ${stall.rating}`);
  }
}

// 回车搜索
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') search();
});

// 启动
init();
