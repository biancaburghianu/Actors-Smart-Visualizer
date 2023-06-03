const menuIcon = document.querySelector(".menu-icon");
const navLinks = document.querySelector(".nav-links");



menuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("show-nav");
});

const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener("input", handleSearch);

function exportDataToCSV(data, filename) {
  let csvContent = "data:text/csv;charset=utf-8,";

  csvContent += Object.keys(data[0]).join(",") + "\n";

  data.forEach((item) => {
    const row = Object.values(item).join(",");
    csvContent += row + "\n";
  });

  const encodedURI = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedURI);
  link.setAttribute("download", filename + ".csv");
  link.click();
}

function exportChartToSVG(chartId, filename) {
  Plotly.toImage(chartId, { format: "svg" })
    .then(function (svg) {
      const link = document.createElement("a");
      link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      link.download = filename + ".svg";
      link.click();
    })
    .catch(function (error) {
      console.error("Error exporting chart as SVG:", error);
    });
}

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

/* Login */
const LoginBtn = document.getElementById("UserBtn");
const LoginPannel = document.querySelector(".UserLogin");
LoginBtn.addEventListener("click", () => {
  LoginPannel.classList.toggle("active");
});

/*Actors by year */

function fetchActorsData() {
  const year = document.getElementById("year").value;
  const gender = document.getElementById("gender").value;
  const won = document.getElementById("wonActors").checked;

  console.log("Selected data:");
  console.log("Year:", year);
  console.log("Gender:", gender);
  console.log("Won:", won);

  const ActorsByYear = new XMLHttpRequest();
  ActorsByYear.open(
    "GET",
    `http://localhost:4567/statistics/actorsByYear/${year}/${gender}/${won}`
  );
  ActorsByYear.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  ActorsByYear.onload = function () {
    if (ActorsByYear.status === 200) {
      const actorsData = JSON.parse(ActorsByYear.responseText);
      console.log("Received data:", actorsData);
      createChart(actorsData, "chart");
    } else {
      console.error("Error fetching actors data:", ActorsByYear.status);
    }
  };
  ActorsByYear.send();
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
    responsive: true, // Make the chart responsive
  };

  Plotly.newPlot("ActorsByYear", data, layout);
}

/*Winners by category */
function fetchCategoryData() {
  const category = document.getElementById("Category").value;
  const won = document.getElementById("wonCategory");

  console.log("Selected data:");
  console.log("Category:", category);
  console.log("Won:", won.checked);

  const WinnersByCategory = new XMLHttpRequest();
  WinnersByCategory.open(
    "GET",
    `http://localhost:4567/statistics/winnersByCategory/${encodeURIComponent(
      category
    )}/${won.checked}`
  );
  WinnersByCategory.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  WinnersByCategory.onload = function () {
    if (WinnersByCategory.status === 200) {
      const categoryData = JSON.parse(WinnersByCategory.responseText);
      console.log("Received data:", categoryData);
      createChartWinnersByCategory(categoryData, "WinnersByCategory");
    } else {
      console.error("Error fetching category data:", WinnersByCategory.status);
    }
  };
  WinnersByCategory.send();
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
    responsive: true, // Make the chart responsive
  };

  Plotly.newPlot(divName, data, layout);
}

function updateWonCheckbox() {
  const won = document.getElementById("won");
  won.checked = !won.checked;
}

// BIGGEST WINNERS

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

  const winnersRequest = new XMLHttpRequest();
  winnersRequest.open("GET", "http://localhost:4567/statistics/biggestWinners");
  winnersRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  winnersRequest.onload = function () {
    if (winnersRequest.status === 200) {
      const winnersData = JSON.parse(winnersRequest.responseText);
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
    } else {
      console.error("Error fetching biggest winners:", winnersRequest.status);
    }
  };
  winnersRequest.send();
}

displayBiggestWinnersChart.processWinnersData = function (data) {
  const processedData = data.map((item) => {
    return {
      show: item.show,
      count: item.count,
    };
  });

  return processedData;
};

displayBiggestWinnersChart("BiggestWinners");


