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