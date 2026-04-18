const stage = document.getElementById("stage");
const paper = document.getElementById("paper");
const button = document.getElementById("toggleBtn");
const pages = Array.from(document.querySelectorAll(".page"));
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
let currentPage = 0;
let animationLock = false;

function goToPage(nextPage) {
  // Keep page navigation inside valid bounds.
  const boundedPage = Math.max(0, Math.min(nextPage, pages.length - 1));
  if (boundedPage === currentPage) {
    return;
  }
  currentPage = boundedPage;
  renderPage();
}

function updateReadingLayout() {
  // Reading layout is only used for inner pages while the paper is open.
  const isReadingPage = currentPage > 0;
  const shouldUseReading = paper.classList.contains("open") && isReadingPage;
  stage.classList.toggle("reading", shouldUseReading);
}

function renderPage() {
  pages.forEach((page, index) => {
    page.classList.toggle("active", index === currentPage);
  });

  // Reset scroll when switching pages to avoid carrying previous scroll state.
  const activeContent = pages[currentPage]?.querySelector(".page-content");
  if (activeContent) {
    activeContent.scrollTop = 0;
  }

  prevPageBtn.disabled = currentPage === 0;
  nextPageBtn.disabled = currentPage === pages.length - 1;
  updateReadingLayout();
}

function togglePaper() {
  if (animationLock) {
    return;
  }

  animationLock = true;
  const isOpen = paper.classList.toggle("open");
  button.textContent = isOpen ? "Cerrar invitacion" : "Abrir invitacion";
  paper.setAttribute("aria-pressed", String(isOpen));
  paper.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute("aria-expanded", String(isOpen));
  updateReadingLayout();

  window.setTimeout(() => {
    animationLock = false;
  }, 1120);
}

paper.addEventListener("click", (event) => {
  if (event.target.closest(".center")) {
    return;
  }
  togglePaper();
});

button.addEventListener("click", togglePaper);

prevPageBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  goToPage(currentPage - 1);
});

nextPageBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  goToPage(currentPage + 1);
});

paper.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && paper.classList.contains("open")) {
    event.preventDefault();
    togglePaper();
    return;
  }

  if (paper.classList.contains("open") && event.key === "ArrowLeft") {
    event.preventDefault();
    goToPage(currentPage - 1);
    return;
  }

  if (paper.classList.contains("open") && event.key === "ArrowRight") {
    event.preventDefault();
    goToPage(currentPage + 1);
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    togglePaper();
  }
});

renderPage();
