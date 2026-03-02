// === SMOOTH SCROLL AND NAVIGATION ===
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

// === HERO BUTTONS ===
const aboutMeBtn = document.querySelector('.btn-secondary');
if (aboutMeBtn) {
    aboutMeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// === MOUSE FOLLOWING EFFECT ===
const mouseFollower = () => {
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Optional: Add a following element effect
    const particles = document.querySelectorAll('.particle');
    setInterval(() => {
        particles.forEach((particle, index) => {
            const rect = particle.getBoundingClientRect();
            const targetX = mouseX + (Math.random() - 0.5) * 200;
            const targetY = mouseY + (Math.random() - 0.5) * 200;
            
            // Мягкое движение частиц
            particle.style.transform = `translate(${(mouseX - rect.left) * 0.05}px, ${(mouseY - rect.top) * 0.05}px)`;
        });
    }, 50);
};

mouseFollower();

// === GLITCH EFFECT ON HOVER ===
const glitchText = document.querySelector('.glitch');
if (glitchText) {
    glitchText.addEventListener('mouseover', function() {
        this.style.animation = 'glitch 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 3';
    });
}

// === SKILL PROGRESS ON SCROLL ===
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.querySelector('.progress');
            if (progress && !progress.classList.contains('animated')) {
                progress.classList.add('animated');
                const width = progress.style.width;
                progress.style.width = '0';
                setTimeout(() => {
                    progress.style.width = width;
                }, 100);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-box').forEach(box => {
    observer.observe(box);
});

// === GAME MODAL ===
let gameScore = 0;
let gameActive = false;
let gameInterval = null;

const modal = document.getElementById('gameModal');
const closeBtn = document.querySelector('.close');
const gameContainer = document.getElementById('gameContainer');
const gameScoreDisplay = document.getElementById('gameScore');

// Explore button triggers game
const exploreBtn = document.querySelector('.btn-primary');
if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
        startGame();
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        endGame();
    });
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        endGame();
    }
});

// === SIMPLE PARTICLE GAME ===
function startGame() {
    gameScore = 0;
    gameActive = true;
    gameContainer.innerHTML = '';
    gameScoreDisplay.textContent = 'Score: 0';
    
    // Clear any existing intervals
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    
    function createParticle() {
        if (!gameActive || !gameContainer.offsetParent) return;
        
        const particle = document.createElement('div');
        const hue = Math.random() * 360;
        const size = 15 + Math.random() * 15;
        
        particle.style.position = 'absolute';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.borderRadius = '50%';
        particle.style.background = `hsl(${hue}, 100%, 50%)`;
        particle.style.cursor = 'pointer';
        particle.style.boxShadow = `0 0 ${size}px hsl(${hue}, 100%, 50%)`;
        particle.style.zIndex = '10';
        particle.style.left = (Math.random() * (gameContainer.clientWidth - size)) + 'px';
        particle.style.top = (Math.random() * (gameContainer.clientHeight - size)) + 'px';
        particle.style.transition = 'all 0.3s ease';
        particle.style.userSelect = 'none';
        
        gameContainer.appendChild(particle);
        
        particle.addEventListener('click', (e) => {
            e.stopPropagation();
            gameScore++;
            gameScoreDisplay.textContent = 'Score: ' + gameScore;
            
            // Burst effect
            particle.style.transform = 'scale(0)';
            particle.style.opacity = '0';
            
            setTimeout(() => {
                if (particle.parentElement) {
                    particle.remove();
                }
            }, 300);
        });
        
        // Hover effect
        particle.addEventListener('mouseenter', () => {
            particle.style.transform = 'scale(1.2)';
            particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, 100%, 50%)`;
        });
        
        particle.addEventListener('mouseleave', () => {
            particle.style.transform = 'scale(1)';
            particle.style.boxShadow = `0 0 ${size}px hsl(${hue}, 100%, 50%)`;
        });
        
        // Remove particle after 4 seconds if not clicked
        setTimeout(() => {
            if (particle.parentElement && gameActive) {
                particle.style.transform = 'scale(0)';
                particle.style.opacity = '0';
                setTimeout(() => {
                    if (particle.parentElement) {
                        particle.remove();
                    }
                }, 300);
            }
        }, 4000);
    }
    
    // Create particles every 600ms
    gameInterval = setInterval(() => {
        if (gameActive) {
            createParticle();
        }
    }, 600);
}

function endGame() {
    gameActive = false;
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    gameContainer.innerHTML = '';
}

// === KEYBOARD NAVIGATION ===
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        gameActive = false;
    }
});

// === PARALLAX EFFECT ===
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        const speed = 0.5 + index * 0.1;
        particle.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// === ACTIVE NAV LINK ON SCROLL ===
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('.section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = '#00D9FF';
            link.style.textShadow = '0 0 10px #00D9FF';
        } else {
            link.style.color = '';
            link.style.textShadow = '';
        }
    });
});

// === TEXT TYPEWRITER EFFECT ===
function typewriterEffect(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    const type = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    };
    
    type();
}

// Apply typewriter effect to terminal
const terminalContent = document.querySelector('.terminal-content');
if (terminalContent) {
    const lines = terminalContent.querySelectorAll('p');
    lines.forEach((line, i) => {
        if (i < lines.length - 1) {
            const text = line.textContent;
            line.textContent = '';
            setTimeout(() => {
                typewriterEffect(line, text, 30);
            }, i * 500);
        }
    });
}

// === CLICK PARTICLES EFFECT ===
document.addEventListener('click', (e) => {
    // Skip if clicking on interactive elements
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const clickParticle = document.createElement('div');
    clickParticle.style.position = 'fixed';
    clickParticle.style.left = e.clientX + 'px';
    clickParticle.style.top = e.clientY + 'px';
    clickParticle.style.width = '10px';
    clickParticle.style.height = '10px';
    clickParticle.style.borderRadius = '50%';
    clickParticle.style.background = '#00D9FF';
    clickParticle.style.pointerEvents = 'none';
    clickParticle.style.zIndex = '9999';
    clickParticle.style.boxShadow = '0 0 10px #00D9FF';
    clickParticle.style.animation = 'clickPop 0.6s ease-out forwards';
    
    document.body.appendChild(clickParticle);
    
    setTimeout(() => clickParticle.remove(), 600);
});

// Add click pop animation
const style = document.createElement('style');
style.textContent = `
    @keyframes clickPop {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(3) translateY(-30px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// === PAGE LOAD ANIMATION ===
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// === CONSOLE EASTER EGG ===
console.log('%c🎉 Welcome to Retro Site! 🎉', 'font-size: 20px; color: #00D9FF; text-shadow: 0 0 10px #00D9FF;');
console.log('%cFor more info, check the source code or reach out on social media!', 'color: #FFBE0B; font-size: 14px;');
console.log('%c', 'background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAKPC9zdmc+"); background-repeat: no-repeat; width:400px; height:100px;');
