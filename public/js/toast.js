// Toast notification system
class Toast {
  static container = null;

  static init() {
    if (!this.container) {
      this.container = document.getElementById('toastContainer');
    }
  }

  static show(message, type = 'success', title = null, duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const toastContent = `
      ${title ? `<div class="toast-title">${title}</div>` : ''}
      <div class="toast-description">${message}</div>
    `;
    
    toast.innerHTML = toastContent;
    
    // Add to container
    this.container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
          if (toast.parentNode) {
            this.container.removeChild(toast);
          }
        }, 300);
      }
    }, duration);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
      if (toast.parentNode) {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
          if (toast.parentNode) {
            this.container.removeChild(toast);
          }
        }, 300);
      }
    });

    return toast;
  }

  static success(message, title = null) {
    return this.show(message, 'success', title);
  }

  static error(message, title = null) {
    return this.show(message, 'error', title);
  }
}

window.Toast = Toast;