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

async function getDataFromDb(year) {
  const res = await fetch(`http://localhost:3456/nominees/${year}`);
  const data = await res.json();
  let category = "";
  let CardsContainerEl;
  let containerEL;
  const excludedCategories = [
    "CAST IN A MOTION PICTURE",
    "ENSEMBLE IN A COMEDY SERIES",
    "ENSEMBLE IN A DRAMA SERIES",
  ];

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
      if (nominee.category.toUpperCase().search("STUNT") != -1) {
        containerEL.id = "Stunts";
      }
      else if (nominee.category.toUpperCase().search("SERIES") != -1) containerEL.id = "Series";
      else containerEL.id = "Movies";
    }
    const cardEl = document.createElement("div");
    if (nominee.won === "True") cardEl.className = "Card active";
    else cardEl.className = "Card";
    if (nominee.full_name === null) {

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
        CardsContainerEl.appendChild(cardEl);
    } else if(!excludedCategories.includes(category.toUpperCase())) {
      const response = fetch(
        `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${nominee.full_name}`
      )
        .then((response) => response.json())
        .then((ActorData) => {
          cardEl.innerHTML = `
    <h3>${ActorData.results[0].name}</h3>
    <h2>${nominee.show}</h2>
    <button class="ActorsCardBtn">More Info</button>`;
          cardEl.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500/${ActorData.results[0].profile_path})`;
          
        })
        .catch((err) => console.log(err));
        CardsContainerEl.appendChild(cardEl);
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
  // const Actorsoverlaybtn = document.querySelectorAll(".ActorsCardBtn");
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
        console.log("Button working");
      });
    });
  });

  overlaybtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      CastOverlay.classList.add("active");
      console.log("Button working");
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
    seriesCards.forEach((card)=>{
      card.classList.add("hidden");
    })
  });
  StuntsBtn.addEventListener("click", () => {
    ResetCards();
    MoviesCards.forEach((MoviesCard) => {
      MoviesCard.classList.add("hidden");
    });
    seriesCards.forEach((card)=>{
      card.classList.add("hidden");
    })
  });

  seriesBtn.addEventListener("click",()=>{
    ResetCards();
    MoviesCards.forEach((card)=>{
      card.classList.add("hidden");
    });
    StuntsCards.forEach((card)=>{
      card.classList.add("hidden");
    })
  })

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