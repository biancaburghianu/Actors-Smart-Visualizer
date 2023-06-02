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

/// show more button for home page.

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

    //  Login Script

    const LoginBtn = document.getElementById("UserBtn");
    const LoginPannel = document.querySelector(".UserLogin");
    LoginBtn.addEventListener("click", () => {
      if (LoginPannel.classList.contains("active"))
        LoginPannel.classList.remove("active");
      else LoginPannel.classList.add("active");
    });

    //Articles

   // ...

// Function to make GET request to retrieve favorite article
async function getFavoriteArticle() {
  const url = "http://localhost:3456/favorite/article";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Add the JWT token from localStorage
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    console.log(data.favoriteArticle); // Display the favorite article data

    // Display the favorite article data on the HTML page
    const favoriteArticleContainer = document.getElementById("favorite-article-container");
    favoriteArticleContainer.innerHTML = "";

    const favoriteArticleElement = document.createElement("div");
    favoriteArticleElement.classList.add("favorite-article");

    const titleElement = document.createElement("h2");
    titleElement.textContent = data.favoriteArticle.title;
    favoriteArticleElement.appendChild(titleElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = data.favoriteArticle.description;
    favoriteArticleElement.appendChild(descriptionElement);

    favoriteArticleContainer.appendChild(favoriteArticleElement);
  } catch (error) {
    console.error(error);
  }
}

// Call the getFavoriteArticle function
getFavoriteArticle();

