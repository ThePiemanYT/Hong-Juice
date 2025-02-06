window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-background");

  // Check if loader was already shown
  if (sessionStorage.getItem("loaderShown")) {
    loader.style.display = "none"; // Instantly hide if already shown
  } else {
    sessionStorage.setItem("loaderShown", "true");

    // Delay hiding to allow full animation to play
    setTimeout(() => {
      loader.classList.add("loader-background-hidden");

      // Add an extra delay before setting display: none
      setTimeout(() => {
        loader.style.display = "none";
      }, 1000); // Adjust this value if needed
    }, 2700); // This is the time your loader stays visible
  }
});

// Reset loader when closing the tab (ensures it shows in a new tab)
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    sessionStorage.removeItem("loaderShown");
  }
});
