/* =========================================================
   설정값 — README에도 동일하게 기재
========================================================= */
const GITHUB_USERNAME = "segretoo";       // 본인 GitHub 아이디로 교체 가능
const SCROLL_TOP_THRESHOLD = 300;         // 스크롤 탑 버튼 노출 기준(px)
const NAV_BG_THRESHOLD = 60;              // 네비게이션 배경 전환 기준(px)
const REVEAL_THRESHOLD = 0.2;             // Intersection Observer 임계값

/* =========================================================
   0) 앱 상태 — 개별 변수 대신 하나의 state 객체로 묶어서 관리한다
   - 관련된 데이터가 한 곳에 모여 있어 추적/디버깅이 쉽다
   - state 자체는 const로 고정하고, 내부 프로퍼티만 갱신한다 (재할당 없음)
   - React의 useState로 옮겨갈 때 이 구조가 그대로 대응된다
   (요구사항 9. 상태 관리 패턴 / 평가 항목4 "STATE 객체" 관련)
========================================================= */
const state = {
  theme: "light",        // 'light' | 'dark' — 다크 모드 상태
  allRepos: [],           // GitHub API에서 받아온 저장소 원본 목록
  activeLanguage: "전체", // Projects 필터 상태
};

/* =========================================================
   1) 다크 모드 토글 (상태 → 렌더링 흐름 #1)
   테마 상태가 바뀌면 data-theme 속성이 바뀌고, 그 속성을 CSS 변수가 읽어
   전체 화면 스타일이 함께 바뀐다.
   - 사용자가 토글을 직접 누른 적이 없으면: 시스템 설정을 계속 실시간으로 따라간다
     (보너스: 시스템 다크모드 "감지" — 한 번만 확인하는 게 아니라 바뀔 때마다 반영)
   - 사용자가 토글을 한 번이라도 누르면: 그 선택을 localStorage에 저장하고,
     그 뒤로는 시스템 설정이 바뀌어도 사용자가 고른 값을 그대로 유지한다
========================================================= */
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const THEME_STORAGE_KEY = "theme";
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function getSystemTheme() {
  return systemThemeQuery.matches ? "dark" : "light";
}

function applyTheme(theme) {
  state.theme = theme;
  root.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : getSystemTheme());

themeToggle.addEventListener("click", () => {
  const next = state.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_STORAGE_KEY, next); // 여기서만 저장 = "사용자가 직접 골랐다"는 표시
});

// 시스템 설정이 바뀔 때: 사용자가 아직 직접 고른 적 없으면(저장된 값이 없으면) 바로 반영
systemThemeQuery.addEventListener("change", (event) => {
  if (localStorage.getItem(THEME_STORAGE_KEY) === null) {
    applyTheme(event.matches ? "dark" : "light");
  }
});

/* =========================================================
   2) 햄버거 메뉴 — 우측에서 슬라이드 인 되는 드로어 토글
========================================================= */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuBackdrop = document.getElementById("mobileMenuBackdrop");
const mobileMenuClose = document.getElementById("mobileMenuClose");

function closeMenu() {
  hamburgerBtn.classList.remove("active");
  mobileMenu.classList.remove("open");
  mobileMenuBackdrop.classList.remove("open");
  hamburgerBtn.setAttribute("aria-expanded", "false");
}

function openMenu() {
  hamburgerBtn.classList.add("active");
  mobileMenu.classList.add("open");
  mobileMenuBackdrop.classList.add("open");
  hamburgerBtn.setAttribute("aria-expanded", "true");
}

hamburgerBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("open");
  if (isOpen) closeMenu();
  else openMenu();
});
mobileMenuClose.addEventListener("click", closeMenu);
mobileMenuBackdrop.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

/* =========================================================
   3) 부드러운 스크롤 + 모바일에서 메뉴 클릭 시 자동 닫힘
========================================================= */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    event.preventDefault();
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  });
});

