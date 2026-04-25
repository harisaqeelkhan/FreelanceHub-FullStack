const API = 'http://localhost:3000/api';

let allServices = [];
let currentService = null;

// page load hone pe sab initialize karo
window.addEventListener('load', () => {
  fetchServices();
  loadDashboard();
  setupDragDrop();
});

// ---- NAVIGATION ----
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  const navItem = document.querySelector(`[data-page="${pageId}"]`);
  if (navItem) navItem.classList.add('active');

  if (pageId === 'dashboard') loadDashboard();
}

// ---- FETCH ALL SERVICES ----
async function fetchServices() {
  try {
    const res = await fetch(`${API}/services`);
    const data = await res.json();
    allServices = data;
    renderCards(allServices);
  } catch (err) {
    // server band hoga - pehle npm start karo
    console.error('fetch error:', err);
    document.getElementById('services-container').innerHTML =
      '<p style="color:#666">Could not connect to server. Run npm start first.</p>';
  }
}

// ---- RENDER CARDS ----
function renderCards(services) {
  const container = document.getElementById('services-container');
  container.innerHTML = '';

  if (services.length === 0) {
    container.innerHTML = '<p class="empty-msg">No services found</p>';
    return;
  }

  services.forEach(s => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.setAttribute('draggable', 'true');
    card.dataset.id = s.id;

    card.innerHTML = `
      <span class="badge">${s.category}</span>
      <h3>${s.title}</h3>
      <div class="meta">by ${s.seller} · ${s.deliveryDays} days</div>
      <div class="price">PKR ${s.price}</div>
      <div class="rating">⭐ ${s.rating} (${s.reviews} reviews)</div>
    `;

    card.addEventListener('click', () => openServiceDetail(s.id));
    card.addEventListener('dragstart', handleDragStart);

    container.appendChild(card);
  });
}

// ---- SERVICE DETAIL PAGE ----
async function openServiceDetail(serviceId) {
  try {
    const res = await fetch(`${API}/services/${serviceId}`);
    if (!res.ok) throw new Error('Service not found');

    const service = await res.json();
    currentService = service;
    renderServiceDetail(service);
    showPage('service-detail');
  } catch (err) {
    const local = allServices.find(s => s.id === parseInt(serviceId));
    if (!local) {
      showToast('Could not load service details');
      return;
    }

    currentService = local;
    renderServiceDetail(local);
    showPage('service-detail');
  }
}

function renderServiceDetail(service) {
  document.getElementById('detail-category').textContent = service.category || 'Other';
  document.getElementById('detail-title').textContent = service.title;
  document.getElementById('detail-seller').textContent = 'by ' + service.seller;
  document.getElementById('detail-desc').textContent = service.description || 'No description provided.';
  document.getElementById('detail-delivery').textContent = 'Delivery: ' + service.deliveryDays + ' day(s)';
  document.getElementById('detail-rating').textContent = 'Rating: ' + service.rating + ' (' + service.reviews + ' reviews)';
  document.getElementById('detail-price').textContent = 'PKR ' + service.price;
}

// ---- SEARCH ----
function handleSearch() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filtered = allServices.filter(s =>
    s.title.toLowerCase().includes(query)
  );
  applyFiltersAndSort(filtered);
}

// ---- FILTER + SORT ----
function applyFiltersAndSort(services = allServices) {
  let result = [...services];

  const cat = document.getElementById('filter-category').value;
  const maxPrice = document.getElementById('filter-price').value;
  const sortBy = document.getElementById('sort-by').value;

  if (cat !== 'all') {
    result = result.filter(s => s.category === cat);
  }

  if (maxPrice) {
    // bug: <= hona chahiye tha, < use kar diya
    result = result.filter(s => s.price < parseInt(maxPrice));
  }

  if (sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  }

  renderCards(result);
}