// BIGGEST NOMINEES


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

  const showsRequest = new XMLHttpRequest();
  showsRequest.open("GET", "http://localhost:4567/statistics/biggestNominees");
  showsRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  showsRequest.onload = function () {
    if (showsRequest.status === 200) {
      const showsData = JSON.parse(showsRequest.responseText);
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
    } else {
      console.error(
        "Error fetching biggest nominees (shows):",
        showsRequest.status
      );
    }
  };
  showsRequest.send();
}

displayBiggestNomineesChart.processShowsData = function (data) {
  const processedData = data.map((item) => {
    return {
      show: item.show,
      count: item.count,
    };
  });

  return processedData;
};


displayBiggestNomineesChart("BiggestNominees");


// MOST NOMINATED PEOPLE

function displayMostNominatedPeopleChart(divId) {
  function processPeopleData(data) {
    return data.map((item) => {
      return {
        full_name: item.full_name,
        count: item.count,
      };
    });
  }

  const peopleRequest = new XMLHttpRequest();
  peopleRequest.open(
    "GET",
    "http://localhost:4567/statistics/mostNominatedPeople"
  );
  peopleRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  peopleRequest.onload = function () {
    if (peopleRequest.status === 200) {
      const peopleData = JSON.parse(peopleRequest.responseText);
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
    } else {
      console.error(
        "Error fetching most nominated people:",
        peopleRequest.status
      );
    }
  };
  peopleRequest.send();
}

displayMostNominatedPeopleChart.processPeopleData = function (data) {
  return data.map((item) => {
    return {
      full_name: item.full_name,
      count: item.count,
    };
  });
};

displayMostNominatedPeopleChart("MostNominatedPeople");


//PEOPLE WITH MOST STATUES

function displayPeopleWithMostStatuesChart(divId) {
  function processPeopleData(data) {
    return data.map((item) => {
      return {
        full_name: item.full_name,
        count: item.count,
      };
    });
  }

  const PeopleWithMostStatuesRequest = new XMLHttpRequest();
  PeopleWithMostStatuesRequest.open(
    "GET",
    "http://localhost:4567/statistics/peopleWithMostStatues"
  );
  PeopleWithMostStatuesRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  PeopleWithMostStatuesRequest.onload = function () {
    if (PeopleWithMostStatuesRequest.status === 200) {
      const peopleData = JSON.parse(
        PeopleWithMostStatuesRequest.responseText
      );
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

      Plotly.newPlot(
        divId,
        [peopleTrace],
        peopleLayout,
        peopleConfig
      );
    } else {
      console.error(
        "Error fetching people with most statues:",
        PeopleWithMostStatuesRequest.status
      );
    }
  };
  PeopleWithMostStatuesRequest.send();
}

displayPeopleWithMostStatuesChart("PeopleWithMostStatues");


// MOST APPEARED SHOWS
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

  const mashowsRequest = new XMLHttpRequest();
  mashowsRequest.open(
    "GET",
    "http://localhost:4567/statistics/mostAppearedShows"
  );
  mashowsRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  mashowsRequest.onload = function () {
    if (mashowsRequest.status === 200) {
      const showsData = JSON.parse(mashowsRequest.responseText);
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
    } else {
      console.error(
        "Error fetching most appeared shows:",
        mashowsRequest.status
      );
    }
  };

  mashowsRequest.send();
}

displayMostAppearedShowsChart.processMAShowsData = function (data) {
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
};

displayMostAppearedShowsChart("MostAppearedShows");


// PEOPLE THAT MOST APPEARED

