const menuIcon = document.querySelector(".menu-icon");
const navLinks = document.querySelector(".nav-links");

menuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("show-nav");
});
function myFunction(articleNum) {
  var dots = document.getElementById("dots" + articleNum);
  var moreText = document.getElementById("more" + articleNum);
  var btnText = document.getElementById("readMore");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    moreText.style.display = "none";
    btnText.innerHTML = "Read more";
  } else {
    dots.style.display = "none";
    moreText.style.display = "inline";
    btnText.innerHTML = "Read less";
  }
}

const LoginBtn = document.getElementById("UserBtn");
const LoginPannel = document.querySelector(".UserLogin");
LoginBtn.addEventListener("click", () => {
  if (LoginPannel.classList.contains("active"))
    LoginPannel.classList.remove("active");
  else LoginPannel.classList.add("active");
});

const searchInput = document.getElementById("searchInput");
const articlesContainer = document.querySelector(".articles-container");

function searchArticles() {
  const searchTerm = searchInput.value;
  console.log(123, searchTerm);
  const url = `http://localhost:3456/articles?search=${searchTerm}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      articlesContainer.innerHTML = "";

      data.articles.slice(0, 10).forEach((article) => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article");

        const articleLink = document.createElement("a");
        articleLink.href = article.url;
        articleLink.textContent = "Read more about this";
        articleElement.appendChild(articleLink);

        const publishedAtElement = document.createElement("p");
        publishedAtElement.textContent = "Published at: " + article.publishedAt;
        articleElement.appendChild(publishedAtElement);

        const titleElement = document.createElement("h2");
        titleElement.textContent = article.title;
        articleElement.appendChild(titleElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = article.description;
        articleElement.appendChild(descriptionElement);

        if (article.urlToImage) {
          const imageElement = document.createElement("img");
          imageElement.src = article.urlToImage;
          articleElement.appendChild(imageElement);
        }

        articlesContainer.appendChild(articleElement);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

document
  .getElementById("searchButton")
  .addEventListener("click", searchArticles);
