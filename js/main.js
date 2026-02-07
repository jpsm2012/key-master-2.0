// main.js - Premium UI Interactions

document.addEventListener('DOMContentLoaded', () => {
    // Mode Switcher (Video/Audio)
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Update active nav link
                document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Typewriter Effect
    const typewriter = document.querySelector('.typewriter');
    if (typewriter) {
        let typewriterInterval;

        function initTypewriter() {
            const wordsAttr = typewriter.getAttribute('data-words');
            if (wordsAttr) {
                const words = JSON.parse(wordsAttr);
                let wordIndex = 0;
                let charIndex = 0;
                let isDeleting = false;
                let typeSpeed = 100;

                function type() {
                    const currentWord = words[wordIndex];

                    if (isDeleting) {
                        typewriter.textContent = currentWord.substring(0, charIndex - 1);
                        charIndex--;
                        typeSpeed = 50;
                    } else {
                        typewriter.textContent = currentWord.substring(0, charIndex + 1);
                        charIndex++;
                        typeSpeed = 100;
                    }

                    if (!isDeleting && charIndex === currentWord.length) {
                        typeSpeed = 2500; // Pause at end
                        isDeleting = true;
                    } else if (isDeleting && charIndex === 0) {
                        isDeleting = false;
                        wordIndex = (wordIndex + 1) % words.length;
                        typeSpeed = 400;
                    }

                    typewriterInterval = setTimeout(type, typeSpeed);
                }

                // Clear any existing interval
                if (typewriterInterval) {
                    clearTimeout(typewriterInterval);
                }

                setTimeout(type, 1200);
            }
        }

        // Initialize typewriter
        initTypewriter();

        // Restart typewriter when language changes
        window.addEventListener('language-changed', () => {
            if (typewriterInterval) {
                clearTimeout(typewriterInterval);
            }
            typewriter.textContent = '';
            setTimeout(initTypewriter, 100);
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active Nav Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // Parallax effect for orbs and 3D assets
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        // Orbs
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        });

        // 3D Wave
        const wave = document.querySelector('.hero-3d-wave');
        if (wave) {
            wave.style.transform = `scale(1.1) translate(${mouseX * -30}px, ${mouseY * -20}px)`;
        }

        // 3D Notes
        const notes = document.querySelectorAll('.floating-3d-note');
        notes.forEach((note, index) => {
            const speed = (index + 1) * 15;
            // Get current transform to preserve it (requires parsing or just applying translation on top via a wrapper, 
            // but for simplicity we'll just apply translation and assume CSS animation handles the big movement)
            // A better approach for combined CSS animation + JS parallax is using CSS variables
            note.style.setProperty('--parallax-x', `${mouseX * speed}px`);
            note.style.setProperty('--parallax-y', `${mouseY * speed}px`);
        });
    });

    // Tilt Effect for Cards
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Counter Animation for Stats
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const observerOptions = { threshold: 0.5 };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let count = 0;
                const duration = 2000;
                const increment = target / (duration / 16);

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.textContent = Math.floor(count).toLocaleString() + '+';
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = target.toLocaleString() + '+';
                    }
                };

                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // Magnetic Button Effect
    document.querySelectorAll('.cta-button, .convert-btn').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.setProperty('--x', `${x * 0.2}px`);
            button.style.setProperty('--y', `${y * 0.2}px`);
        });

        button.addEventListener('mouseleave', () => {
            button.style.setProperty('--x', '0px');
            button.style.setProperty('--y', '0px');
        });
    });

    // Ripple Effect on Click
    document.querySelectorAll('.cta-button, .convert-btn, .download-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 800);
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
    });

    console.log('✨ Key Master Premium UI Loaded');
});