function displayMostAppearedPeopleChart(divId) {
  function processPMAShowsData(data) {
    return data.map((item) => {
      const falseCount = item.FalseCount;
      const trueCount = item.TrueCount;
      const totalCount = falseCount + trueCount;
      const falseProportion = falseCount / totalCount;
      const trueProportion = trueCount / totalCount;
      return {
        full_name: item.full_name, // Update property name to full_name
        totalCount: totalCount,
        falseProportion: falseProportion,
        trueProportion: trueProportion,
        falseCount: falseCount,
        trueCount: trueCount,
      };
    });
  }

  const pmashowsRequest = new XMLHttpRequest();
  pmashowsRequest.open(
    "GET",
    "http://localhost:4567/statistics/mostAppearedPeople"
  );
  pmashowsRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  pmashowsRequest.onload = function () {
    if (pmashowsRequest.status === 200) {
      const showsData = JSON.parse(pmashowsRequest.responseText);
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
        x: processedShowsData.map((item) => item.full_name), // Update property name to full_name
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
        x: processedShowsData.map((item) => item.full_name), // Update property name to full_name
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
    } else {
      console.error(
        "Error fetching most appeared shows:",
        pmashowsRequest.status
      );
    }
  };

  pmashowsRequest.send();
}
displayMostAppearedShowsChart.processMAShowsData = function (data) {
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
};
displayMostAppearedPeopleChart("MostAppearedPeople");


