// AgroTrack Main JavaScript File

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            input.style.borderColor = '#2E8B57';
        }
    });

    return isValid;
}

// Password Strength Checker
function checkPasswordStrength(password) {
    const strength = {
        0: "Très faible",
        1: "Faible",
        2: "Moyen",
        3: "Fort",
        4: "Très fort"
    };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
    if (password.match(/\d/)) score++;
    if (password.match(/[^a-zA-Z\d]/)) score++;

    return {
        score: score,
        text: strength[score]
    };
}

// Dynamic Stats Counter
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize counters when in viewport
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Search Functionality
function performSearch(query) {
    // Implement search logic based on your data structure
    console.log('Searching for:', query);
    // This would typically make an API call to your backend
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Local Storage Helper
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
};

// Theme Toggle (for future dark mode)
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    Storage.set('theme', newTheme);
}

// Initialize theme from storage
function initTheme() {
    const savedTheme = Storage.get('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Responsive Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Form Data Serializer
function serializeForm(form) {
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

// API Helper
const API = {
    baseURL: '/api',
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    get(endpoint) {
        return this.request(endpoint);
    },
    
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    },
    
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    },
    
    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initCounters();
    
    // Add loading states to buttons
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
                
                // Re-enable after 5 seconds (fallback)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Soumettre';
                }, 5000);
            }
        });
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        checkPasswordStrength,
        showNotification,
        Storage,
        API
    };
}