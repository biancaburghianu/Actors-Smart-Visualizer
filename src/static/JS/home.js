const menuIcon = document.querySelector(".menu-icon");
const navLinks = document.querySelector(".nav-links");

menuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("show-nav");
  toggleNavLinks();
});

function toggleNavLinks() {
  const navLinks = document.querySelectorAll(".nav-links li a");

  navLinks.forEach((link) => {
    link.style.display = link.style.display === "block" ? "none" : "block";
  });
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
  const nomineeName = await getFavoriteNominee();
  // const nomineeName = "The dark knight";

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
        await generateCard(movie, movie.media_type);
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

    if (searchType === "movie" || searchType === "tv") {
      title = result.title || result.name;
      overview = result.overview;
      imagePath = result.poster_path;
    } else if (result.media_type === "person") {
      title = result.name;
      overview = `Known for: ${result.known_for_department}`;
      imagePath = result.profile_path;
    }

    const imageUrl = imagePath
      ? `https://image.tmdb.org/t/p/w500${imagePath}`
      : "path_catre_o_imagine_alternativa";

    card.innerHTML = `
      <h3>${title}</h3>
      <p>${overview}</p>`;

    card.style.backgroundImage = `url(${imageUrl})`;
  } catch (error) {
    console.error("Error building card:", error);
    card.textContent = "Error building card";
  }
  cardContainer.appendChild(card);
}

generateFavoriteNomineeCard();

//biggest winner

