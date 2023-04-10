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
