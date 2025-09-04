(function() {
  const body = document.body;
  const btn = document.getElementById("btn-theme");

  // Load saved theme
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    body.classList.add("dark");
    btn.textContent = "☀️";
  } else {
    body.classList.remove("dark");
    btn.textContent = "🌙";
  }

  btn.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    btn.textContent = isDark ? "☀️" : "🌙";
  });
})();
