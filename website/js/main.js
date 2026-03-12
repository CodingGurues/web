const loader = document.getElementById('loader');
window.addEventListener('load', () => setTimeout(() => loader?.classList.add('hidden'), 500));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('.faq-item button').forEach((btn) => {
  btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
});

const counters = document.querySelectorAll('.counter');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.target || 0);
    let n = 0;
    const timer = setInterval(() => {
      n += Math.max(1, Math.ceil(target / 40));
      if (n >= target) {
        n = target;
        clearInterval(timer);
      }
      counter.textContent = `${n}`;
    }, 30);
    countObserver.unobserve(counter);
  });
}, { threshold: 0.4 });
counters.forEach((c) => countObserver.observe(c));

window.addEventListener('scroll', () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  const bar = document.getElementById('scrollProgress');
  if (bar) bar.style.width = `${progress}%`;
});

const themeToggle = document.getElementById('themeToggle');
themeToggle?.addEventListener('click', () => document.body.classList.toggle('light'));

async function loadArticles() {
  const grid = document.getElementById('articleGrid');
  if (!grid) return;
  try {
    const res = await fetch('./data/articles.json');
    const articles = await res.json();
    grid.innerHTML = articles.map((article) => `
      <article class="glass feature">
        <img loading="lazy" src="${article.image}" alt="${article.title}" style="width:100%;border-radius:12px;margin-bottom:12px;"/>
        <p style="font-size:14px;color:var(--muted);margin:0 0 8px;">${article.date} · ${article.readingTime}</p>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
        <a class="btn btn--secondary" href="${article.url}">Read Article</a>
      </article>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p>Unable to load articles right now.</p>';
  }
}

loadArticles();
