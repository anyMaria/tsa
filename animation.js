let btn = document.getElementById("btn")
let video = document.getElementById("video")

function mute() {
    video.muted = !video.muted;
    if (video.muted) {
        btn.textContent = "Rétablir le son";
    } else {
        btn.textContent = "Couper le son";
}
}

btn.addEventListener ('click', mute)

 const discoverBtn = document.getElementById('discoverBtn');
    if (discoverBtn) {
        discoverBtn.addEventListener('click', () => {
            document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Back to top 
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show after 300px (past hero)
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
