window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-background");

  loader.classList.add("loader-background-hidden")

  loader.addEventListener("transitionend", () => {
    document.body.removeChild("loader")
  })
})

