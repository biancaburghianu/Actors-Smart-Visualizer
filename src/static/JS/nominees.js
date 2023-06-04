const BigContainerEl = document.querySelector(".CardsClass");
const API_KEY = "23fe5450a05a0810ba1587ec23e9b849";

//Log out script
const logoutButton = document.querySelector("#logoutButton");
logoutButton.addEventListener("click", () => {
  window.location.href = "login.html";
  localStorage.removeItem("token");
});
//  End
//  Login Script
const LoginPannel = document.querySelector(".UserLogin");
const LoginBtn = document.getElementById("UserBtn");
LoginBtn.addEventListener("click", () => {
  if (LoginPannel.classList.contains("active"))
    LoginPannel.classList.remove("active");
  else LoginPannel.classList.add("active");
});
//

// dropdown script
const dropdown = document.querySelector(".select-box");
dropdown.addEventListener("change", () => {
  const selectedValue = dropdown.value;
  CreateELEMENTS(selectedValue);
});

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

        const CardEl = btn.parentElement;
        const title = CardEl.querySelector("h3").textContent;
        const backgroundImageUrl = getComputedStyle(CardEl).backgroundImage;
        const url = "http://localhost:3456/favorite/nominee";
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(title),
        };
        fetch(url, options)
          .then((res) => res.json())
          .then((data) => console.log(data))
          .catch((err) => console.log(err));
      }
    });
  });
}




