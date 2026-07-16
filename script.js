// ============================================
// WM DUO — Complete Interactive Experience
// ============================================

(function() {
    'use strict';

    // ==========================================
    // FOMO NOTIFICATION SYSTEM
    // ==========================================
    const FomoNotifier = {
        notifications: [
            { from: 'New York', name: 'Sarah' },
            { from: 'London', name: 'James' },
            { from: 'Berlin', name: 'Maria' },
            { from: 'Toronto', name: 'Alex' },
            { from: 'Sydney', name: 'Emma' },
            { from: 'Paris', name: 'Lucas' },
            { from: 'Dubai', name: 'Fatima' },
            { from: 'Singapore', name: 'Wei' },
            { from: 'Mumbai', name: 'Priya' },
            { from: 'Los Angeles', name: 'Mike' },
            { from: 'Chicago', name: 'Ashley' },
            { from: 'Amsterdam', name: 'Sophie' },
        ],
        products: ['CastleView™', 'CastleView Mini', 'CastleView Pro', 'CastleView 210°'],
        el: null,
        textEl: null,
        closeEl: null,
        interval: null,

        init: function() {
            this.el = document.getElementById('fomoNotif');
            this.textEl = document.getElementById('fomoText');
            this.closeEl = document.getElementById('fomoClose');

            if (!this.el) return;

            // Close handler
            if (this.closeEl) {
                this.closeEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.hide();
                    setTimeout(() => this.show(), 120000); // 2 min cooldown
                });
            }

            // Start showing notifications after 5 seconds
            setTimeout(() => {
                this.showRandom();
                this.interval = setInterval(() => this.showRandom(), 8000 + Math.random() * 7000);
            }, 5000);
        },

        getRandom: function() {
            const n = this.notifications[Math.floor(Math.random() * this.notifications.length)];
            const p = this.products[Math.floor(Math.random() * this.products.length)];
            return { ...n, product: p };
        },

        showRandom: function() {
            const data = this.getRandom();
            if (this.textEl) {
                this.textEl.textContent = `🔥 ${data.name} from ${data.from} just purchased ${data.product}`;
            }
            this.show();
            setTimeout(() => this.hide(), 5000);
        },

        show: function() {
            if (this.el) this.el.classList.add('show');
        },

        hide: function() {
            if (this.el) this.el.classList.remove('show');
        },

        destroy: function() {
            if (this.interval) clearInterval(this.interval);
        }
    };

    // ==========================================
    // COUNTDOWN TIMER
    // ==========================================
    const CountdownTimer = {
        timerEl: null,
        ctaTimerEl: null,
        endTime: null,

        init: function() {
            this.timerEl = document.getElementById('countdownTimer');
            this.ctaTimerEl = document.getElementById('ctaTimer');

            // Set countdown: 4 hours from now
            this.endTime = new Date();
            this.endTime.setHours(this.endTime.getHours() + 4);
            this.endTime.setMinutes(this.endTime.getMinutes() + 37);

            this.tick();
            setInterval(() => this.tick(), 1000);
        },

        tick: function() {
            const now = new Date();
            const diff = Math.max(0, Math.floor((this.endTime - now) / 1000));

            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;

            const str = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

            if (this.timerEl) this.timerEl.textContent = str;
            if (this.ctaTimerEl) {
                const strong = this.ctaTimerEl.querySelector('strong');
                if (strong) strong.textContent = str;
            }
        }
    };

    // ==========================================
    // STOCK INDICATOR
    // ==========================================
    const StockIndicator = {
        el: null,
        fillEl: null,
        textEl: null,
        ctaStockEl: null,
        currentStock: 7,

        init: function() {
            this.fillEl = document.getElementById('stockFill');
            this.textEl = document.getElementById('stockText');
            this.ctaStockEl = document.getElementById('ctaStock');

            // Randomize initial stock between 3-12
            this.currentStock = Math.floor(Math.random() * 10) + 3;

            // Occasionally decrease stock
            setInterval(() => {
                if (this.currentStock > 1 && Math.random() > 0.6) {
                    this.currentStock--;
                    this.updateDisplay();
                }
            }, 45000); // every 45 seconds
        },

        updateDisplay: function() {
            const pct = Math.min(100, (this.currentStock / 15) * 100);
            if (this.fillEl) this.fillEl.style.width = pct + '%';

            const msg = this.currentStock <= 3
                ? `🚨 Only ${this.currentStock} left — Almost gone!`
                : `⚠️ Only ${this.currentStock} left in stock — Order now`;

            if (this.textEl) this.textEl.textContent = msg;
            if (this.ctaStockEl) this.ctaStockEl.textContent = msg;
        }
    };

    // ==========================================
    // LIVE SOLD COUNTER
    // ==========================================
    const SoldCounter = {
        el: null,
        count: 48,

        init: function() {
            this.el = document.getElementById('ctaSold');
            // Random bump every 30-90 seconds
            setInterval(() => {
                if (Math.random() > 0.5) {
                    const bump = Math.floor(Math.random() * 3) + 1;
                    this.count += bump;
                    if (this.el) {
                        this.el.textContent = `🔥 ${this.count} people bought this today`;
                    }
                }
            }, 30000 + Math.random() * 60000);
        }
    };

    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    const FAQ = {
        init: function() {
            document.querySelectorAll('.faq-question').forEach(btn => {
                btn.addEventListener('click', () => {
                    const expanded = btn.getAttribute('aria-expanded') === 'true';
                    // Close all
                    document.querySelectorAll('.faq-question').forEach(q => {
                        q.setAttribute('aria-expanded', 'false');
                        q.nextElementSibling.classList.remove('open');
                    });
                    // Toggle clicked
                    if (!expanded) {
                        btn.setAttribute('aria-expanded', 'true');
                        btn.nextElementSibling.classList.add('open');
                    }
                });
            });
        }
    };

    // ==========================================
    // NAVBAR — SCROLL + MOBILE
    // ==========================================
    const Navbar = {
        el: null,
        toggleEl: null,
        linksEl: null,

        init: function() {
            this.el = document.getElementById('navbar');
            this.toggleEl = document.getElementById('navToggle');
            this.linksEl = document.getElementById('navLinks');

            // Scroll effect
            window.addEventListener('scroll', () => {
                if (this.el) {
                    this.el.classList.toggle('scrolled', window.scrollY > 50);
                }
            });

            // Mobile toggle
            if (this.toggleEl && this.linksEl) {
                this.toggleEl.addEventListener('click', () => {
                    this.linksEl.classList.toggle('active');
                });

                // Close on link click
                this.linksEl.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        this.linksEl.classList.remove('active');
                    });
                });
            }

            // Adjust for top bar height
            this.adjustForTopBar();
            window.addEventListener('resize', () => this.adjustForTopBar());
        },

        adjustForTopBar: function() {
            const topBar = document.querySelector('.top-bar');
            if (topBar) {
                document.body.classList.add('has-top-bar');
            }
        }
    };

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const ScrollReveal = {
        init: function() {
            const elements = document.querySelectorAll(
                '.section-header, .product-card, .feature-card, .review-card, ' +
                '.pd-grid > *, .specs-table, .ps-grid, .faq-list, ' +
                '.guarantee-card, .cta-card, .newsletter-card, ' +
                '.about-content, .about-visual, .reviews-summary'
            );

            // Add reveal class
            elements.forEach(el => el.classList.add('reveal'));

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            elements.forEach(el => observer.observe(el));
        }
    };

    // ==========================================
    // NEWSLETTER FORM
    // ==========================================
    const NewsletterForm = {
        init: function() {
            const form = document.getElementById('newsletterForm');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector('input[type="email"]');
                const email = input.value.trim();

                if (email) {
                    // Show success
                    const btn = form.querySelector('button');
                    const originalText = btn.textContent;
                    btn.textContent = '✅ Subscribed!';
                    btn.style.pointerEvents = 'none';

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.pointerEvents = '';
                        form.reset();
                    }, 3000);
                }
            });
        }
    };

    // ==========================================
    // CONTACT FORM
    // ==========================================
    const ContactForm = {
        init: function() {
            const form = document.getElementById('contactForm');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = '✅ Message Sent!';
                btn.style.pointerEvents = 'none';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.pointerEvents = '';
                    form.reset();
                }, 3000);
            });
        }
    };

    // ==========================================
    // WHATSAPP FLOAT — scroll hide
    // ==========================================
    const WhatsAppFloat = {
        init: function() {
            const wa = document.querySelector('.whatsapp-float');
            if (!wa) return;

            let lastScroll = 0;
            window.addEventListener('scroll', () => {
                const currentScroll = window.scrollY;
                if (currentScroll > lastScroll && currentScroll > 300) {
                    wa.style.transform = 'translateY(80px)';
                } else {
                    wa.style.transform = '';
                }
                lastScroll = currentScroll;
            });
        }
    };

    // ==========================================
    // SMOOTH SCROLL for anchor links with offset
    // ==========================================
    const SmoothScroll = {
        init: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href === '#') return;
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const topBar = document.querySelector('.top-bar');
                        const offset = topBar ? topBar.offsetHeight + 70 : 70;
                        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                });
            });
        }
    };

    // ==========================================
    // INIT ALL
    // ==========================================
    document.addEventListener('DOMContentLoaded', function() {
        FomoNotifier.init();
        CountdownTimer.init();
        StockIndicator.init();
        SoldCounter.init();
        FAQ.init();
        Navbar.init();
        ScrollReveal.init();
        NewsletterForm.init();
        ContactForm.init();
        WhatsAppFloat.init();
        SmoothScroll.init();

        console.log('🚀 WM Duo — All systems initialized');
    });

})();
