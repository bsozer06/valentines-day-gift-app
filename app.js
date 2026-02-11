// ==================== UYGULAMA JAVASCRIPT ====================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    createFloatingHearts();
    setupIntroButton();
    renderTimeline();
    renderReasons();
    setupMusicPlayer();
    setupNavigationButtons();
}

// ==================== FLOATING HEARTS ====================
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝'];
    
    // İlk yüklemede birkaç kalp oluştur
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createHeart(container, hearts), i * 500);
    }
    
    // Sürekli yeni kalpler oluştur
    setInterval(() => createHeart(container, hearts), 800);
}

function createHeart(container, hearts) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
    heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(heart);
    
    // Animasyon bitince kalbi kaldır
    setTimeout(() => heart.remove(), 12000);
}

// ==================== INTRO BUTTON ====================
function setupIntroButton() {
    const startBtn = document.getElementById('startBtn');
    
    startBtn.addEventListener('click', () => {
        // Buton animasyonu
        startBtn.classList.add('animate__animated', 'animate__pulse');
        
        setTimeout(() => {
            navigateToSection('timeline');
        }, 500);
    });
}

// ==================== TIMELINE ====================
function renderTimeline() {
    const container = document.getElementById('timelineContainer');
    
    DATA.timeline.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <span class="timeline-date">${item.date}</span>
                <h3 class="timeline-title">${item.title}</h3>
                <p class="timeline-text">${item.text}</p>
                <img src="${item.image}" alt="${item.title}" class="timeline-image">
            </div>
            <div class="timeline-dot"></div>
        `;
        
        container.appendChild(timelineItem);
        
        // Gecikmeli görünürlük
        setTimeout(() => {
            timelineItem.classList.add('visible');
        }, 300);
    });
}

// ==================== REASONS ====================
function renderReasons() {
    const container = document.getElementById('reasonsContainer');
    
    DATA.reasons.forEach((reason, index) => {
        const card = document.createElement('div');
        card.className = 'reason-card animate__animated';
        card.innerHTML = `
            <span class="reason-icon">${reason.icon}</span>
            <h3 class="reason-title">${reason.title}</h3>
            <p class="reason-text">${reason.text}</p>
        `;
        
        // Hover efekti için tıklama desteği (mobil için)
        card.addEventListener('click', () => {
            card.classList.toggle('active');
        });
        
        container.appendChild(card);
    });
}

// ==================== MUSIC PLAYER ====================
function setupMusicPlayer() {
    const playBtn = document.getElementById('playBtn');
    const progress = document.getElementById('musicProgress');
    const albumCover = document.querySelector('.album-cover');
    const currentTimeEl = document.querySelector('.time.current');
    
    let isPlaying = false;
    let progressInterval;
    let currentProgress = 0;
    const totalDuration = 225; // 3:45 in seconds
    
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            playBtn.textContent = '⏸';
            albumCover.classList.add('playing');
            
            // Progress animasyonu
            progressInterval = setInterval(() => {
                if (currentProgress < 100) {
                    currentProgress += 0.1;
                    progress.style.width = currentProgress + '%';
                    
                    // Zaman güncelle
                    const currentSeconds = Math.floor((currentProgress / 100) * totalDuration);
                    const minutes = Math.floor(currentSeconds / 60);
                    const seconds = currentSeconds % 60;
                    currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                } else {
                    clearInterval(progressInterval);
                    isPlaying = false;
                    playBtn.textContent = '▶';
                    albumCover.classList.remove('playing');
                    currentProgress = 0;
                    progress.style.width = '0%';
                    currentTimeEl.textContent = '0:00';
                }
            }, 100);
        } else {
            playBtn.textContent = '▶';
            albumCover.classList.remove('playing');
            clearInterval(progressInterval);
        }
    });
    
    // Progress bar tıklama
    document.querySelector('.progress-bar').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        currentProgress = clickPosition * 100;
        progress.style.width = currentProgress + '%';
        
        const currentSeconds = Math.floor(clickPosition * totalDuration);
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });
}

// ==================== NAVIGATION ====================
function setupNavigationButtons() {
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextSection = btn.dataset.next;
            navigateToSection(nextSection);
        });
    });
}

function navigateToSection(sectionId) {
    // Mevcut aktif section'ı gizle
    document.querySelector('.section.active').classList.remove('active');
    
    // Yeni section'ı göster
    const newSection = document.getElementById(sectionId);
    newSection.classList.add('active');
    
    // Section'a özel animasyonlar
    animateSectionElements(sectionId);
    
    // Mektup section'ı ise daktilo efektini başlat
    if (sectionId === 'letter') {
        setTimeout(() => typewriterEffect(), 500);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function animateSectionElements(sectionId) {
    const section = document.getElementById(sectionId);
    const header = section.querySelector('.section-header');
    
    if (header) {
        header.classList.add('animate__fadeInDown');
    }
    
    // Timeline items animasyonu
    if (sectionId === 'timeline') {
        const items = section.querySelectorAll('.timeline-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 200);
        });
    }
    
    // Reason cards animasyonu
    if (sectionId === 'reasons') {
        const cards = section.querySelectorAll('.reason-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate__fadeInUp');
            }, index * 100);
        });
    }
}

// ==================== TYPEWRITER EFFECT ====================
function typewriterEffect() {
    const letterContent = document.getElementById('letterContent');
    const text = DATA.letter;
    let index = 0;
    
    letterContent.innerHTML = '<span class="cursor"></span>';
    
    function type() {
        if (index < text.length) {
            const char = text.charAt(index);
            
            // Yeni satır kontrolü
            if (char === '\n') {
                letterContent.innerHTML = letterContent.innerHTML.replace('<span class="cursor"></span>', '') + 
                    '<br><span class="cursor"></span>';
            } else {
                letterContent.innerHTML = letterContent.innerHTML.replace('<span class="cursor"></span>', '') + 
                    char + '<span class="cursor"></span>';
            }
            
            index++;
            
            // Yazma hızı - nokta ve virgülde daha yavaş
            let delay = 30;
            if (char === '.' || char === ',' || char === '!' || char === '?') {
                delay = 150;
            } else if (char === '\n') {
                delay = 300;
            }
            
            setTimeout(type, delay);
        } else {
            // Yazma bitince cursor'u kaldır ve final mesajını göster
            setTimeout(() => {
                letterContent.innerHTML = letterContent.innerHTML.replace('<span class="cursor"></span>', '');
                showFinalMessage();
            }, 500);
        }
    }
    
    // Biraz gecikmeyle başla
    setTimeout(type, 1000);
}

// ==================== FINAL MESSAGE ====================
function showFinalMessage() {
    const finalMessage = document.getElementById('finalMessage');
    finalMessage.classList.add('visible');
    
    // Kalp patlaması efekti
    const heartBurst = document.getElementById('heartBurst');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝', '💞', '💟'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('span');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                font-size: ${Math.random() * 30 + 20}px;
                animation: burstHeart 2s ease-out forwards;
                --tx: ${(Math.random() - 0.5) * 400}px;
                --ty: ${(Math.random() - 0.5) * 400}px;
            `;
            heartBurst.appendChild(heart);
            
            setTimeout(() => heart.remove(), 2000);
        }, i * 50);
    }
    
    // Kalp patlaması animasyonunu CSS'e ekle (dinamik)
    if (!document.getElementById('burstAnimation')) {
        const style = document.createElement('style');
        style.id = 'burstAnimation';
        style.textContent = `
            @keyframes burstHeart {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Smooth scroll polyfill için basit bir fallback
if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}
