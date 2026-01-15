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
  if (document.body.classList.contains('music-page') || document.body.classList.contains('epk-page')) {
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
   EPK BOOKING CLOSE
---------------------------------------- */
const bookingClose = document.getElementById('epk-booking-close');
const bookingSection = document.getElementById('epk-booking');
const bookingTriggers = document.querySelectorAll('.booking-trigger');

window.addEventListener('load', () => {
  document.body.classList.remove('preload');
});

if (bookingSection) {
  bookingSection.classList.add('booking-hidden');

  bookingTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      bookingSection.classList.remove('booking-hidden');
      setTimeout(() => bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 10);
    });
  });

  if (bookingClose) {
    bookingClose.addEventListener('click', () => {
      bookingSection.classList.add('booking-hidden');
      const heroSection = document.querySelector('.epk-hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
      if (history && history.replaceState) {
        history.replaceState(null, '', window.location.pathname);
      }
    });
  }

  // Block out booked dates in the booking form date picker
  const bookingForm = document.querySelector('.epk-booking-form');
  const statusEl = bookingForm ? bookingForm.querySelector('.form-status') : null;
  const submitBtn = bookingForm ? bookingForm.querySelector('button[type="submit"]') : null;
  const calendarMount = document.getElementById('booking-calendar');
  const selectedContainer = document.getElementById('selected-dates');
  const selectedInput = document.getElementById('booking-selected-input');

  // Pull confirmed show dates from the shows list so only actual gigs are blocked.
  function parseTourDate(str) {
    if (!str) return null;
    const monthMap = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
    };
    const cleaned = str.replace(',', '').replace(/(\d+)(st|nd|rd|th)/i, '$1').trim();
    const parts = cleaned.split(/\s+/); // e.g. ["JAN","2","2026"]
    if (parts.length < 3) return null;
    const [monStr, dayStr, yearStr] = parts;
    const month = monthMap[monStr.toUpperCase()];
    const day = parseInt(dayStr, 10);
    const year = parseInt(yearStr, 10);
    if (month === undefined || Number.isNaN(day) || Number.isNaN(year)) return null;
    const pad = (n) => n.toString().padStart(2, '0');
    return `${year}-${pad(month + 1)}-${pad(day)}`;
  }

  function collectBookedDates() {
    const fromList = Array.from(document.querySelectorAll('.tour-date'))
      .map((el) => parseTourDate(el.textContent))
      .filter(Boolean);
    // Fallback to the known list if we're not on the shows page.
    if (fromList.length) return new Set(fromList);
    return new Set([
      '2026-01-02',
      '2026-01-04',
      '2026-02-06',
      '2026-03-14'
    ]);
  }

  const bookedDates = collectBookedDates();

  // Build a booking calendar that matches the shows page and lets users pick multiple dates.
  if (calendarMount && selectedInput) {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const selectedDates = new Set();
    const monthsToShow = 6;
    const today = new Date();

    const pad = (n) => n.toString().padStart(2, '0');

    function addSelected(dateStr, label) {
      selectedDates.add(dateStr);
      renderSelected();
    }
    function removeSelected(dateStr) {
      selectedDates.delete(dateStr);
      renderSelected();
    }
    function renderSelected() {
      if (!selectedContainer) return;
      selectedContainer.innerHTML = '';
      const sorted = Array.from(selectedDates).sort();
      sorted.forEach((ds) => {
        const chip = document.createElement('span');
        chip.className = 'selected-chip';
        const dateObj = new Date(ds);
        const label = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        chip.textContent = label;
        selectedContainer.appendChild(chip);
      });
      selectedInput.value = sorted.join(', ');
    }

    function buildMonth(year, month) {
      const wrapper = document.createElement('div');
      wrapper.className = 'calendar-month';
      const header = document.createElement('div');
      header.className = 'calendar-head';
      header.textContent = `${monthNames[month]} ${year}`;
      wrapper.appendChild(header);

      const dayRow = document.createElement('div');
      dayRow.className = 'calendar-row calendar-days';
      dayNames.forEach((d) => {
        const dn = document.createElement('div');
        dn.className = 'calendar-cell calendar-dayname';
        dn.textContent = d;
        dayRow.appendChild(dn);
      });
      wrapper.appendChild(dayRow);

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const datesRow = document.createElement('div');
      datesRow.className = 'calendar-grid';

      for (let i = 0; i < firstDay.getDay(); i++) {
        const blank = document.createElement('div');
        blank.className = 'calendar-cell blank';
        datesRow.appendChild(blank);
      }

      for (let d = 1; d <= lastDay.getDate(); d++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell selectable';
        const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
        cell.textContent = d;

        if (bookedDates.has(dateStr)) {
          cell.classList.add('booked');
          cell.classList.remove('selectable');
        } else {
          cell.addEventListener('click', () => {
            if (selectedDates.has(dateStr)) {
              cell.classList.remove('selected');
              removeSelected(dateStr);
            } else {
              cell.classList.add('selected');
              addSelected(dateStr);
            }
          });
        }

        datesRow.appendChild(cell);
      }

      wrapper.appendChild(datesRow);
      return wrapper;
    }

    for (let i = 0; i < monthsToShow; i++) {
      const dt = new Date(today.getFullYear(), today.getMonth() + i, 1);
      calendarMount.appendChild(buildMonth(dt.getFullYear(), dt.getMonth()));
    }
  }

  // Inline submit (stay on page) for booking form
  if (bookingForm && submitBtn && statusEl) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (selectedInput && !selectedInput.value.trim()) {
        statusEl.textContent = 'Please pick at least one date.';
        return;
      }
      statusEl.textContent = 'Sending...';
      submitBtn.disabled = true;
      try {
        const data = new FormData(bookingForm);
        const res = await fetch(bookingForm.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          statusEl.textContent = 'Thanks — your booking request is on its way.';
          bookingForm.reset();
        } else {
          statusEl.textContent = 'There was a problem sending. Please try again.';
        }
      } catch (err) {
        statusEl.textContent = 'Network error. Please try again.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
}

/* ---------------------------------------
   COVERS TOGGLE
---------------------------------------- */
const coversToggles = document.querySelectorAll('.covers-toggle');
coversToggles.forEach((btn) => {
  btn.addEventListener('click', () => {
    const list = btn.closest('.covers-preview')?.querySelector('.covers-list');
    if (!list) return;
    const expanded = list.classList.toggle('expanded');
    list.classList.toggle('collapsed', !expanded);
    btn.textContent = expanded ? 'Show less' : 'Show more';
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  });
});


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

