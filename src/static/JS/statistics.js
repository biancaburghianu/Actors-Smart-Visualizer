const menuIcon = document.querySelector(".menu-icon");
const navLinks = document.querySelector(".nav-links");

menuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("show-nav");
});

const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener("input", handleSearch);

function handleSearch() {
  const searchTerm = this.value.toLowerCase();
  const statistics = document.querySelectorAll(".statistic");

  statistics.forEach((statistic) => {
    const title = statistic
      .querySelector(".statistic-title")
      .textContent.toLowerCase();

    if (title.includes(searchTerm)) {
      statistic.style.display = "inline-block";
    } else {
      statistic.style.display = "none";
    }
  });
}

const LoginBtn = document.getElementById("UserBtn");
const LoginPannel = document.querySelector(".UserLogin");
LoginBtn.addEventListener("click", () => {
  if (LoginPannel.classList.contains("active"))
    LoginPannel.classList.remove("active");
  else LoginPannel.classList.add("active");
});
const request = new XMLHttpRequest();
request.open("GET", "http://localhost:3456/statistics/biggestWinners");
request.onload = function () {
  if (request.status === 200) {
    const data = JSON.parse(request.responseText);
    console.log(data);
    const groupedData = processData(data);

    const trace = {
      x: groupedData.map((item) => item.show),
      y: groupedData.map((item) => item.count),
      text: groupedData.map((item) => item.count),
      textposition: "auto",
      type: "bar",
    };

    const layout = {
      title: "Top 10 Biggest Winners",
    };

    const fig = Plotly.newPlot("chart", [trace], layout);
  } else {
    console.error("Error fetching biggest winners:", request.status);
  }
};
request.send();

function processData(data) {
  const processedData = data.map((item) => {
    return {
      show: item.show,
      count: item.count,
    };
  });

  return processedData;
}
