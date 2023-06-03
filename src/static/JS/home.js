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

async function getFavoriteArticle() {
  const url = "http://localhost:3456/favorite/article";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    const favoriteArticle = data.favoriteArticle;

    const favoriteArticleContainer = document.getElementById(
      "favorite-article-container"
    );
    favoriteArticleContainer.innerHTML = "";

    const favoriteArticleElement = document.createElement("div");
    favoriteArticleElement.classList.add("favorite-article");

    for (const key in favoriteArticle) {
      if (favoriteArticle.hasOwnProperty(key)) {
        const propertyElement = document.createElement("p");
        propertyElement.textContent = `${key}: ${favoriteArticle[key]}`;
        favoriteArticleElement.appendChild(propertyElement);
      }
    }

    favoriteArticleContainer.appendChild(favoriteArticleElement);
  } catch (error) {
    console.error(error);
  }
}

getFavoriteArticle();
    
