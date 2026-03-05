/**
 * HomeView
 * @author Norton 2022
 */
import { router } from "../router.js";

 class NavView {

    constructor() {
    }

    async render(context) {

        context.indexActive = 'active';

        if (!this.navTemplate) {
            this.navTemplate = await getTemplate('/app/views/templates/navbar.hbs');
        } 

        if (!this.footerTemplate) {
            this.footerTemplate = await getTemplate('/app/views/templates/footer.hbs');
        } 

        this.nav = document.getElementById('nav');
        this.nav.innerHTML = this.navTemplate(context)

        this.foot = document.getElementById('foot');
        this.foot.innerHTML = this.footerTemplate(context);

        router.setRouteLinks(this.nav, this.foot);

        const navLinks = document.querySelectorAll('.nav-item:not(.dropdown), .dropdown-item');
        const menuToggle = document.getElementById('navbarNavDropdown');
        const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle:false});

        navLinks.forEach((l) => {
            l.addEventListener('click', () => { 
                if (menuToggle.classList.contains('show')) bsCollapse.toggle();
            })
        })

        document.title = `CoinBaseCamp Trader App`;
        window.scrollTo(0,0);
    }

    setupNewsletterForm() {
        const newsletterForm = document.getElementById('newsletterForm');
        const emailInput = document.getElementById('newsletterEmail');
        const submitBtn = document.getElementById('btnSubmitNewsletterForm');

        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput?.value?.trim();
            if (!email) {
                this.showNewsletterMessage('Please enter your email address.', 'error');
                return;
            }

            // Disable button and show loading state
            submitBtn.disabled = true;
            const icon = submitBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-spinner fa-spin me-1';
            }

            try {
                const response = await api.post(endpoints.newsletterSubscribe(), {
                    email: email,
                    source: 'footer'
                });

                if (response.success) {
                    this.showNewsletterMessage(response.message, 'success');
                    emailInput.value = '';
                } else {
                    this.showNewsletterMessage(response.message || 'Subscription failed.', 'error');
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                // Try to parse error message
                let errorMsg = 'Failed to subscribe. Please try again.';
                if (error.message) {
                    errorMsg = error.message;
                }
                this.showNewsletterMessage(errorMsg, 'error');
            } finally {
                submitBtn.disabled = false;
                if (icon) {
                    icon.className = 'fas fa-paper-plane me-1';
                }
            }
        });
    }
    
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value?.trim();
            const email = document.getElementById('email')?.value?.trim();
            const subject = document.getElementById('subject')?.value?.trim();
            const message = document.getElementById('message')?.value?.trim();
            
            if (!email || !message) {
                this.showContactMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Disable submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                const icon = submitBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-spinner fa-spin me-2';
            }
            
            try {
                const response = await api.post(endpoints.contact(), {
                    name,
                    email,
                    subject,
                    message
                });
                
                if (response.success) {
                    this.showContactMessage(response.message || 'Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    this.showContactMessage(response.error || 'Failed to send message.', 'error');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                this.showContactMessage(error.message || 'Failed to send message. Please try again.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    const icon = submitBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-paper-plane me-2';
                }
            }
        });
    }
    
    showContactMessage(message, type) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: type === 'success' ? 'Message Sent!' : 'Oops...',
                text: message,
                icon: type === 'success' ? 'success' : 'error',
                confirmButtonColor: '#667eea',
                timer: type === 'success' ? 4000 : undefined,
                timerProgressBar: true
            });
        } else {
            alert(message);
        }
    }

    showNewsletterMessage(message, type) {
        // Use SweetAlert2 if available, otherwise fallback to alert
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: type === 'success' ? 'Success!' : 'Oops...',
                text: message,
                icon: type === 'success' ? 'success' : 'error',
                confirmButtonColor: '#667eea',
                timer: type === 'success' ? 3000 : undefined,
                timerProgressBar: true
            });
        } else {
            alert(message);
        }
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        // Check saved preference or default to light
        const savedTheme = localStorage.getItem('lsb-theme') || 'light';
        this.applyTheme(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
            localStorage.setItem('lsb-theme', newTheme);
            
            // Update image rotators if theme-aware
            this.updateRotatorsForTheme(newTheme);
        });
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        
        // Update toggle button appearance
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.classList.toggle('active', theme === 'dark');
        }
    }
    
    updateRotatorsForTheme(theme) {
        // Dispatch theme change event for all theme-aware components
        // The imageRotator listens for this to switch between light/dark image sets
        const event = new CustomEvent('lsb-theme-change', { detail: { theme } });
        window.dispatchEvent(event);
        console.log('[Theme] Dispatched lsb-theme-change event:', theme);
    }
    
    setupCartButton() {
        const navCartBtn = document.getElementById('navCartBtn');
        if (!navCartBtn) return;
        
        navCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Dispatch cart toggle event that store/shop pages listen for
            const event = new CustomEvent('lsb-cart-toggle', { detail: { source: 'navbar' } });
            window.dispatchEvent(event);
        });
        
        // Update cart badge when cart changes
        window.addEventListener('lsb-cart-updated', (e) => {
            const badge = document.getElementById('navCartBadge');
            const cartCount = e.detail?.count || 0;
            if (badge) {
                if (cartCount > 0) {
                    badge.textContent = cartCount;
                    badge.style.display = 'block';
                } else {
                    badge.style.display = 'none';
                }
            }
        });
    }

}

export { NavView };