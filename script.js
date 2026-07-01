/**
 * PROJECT: ECLIPSE - Reconstructed Smooth Logics with Particle Engine
 * Developer: Fatima Ibrahim (2026)
 */

document.addEventListener("DOMContentLoaded", () => {

    // تشغيل فوري ناعم لمكتبة الحركات التفاعلية AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 900,
            once: true,
            offset: 80,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
    }

    // إعدادات الماوس الزجاجي التفاعلي والضوء الخلفي (Lights Effect)
    const customCursor = document.getElementById("customCursor");
    const mouseGlow = document.getElementById("mouseGlow");
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // استخدام تدميج حركة ذكي (Lerp / Smooth Interpolation) لإعطاء الماوس تأثير فيزيائي ناعم جداً ومبلور
    function renderCursor() {
        // سلاسة حركة الماوس الدائري
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        if (customCursor) {
            customCursor.style.left = `${cursorX}px`;
            customCursor.style.top = `${cursorY}px`;
        }

        // سلاسة لحاق كشاف الضوء الخلفي (Light Effect)
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        if (mouseGlow) {
            mouseGlow.style.left = `${glowX}px`;
            mouseGlow.style.top = `${glowY}px`;
        }

        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // جعل الماوس الزجاجي يتفاعل بالتكبير والتوهج عند الاقتراب من العناصر القابلة للضغط
    const interactiveElements = document.querySelectorAll("a, button, .project-row, .cert-card, .contact-icon");
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            if (customCursor) customCursor.classList.add("hovered");
        });
        el.addEventListener("mouseleave", () => {
            if (customCursor) customCursor.classList.remove("hovered");
        });
    });


    // ==========================================================================
    // محرك الجزيئات البيضاء العائمة المتحركة والتفاعلية (White Floating Particles)
    // ==========================================================================
    const canvas = document.getElementById("particlesCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particlesArray = [];
        const numberOfParticles = window.innerWidth < 600 ? 35 : 80;

        // ضبط أبعاد الـ Canvas
        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        setCanvasSize();
        window.addEventListener("resize", setCanvasSize);

        // بناء كائن الجزيء المفرد
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;

                let dx = mouseX - this.x;
                let dy = mouseY - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    this.x -= dx * 0.02;
                    this.y -= dy * 0.02;
                }
            }

            draw() {
                ctx.save();
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = "#ffffff";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        initParticles();

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(particle => {
                particle.update();
                particle.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================================================
    // مراقبة شريط التنقل وتحديث خط القراءة
    // ==========================================================================
    const navbar = document.querySelector(".navbar");
    const progressBar = document.querySelector(".scroll-progress");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (totalHeight > 0) {
            progressBar.style.width = (scrollTop / totalHeight) * 100 + "%";
        }

        if (scrollTop > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 130;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + section.offsetHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
});

// فتح وإغلاق كروت المشاريع (الأكورديون)
function toggleProject(projectId) {
    const detailBox = document.getElementById(projectId);
    const icon = document.getElementById("icon-" + projectId);
    
    if (!detailBox || !icon) return;

    if (detailBox.classList.contains("open")) {
        detailBox.classList.remove("open");
        icon.style.transform = "rotate(0deg)";
    } else {
        document.querySelectorAll(".project-details.open").forEach(openBox => {
            openBox.classList.remove("open");
            const openId = openBox.getAttribute("id");
            const targetIcon = document.getElementById("icon-" + openId);
            if (targetIcon) targetIcon.style.transform = "rotate(0deg)";
        });

        detailBox.classList.add("open");
        icon.style.transform = "rotate(45deg)";
    }
}

// قلب كروت الشهادات عند الضغط
function flipCard(cardElement) {
    if (cardElement) {
        cardElement.classList.toggle("flipped");
    }
}
