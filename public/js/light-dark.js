const toggleButton = document.getElementById("dark-mode-toggle");

toggleButton.addEventListener("click", () => {
  // Check the current theme
  const currentTheme = document.documentElement.getAttribute("data-theme");

  // Toggle theme attribute
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    toggleButton.textContent = "Dark Mode";
    toggleButton.classList.remove
    ('is-dark');
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    toggleButton.textContent = "Light Mode";
    toggleButton.classList.add
    ('is-dark');
  }
});