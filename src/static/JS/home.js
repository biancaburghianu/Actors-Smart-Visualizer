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
    const newToken = response.headers.get("Authorization");
    if (newToken) {
      localStorage.setItem("token", newToken.split(" ")[1]);
    }

    const data = await response.json();
    const favoriteArticle = data.favoriteArticle;

    const favoriteArticleContainer = document.getElementById(
      "favorite-article-container"
    );
    favoriteArticleContainer.innerHTML = "";

    const favoriteArticleElement = document.createElement("div");
    favoriteArticleElement.classList.add("favorite-article");

    const titleElement = document.createElement("h2");
    titleElement.textContent =
      favoriteArticle.details.title || "No title available";
    favoriteArticleElement.appendChild(titleElement);

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent =
      favoriteArticle.details.description || "No description available";
    favoriteArticleElement.appendChild(descriptionElement);

    const imageElement = document.createElement("img");
    imageElement.src = favoriteArticle.details.imageUrl || "";
    favoriteArticleElement.appendChild(imageElement);

    const publishedAtElement = document.createElement("p");
    publishedAtElement.textContent =
      favoriteArticle.details.publishedAt || "No publication date available";
    favoriteArticleElement.appendChild(publishedAtElement);

    const articleUrlElement = document.createElement("a");
    articleUrlElement.href = favoriteArticle.details.articleUrl || "#";
    articleUrlElement.textContent = "Read more";
    favoriteArticleElement.appendChild(articleUrlElement);

    favoriteArticleContainer.appendChild(favoriteArticleElement);
  } catch (error) {
    console.error(error);
  }
}

getFavoriteArticle();

const API_KEY = "23fe5450a05a0810ba1587ec23e9b849";

async function getFavoriteNominee() {
  const url = "http://localhost:3456/favorite/nominee";
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
    const newToken = response.headers.get("Authorization");
    if (newToken) {
      localStorage.setItem("token", newToken.split(" ")[1]);
    }
    const data = await response.json();
    return data.favoriteNominee.nomineeName;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function generateFavoriteNomineeCard() {
  // const nomineeName = await getFavoriteNominee();
  const nomineeName = "Al Pac";

  if (nomineeName) {
    const urlMovie = "https://api.themoviedb.org/3/search/multi";
    const urlPerson = "https://api.themoviedb.org/3/search/person";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const responseMovie = await fetch(
        `${urlMovie}?api_key=${API_KEY}&query=${encodeURIComponent(
          nomineeName
        )}`,
        options
      );
      const dataMovie = await responseMovie.json();
      console.log(dataMovie.results[0]);
      if (dataMovie.results && dataMovie.results.length > 0) {
        const movie = dataMovie.results[0];
        await generateCard(movie, "movie");
        return;
      }

      const responsePerson = await fetch(
        `${urlPerson}?api_key=${API_KEY}&query=${encodeURIComponent(
          nomineeName
        )}`,
        options
      );
      const dataPerson = await responsePerson.json();

      if (dataPerson.results && dataPerson.results.length > 0) {
        const person = dataPerson.results[0];
        await generateCard(person, "person");
        return;
      }

      console.log("No results found");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  } else {
    console.log("No favorite nominee found");
  }
}

async function generateCard(result, searchType) {
  const cardContainer = document.querySelector(".Cards.Container");
  console.log(cardContainer);
  const card = document.createElement("div");
  card.className = "Card";

  try {
    let title, overview, imagePath;

    if (searchType === "movie") {
      title = result.title;
      overview = result.overview;
      imagePath = result.poster_path;
    } else if (searchType === "person") {
      title = result.name;
      overview = `Known for: ${result.known_for_department}`;
      imagePath = result.profile_path;
    }

    const imageUrl = imagePath
      ? `https://image.tmdb.org/t/p/w500${imagePath}`
      : "path_catre_o_imagine_alternativa";

    card.innerHTML = `
      <h3>${title}</h3>
      <p>${overview}</p>
      <img src="${imageUrl}" alt="${title}">
    `;
  } catch (error) {
    console.error("Error building card:", error);
    card.textContent = "Error building card";
  }
  cardContainer.appendChild(card);
}

generateFavoriteNomineeCard();