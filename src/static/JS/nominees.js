const CardsContainer = document.querySelectorAll(".CardsContainer");
const overlay = document.querySelectorAll(".overlayCard");
const ActorsOverlay = document.querySelector(".overlayCard.Actors");
const CastOverlay = document.querySelector(".overlayCard.Cast");
const closebtn = document.querySelectorAll(".overlaybtn");
const overlaybtn = document.querySelectorAll(".CardBtn");
const ActorsCardBtn = document.querySelectorAll(".ActorsCardBtn");
const Actorsoverlaybtn = document.querySelectorAll(".ActorsCardBtn");
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