/* =========================================================
   4) 스크롤 이벤트 — 네비게이션 배경 전환 + 스크롤 탑 버튼
========================================================= */
const siteHeader = document.getElementById("siteHeader");
const scrollTopBtn = document.getElementById("scrollTopBtn");
let ticking = false;

function handleScroll() {
  const y = window.scrollY;
  siteHeader.classList.toggle("scrolled", y > NAV_BG_THRESHOLD);
  scrollTopBtn.classList.toggle("visible", y > SCROLL_TOP_THRESHOLD);
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(handleScroll);
    ticking = true;
  }
});
handleScroll();

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================================================
   5) 스크롤 등장 애니메이션 (Intersection Observer)
========================================================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: REVEAL_THRESHOLD }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* =========================================================
   6) Hero 타이핑 효과 — 새로고침 없이도 계속 반복되도록 루프 처리
========================================================= */
function typeLoop(el, text, options = {}) {
  const { typeSpeed = 45, deleteSpeed = 28, holdTime = 1800, restTime = 500 } = options;

  // 모션 최소화 설정을 켠 사용자에게는 애니메이션 없이 완성된 문장만 보여준다
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = text;
    return;
  }

  let i = 0;
  let deleting = false;

  function tick() {
    if (!deleting) {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i === text.length) {
        deleting = true;
        setTimeout(tick, holdTime); // 다 쓴 문장을 잠깐 보여준 뒤 지우기 시작
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      i -= 1;
      el.textContent = text.slice(0, i);
      if (i === 0) {
        deleting = false;
        setTimeout(tick, restTime); // 완전히 지운 뒤 잠깐 쉬고 다시 타이핑
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  tick();
}

typeLoop(
  document.getElementById("heroTyping"),
  "풀스택 개발에 관심이 많아, Python과 AI 도구까지 다루는 범위를 넓히는 중입니다."
);

/* =========================================================
   6-1) 히어로 배경 파티클 — 별처럼 은은하게 떠오르는 장식
========================================================= */
function createHeroParticles() {
  const host = document.getElementById("heroParticles");
  if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const palette = ["var(--primary)", "var(--lavender)", "var(--mint)"];
  const PARTICLE_COUNT = 34;

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const particle = document.createElement("span");
    particle.className = "hero-particle";
    const size = 3 + Math.random() * 6;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.background = palette[i % palette.length];
    particle.style.animationDuration = `${14 + Math.random() * 16}s`;
    particle.style.animationDelay = `${Math.random() * -18}s`; // 음수 지연 = 이미 진행 중인 상태로 시작 (첫 화면부터 자연스럽게)

    host.appendChild(particle);
  }
}

createHeroParticles();

/* =========================================================
   7) GitHub API 연동 (상태 → 렌더링 흐름 #2)
   이벤트: 페이지 로드 → 상태: idle → loading → success/error/empty
   → 렌더링: Projects 섹션의 스피너 / 카드 리스트 / 에러 메시지 전환
========================================================= */
const projectsGrid = document.getElementById("projectsGrid");
const projectsStatus = document.getElementById("projectsStatus");
const filterBar = document.getElementById("filterBar");

function renderStatus(statusKind) {
  projectsStatus.classList.toggle("is-error", statusKind === "error");
  const messages = {
    loading: '<span class="spinner"></span>불러오는 중...',
    error: "프로젝트를 불러올 수 없습니다.",
    empty: "표시할 프로젝트가 없습니다.",
    idle: "",
  };
  projectsStatus.innerHTML = messages[statusKind] ?? "";

  if (statusKind === "error") {
    const retryBtn = document.createElement("button");
    retryBtn.textContent = "다시 시도";
    retryBtn.className = "btn btn-ghost retry-btn";
    retryBtn.addEventListener("click", loadRepos);
    projectsStatus.appendChild(retryBtn);
  }
}

function createProjectCard(repo) {
  // 구조분해 할당으로 필요한 값만 추출
  const { name, html_url, description, stargazers_count, language } = repo;

  // <article>로 시맨틱을 지키면서, 내부의 투명 링크(stretched-link)가
  // 카드 전체를 덮어서 어디를 눌러도 저장소로 이동하게 한다
  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.language = language || "기타";

  // 템플릿 리터럴로 카드 내부 HTML을 동적으로 생성
  card.innerHTML = `
    <h3>${name}</h3>
    <p class="project-desc">${description ? description : "설명이 아직 없는 저장소입니다."}</p>
    <div class="project-meta">
      ${language ? `<span class="lang-chip"><span class="lang-dot"></span>${language}</span>` : `<span>언어 정보 없음</span>`}
      <span class="star-count">★ ${stargazers_count}</span>
    </div>
    <a class="card-stretched-link" href="${html_url}" target="_blank" rel="noopener noreferrer" aria-label="${name} 저장소 열기 (새 탭)"></a>
  `;
  return card;
}

function renderRepos(repos) {
  projectsGrid.innerHTML = "";
  if (repos.length === 0) {
    renderStatus("empty");
    return;
  }
  renderStatus("idle");
  // map으로 카드 배열을 만들고 forEach로 DOM에 붙인다
  repos.map(createProjectCard).forEach((card) => projectsGrid.appendChild(card));
}

function buildFilterBar(repos) {
  const languages = repos
    .map((repo) => repo.language)
    .filter((lang) => Boolean(lang)); // falsy(언어 없음) 제외

  const uniqueLanguages = ["전체", ...new Set(languages)];
  if (uniqueLanguages.length <= 2) {
    filterBar.hidden = true;
    return;
  }

  filterBar.hidden = false;
  filterBar.innerHTML = "";
  uniqueLanguages.forEach((lang) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn" + (lang === state.activeLanguage ? " active" : "");
    btn.textContent = lang;
    btn.addEventListener("click", () => applyLanguageFilter(lang));
    filterBar.appendChild(btn);
  });
}

