// Toast notification component
const Toast = {
  show(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const existing = container.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerHTML = `<span>${type === 'error' ? '❌' : '✅'}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};
