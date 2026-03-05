/**
 * Life.Science.Balance Image Rotator
 * Handles rotating images for branding elements
 * @author Norton with Co-Pilot doing the heavy lifting! 2025-2026
 */

export class ImageRotator {
    constructor() {
        // Image sets organized by type and use case
        this.imageSets = {
            // === LSB BRAND (Primary) ===
            // Silver logos - good for icons, avatars, small displays
            lsbSilver: this.generateSet('/app/public/images/lsb/lsb_silver', '.png', 1, 5),
            
            // Wide high-res PNGs - BEST for hero banners and backgrounds (1536x768)
            lsbWide: this.generateSet('/app/public/images/lsb/lsb_wide_electric', '.png', 1, 13),
            lsbDarkWide: this.generateSet('/app/public/images/lsb/lsb_dark_wide_electric', '.png', 1, 6),
            
            // Wide animated GIFs - smaller resolution (320x160), good for accents
            lsbWideLightGif: this.generateSet('/app/public/images/lsb/lsb_wide_light_electric', '.gif', 1, 16),
            lsbWideDarkGif: this.generateSet('/app/public/images/lsb/lsb_wide_dark_electric', '.gif', 1, 16),
            
            // Life animated GIFs (root of images/ — no vendor subdir)
            life: this.generateSet('/app/public/images/life_', '.gif', 1, 3),
            
            // === QUIZZAP BRAND (Legacy/Secondary) ===
            quizzapLife: this.generateSet('/app/public/images/quizzap/quizzap_life', '.png', 1, 13),
            quizzapWide: this.generateSet('/app/public/images/quizzap/quizzap_white', '.png', 1, 18),
            quizzapBrilliance: this.generateSet('/app/public/images/quizzap/quizzap_brilliance_', '.png', 1, 7),
            quizzapFeaturing: this.generateSet('/app/public/images/quizzap/quizzap_featuring', '.png', 1, 15),
            quizzapNorton: this.generateSet('/app/public/images/quizzap/quizzap_norton', '.png', 1, 9),
            
            // === BMW BRAND (Balanced Mind Wellness) ===
            bmwLogo: [
                '/app/public/images/bmw/BMW-logo-3.webp',
                '/app/public/images/bmw/BMW-brain.png',
                '/app/public/images/bmw/BMW-brain-image-side.webp'
            ],
            bmwWide: [
                '/app/public/images/bmw/BMW-logo-3.webp',
                '/app/public/images/bmw/BMW-spice-bottles.webp',
                '/app/public/images/bmw/BMW-e4l-logo-white-scaled.webp'
            ],
            
            // === TDA BRAND (True DNA Story) ===
            tdaLogo: [
                '/app/public/images/tda/tda_logo.png',
                '/app/public/images/tda/tda1.png',
                '/app/public/images/tda/tda2.png'
            ],
            tdaWide: this.generateSet('/app/public/images/tda/tda', '.png', 1, 4),
        };
        
        this.activeRotators = new Map();
    }

    /**
     * Generate array of image paths
     */
    generateSet(prefix, ext, start, end) {
        const images = [];
        for (let i = start; i <= end; i++) {
            images.push(`${prefix}${i}${ext}`);
        }
        return images;
    }

    /**
     * Get random image from a set
     */
    getRandomImage(setName) {
        const set = this.imageSets[setName];
        if (!set || set.length === 0) return null;
        return set[Math.floor(Math.random() * set.length)];
    }

    /**
     * Start rotating images on an element
     */
    startRotation(element, setName, interval = 5000, transition = 'fade') {
        if (!element || !this.imageSets[setName]) return;

        const id = `rotator_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        element.dataset.rotatorId = id;

        const set = this.imageSets[setName];
        let currentIndex = 0;

        // Apply initial image
        this.setImage(element, set[currentIndex], transition);

        // Start rotation
        const rotatorInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % set.length;
            this.setImage(element, set[currentIndex], transition);
        }, interval);

        this.activeRotators.set(id, {
            interval: rotatorInterval,
            element,
            setName
        });

        return id;
    }

    /**
     * Set image with transition effect
     */
    setImage(element, src, transition) {
        if (element.tagName === 'IMG') {
            if (transition === 'fade') {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.src = src;
                    element.style.opacity = '1';
                }, 300);
            } else {
                element.src = src;
            }
        } else {
            // Background image
            if (transition === 'fade') {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.backgroundImage = `url('${src}')`;
                    element.style.opacity = '1';
                }, 300);
            } else {
                element.style.backgroundImage = `url('${src}')`;
            }
        }
    }

    /**
     * Stop rotation for a specific element
     */
    stopRotation(id) {
        const rotator = this.activeRotators.get(id);
        if (rotator) {
            clearInterval(rotator.interval);
            this.activeRotators.delete(id);
        }
    }

    /**
     * Stop all active rotations
     */
    stopAll() {
        this.activeRotators.forEach((rotator, id) => {
            clearInterval(rotator.interval);
        });
        this.activeRotators.clear();
    }

    /**
     * Initialize rotators based on data attributes
     * Use: <img data-lsb-rotator="life" data-interval="3000">
     * Available sets: life, lsbSilver, lsbWide, lsbDarkWide, lsbWideLightGif, lsbWideDarkGif
     * 
     * Theme-aware sets: Use data-lsb-rotator-dark="setName" to specify a dark theme alternative
     */
    autoInit() {
        document.querySelectorAll('[data-lsb-rotator]').forEach(el => {
            const setName = el.dataset.lsbRotator;
            const interval = parseInt(el.dataset.interval) || 5000;
            const transition = el.dataset.transition || 'fade';
            this.startRotation(el, setName, interval, transition);
        });
        
        // Listen for theme changes to switch rotator image sets
        window.addEventListener('lsb-theme-change', (e) => {
            this.handleThemeChange(e.detail.theme);
        });
    }
    
    /**
     * Handle theme change - switch image sets for theme-aware rotators
     */
    handleThemeChange(theme) {
        document.querySelectorAll('[data-lsb-rotator]').forEach(el => {
            const lightSet = el.dataset.lsbRotator;
            const darkSet = el.dataset.lsbRotatorDark;
            
            if (darkSet) {
                // This element has theme-specific sets
                const rotatorId = el.dataset.rotatorId;
                if (rotatorId) {
                    this.stopRotation(rotatorId);
                }
                
                const setName = theme === 'dark' ? darkSet : lightSet;
                const interval = parseInt(el.dataset.interval) || 5000;
                const transition = el.dataset.transition || 'fade';
                this.startRotation(el, setName, interval, transition);
            }
        });
    }
}

// Global instance
export const imageRotator = new ImageRotator();

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        imageRotator.autoInit();
    });
}