// 필터 버튼과 Skills 태그 클릭이 공통으로 쓰는 필터 적용 함수
// (필터 상태 변경 → 프로젝트 목록 변경, 상태 → 렌더링 흐름 #4, 보너스)
function applyLanguageFilter(lang) {
  state.activeLanguage = lang;
  filterBar.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.toggle("active", b.textContent === lang);
  });
  const filtered = lang === "전체" ? state.allRepos : state.allRepos.filter((repo) => repo.language === lang);
  renderRepos(filtered);
}

// Skills 섹션 태그와 Projects 언어를 연결: 실제로 쓰인 언어면 개수 배지를 달고,
// 클릭하면 Projects로 스크롤 + 해당 언어로 필터링한다
function syncSkillTagsWithProjects() {
  const counts = state.allRepos.reduce((acc, repo) => {
    if (!repo.language) return acc;
    acc[repo.language] = (acc[repo.language] || 0) + 1;
    return acc;
  }, {});

  document.querySelectorAll(".tag-list li").forEach((tag) => {
    // 재호출(재시도 등) 대비 기존 배지/인터랙션 초기화
    tag.querySelector(".tag-count")?.remove();
    tag.classList.remove("tag-linked");
    tag.removeAttribute("tabindex");
    tag.removeAttribute("role");
    tag.replaceWith(tag.cloneNode(true)); // 이전에 붙인 이벤트 리스너 제거
  });

  document.querySelectorAll(".tag-list li").forEach((tag) => {
    const label = tag.textContent.trim();
    const count = counts[label];
    if (!count) return;

    const badge = document.createElement("span");
    badge.className = "tag-count";
    badge.textContent = count;
    tag.appendChild(badge);

    tag.classList.add("tag-linked");
    tag.tabIndex = 0;
    tag.setAttribute("role", "button");
    tag.setAttribute("aria-label", `${label} 프로젝트 ${count}개 보기`);

    const goToFilteredProjects = () => {
      document.getElementById("projects").scrollIntoView({ behavior: "smooth", block: "start" });
      applyLanguageFilter(label);
    };
    tag.addEventListener("click", goToFilteredProjects);
    tag.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goToFilteredProjects();
      }
    });
  });
}

