// =========== TECHNOLOGY ANIMATED BACKGROUND ===========
const canvas = document.getElementById('tech-bg-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth, height = window.innerHeight;
let particles = [];
let lines = [];

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Particle system (glowing blue/teal dots)
function createParticles() {
    particles = [];
    for(let i=0; i<70; i++) {
        particles.push({
            x: Math.random()*width,
            y: Math.random()*height,
            r: Math.random()*2 + 1.7,
            dx: (Math.random()-0.5)*0.7,
            dy: (Math.random()-0.5)*0.5,
            g: Math.random()*0.5+0.5
        });
    }
}
// Lines that connect some particles
function createLines() {
    lines = [];
    for(let i=0; i<26; i++) {
        let a = Math.floor(Math.random()*particles.length);
        let b = Math.floor(Math.random()*particles.length);
        if(a!==b) lines.push([a,b]);
    }
}

function animateBg() {
    ctx.clearRect(0, 0, width, height);
    // draw lines
    for(const [i,j] of lines) {
        let p1 = particles[i], p2 = particles[j];
        let dx = p1.x-p2.x, dy = p1.y-p2.y;
        let dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 200) {
            ctx.save();
            ctx.strokeStyle = `rgba(89,234,255,${0.18 + 0.17*Math.cos(Date.now()/900 + i)})`;
            ctx.shadowColor = "#59eaff";
            ctx.shadowBlur = 10;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
        }
    }
    // draw glowing particles
    for(const p of particles) {
        ctx.save();
        let gradient = ctx.createRadialGradient(p.x, p.y, p.r/5, p.x, p.y, p.r*3.5);
        gradient.addColorStop(0, "#00eaff");
        gradient.addColorStop(0.45, "#59eaff");
        gradient.addColorStop(0.85, "rgba(0,255,156,0.23)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r*3.5, 0, Math.PI*2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = p.g;
        ctx.fill();
        ctx.restore();
    }
    // move particles
    for(const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        if(p.x<0 || p.x>width) p.dx *= -1;
        if(p.y<0 || p.y>height) p.dy *= -1;
    }
    requestAnimationFrame(animateBg);
}
createParticles();
createLines();
animateBg();

// Re-create lines and particles on resize
window.addEventListener("resize", ()=>{
    createParticles();
    createLines();
});

// =========== LOADING OVERLAY WITH PROGRESS ===========
let progress = 0;
function updateProgressBar() {
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    bar.style.width = progress + "%";
    text.textContent = "Loading... " + progress + "%";
}
function loadingSequence() {
    progress = 0;
    updateProgressBar();
    const interval = setInterval(()=>{
        progress++;
        updateProgressBar();
        if(progress >= 100) {
            clearInterval(interval);
            setTimeout(()=>{
                document.getElementById('loadingOverlay').style.opacity = 0;
                setTimeout(()=>{
                    document.getElementById('loadingOverlay').style.display = "none";
                    document.getElementById('mainApp').style.display = "flex";
                }, 900); // fade out
            }, 400);
        }
    }, 100); // 10 seconds total
}
loadingSequence();

// =========== MAIN APP LOGIC ===========
function generateImage() {
    const prompt = document.getElementById("promptInput").value.trim();
    if (!prompt) {
        alert("Please enter a prompt.");
        return;
    }
    displayImage(prompt);
}

function displayImage(prompt) {
    const imageUrl = `https://img.hazex.workers.dev/?prompt=${encodeURIComponent(prompt)}&improve=true&format=square&random=${Math.random()}`;
    const imageElement = document.getElementById("generatedImage");
    const regenerateButton = document.getElementById("regenerateButton");
    const downloadButton = document.getElementById("downloadButton");
    const telegramLink = document.getElementById("telegramLink");

    // Show spinner animation on image (optional)
    imageElement.style.display = "none";
    regenerateButton.style.display = "none";
    downloadButton.style.display = "none";
    telegramLink.style.display = "none";

    imageElement.onload = () => {
        imageElement.style.display = "block";
        regenerateButton.style.display = "inline-block";
        downloadButton.style.display = "inline-block";
        telegramLink.style.display = "inline-block";
    };
    imageElement.src = imageUrl;
}

function downloadImage() {
    const imageElement = document.getElementById("generatedImage");
    if (imageElement.src) {
        const link = document.createElement("a");
        link.href = imageElement.src;
        link.download = "zaynix_image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("No image to download. Please generate an image first.");
    }
}
