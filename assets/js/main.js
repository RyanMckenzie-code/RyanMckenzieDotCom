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
    } else {
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
---------------------------------------- */
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const hero = document.querySelector('.hero-home');
  const bigTitle = document.querySelector('.hero-name-large');

  // Always show header title on music page without waiting for scroll.
  if (document.body.classList.contains('music-page')) {
    header.classList.add('show-title');
    if (bigTitle) bigTitle.style.opacity = 1;
    return;
  }

  // If there's no hero (non-home pages), keep the header title visible.
  if (!hero) {
    header.classList.add('show-title');
    return;
  }

  const heroHeight = hero.offsetHeight;

  if (window.scrollY > heroHeight - 120) {
      header.classList.add('show-title');
      if (bigTitle) bigTitle.style.opacity = 0;
  } else {
      header.classList.remove('show-title');
      if (bigTitle) bigTitle.style.opacity = 1;
  }
});



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
  document.querySelector('.hero-name-large').classList.add('show');
});

/* ---------------------------------------
   INSTAGRAM EMBED MODAL (header button)
---------------------------------------- */
function attachInstagramEmbed() {
  const instaIcon = document.querySelector('.header-icons img[alt="Instagram"]');
  if (!instaIcon) return;

  const parentLink = instaIcon.closest('a');
  if (!parentLink) return;

  const existingModal = document.getElementById('insta-embed-modal');

  // Build modal once
  const ensureModal = () => {
    let modal = document.getElementById('insta-embed-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'insta-embed-modal';
    modal.innerHTML = `
      <div class="insta-embed-backdrop"></div>
      <div class="insta-embed-content">
        <button class="insta-close" aria-label="Close Instagram embed">×</button>
        <div class="insta-embed-body">
          <blockquote class="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/ryan.mckenzie.music/?utm_source=ig_embed&amp;utm_campaign=loading"
            data-instgrm-version="14"
            style="background:#FFF; border:0; border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.4); margin:0; padding:0; width:100%; max-width:540px;">
          </blockquote>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Load Instagram embed script once
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
      const s = document.createElement('script');
      s.src = "//www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
    } else if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }

    const closeModal = () => modal.classList.remove('show');
    modal.querySelector('.insta-close').addEventListener('click', closeModal);
    modal.querySelector('.insta-embed-backdrop').addEventListener('click', closeModal);
    return modal;
  };

  parentLink.addEventListener('click', (e) => {
    e.preventDefault();
    const modal = ensureModal();
    modal.classList.add('show');
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  });
}

attachInstagramEmbed();

/* ---------------------------------------
   FACEBOOK PAGE EMBED MODAL (header button)
---------------------------------------- */
function attachFacebookEmbed() {
  const fbIcon = document.querySelector('.header-icons img[alt="Facebook"]');
  if (!fbIcon) return;

  const parentLink = fbIcon.closest('a');
  if (!parentLink) return;

  const ensureFBRoot = () => {
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }
  };

  const ensureSDK = () => {
    if (window.FB) return;
    ensureFBRoot();
    const s = document.createElement('script');
    s.async = true;
    s.defer = true;
    s.crossOrigin = "anonymous";
    s.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v20.0";
    document.body.appendChild(s);
  };

  const ensureModal = () => {
    let modal = document.getElementById('fb-embed-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'fb-embed-modal';
    modal.innerHTML = `
      <div class="fb-embed-backdrop"></div>
      <div class="fb-embed-content">
        <button class="fb-close" aria-label="Close Facebook embed">×</button>
        <div class="fb-embed-body">
          <div class="fb-page"
            data-href="https://www.facebook.com/profile.php?id=61574476614038&amp;open_field=website&amp;sk=about_contact_and_basic_info"
            data-tabs="timeline"
            data-width="500"
            data-height="420"
            data-small-header="true"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true">
            <blockquote
              cite="https://www.facebook.com/profile.php?id=61574476614038&amp;open_field=website&amp;sk=about_contact_and_basic_info"
              class="fb-xfbml-parse-ignore">
              <a href="https://www.facebook.com/profile.php?id=61574476614038&amp;open_field=website&amp;sk=about_contact_and_basic_info">Ryan McKenzie Music</a>
            </blockquote>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => modal.classList.remove('show');
    modal.querySelector('.fb-close').addEventListener('click', closeModal);
    modal.querySelector('.fb-embed-backdrop').addEventListener('click', closeModal);
    return modal;
  };

  parentLink.addEventListener('click', (e) => {
    e.preventDefault();
    ensureSDK();
    const modal = ensureModal();
    modal.classList.add('show');
    if (window.FB && window.FB.XFBML) {
      window.FB.XFBML.parse(modal);
    }
  });
}

attachFacebookEmbed();


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
