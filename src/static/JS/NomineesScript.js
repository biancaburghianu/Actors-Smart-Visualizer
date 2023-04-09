const CardsContainer = document.querySelectorAll(".CardsContainer");
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
