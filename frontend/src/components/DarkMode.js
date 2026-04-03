export function DarkMode() {

  // =============================
  // DARK MODE TOGGLE
  // =============================
  const toggleBtn = document.getElementById("modeToggle");

  if (toggleBtn) {

    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      toggleBtn.textContent = "☀️";
    } else {
      document.body.classList.remove("dark-mode");
      toggleBtn.textContent = "🌙";
    }

    toggleBtn.onclick = () => {
      const isNowDark = document.body.classList.toggle("dark-mode");

      if (isNowDark) {
        localStorage.setItem("darkMode", "enabled");
        toggleBtn.textContent = "☀️";
      } else {
        localStorage.setItem("darkMode", "disabled");
        toggleBtn.textContent = "🌙";
      }
    };
  }

}