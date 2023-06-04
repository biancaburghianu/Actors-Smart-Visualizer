const menuIcon = document.querySelector(".menu-icon");
const navLinks = document.querySelector(".nav-links");


menuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("show-nav");
  toggleNavLinks();
});

function toggleNavLinks() {
  const navLinks = document.querySelectorAll('.nav-links li a');
  
  navLinks.forEach(link => {
    link.style.display = link.style.display === 'block' ? 'none' : 'block';
  });
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

  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      const newToken = response.headers.get("Authorization");
      if (newToken) {
        localStorage.setItem("token", newToken.split(" ")[1]);
      }
      return response.json();
    })
    .then((data) => {
      articlesContainer.innerHTML = "";

      data.articles.slice(0, 10).forEach((article) => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article");

        const favoriteButton = document.createElement("button");
        favoriteButton.classList.add("favorite-button");
        favoriteButton.innerHTML =
          '<i class="far fa-heart"></i> Mark as favorite';
        articleElement.appendChild(favoriteButton);

        const publishedAtElement = document.createElement("em");
        publishedAtElement.textContent = "Published at: " + article.publishedAt;
        articleElement.appendChild(publishedAtElement);

        const titleElement = document.createElement("h2");
        titleElement.textContent = article.title;
        articleElement.appendChild(titleElement);

        if (article.urlToImage) {
          const imageElement = document.createElement("img");
          imageElement.src = article.urlToImage;
          articleElement.appendChild(imageElement);
        }

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = article.description;
        articleElement.appendChild(descriptionElement);

        const articleLink = document.createElement("a");
        articleLink.href = article.url;
        articleLink.textContent = "Read more about this";
        articleElement.appendChild(articleLink);

        articlesContainer.appendChild(articleElement);
      });
      favoriteButton();
    })
    .catch((error) => {
      console.error(error);
    });
}

function favoriteButton() {
  const favoriteBtns = document.querySelectorAll(".favorite-button");

  favoriteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isFavorite = btn.classList.contains("favorite");

      favoriteBtns.forEach((btn) => {
        btn.classList.remove("favorite");
        btn.innerHTML = '<i class="far fa-heart"></i> Mark as favorite';
      });

      if (!isFavorite) {
        btn.classList.add("favorite");
        btn.innerHTML = '<i class="fas fa-heart"></i> Favorite';

        const articleElement = btn.closest(".article");
        const title = articleElement.querySelector("h2").textContent;
        const description = articleElement.querySelector("p").textContent;
        const publishedAt = articleElement.querySelector("em").textContent;
        const imageUrl = articleElement.querySelector("img").src;
        const articleUrl = articleElement.querySelector("a").href;

        const favoriteArticle = {
          title,
          description,
          publishedAt,
          imageUrl,
          articleUrl,
        };

        const url = "http://localhost:3456/favorite/article";
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(favoriteArticle),
        };

        fetch(url, options)
          .then((response) => {
            const newToken = response.headers.get("Authorization");
            if (newToken) {
              localStorage.setItem("token", newToken.split(" ")[1]);
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  });
}

function checkHeartsFavorites() {
  const hearts = document.querySelectorAll(".fa.fa-heart");
  if (hearts.length < 1) {
    return true;
  } else {
    return false;
  }
}

document
  .getElementById("searchButton")
  .addEventListener("click", searchArticles);