//CATEGORY THAT MOST APPEARED

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

  const cmaCategoriesRequest = new XMLHttpRequest();
  cmaCategoriesRequest.open(
    "GET",
    "http://localhost:4567/statistics/mostAppearedCategories"
  );
  cmaCategoriesRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  cmaCategoriesRequest.onload = function () {
    if (cmaCategoriesRequest.status === 200) {
      const categoriesData = JSON.parse(cmaCategoriesRequest.responseText);
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

      const totalCountY = processedCategoriesData.map((item) => item.totalCount);

      const falseCountY = processedCategoriesData.map((item) => item.falseCount);

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
    } else {
      console.error(
        "Error fetching most appeared categories:",
        cmaCategoriesRequest.status
      );
    }
  };

  cmaCategoriesRequest.send();
}
displayMostAppearedCategoriesChart.processCMACategoriesData = function (data) {
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

displayMostAppearedCategoriesChart("MostAppearedCategories");


// ACTORS VS ACTRESESS

function displayActorActressProportionsChart(divId) {
  const actorActressProportionsRequest = new XMLHttpRequest();
  actorActressProportionsRequest.open(
    "GET",
    "http://localhost:4567/statistics/actorActressProportions"
  );
  actorActressProportionsRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  actorActressProportionsRequest.onload = function () {
    if (actorActressProportionsRequest.status === 200) {
      const actorActressProportionsData = JSON.parse(
        actorActressProportionsRequest.responseText
      );

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

      Plotly.newPlot(
        divId,
        [pieTrace],
        pieLayout,
        pieConfig
      );
    } else {
      console.error(
        "Error fetching actor vs actress proportions:",
        actorActressProportionsRequest.status
      );
    }
  };

  actorActressProportionsRequest.send();
}
displayActorActressProportionsChart.processActorActressProportionsData = function(data) {
  return data.map((item) => {
    return {
      category: item.category,
      count: item.count,
    };
  });
}


displayActorActressProportionsChart("ActorVsActressProportions");

// SHOW BY YEAR - NOMINEES

function displayShowByYearNomineesChart(divId) {
  const nomineesRequest = new XMLHttpRequest();
  nomineesRequest.open(
    "GET",
    "http://localhost:4567/statistics/showByYearNominees"
  );
  nomineesRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  nomineesRequest.onload = function () {
    if (nomineesRequest.status === 200) {
      const nomineesData = JSON.parse(nomineesRequest.responseText);

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

      Plotly.newPlot(
        divId,
        nomineesTraces,
        nomineesLayout,
        nomineesConfig
      );
    } else {
      console.error(
        "Error fetching show by year nominees:",
        nomineesRequest.status
      );
    }
  };

  nomineesRequest.send();
}

displayShowByYearNomineesChart("ShowByYearNominees");


//SHOW BY YEAR WINNERS

function displayShowByYearWinnersChart(divId) {
  const showByYearWinnerRequest = new XMLHttpRequest();
  showByYearWinnerRequest.open(
    "GET",
    "http://localhost:4567/statistics/showByYearWinners"
  );
  showByYearWinnerRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  showByYearWinnerRequest.onload = function () {
    if (showByYearWinnerRequest.status === 200) {
      const winnersData = JSON.parse(showByYearWinnerRequest.responseText);

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

      Plotly.newPlot(
        divId,
        winnersTraces,
        winnersLayout,
        winnersConfig
      );
    } else {
      console.error(
        "Error fetching show by year winners:",
        showByYearWinnerRequest.status
      );
    }
  };

  showByYearWinnerRequest.send();
}

displayShowByYearWinnersChart("ShowByYearWinners");


//PEOPLE BY YEAR NOMINNES

function displayPeopleByYearNomineesChart(divId) {
  const peopleByYearNomineesRequest = new XMLHttpRequest();
  peopleByYearNomineesRequest.open(
    "GET",
    "http://localhost:4567/statistics/peopleByYearNominees"
  );
  peopleByYearNomineesRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  peopleByYearNomineesRequest.onload = function () {
    if (peopleByYearNomineesRequest.status === 200) {
      const nomineesData = JSON.parse(peopleByYearNomineesRequest.responseText);

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

      Plotly.newPlot(
        divId,
        nomineesTraces,
        nomineesLayout,
        nomineesConfig
      );
    } else {
      console.error(
        "Error fetching people by year nominees:",
        peopleByYearNomineesRequest.status
      );
    }
  };

  peopleByYearNomineesRequest.send();
}

displayPeopleByYearNomineesChart("PeopleByYearNominees");


// PEOPLE BY TEAR WINNERS

function displayPeopleByYearWinnersChart(divId) {
  const peopleByYearWinnersRequest = new XMLHttpRequest();
  peopleByYearWinnersRequest.open(
    "GET",
    "http://localhost:4567/statistics/peopleByYearWinners"
  );
  peopleByYearWinnersRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  peopleByYearWinnersRequest.onload = function () {
    if (peopleByYearWinnersRequest.status === 200) {
      const winnersData = JSON.parse(peopleByYearWinnersRequest.responseText);

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

      Plotly.newPlot(
        divId,
        winnersTraces,
        winnersLayout,
        winnersConfig
      );
    } else {
      console.error(
        "Error fetching people by year winners:",
        peopleByYearWinnersRequest.status
      );
    }
  };

  peopleByYearWinnersRequest.send();
}

displayPeopleByYearWinnersChart("PeopleByYearWinners");


// WINNING PROPORTION

function displayWinningAndLosingProportionsChart(divId) {
  const winningRequest = new XMLHttpRequest();
  winningRequest.open("GET", "http://localhost:4567/statistics/winning");
  winningRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  winningRequest.onload = function () {
    if (winningRequest.status === 200) {
      const winnersData = JSON.parse(winningRequest.responseText);
      console.log("Winners Data:", winnersData); // Log the retrieved data

      const falseCount = winnersData.falseCount;
      const trueCount = winnersData.trueCount;

      console.log("False Count:", falseCount);
      console.log("True Count:", trueCount);

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
    } else {
      console.error("Error fetching winners:", winningRequest.status);
    }
  };

  winningRequest.send();
}

displayWinningAndLosingProportionsChart("WinningandLosingProportions");


// functiile de exportare ale chart-urilor in format csv, webp si svg
function exportChartBiggestWinners(format) {
  if (format === "csv") {
    const winnersRequest = new XMLHttpRequest();
    winnersRequest.open(
      "GET",
      "http://localhost:4567/statistics/biggestWinners"
    );
    winnersRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    winnersRequest.onload = function () {
      if (winnersRequest.status === 200) {
        const winnersData = JSON.parse(winnersRequest.responseText);
        const processedWinnersData = displayBiggestWinnersChart.processWinnersData(winnersData);
        exportDataToCSV(processedWinnersData, "biggest_winners");
      } else {
        console.error("Error fetching biggest winners:", winnersRequest.status);
      }
    };
    winnersRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("BiggestWinners", {
      format: "webp",
      filename: "BiggestWinners",
    })
      .then(function () {
        console.log("WebP chart downloaded successfully");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("BiggestWinners", {
      format: "svg",
      filename: "BiggestWinners",
    })
      .then(function () {
        console.log("SVG chart downloaded successfully");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}
function exportChartBiggestNominees(format) {
  if (format === "csv") {
    const nomineesRequest = new XMLHttpRequest();
    nomineesRequest.open(
      "GET",
      "http://localhost:4567/statistics/biggestNominees"
    );
    nomineesRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    nomineesRequest.onload = function () {
      if (nomineesRequest.status === 200) {
        const nomineesData = JSON.parse(nomineesRequest.responseText);
        const processedNomineesData = displayBiggestNomineesChart.processShowsData(nomineesData);
        exportDataToCSV(processedNomineesData, "biggest_nominees");
      } else {
        console.error(
          "Error fetching biggest winners:",
          nomineesRequest.status
        );
      }
    };
    nomineesRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("BiggestNominees", {
      format: "webp",
      filename: "BiggestNominees",
    })
      .then(function () {
        console.log("s-a descarcat webp-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("BiggestNominees", {
      format: "svg",
      filename: "BiggestNominees",
    })
      .then(function () {
        console.log("s-a descarcat svg-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

//exportChartMostNominatedPeople

function exportChartMostNominatedPeople(format) {
  if (format === "csv") {
    const nomineesRequest = new XMLHttpRequest();
    nomineesRequest.open(
      "GET",
      "http://localhost:4567/statistics/mostNominatedPeople"
    );
    nomineesRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    nomineesRequest.onload = function () {
      if (nomineesRequest.status === 200) {
        const nomineesData = JSON.parse(nomineesRequest.responseText);
        const processedNomineesData = displayMostNominatedPeopleChart.processPeopleData(nomineesData);
        exportDataToCSV(processedNomineesData, "most_nominated_people");
      } else {
        console.error(
          "Error fetching most nominated people:",
          nomineesRequest.status
        );
      }
    };
    nomineesRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("MostNominatedPeople", {
      format: "webp",
      filename: "MostNominatedPeople",
    })
      .then(function () {
        console.log("s-a descarcat webp-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("MostNominatedPeople", {
      format: "svg",
      filename: "MostNominatedPeople",
    })
      .then(function () {
        console.log("s-a descarcat svg-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}
//exportChartPeopleWithMostStatues
function exportChartPeopleWithMostStatues(format) {
  if (format === "csv") {
    const peopleRequest = new XMLHttpRequest();
    peopleRequest.open(
      "GET",
      "http://localhost:4567/statistics/peopleWithMostStatues"
    );
    peopleRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    peopleRequest.onload = function () {
      if (peopleRequest.status === 200) {
        const peopleData = JSON.parse(peopleRequest.responseText);
        const processedPeopleData = displayMostNominatedPeopleChart.processPeopleData(peopleData);
        exportDataToCSV(processedPeopleData, "people_with_most_statues");
      } else {
        console.error(
          "Error fetching people with most statues:",
          peopleRequest.status
        );
      }
    };
    peopleRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("PeopleWithMostStatues", {
      format: "webp",
      filename: "PeopleWithMostStatues",
    })
      .then(function () {
        console.log("s-a descarcat webp-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("PeopleWithMostStatues", {
      format: "svg",
      filename: "PeopleWithMostStatues",
    })
      .then(function () {
        console.log("s-a descarcat svg-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

//exportChartMostAppearedShows
function exportChartMostAppearedShows(format) {
  if (format === "csv") {
    const showsRequest = new XMLHttpRequest();
    showsRequest.open(
      "GET",
      "http://localhost:4567/statistics/mostAppearedShows"
    );
    showsRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    showsRequest.onload = function () {
      if (showsRequest.status === 200) {
        const showsData = JSON.parse(showsRequest.responseText);
        const processedShowsData = displayMostAppearedShowsChart.processMAShowsData(showsData);
        exportDataToCSV(showsData, "most_appeared_shows");
      } else {
        console.error(
          "Error fetching most appeared shows:",
          showsRequest.status
        );
      }
    };
    showsRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("MostAppearedShows", {
      format: "webp",
      filename: "MostAppearedShows",
    })
      .then(function () {
        console.log("s-a descarcat webp-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("MostAppearedShows", {
      format: "svg",
      filename: "MostAppearedShows",
    })
      .then(function () {
        console.log("s-a descarcat svg-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

//exportChartMostAppearedPeople
function exportChartMostAppearedPeople(format) {
  if (format === "csv") {
    const peopleRequest = new XMLHttpRequest();
    peopleRequest.open(
      "GET",
      "http://localhost:4567/statistics/mostAppearedPeople"
    );
    peopleRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    peopleRequest.onload = function () {
      if (peopleRequest.status === 200) {
        const peopleData = JSON.parse(peopleRequest.responseText);
        const processedPeopleData = displayMostAppearedShowsChart.processMAShowsData(peopleData);
        exportDataToCSV(peopleData, "most_appeared_people");
      } else {
        console.error(
          "Error fetching most appeared shows:",
          peopleRequest.status
        );
      }
    };
    peopleRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("MostAppearedPeople", {
      format: "webp",
      filename: "MostAppearedPeople",
    })
      .then(function () {
        console.log("s-a descarcat webp-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("MostAppearedPeople", {
      format: "svg",
      filename: "MostAppearedPeople",
    })
      .then(function () {
        console.log("s-a descarcat svg-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

//exportChartMostAppearedCategories
function exportChartMostAppearedCategories(format) {
  if (format === "csv") {
    const categoriesRequest = new XMLHttpRequest();
    categoriesRequest.open(
      "GET",
      "http://localhost:4567/statistics/mostAppearedCategories"
    );
    categoriesRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    categoriesRequest.onload = function () {
      if (categoriesRequest.status === 200) {
        const categoriesData = JSON.parse(categoriesRequest.responseText);
        const processedCategoriesData =
        displayMostAppearedCategoriesChart.processCMACategoriesData(categoriesData);
        exportDataToCSV(categoriesData, "most_appeared_categories");
      } else {
        console.error(
          "Error fetching most appeared categories:",
          categoriesRequest.status
        );
      }
    };
    categoriesRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("MostAppearedCategories", {
      format: "webp",
      filename: "MostAppearedCategories",
    })
      .then(function () {
        console.log("s-a descarcat webp-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("MostAppearedCategories", {
      format: "svg",
      filename: "MostAppearedCategories",
    })
      .then(function () {
        console.log("s-a descarcat svg-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

//exportChartActorVsActressProportions
function exportChartActorVsActressProportions(format) {
  if (format === "csv") {
    const actorActressProportionsRequest = new XMLHttpRequest();
    actorActressProportionsRequest.open(
      "GET",
      "http://localhost:4567/statistics/actorActressProportions"
    );
    actorActressProportionsRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    actorActressProportionsRequest.onload = function () {
      if (actorActressProportionsRequest.status === 200) {
        const actorActressProportionsData = JSON.parse(
          actorActressProportionsRequest.responseText
        );

        const processedData = actorActressProportionsData.data.map((item) => {
          return {
            category: item.category,
            count: item.count,
          };
        });
        exportDataToCSV(processedData, "actors_vs_actresses");
      } else {
        console.error(
          "Error fetching actors vs actresses:",
          actorActressProportionsRequest.status
        );
      }
    };
    actorActressProportionsRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("ActorVsActressProportions", {
      format: "webp",
      filename: "ActorVsActressProportions",
    })
      .then(function () {
        console.log("s-a descarcat webp-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("ActorVsActressProportions", {
      format: "svg",
      filename: "ActorVsActressProportions",
    })
      .then(function () {
        console.log("s-a descarcat svg-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

//exportChartShowByYearNominees
function exportChartShowByYearNominees(format) {
  if (format === "csv") {
    const nomineesRequest = new XMLHttpRequest();
    nomineesRequest.open(
      "GET",
      "http://localhost:4567/statistics/showByYearNominees"
    );
    nomineesRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    nomineesRequest.onload = function () {
      if (nomineesRequest.status === 200) {
        const nomineesData = JSON.parse(nomineesRequest.responseText);
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
        exportDataToCSV(filteredNominees, "show_by_year_nominees");
      } else {
        console.error(
          "Error fetching show by year nominees:",
          nomineesRequest.status
        );
      }
    };
    nomineesRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("ShowByYearNominees", {
      format: "webp",
      filename: "ShowByYearNominees",
    })
      .then(function () {
        console.log("WebP chart exported successfully.");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("ShowByYearNominees", {
      format: "svg",
      filename: "ShowByYearNominees",
    })
      .then(function () {
        console.log("SVG chart exported successfully.");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

//exportChartShowByYearWinners
function exportChartShowByYearWinners(format) {
  if (format === "csv") {
    const winnersRequest = new XMLHttpRequest();
    winnersRequest.open(
      "GET",
      "http://localhost:4567/statistics/showByYearWinners"
    );
    winnersRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    winnersRequest.onload = function () {
      if (winnersRequest.status === 200) {
        const winnersData = JSON.parse(winnersRequest.responseText);
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

        exportDataToCSV(filteredWinners, "show_by_year_winners");
      } else {
        console.error(
          "Error fetching show by year winners:",
          winnersRequest.status
        );
      }
    };

    winnersRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("ShowByYearWinners", {
      format: "webp",
      filename: "ShowByYearWinners",
    })
      .then(function () {
        console.log("WebP chart exported successfully.");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("ShowByYearWinners", {
      format: "svg",
      filename: "ShowByYearWinners",
    })
      .then(function () {
        console.log("SVG chart exported successfully.");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}
//exportChartPeopleByYearNominees
function exportChartPeopleByYearNominees(format) {
  if (format === "csv") {
    const nomineesRequest = new XMLHttpRequest();
    nomineesRequest.open(
      "GET",
      "http://localhost:4567/statistics/peopleByYearNominees"
    );
    nomineesRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    nomineesRequest.onload = function () {
      if (nomineesRequest.status === 200) {
        const nomineesData = JSON.parse(nomineesRequest.responseText);
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

        exportDataToCSV(filteredNominees, "people_by_year_nominees");
      } else {
        console.error(
          "Error fetching people by year nominees:",
          nomineesRequest.status
        );
      }
    };

    nomineesRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("PeopleByYearNominees", {
      format: "webp",
      filename: "PeopleByYearNominees",
    })
      .then(function () {
        console.log("WebP chart exported successfully.");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("PeopleByYearNominees", {
      format: "svg",
      filename: "PeopleByYearNominees",
    })
      .then(function () {
        console.log("SVG chart exported successfully.");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

//exportChartPeopleByYearWinners
function exportChartPeopleByYearWinners(format) {
  if (format === "csv") {
    const winnersRequest = new XMLHttpRequest();
    winnersRequest.open(
      "GET",
      "http://localhost:4567/statistics/peopleByYearWinners"
    );
    winnersRequest.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    winnersRequest.onload = function () {
      if (winnersRequest.status === 200) {
        const winnersData = JSON.parse(winnersRequest.responseText);
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

        exportDataToCSV(filteredWinners, "people_by_year_winners");
      } else {
        console.error(
          "Error fetching people by year winners:",
          winnersRequest.status
        );
      }
    };

    winnersRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("PeopleByYearWinners", {
      format: "webp",
      filename: "PeopleByYearWinners",
    })
      .then(function () {
        console.log("WebP chart exported successfully.");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("PeopleByYearWinners", {
      format: "svg",
      filename: "PeopleByYearWinners",
    })
      .then(function () {
        console.log("SVG chart exported successfully.");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

//exportChartWinningandLosingProportions

function exportChartWinningandLosingProportions(format) {
  const winningRequest = new XMLHttpRequest();
  winningRequest.open("GET", "http://localhost:4567/statistics/winning");
  winningRequest.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  winningRequest.onload = function () {
    if (winningRequest.status === 200) {
      const winnersData = JSON.parse(winningRequest.responseText);
      console.log("Winners Data:", winnersData); // Log the retrieved data

      const falseCount = winnersData.falseCount;
      const trueCount = winnersData.trueCount;

      console.log("False Count:", falseCount);
      console.log("True Count:", trueCount);

      if (format === "csv") {
        const data = [
          {
            falseCount: falseCount,
            trueCount: trueCount,
          },
        ];
        exportDataToCSV(data, "winning_and_losing_proportions");
      } else if (format === "webp") {
        Plotly.downloadImage("WinningandLosingProportions", {
          format: "webp",
          filename: "WinningAndLosingProportions",
        })
          .then(function () {
            console.log("WebP chart exported successfully.");
          })
          .catch(function (error) {
            console.error("Error exporting chart as WebP:", error);
          });
      } else if (format === "svg") {
        Plotly.downloadImage("WinningandLosingProportions", {
          format: "svg",
          filename: "WinningAndLosingProportions",
        })
          .then(function () {
            console.log("SVG chart exported successfully.");
          })
          .catch(function (error) {
            console.error("Error exporting chart as SVG:", error);
          });
      }
    } else {
      console.error("Error fetching winners:", winningRequest.status);
    }
  };

  winningRequest.send();
}

// exportChartActorsByYear
function exportChartActorsByYear(format) {
  const year = document.getElementById("year").value;
  const gender = document.getElementById("gender").value;
  const won = document.getElementById("wonActors").checked;

  console.log("Selected data:");
  console.log("Year:", year);
  console.log("Gender:", gender);
  console.log("Won:", won);

  const ActorsByYear = new XMLHttpRequest();
  ActorsByYear.open(
    "GET",
    `http://localhost:4567/statistics/actorsByYear/${year}/${gender}/${won}`
  );
  ActorsByYear.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  ActorsByYear.onload = function () {
    if (ActorsByYear.status === 200) {
      const actorsData = JSON.parse(ActorsByYear.responseText);
      console.log("Received data:", actorsData);

      if (format === "csv") {
        exportDataToCSV(actorsData, "actors_data");
      } else if (format === "webp") {
        Plotly.downloadImage("ActorsByYear", {
          format: "webp",
          filename: "ActorsData",
        })
          .then(function () {
            console.log("WebP chart exported successfully.");
          })
          .catch(function (error) {
            console.error("Error exporting chart as WebP:", error);
          });
      } else if (format === "svg") {
        Plotly.downloadImage("ActorsByYear", {
          format: "svg",
          filename: "ActorsData",
        })
          .then(function () {
            console.log("SVG chart exported successfully.");
          })
          .catch(function (error) {
            console.error("Error exporting chart as SVG:", error);
          });
      }
    } else {
      console.error("Error fetching actors data:", ActorsByYear.status);
    }
  };
  ActorsByYear.send();
}


//exportWinnersByCategory
function exportWinnersByCategory(format) {
  const category = document.getElementById("Category").value;
  const won = document.getElementById("wonCategory");

  console.log("Selected data:");
  console.log("Category:", category);
  console.log("Won:", won.checked);

  const WinnersByCategory = new XMLHttpRequest();
  WinnersByCategory.open(
    "GET",
    `http://localhost:4567/statistics/winnersByCategory/${encodeURIComponent(
      category
    )}/${won.checked}`
  );
  WinnersByCategory.setRequestHeader(
    "Authorization",
    `Bearer ${localStorage.getItem("token")}`
  );
  WinnersByCategory.onload = function () {
    if (WinnersByCategory.status === 200) {
      const categoryData = JSON.parse(WinnersByCategory.responseText);
      console.log("Received data:", categoryData);
      createChartWinnersByCategory(categoryData, "WinnersByCategory");

      if (format === "csv") {
        exportDataToCSV(categoryData, "category_data");
      } else if (format === "webp") {
        Plotly.downloadImage("WinnersByCategory", {
          format: "webp",
          filename: "WinnersByCategory",
        })
          .then(function () {
            console.log("WebP chart exported successfully.");
          })
          .catch(function (error) {
            console.error("Error exporting chart as WebP:", error);
          });
      } else if (format === "svg") {
        Plotly.downloadImage("WinnersByCategory", {
          format: "svg",
          filename: "WinnersByCategory",
        })
          .then(function () {
            console.log("SVG chart exported successfully.");
          })
          .catch(function (error) {
            console.error("Error exporting chart as SVG:", error);
          });
      }
    } else {
      console.error("Error fetching category data:", WinnersByCategory.status);
    }
  };
  WinnersByCategory.send();
}

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
        
        // json to send
        const favoriteStatistic = {

        }
        //

        const url = "http://localhost:3456/favorite/statistics";
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(favoriteStatistic),
        };
        fetch(url,options).then((res)=>res.json()).then((data)=>console.log(data)).catch((err)=>console.log(err));
      }
    });
  });
}

favoriteButton();