/* ---------------------------------------
   FADE-IN FOR TEXT ELEMENTS (.fade)
---------------------------------------- */
// Make sure everything inside each preview block fades in.
document.querySelectorAll('.section-content').forEach((content) => {
  content.classList.add('fade');
  content.querySelectorAll('*').forEach((child) => child.classList.add('fade'));
});

const faders = document.querySelectorAll(".fade");

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: "0px 0px -15% 0px" });

faders.forEach((el) => fadeObserver.observe(el));



/* ---------------------------------------
   FADE-IN / FADE-OUT BACKGROUNDS
   FOR HOMEPAGE SECTIONS (.home-section)
---------------------------------------- */
const sections = document.querySelectorAll(".home-section");

// On the music page, wait a bit longer (but still trigger reliably) before swapping backgrounds
// so the smoke/fire transition feels natural.
const bgObserverOptions = document.body.classList.contains("music-page")
  ? { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
  : { threshold: 0.2 };

const bgObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {

    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      entry.target.classList.remove("inactive");
      entry.target.dataset.hasActivated = "true";
      // Keep music preview active after first reveal
      if (entry.target.id === "music-preview") {
        bgObserver.unobserve(entry.target);
      }
    } else {
      // Don't fade music-preview back out once shown
      if (entry.target.id === "music-preview" && entry.target.dataset.hasActivated === "true") {
        return;
      }
      entry.target.classList.remove("active");
      entry.target.classList.add("inactive");
    }

  });
}, bgObserverOptions); // triggers when section is centered

sections.forEach((sec) => bgObserver.observe(sec));



/* ---------------------------------------
   MOBILE MENU TOGGLE
---------------------------------------- */
const menuToggle = document.getElementById("menu-toggle");
const leftNav = document.querySelector(".left-nav");

if (menuToggle && leftNav) {
  menuToggle.addEventListener("click", () => {
    const open = leftNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.classList.toggle("open", open);
  });
}


/* ---------------------------------------
   SMOOTH SCROLLING FOR HOMEPAGE PREVIEWS
   - Only on index.html
---------------------------------------- */
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  document.querySelectorAll(".left-nav a").forEach((link) => {

    const href = link.getAttribute("href");
    const id = href.replace(".html", "") + "-preview"; // music.html → music-preview
    const section = document.getElementById(id);

    if (section) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        section.scrollIntoView({ behavior: "smooth" });
      });
    }
  });
}



/* ---------------------------------------
   HERO INLINE NAV SMOOTH SCROLL (home only)
---------------------------------------- */
if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
  document.querySelectorAll(".hero-inline-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    const id = href.replace(".html", "") + "-preview";
    const section = document.getElementById(id);

    if (section) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        section.scrollIntoView({ behavior: "smooth" });
      });
    }
  });
}


/* ---------------------------------------
   PAGE TRANSITION FADE-OUT
---------------------------------------- */
document.querySelectorAll("a[href]").forEach((a) => {
  const url = a.getAttribute("href");

  if (url && !url.startsWith("http") && !url.startsWith("#")) {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.add("fade-out");
      setTimeout(() => (window.location = url), 350);
    });
  }
});



/* ---------------------------------------
   SIMPLE HEADER EFFECT ON SCROLL
   - Hide header while hero is in view on desktop
---------------------------------------- */
const header = document.querySelector('header');
const hero = document.querySelector('.hero-home');
const bigTitles = document.querySelectorAll('.hero-name-large');

let heroVisible = true;

if (hero) {
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        heroVisible = entry.isIntersecting;
        updateHeaderState();
      });
    },
    { threshold: 0.3 }
  );
  heroObserver.observe(hero);
}

const isMobileViewport = () => window.innerWidth <= 820;

function updateHeaderState() {
  if (!header) return;

  // Always show header/title on music page.
  if (document.body.classList.contains('music-page')) {
    header.classList.add('show-title');
    header.classList.remove('header-hidden');
    bigTitles.forEach((title) => (title.style.opacity = 1));
    return;
  }

  // If there's no hero (non-home pages), keep header visible.
  if (!hero) {
    header.classList.add('show-title');
    header.classList.remove('header-hidden');
    return;
  }

  // Hide header on desktop while hero is visible.
  if (!isMobileViewport() && heroVisible) {
    header.classList.add('header-hidden');
  } else {
    header.classList.remove('header-hidden');
  }

  const heroHeight = hero.offsetHeight;

  if (window.scrollY > heroHeight - 120) {
    header.classList.add('show-title');
    bigTitles.forEach((title) => (title.style.opacity = 0));
  } else {
    header.classList.remove('show-title');
    bigTitles.forEach((title) => (title.style.opacity = 1));
  }
}

window.addEventListener('scroll', updateHeaderState);
window.addEventListener('resize', updateHeaderState);



/* ---------------------------------------
   LIGHTBOX LOGIC
---------------------------------------- */
const lb = document.getElementById("lightbox");
if (lb) {
  const lbImg = document.getElementById("lightbox-img");

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      const img = item.getAttribute("data-img");
      if (!img) return;
      lbImg.src = img;
      lb.style.display = "flex";
    });
  });

  lb.addEventListener("click", () => (lb.style.display = "none"));
}
window.addEventListener('load', () => {
  bigTitles.forEach((title) => title.classList.add('show'));
  updateHeaderState();
});

const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function wireSocialLinks() {
  const socialLinks = document.querySelectorAll('a.social-link');
  if (!socialLinks.length) return;

  socialLinks.forEach((link) => {
    const appUrl = link.getAttribute('data-app-url');
    const webUrl = link.getAttribute('href');

    link.addEventListener('click', (e) => {
      if (!isMobileDevice() || !appUrl || !webUrl) return;
      e.preventDefault();
      // Try the app first, then fall back to the web link.
      window.location.href = appUrl;
      setTimeout(() => {
        window.location.href = webUrl;
      }, 550);
    });
  });
}

wireSocialLinks();


/* ---------------------------------------
   (Optional) OLD DISAPPEARING NAV
---------------------------------------- */
/*
let prev = window.pageYOffset;
const nav = document.getElementById("nav");

window.addEventListener("scroll", () => {
  let cur = window.pageYOffset;
  if (cur > prev && cur > 50) {
    nav.style.transform = "translateY(-100%)";
  } else {
    nav.style.transform = "translateY(0)";
  }
  prev = cur;
});
*/