async function loadRepos() {
  renderStatus("loading");
  filterBar.hidden = true;

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=9`);

    if (!response.ok) {
      // GitHub API 레이트 리밋(403) 등 HTTP 에러 상태 처리
      throw new Error(`GitHub API 오류: ${response.status}`);
    }

    const data = await response.json();
    state.allRepos = data;
    buildFilterBar(state.allRepos);
    renderRepos(state.allRepos);
    syncSkillTagsWithProjects();
  } catch (error) {
    console.error(error);
    projectsGrid.innerHTML = "";
    renderStatus("error");
  }
}

loadRepos();

/* =========================================================
   8) Contact 폼 유효성 검사 (상태 → 렌더링 흐름 #3)
   입력값 상태가 바뀔 때마다 유효성 상태를 다시 계산하고,
   에러 메시지 표시/숨김으로 화면에 반영한다.
========================================================= */

/* 보너스: 폼 실제 전송 (EmailJS)
   1) https://www.emailjs.com 무료 가입 → Email Service 연결
   2) 아래 세 값을 본인 계정 값으로 교체
   교체 전에는 값이 플레이스홀더 그대로라 emailjs.send를 호출하지 않고
   기존처럼 화면에만 성공 메시지를 보여준다 (기능은 그대로 동작) */
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_CONFIGURED =
  typeof emailjs !== "undefined" &&
  ![EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID].some((v) => v.startsWith("YOUR_"));

if (EMAILJS_CONFIGURED) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

const fields = {
  name: { input: document.getElementById("name"), error: document.getElementById("nameError") },
  email: { input: document.getElementById("email"), error: document.getElementById("emailError") },
  message: { input: document.getElementById("message"), error: document.getElementById("messageError") },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(field, message) {
  const { input, error } = fields[field];
  error.textContent = message;
  input.closest(".form-row").classList.toggle("has-error", Boolean(message));
}

function validateField(field) {
  const value = fields[field].input.value.trim();

  if (field === "name") {
    if (!value) return setFieldError("name", "이름을 입력해주세요."), false;
    setFieldError("name", "");
    return true;
  }

  if (field === "email") {
    if (!value) return setFieldError("email", "이메일을 입력해주세요."), false;
    if (!EMAIL_PATTERN.test(value)) return setFieldError("email", "올바른 이메일 형식이 아닙니다."), false;
    setFieldError("email", "");
    return true;
  }

  if (field === "message") {
    if (!value) return setFieldError("message", "메시지를 입력해주세요."), false;
    setFieldError("message", "");
    return true;
  }

  return true;
}

Object.keys(fields).forEach((field) => {
  fields[field].input.addEventListener("input", () => validateField(field));
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const results = Object.keys(fields).map((field) => validateField(field));
  const isValid = results.every(Boolean);

  if (!isValid) {
    formSuccess.textContent = "";
    return;
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');

  if (!EMAILJS_CONFIGURED) {
    // EmailJS 계정이 아직 연결되지 않은 상태 → 화면에만 성공 메시지 표시
    formSuccess.textContent = "메시지가 접수되었습니다. 곧 답장 드릴게요!";
    contactForm.reset();
    Object.keys(fields).forEach((field) => setFieldError(field, ""));
    return;
  }

  submitBtn.disabled = true;
  formSuccess.textContent = "전송 중...";

  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      // EmailJS 기본 "Contact Us" 템플릿의 변수명({{name}}, {{email}}, {{title}}, {{message}})에 맞췄다
      name: fields.name.input.value.trim(),
      email: fields.email.input.value.trim(),
      title: "포트폴리오 문의",
      message: fields.message.input.value.trim(),
    })
    .then(() => {
      formSuccess.textContent = "메시지가 전송되었습니다. 곧 답장 드릴게요!";
      contactForm.reset();
      Object.keys(fields).forEach((field) => setFieldError(field, ""));
    })
    .catch((error) => {
      console.error(error);
      formSuccess.textContent = "";
      setFieldError("message", "전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
});

/* =========================================================
   9) 기타
========================================================= */
document.getElementById("year").textContent = new Date().getFullYear();