function displayBiggestWinnersChart(divId) {
  function processWinnersData(data) {
    const processedData = data.map((item) => {
      return {
        show: item.show,
        count: item.count,
      };
    });

    return processedData;
  }

  fetch("http://localhost:4567/statistics/biggestWinners", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error("Error fetching biggest winners: " + response.status);
      }
    })
    .then((winnersData) => {
      const processedWinnersData = processWinnersData(winnersData);

      const winnersTrace = {
        x: processedWinnersData.map((item) => item.show),
        y: processedWinnersData.map((item) => item.count),
        text: processedWinnersData.map((item) => item.count),
        textposition: "auto",
        type: "bar",
        marker: {
          color: "blue",
        },
      };

      const winnersLayout = {
        title: "Top 10 Biggest Winners",
      };

      const winnersConfig = {
        responsive: true,
      };

      Plotly.newPlot(divId, [winnersTrace], winnersLayout, winnersConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}

//biggest nominee
function displayBiggestNomineesChart(divId) {
  function processShowsData(data) {
    const processedData = data.map((item) => {
      return {
        show: item.show,
        count: item.count,
      };
    });

    return processedData;
  }

  fetch("http://localhost:4567/statistics/biggestNominees", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching biggest nominees (shows): " + response.status
        );
      }
    })
    .then((showsData) => {
      const processedShowsData = processShowsData(showsData);

      const showsTrace = {
        x: processedShowsData.map((item) => item.show),
        y: processedShowsData.map((item) => item.count),
        text: processedShowsData.map((item) => item.count),
        textposition: "auto",
        type: "bar",
        marker: {
          color: "blue",
        },
      };

      const showsLayout = {
        title: "Biggest Nominees",
      };

      const showsConfig = {
        responsive: true,
      };

      Plotly.newPlot(divId, [showsTrace], showsLayout, showsConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//most nominated people
function displayMostNominatedPeopleChart(divId) {
  function processPeopleData(data) {
    return data.map((item) => {
      return {
        full_name: item.full_name,
        count: item.count,
      };
    });
  }

  fetch("http://localhost:4567/statistics/mostNominatedPeople", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching most nominated people: " + response.status
        );
      }
    })
    .then((peopleData) => {
      const processedPeopleData = processPeopleData(peopleData);

      const peopleTrace = {
        x: processedPeopleData.map((item) => item.full_name),
        y: processedPeopleData.map((item) => item.count),
        text: processedPeopleData.map((item) => item.count),
        textposition: "auto",
        type: "bar",
        marker: {
          color: "blue",
        },
      };

      const peopleLayout = {
        title: "Most Nominated People",
      };

      const peopleConfig = {
        responsive: true,
      };

      Plotly.newPlot(divId, [peopleTrace], peopleLayout, peopleConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//people with most statues
function displayPeopleWithMostStatuesChart(divId) {
  function processPeopleData(data) {
    return data.map((item) => {
      return {
        full_name: item.full_name,
        count: item.count,
      };
    });
  }

  fetch("http://localhost:4567/statistics/peopleWithMostStatues", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching people with most statues: " + response.status
        );
      }
    })
    .then((peopleData) => {
      const processedPeopleData = processPeopleData(peopleData);

      const peopleTrace = {
        x: processedPeopleData.map((item) => item.full_name),
        y: processedPeopleData.map((item) => item.count),
        text: processedPeopleData.map((item) => item.count),
        textposition: "auto",
        type: "bar",
        marker: {
          color: "blue",
        },
      };

      const peopleLayout = {
        title: "People With Most Statues",
      };

      const peopleConfig = {
        responsive: true,
      };

      Plotly.newPlot(divId, [peopleTrace], peopleLayout, peopleConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//most apperd show
function displayMostAppearedShowsChart(divId) {
  function processMAShowsData(data) {
    return data.map((item) => {
      const totalCount = item.TotalAppearance;
      const falseCount = item.FalseCount;
      const trueCount = item.TrueCount;
      const falseProportion = falseCount / totalCount;
      const trueProportion = trueCount / totalCount;
      return {
        show: item.show,
        totalCount: totalCount,
        falseProportion: falseProportion,
        trueProportion: trueProportion,
        falseCount: falseCount,
        trueCount: trueCount,
      };
    });
  }

  fetch("http://localhost:4567/statistics/mostAppearedShows", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching most appeared shows: " + response.status
        );
      }
    })
    .then((showsData) => {
      const processedShowsData = processMAShowsData(showsData);

      const fig = {
        data: [],
        layout: {
          title: "Shows with Most Appearances",
          barmode: "stack",
        },
      };

      const colors = processedShowsData.map(() => [
        "rgba(0, 0, 255, 1)",
        "rgba(255, 0, 0, 1)",
      ]);

      const totalCountY = processedShowsData.map((item) => item.totalCount);

      const falseProportionY = processedShowsData.map(
        (item) => item.falseProportion * item.totalCount
      );

      const trueProportionY = processedShowsData.map(
        (item) => item.trueProportion * item.totalCount
      );

      const falseProportionTrace = {
        x: processedShowsData.map((item) => item.show),
        y: falseProportionY,
        text: falseProportionY,
        textposition: "auto",
        name: "Nominee",
        type: "bar",
        marker: {
          color: colors.map(([, color2]) => color2),
        },
      };

      const trueProportionTrace = {
        x: processedShowsData.map((item) => item.show),
        y: trueProportionY,
        text: trueProportionY,
        textposition: "auto",
        name: "Won",
        type: "bar",
        marker: {
          color: colors.map(([color1]) => color1),
        },
      };
      const figConfig = {
        responsive: true,
      };
      fig.data.push(trueProportionTrace);
      fig.data.push(falseProportionTrace);

      Plotly.newPlot(divId, fig.data, fig.layout, figConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//people that most appeared
function displayMostAppearedPeopleChart(divId) {
  function processPMAShowsData(data) {
    return data.map((item) => {
      const falseCount = item.FalseCount;
      const trueCount = item.TrueCount;
      const totalCount = falseCount + trueCount;
      const falseProportion = falseCount / totalCount;
      const trueProportion = trueCount / totalCount;
      return {
        full_name: item.full_name,
        totalCount: totalCount,
        falseProportion: falseProportion,
        trueProportion: trueProportion,
        falseCount: falseCount,
        trueCount: trueCount,
      };
    });
  }

  fetch("http://localhost:4567/statistics/mostAppearedPeople", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching most appeared people: " + response.status
        );
      }
    })
    .then((showsData) => {
      const processedShowsData = processPMAShowsData(showsData);

      const fig = {
        data: [],
        layout: {
          title: "Most Appeared People",
          barmode: "stack",
        },
      };

      const colors = processedShowsData.map(() => [
        "rgba(0, 0, 255, 1)",
        "rgba(255, 0, 0, 1)",
      ]);

      const totalCountY = processedShowsData.map((item) => item.totalCount);

      const falseCountY = processedShowsData.map((item) => item.falseCount);

      const trueCountY = processedShowsData.map((item) => item.trueCount);

      const falseCountTrace = {
        x: processedShowsData.map((item) => item.full_name),
        y: falseCountY,
        text: falseCountY,
        textposition: "auto",
        name: "Nominee",
        type: "bar",
        marker: {
          color: colors.map(([, color2]) => color2),
        },
      };

      const trueCountTrace = {
        x: processedShowsData.map((item) => item.full_name),
        y: trueCountY,
        text: trueCountY,
        textposition: "auto",
        name: "Won",
        type: "bar",
        marker: {
          color: colors.map(([color1]) => color1),
        },
      };
      const figConfig = {
        responsive: true,
      };

      fig.data.push(trueCountTrace);
      fig.data.push(falseCountTrace);

      Plotly.newPlot(divId, fig.data, fig.layout, figConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//category that most appeared
function displayMostAppearedCategoriesChart(divId) {
  function processCMACategoriesData(data) {
    return data.map((item) => {
      const falseCount = item.FalseCount;
      const trueCount = item.TrueCount;
      const totalCount = falseCount + trueCount;
      const falseProportion = falseCount / totalCount;
      const trueProportion = trueCount / totalCount;
      return {
        category: item.category,
        totalCount: totalCount,
        falseProportion: falseProportion,
        trueProportion: trueProportion,
        falseCount: falseCount,
        trueCount: trueCount,
      };
    });
  }

  fetch("http://localhost:4567/statistics/mostAppearedCategories", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching most appeared categories: " + response.status
        );
      }
    })
    .then((categoriesData) => {
      const processedCategoriesData = processCMACategoriesData(categoriesData);

      const fig = {
        data: [],
        layout: {
          title: "Most Appeared Categories",
          barmode: "stack",
        },
      };

      const colors = processedCategoriesData.map(() => [
        "rgba(0, 0, 255, 1)",
        "rgba(255, 0, 0, 1)",
      ]);

      const totalCountY = processedCategoriesData.map(
        (item) => item.totalCount
      );

      const falseCountY = processedCategoriesData.map(
        (item) => item.falseCount
      );

      const trueCountY = processedCategoriesData.map((item) => item.trueCount);

      const falseCountTrace = {
        x: processedCategoriesData.map((item) => item.category),
        y: falseCountY,
        text: falseCountY,
        textposition: "auto",
        name: "Nominee",
        type: "bar",
        marker: {
          color: colors.map(([, color2]) => color2),
        },
      };

      const trueCountTrace = {
        x: processedCategoriesData.map((item) => item.category),
        y: trueCountY,
        text: trueCountY,
        textposition: "auto",
        name: "Won",
        type: "bar",
        marker: {
          color: colors.map(([color1]) => color1),
        },
      };
      const figConfig = {
        responsive: true,
      };

      fig.data.push(trueCountTrace);
      fig.data.push(falseCountTrace);

      Plotly.newPlot(divId, fig.data, fig.layout, figConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//actors vs actresses
function displayActorActressProportionsChart(divId) {
  fetch("http://localhost:4567/statistics/actorActressProportions", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching actor vs actress proportions: " + response.status
        );
      }
    })
    .then((actorActressProportionsData) => {
      const processedData = actorActressProportionsData.data.map((item) => {
        return {
          category: item.category,
          count: item.count,
        };
      });

      const pieTrace = {
        labels: processedData.map((item) => item.category),
        values: processedData.map((item) => item.count),
        type: "pie",
        marker: {
          colors: processedData.map((item) =>
            item.category === "Actor"
              ? "rgba(0, 0, 255, 1)"
              : "rgba(255, 0, 0, 1)"
          ),
        },
        textinfo: "label+percent",
        textposition: "inside",
      };
      const pieConfig = {
        responsive: true,
      };

      const pieLayout = {
        title: "Actor vs Actress Proportions",
      };

      Plotly.newPlot(divId, [pieTrace], pieLayout, pieConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//show by year nominees
function displayShowByYearNomineesChart(divId) {
  fetch("http://localhost:4567/statistics/showByYearNominees", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching show by year nominees: " + response.status
        );
      }
    })
    .then((nomineesData) => {
      const filteredNominees = [];

      nomineesData.forEach((nominee) => {
        const { year, show, count } = nominee;

        if (year !== 1 && year !== null && year !== " ESQ") {
          const existingNominee = filteredNominees.find(
            (item) => item.year === year
          );

          if (!existingNominee) {
            filteredNominees.push({
              year: year,
              show: show,
              count: count,
            });
          }
        }
      });

      const nomineesTraces = filteredNominees.map((nominee) => {
        return {
          x: [nominee.year],
          y: [nominee.count],
          text: nominee.show,
          textposition: "auto",
          type: "bar",
          name: nominee.year,
          marker: {
            color: "blue",
          },
        };
      });

      const nomineesLayout = {
        title: "Show by Year - Nominees",
        xaxis: {
          title: "Year",
        },
        yaxis: {
          title: "Nominees",
        },
        barmode: "group",
      };

      const nomineesConfig = {
        responsive: true,
      };

      Plotly.newPlot(divId, nomineesTraces, nomineesLayout, nomineesConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//show by year winners
function displayShowByYearWinnersChart(divId) {
  fetch("http://localhost:4567/statistics/showByYearWinners", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching show by year winners: " + response.status
        );
      }
    })
    .then((winnersData) => {
      const filteredWinners = [];

      winnersData.forEach((winner) => {
        const { year, show, count } = winner;

        if (
          year !== 1 &&
          year !== null &&
          year !== " ESQ" &&
          show !== "N/A" &&
          show != "ER"
        ) {
          const existingWinner = filteredWinners.find(
            (item) => item.year === year
          );

          if (!existingWinner) {
            filteredWinners.push({
              year: year,
              show: show,
              count: count,
            });
          }
        }
      });

      const winnersTraces = filteredWinners.map((winner) => {
        return {
          x: [winner.year],
          y: [winner.count],
          text: winner.show,
          textposition: "auto",
          type: "bar",
          name: winner.year,
          marker: {
            color: "blue",
          },
        };
      });

      const winnersLayout = {
        title: "Show by Year - Winners",
        xaxis: {
          title: "Year",
        },
        yaxis: {
          title: "Winners",
        },
        barmode: "group",
      };

      const winnersConfig = {
        responsive: true,
      };

      Plotly.newPlot(divId, winnersTraces, winnersLayout, winnersConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//people by year nominees
function displayPeopleByYearNomineesChart(divId) {
  fetch("http://localhost:4567/statistics/peopleByYearNominees", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching people by year nominees: " + response.status
        );
      }
    })
    .then((nomineesData) => {
      const filteredNominees = [];

      nomineesData.forEach((nominee) => {
        const { year, full_name, count } = nominee;

        if (
          year !== 1 &&
          year !== null &&
          year !== " ESQ" &&
          full_name !== null
        ) {
          const existingNominee = filteredNominees.find(
            (item) => item.year === year
          );

          if (!existingNominee) {
            filteredNominees.push({
              year: year,
              full_name: full_name,
              count: count,
            });
          }
        }
      });

      const nomineesTraces = filteredNominees.map((nominee) => {
        return {
          x: [nominee.year],
          y: [nominee.count],
          text: nominee.full_name,
          textposition: "auto",
          type: "bar",
          name: nominee.year,
          marker: {
            color: "blue",
          },
        };
      });

      const nomineesLayout = {
        title: "People by Year - Nominees",
        xaxis: {
          title: "Year",
        },
        yaxis: {
          title: "Nominees",
        },
        barmode: "group",
      };

      const nomineesConfig = {
        responsive: true,
      };

      Plotly.newPlot(divId, nomineesTraces, nomineesLayout, nomineesConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//people by year winners
function displayPeopleByYearWinnersChart(divId) {
  fetch("http://localhost:4567/statistics/peopleByYearWinners", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error(
          "Error fetching people by year winners: " + response.status
        );
      }
    })
    .then((winnersData) => {
      const filteredWinners = [];

      winnersData.forEach((winner) => {
        const { year, full_name, count } = winner;

        if (
          year !== 1 &&
          year !== null &&
          year !== " ESQ" &&
          full_name !== null
        ) {
          const existingWinner = filteredWinners.find(
            (item) => item.year === year
          );

          if (!existingWinner) {
            filteredWinners.push({
              year: year,
              full_name: full_name,
              count: count,
            });
          }
        }
      });

      const winnersTraces = filteredWinners.map((winner) => {
        return {
          x: [winner.year],
          y: [winner.count],
          text: winner.full_name,
          textposition: "auto",
          type: "bar",
          name: winner.year,
          marker: {
            color: "blue",
          },
        };
      });

      const winnersLayout = {
        title: "People by Year - Winners",
        xaxis: {
          title: "Year",
        },
        yaxis: {
          title: "Winners",
        },
        barmode: "group",
      };

      const winnersConfig = {
        responsive: true,
      };

      Plotly.newPlot(divId, winnersTraces, winnersLayout, winnersConfig);
    })
    .catch((error) => {
      console.error(error);
    });
}
//WINNING PROPORTION
function displayWinningAndLosingProportionsChart(divId) {
  fetch("http://localhost:4567/statistics/winning", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error("Error fetching winners: " + response.status);
      }
    })
    .then((winnersData) => {
      const falseCount = winnersData.falseCount;
      const trueCount = winnersData.trueCount;

      const data = [
        {
          labels: ["False", "True"],
          values: [falseCount, trueCount],
          type: "pie",
          marker: {
            colors: ["red", "blue"],
          },
        },
      ];

      const layout = {
        title: "Winning and Losing Proportions",
      };

      Plotly.newPlot(divId, data, layout);
    })
    .catch((error) => {
      console.error(error);
    });
}
//actor by year
function fetchActorsData() {
  fetch(`http://localhost:4567/statistics/actorsByYear/2020/MALE/True`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error("Error fetching actors data: " + response.status);
      }
    })
    .then((actorsData) => {
      console.log("Received data:", actorsData);
      createChart(actorsData, "chart");
    })
    .catch((error) => {
      console.error(error);
    });
}

function createChart(actorsData, divName) {
  const xData = actorsData.map((actor) => actor.full_name);
  const yData = actorsData.map((actor) => actor.won_count);

  const data = [
    {
      x: xData,
      y: yData,
      type: "bar",
      marker: {
        color: "blue",
      },
    },
  ];

  const layout = {
    title: "Actors' By Year",
    xaxis: { title: "Actor" },
    yaxis: { title: "Won Count" },
    responsive: true,
  };

  Plotly.newPlot("favoriteChart", data, layout);
}
//winners by category
function fetchCategoryData() {
  const category = "CAST IN A MOTION PICTURE";
  const won = true;

  const url = `http://localhost:4567/statistics/winnersByCategory/${encodeURIComponent(
    category
  )}/${won}`;
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        const newToken = response.headers.get("Authorization");
        if (newToken) {
          localStorage.setItem("token", newToken.split(" ")[1]);
        }
        return response.json();
      } else {
        throw new Error("Error fetching category data: " + response.status);
      }
    })
    .then((categoryData) => {
      console.log("Received data:", categoryData);
      createChartWinnersByCategory(categoryData, "favoriteChart");
    })
    .catch((error) => {
      console.error(error);
    });
}

function createChartWinnersByCategory(categoryData, divName) {
  const xData = categoryData.map((category) => category.year);
  const yData = categoryData.map((category) => category.count);
  const resultData = categoryData.map((category) => category.value);

  const data = [
    {
      x: xData,
      y: yData,
      type: "bar",
      text: resultData,
      marker: {
        color: "blue",
      },
    },
  ];

  const layout = {
    title: "Winners by Category",
    xaxis: { title: "Year" },
    yaxis: { title: "Count" },
    responsive: true,
  };

  Plotly.newPlot(divName, data, layout);
}
// favorite statistics
async function fetchFavoriteStatistic() {
  const url = "http://localhost:3456/favorite/statistics";
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
    const data = await response.json();
    const statisticName = data.favoriteStatistic.statisticName;
    console.log("Received favorite statistic name:", statisticName);

    if (statisticName.includes("Biggest Winners")) {
      console.log("The statistic name contains 'Biggest Winners'");
      displayBiggestWinnersChart("favoriteChart");
    } else if (statisticName.includes("Biggest Nominees")) {
      displayBiggestNomineesChart("favoriteChart");
    } else if (statisticName.includes("Most Nominated People")) {
      displayMostNominatedPeopleChart("favoriteChart");
    } else if (statisticName.includes("People With Most Statues")) {
      displayPeopleWithMostStatuesChart("favoriteChart");
    } else if (statisticName.includes("Most Appeared Shows")) {
      displayMostAppearedShowsChart("favoriteChart");
    } else if (statisticName.includes("Most Appeared People")) {
      displayMostAppearedPeopleChart("favoriteChart");
    } else if (statisticName.includes("Most Appeared Category")) {
      displayMostAppearedCategoriesChart("favoriteChart");
    } else if (statisticName.includes("Actor vs Actress")) {
      displayActorActressProportionsChart("favoriteChart");
    } else if (statisticName.includes("Show By Year - Nominees")) {
      displayShowByYearNomineesChart("favoriteChart");
    } else if (statisticName.includes("Show By Year - Winners")) {
      displayShowByYearWinnersChart("favoriteChart");
    } else if (statisticName.includes("People by Year - Nominees")) {
      displayPeopleByYearNomineesChart("favoriteChart");
    } else if (statisticName.includes("People by Year - Winners")) {
      displayPeopleByYearWinnersChart("favoriteChart");
    } else if (statisticName.includes("Winning and Losing")) {
      displayWinningAndLosingProportionsChart("favoriteChart");
    } else if (statisticName.includes("Actors By Year")) {
      fetchActorsData("favoriteChart");
    } else if (statisticName.includes("Winners By Category")) {
      fetchCategoryData("favoriteChart");
    }

    return statisticName;
  } catch (error) {
    console.error("Error fetching favorite statistic:", error);
    return null;
  }
}

fetchFavoriteStatistic();