// request for database data and tmdb api
const overviewData = new Map();
const actorsOverlayData = new Map();
async function getDataFromDb(year) {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

  const options = {
    method: "GET",
    headers: headers,
  };
  const res = await fetch(`http://localhost:3456/nominees/${year}`, options);
  const db_data = await res.json();
  console.log(db_data);
  let category = "";
  let CardsContainerEl;
  let containerEL;
  const excludedCategories = [
    "CAST IN A MOTION PICTURE",
    "ENSEMBLE IN A COMEDY SERIES",
    "ENSEMBLE IN A DRAMA SERIES",
  ];

  for (const nominee of db_data) {
    if (nominee.category != category) {
      category = nominee.category;
      containerEL = document.createElement("div");
      CardsContainerEl = document.createElement("div");
      CardsContainerEl.className = "CardsContainer";
      containerEL.className = "CardsAndCategory";
      const categoryEL = document.createElement("div");
      categoryEL.className = "CategoryNominalization";
      categoryEL.innerHTML = `<p>Outstanding performance by a</p>
    <h1>${category}</h1>`;
      containerEL.appendChild(categoryEL);
      containerEL.appendChild(CardsContainerEl);
      BigContainerEl.appendChild(containerEL);
      if (nominee.category.toUpperCase().search("STUNT") != -1) {
        containerEL.id = "Stunts";
      } else if (nominee.category.toUpperCase().search("SERIES") != -1)
        containerEL.id = "Series";
      else containerEL.id = "Movies";
    }
    const cardEl = document.createElement("div");
    if (nominee.won === "True") cardEl.className = "Card active";
    else cardEl.className = "Card";
    if (nominee.full_name === null) {
      const data = await tmdbData(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${nominee.show}`
      );
      // const data = await res.json();
      if (data.results && data.results.length > 0) {
        cardEl.innerHTML = `
        <button class ="favorite-button">
        <i class="far fa-heart"></i>
        Mark as favorite
        </button>
          <h1></h1>
          <h3>${data.results[0].title || data.results[0].name}</h3>
          <button class="CardBtn Movies">More info</button>`;
        const winner = cardEl.querySelector("h1");
        if(cardEl.className==="Card active")
        winner.innerText="Winner";
        cardEl.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500/${data.results[0].poster_path})`;
        overviewData.set(
          data.results[0].title || data.results[0].name,
          data.results[0].overview
        );
      } else {
        cardEl.innerHTML = `<h3>Cant find</h3>`;
      }
      CardsContainerEl.appendChild(cardEl);
    } else if (!excludedCategories.includes(category.toUpperCase())) {
      const data = await tmdbData(
        `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${nominee.full_name}`
      );
      if (data.results && data.results.length > 0) {
        cardEl.innerHTML = `
      <button class ="favorite-button">
      <i class="far fa-heart"></i>
      Mark as favorite
      </button>
      <h1></h1>
    <h3 id="ActorName">${data.results[0].name || "Cant find"}</h3>
    <h2 id="ActorShow">${nominee.show || "Cant find"}</h2>
    <button class="CardBtn Actors">More Info</button>`;
        const winner = cardEl.querySelector("h1");
        if(cardEl.className==="Card active")
        winner.innerText="Winner";
        cardEl.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500/${data.results[0].profile_path})`;
        actorsOverlayData.set(data.results[0].name, data.results[0].known_for);
      } else {
        cardEl.innerHTML = `<h3>Cant find</h3>`;
      }
      CardsContainerEl.appendChild(cardEl);
    }
  }
}

async function tmdbData(path) {
  try {
    const res = await fetch(path);
    const cardData = await res.json();
    return cardData;
  } catch (err) {
    console.log("Failed loading tmdb", err);
    throw err;
  }
}

// End of gettingData

// Creating cards
async function CreateELEMENTS(year) {
  BigContainerEl.innerHTML = "";
  const res = await getDataFromDb(year);
  favoriteButton();
  const CardsContainer = document.querySelectorAll(".CardsContainer");
  const overlay = document.querySelectorAll(".overlayCard");
  const ActorsOverlay = document.querySelector(".overlayCard.Actors");
  const moviesOverlay = document.querySelector(".overlayCard.Movies");
  const closebtn = document.querySelectorAll(".overlaybtn");
  const ActorsCardBtn = document.querySelectorAll(".ActorsCardBtn");
  // const Actorsoverlaybtn = document.querySelectorAll(".ActorsCardBtn");
  
  
  const overlayBtnMovies = document.querySelectorAll(".CardBtn.Movies");
  const overlayBtnActors = document.querySelectorAll(".CardBtn.Actors");
  const favoriteBtn = document.querySelectorAll(".favorite-button");

  
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

  //

  CardsContainer.forEach((Container) => {
    let Cards = Container.querySelectorAll(".Card");
    Cards.forEach((Card) => {
      Card.addEventListener("click", () => {
        removeActive(Cards);
        Card.classList.add("active");
      });
    });
  });

  function removeActive(CardsVariable) {
    CardsVariable.forEach((Card) => {
      Card.classList.remove("active");
    });
  }

  closebtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      // overlay.classList.remove("active");
      overlay.forEach((ovr) => {
        ovr.classList.remove("active");
      });
    });
  });
  console.log(overviewData);
  console.log(actorsOverlayData);

  overlayBtnMovies.forEach((btn) => {
    btn.addEventListener("click", () => {
      // const Card = btn.parentElement;
      // console.log(Card);
      const titleEl = document.getElementById("title");
      const overviewEl = document.getElementById("overview");
      const title = btn.parentElement.querySelector("h3").textContent;
      console.log(title);
      titleEl.textContent = title;
      overviewEl.textContent = overviewData.get(title);
      moviesOverlay.classList.add("active");
    });
  });

  overlayBtnActors.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nameEl = document.getElementById("name");
      known_forEl = document.getElementById("known_for");
      const name = btn.parentElement.querySelector("h3").textContent;
      nameEl.textContent = name;
      known_forEl.innerHTML = "";
      actorsOverlayData.get(name).forEach((movie) => {
        const liEl = document.createElement("li");
        liEl.textContent = movie.title || movie.name;
        const overview = document.createElement("p");
        overview.textContent = movie.overview;
        known_forEl.appendChild(liEl);
        known_forEl.appendChild(overview);
      });
      ActorsOverlay.classList.add("active");
    });
  });

  // Filter Btns

  const MovieBtn = document.getElementById("MoviesBTN");
  const StuntsBtn = document.getElementById("StuntsBTN");
  const seriesBtn = document.getElementById("SeriesBTN");
  const StuntsCards = document.querySelectorAll("#Stunts");
  const MoviesCards = document.querySelectorAll("#Movies");
  const seriesCards = document.querySelectorAll("#Series");
  const allbtn = document.getElementById("AllBtn");
  const AllCards = document.querySelectorAll(".CardsAndCategory");

  MovieBtn.addEventListener("click", () => {
    ResetCards();
    StuntsCards.forEach((StuntCard) => {
      StuntCard.classList.add("hidden");
    });
    seriesCards.forEach((card) => {
      card.classList.add("hidden");
    });
  });
  StuntsBtn.addEventListener("click", () => {
    ResetCards();
    MoviesCards.forEach((MoviesCard) => {
      MoviesCard.classList.add("hidden");
    });
    seriesCards.forEach((card) => {
      card.classList.add("hidden");
    });
  });

  seriesBtn.addEventListener("click", () => {
    ResetCards();
    MoviesCards.forEach((card) => {
      card.classList.add("hidden");
    });
    StuntsCards.forEach((card) => {
      card.classList.add("hidden");
    });
  });

  allbtn.addEventListener("click", () => {
    ResetCards();
  });
  function ResetCards() {
    AllCards.forEach(function (Cards) {
      Cards.classList.remove("hidden");
    });
  }


}
//End of creating cards

CreateELEMENTS("2020");

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
