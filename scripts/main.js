// reveal on scroll
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// magnetic buttons (fine pointers only)
if (matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.magnetic').forEach((el) => {
        el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.25;
            const y = (e.clientY - r.top - r.height / 2) * 0.35;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
        el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
}