// ---- MODAL ----
function openModal(service) {
  currentService = service;
  document.getElementById('modal-title').textContent = service.title;
  document.getElementById('modal-seller').textContent = 'by ' + service.seller;
  document.getElementById('modal-desc').textContent = service.description;
  document.getElementById('modal-price').textContent = 'PKR ' + service.price;
  document.getElementById('modal-rating').textContent = '⭐ ' + service.rating + ' (' + service.reviews + ' reviews)';
  document.getElementById('modal-delivery').textContent = service.deliveryDays + ' day delivery';

  document.getElementById('service-modal').classList.add('open');
}

function closeModal(clearSelection = true) {
  document.getElementById('service-modal').classList.remove('open');
  if (clearSelection) currentService = null;
}

function openConfirm(action) {
  document.getElementById('confirm-action').textContent = action;
  document.getElementById('confirm-modal').classList.add('open');
}

function closeConfirm() {
  document.getElementById('confirm-modal').classList.remove('open');
}

// ---- SAVE / HIRE ----
async function saveService() {
  if (!currentService) return;
  closeModal(false);
  openConfirm('save');
}

async function hireService() {
  if (!currentService) return;
  closeModal(false);
  openConfirm('hire');
}

async function confirmAction() {
  const action = document.getElementById('confirm-action').textContent;
  closeConfirm();

  if (!currentService) {
    showToast('No service selected');
    return;
  }

  // action ke hisaab se endpoint choose karo
  const endpoint = action === 'save' ? '/save' : '/hire';

  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: currentService.id })
    });

    const data = await res.json();
    showToast(data.message || 'Action completed');
    loadDashboard();
  } catch (err) {
    showToast('Something went wrong');
  }

  currentService = null;
}

// ---- DRAG AND DROP ----
function setupDragDrop() {
  const zone = document.getElementById('drop-zone');

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', async (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');

    const id = e.dataTransfer.getData('serviceId');
    if (!id) return;

    // drop hone pe save API call
    try {
      const res = await fetch(`${API}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: parseInt(id) })
      });
      const data = await res.json();
      showToast('Dragged & ' + data.message);
      loadDashboard();
    } catch (err) {
      console.log(err);
    }
  });
}

function handleDragStart(e) {
  e.dataTransfer.setData('serviceId', e.currentTarget.dataset.id);
}

// ---- DASHBOARD ----
async function loadDashboard() {
  try {
    // dono requests ek saath bhejo
    const [savedRes, hiredRes] = await Promise.all([
      fetch(`${API}/saved`),
      fetch(`${API}/hired`)
    ]);

    const saved = await savedRes.json();
    const hired = await hiredRes.json();

    document.getElementById('stat-saved').textContent = saved.length;
    document.getElementById('stat-hired').textContent = hired.length;

    renderDashboardList('saved-list', saved);
    renderDashboardList('hired-list', hired);
  } catch (err) {
    console.log('Dashboard load failed:', err);
  }
}

function renderDashboardList(containerId, items) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = '<p class="empty-msg">Nothing here yet</p>';
    return;
  }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'dashboard-item';
    div.innerHTML = `
      <strong>${item.title}</strong>
      <span>PKR ${item.price} · ${item.category}</span>
    `;
    container.appendChild(div);
  });
}

// ---- ADD SERVICE ----
async function submitNewService() {
  const title = document.getElementById('new-title').value;
  const seller = document.getElementById('new-seller').value;
  const price = document.getElementById('new-price').value;
  const category = document.getElementById('new-category').value;
  const desc = document.getElementById('new-desc').value;

  if (!title || !seller || !price) {
    showToast('Please fill all required fields');
    return;
  }

  try {
    const res = await fetch(`${API}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, seller, price, category, description: desc })
    });

    // res.ok check bhool gaya - ye bug hai
    const data = await res.json();
    showToast('Service added!');
    fetchServices();

    ['new-title', 'new-seller', 'new-price', 'new-desc'].forEach(id => {
      document.getElementById(id).value = '';
    });
  } catch (err) {
    showToast('Failed to add service');
  }
}

// ---- TOAST ----
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
