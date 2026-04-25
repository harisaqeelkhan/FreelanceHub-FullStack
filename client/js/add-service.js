const API = 'http://localhost:3000/api';

async function submitNewService() {
  const title = document.getElementById('new-title').value.trim();
  const seller = document.getElementById('new-seller').value.trim();
  const price = document.getElementById('new-price').value;
  const category = document.getElementById('new-category').value;
  const desc = document.getElementById('new-desc').value.trim();

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

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to add service');
    }

    showToast('Service added! Redirecting to Services...');

    ['new-title', 'new-seller', 'new-price', 'new-desc'].forEach(id => {
      document.getElementById(id).value = '';
    });

    setTimeout(() => {
      window.location.href = 'index.html#services';
    }, 900);
  } catch (err) {
    showToast(err.message || 'Failed to add service');
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
