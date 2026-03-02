// Smooth scroll for nav and buttons
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href) return;
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Active nav link on scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function updateActiveLink() {
    let currentId = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 120) {
            currentId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (href === `#${currentId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// Typewriter for terminal lines
const typeBlock = document.getElementById('typewriterBlock');
if (typeBlock) {
    const lines = Array.from(typeBlock.querySelectorAll('p:not(.cursor)'));
    const originalTexts = lines.map((line) => line.textContent || '');

    lines.forEach((line) => {
        line.textContent = '';
    });

    function typeLine(lineIndex, charIndex) {
        if (lineIndex >= lines.length) return;

        const text = originalTexts[lineIndex];
        const line = lines[lineIndex];

        if (charIndex <= text.length) {
            line.textContent = text.slice(0, charIndex);
            setTimeout(() => typeLine(lineIndex, charIndex + 1), 26);
            return;
        }

        setTimeout(() => typeLine(lineIndex + 1, 0), 180);
    }

    setTimeout(() => typeLine(0, 0), 260);
}

// Animate skill bars when section enters viewport
const progressBars = document.querySelectorAll('.progress');
let barsAnimated = false;

function animateSkillBars() {
    if (barsAnimated) return;

    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const top = skillsSection.getBoundingClientRect().top;
    if (top > window.innerHeight * 0.8) return;

    progressBars.forEach((bar) => {
        const width = bar.getAttribute('data-width') || '0';
        bar.style.width = `${width}%`;
    });

    barsAnimated = true;
}

window.addEventListener('scroll', animateSkillBars);
animateSkillBars();

// Placeholder logic for future .tgs slots
const tgsHeroSlot = document.getElementById('tgsHeroSlot');
const tgsSectionSlot = document.getElementById('tgsSectionSlot');
const tgsBgSlot = document.querySelector('.tgs-bg-slot');

function markFutureTgsSlot(slotElement, slotName) {
    if (!slotElement) return;
    slotElement.setAttribute('data-tgs-ready', 'true');
    slotElement.setAttribute('title', `${slotName} ready for future .tgs animation`);
}

markFutureTgsSlot(tgsHeroSlot, 'Hero slot');
markFutureTgsSlot(tgsSectionSlot, 'Section slot');
markFutureTgsSlot(tgsBgSlot, 'Background slot');
