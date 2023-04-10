const menuIcon = document.querySelector(".menu-icon");
const navLinks = document.querySelector(".nav-links");

menuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("show-nav");
});

const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener("input", handleSearch);

function handleSearch() {
  const searchTerm = this.value.toLowerCase();
  const statistics = document.querySelectorAll(".statistic");

  statistics.forEach((statistic) => {
    const title = statistic
      .querySelector(".statistic-title")
      .textContent.toLowerCase();

    if (title.includes(searchTerm)) {
      statistic.style.display = "inline-block";
    } else {
      statistic.style.display = "none";
    }
  });
}

//  Login Script
const LoginBtn = document.getElementById("UserBtn");
const LoginPannel = document.querySelector(".UserLogin");
LoginBtn.addEventListener("click", () => {
  if (LoginPannel.classList.contains("active"))
    LoginPannel.classList.remove("active");
  else LoginPannel.classList.add("active");
});
