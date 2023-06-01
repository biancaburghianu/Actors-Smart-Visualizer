const BigContainerEl = document.querySelector(".CardsClass");

// dropdown script
const dropdown = document.querySelector(".select-box")
dropdown.addEventListener("change",()=>{
  const selectedValue = dropdown.value;
  console.log(selectedValue);
  CreateELEMENTS(selectedValue);
})

// request for database data and tmdb api

const API_KEY = "23fe5450a05a0810ba1587ec23e9b849";
const excludedCategories = [
  "CAST IN A MOTION PICTURE",
  "ENSEMBLE IN A COMEDY SERIES",
  "ENSEMBLE IN A DRAMA SERIES",
];

async function getDataFromDb(year) {
  const res = await fetch(`http://localhost:3456/nominees/${year}`);
  const data = await res.json();
  console.log(data);
  let category = "";
  let CardsContainerEl;
  let containerEL;

  data.forEach((nominee) => {
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
      if (nominee.category.toUpperCase().indexOf("STUNT") != -1) {
        containerEL.id = "Stunts";
      }
      if (nominee.category.search("SERIES") != -1) containerEL.id = "Series";
      else containerEL.id = "Movies";
    }

    const cardEl = document.createElement("div");
    if (nominee.won === "True") cardEl.className = "Card active";
    else cardEl.className = "Card";
    CardsContainerEl.appendChild(cardEl);

    if (nominee.full_name === null) {
      // Code for nominees without full_name
      const response = fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${nominee.show}`
      )
        .then((response) => response.json())
        .then((MovieData) => {
          cardEl.innerHTML = `
    <h3>${MovieData.results[0].title || MovieData.results[0].name}</h3>
    <button class="CardBtn">View Cast</button>`;
          cardEl.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500/${MovieData.results[0].poster_path})`;
        })
        .catch((err) => console.log(err));
    } else if (!excludedCategories.includes(nominee.category.toUpperCase())) {
      // Code for nominees with full_name (excluding specific categories)
      const response = fetch(
        `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${nominee.full_name}`
      )
        .then((response) => response.json())
        .then((ActorData) => {
          cardEl.innerHTML = `
    <h3>${ActorData.results[0].name}</h3>
    <h2>${nominee.show}<h2>
    <button class="ActorsCardBtn">More Info</button>`;
          cardEl.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500/${ActorData.results[0].profile_path})`;
        })
        .catch((err) => console.log(err));
    } else {
      cardEl.remove(); // Remove the card for excluded categories with full_name
    }
  });
}




// End of gettingData

// Creating cards
async function CreateELEMENTS(year) {
  BigContainerEl.innerHTML='';
  const res = await getDataFromDb(year);
  const CardsContainer = document.querySelectorAll(".CardsContainer");
  const overlay = document.querySelectorAll(".overlayCard");
  const ActorsOverlay = document.querySelector(".overlayCard.Actors");
  const CastOverlay = document.querySelector(".overlayCard.Cast");
  const closebtn = document.querySelectorAll(".overlaybtn");
  const overlaybtn = document.querySelectorAll(".CardBtn");
  const ActorsCardBtn = document.querySelectorAll(".ActorsCardBtn");
  const Actorsoverlaybtn = document.querySelectorAll(".ActorsCardBtn");
  const LoginBtn = document.getElementById("UserBtn");
  const LoginPannel = document.querySelector(".UserLogin");

  //  Login Script

  LoginBtn.addEventListener("click", () => {
    if (LoginPannel.classList.contains("active"))
      LoginPannel.classList.remove("active");
    else LoginPannel.classList.add("active");
  });

  //  End

  //
  const menuIcon = document.querySelector(".menu-icon");
  const navLinks = document.querySelector(".nav-links");

  menuIcon.addEventListener("click", () => {
    navLinks.classList.toggle("show-nav");
  });

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

  overlaybtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      CastOverlay.classList.add("active");
    });
  });
  ActorsCardBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      ActorsOverlay.classList.add("active");
    });
  });

  // Filter Btns

  const MovieBtn = document.getElementById("MoviesBTN");
  const StuntsBtn = document.getElementById("StuntsBTN");
  const StuntsCards = document.querySelectorAll("#Stunts");
  const MoviesCards = document.querySelectorAll("#Movies");
  const allbtn = document.getElementById("AllBtn");
  const AllCards = document.querySelectorAll(".CardsAndCategory");

  MovieBtn.addEventListener("click", () => {
    ResetCards();
    StuntsCards.forEach((StuntCard) => {
      StuntCard.classList.add("hidden");
    });
  });
  StuntsBtn.addEventListener("click", () => {
    ResetCards();
    MoviesCards.forEach((MoviesCard) => {
      MoviesCard.classList.add("hidden");
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

CreateELEMENTS('2020');

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
