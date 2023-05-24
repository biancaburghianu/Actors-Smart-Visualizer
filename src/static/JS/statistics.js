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

// BIGGEST WINNERS
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
winnersRequest.open("GET", "http://localhost:3456/statistics/biggestWinners");
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

    Plotly.newPlot(
      "BiggestWinners",
      [winnersTrace],
      winnersLayout,
      winnersConfig
    );
  } else {
    console.error("Error fetching biggest winners:", winnersRequest.status);
  }
};
winnersRequest.send();

function exportChartBiggestWinners(format) {
  if (format === "csv") {
    const winnersRequest = new XMLHttpRequest();
    winnersRequest.open(
      "GET",
      "http://localhost:3456/statistics/biggestWinners"
    );
    winnersRequest.onload = function () {
      if (winnersRequest.status === 200) {
        const winnersData = JSON.parse(winnersRequest.responseText);
        const processedWinnersData = processWinnersData(winnersData);
        exportDataToCSV(processedWinnersData, "biggest_winners");
      } else {
        console.error("Error fetching biggest winners:", winnersRequest.status);
      }
    };
    winnersRequest.send();
  } else if (format === "webp") {
    Plotly.downloadImage("BiggestWinners", {
      format: "webp",
      filename: "BiggestWinners.webp",
    })
      .then(function () {
        console.log("s-a descarcat webp-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as WebP:", error);
      });
  } else if (format === "svg") {
    Plotly.downloadImage("BiggestWinners", {
      format: "svg",
      filename: "BiggestWinners.svg",
    })
      .then(function () {
        console.log("s-a descarcat svg-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}

// BIGGEST NOMINEES

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
showsRequest.open("GET", "http://localhost:3456/statistics/biggestNominees");
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

    Plotly.newPlot("BiggestNominees", [showsTrace], showsLayout, showsConfig);
  } else {
    console.error(
      "Error fetching biggest nominees (shows):",
      showsRequest.status
    );
  }
};
showsRequest.send();

// MOST NOMINATED PEOPLE

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
  "http://localhost:3456/statistics/mostNominatedPeople"
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

    Plotly.newPlot(
      "MostNominatedPeople",
      [peopleTrace],
      peopleLayout,
      peopleConfig
    );
  } else {
    console.error(
      "Error fetching most nominated people:",
      peopleRequest.status
    );
  }
};
peopleRequest.send();

//PEOPLE WITH MOST STATUES

const PeopleWithMostStatuesRequest = new XMLHttpRequest();
PeopleWithMostStatuesRequest.open(
  "GET",
  "http://localhost:3456/statistics/peopleWithMostStatues"
);
PeopleWithMostStatuesRequest.onload = function () {
  if (PeopleWithMostStatuesRequest.status === 200) {
    const peopleData = JSON.parse(PeopleWithMostStatuesRequest.responseText);
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
      "PeopleWithMostStatues",
      [peopleTrace],
      peopleLayout,
      peopleConfig
    );
  } else {
    console.error(
      "Error fetching most nominated people:",
      PeopleWithMostStatuesRequest.status
    );
  }
};
PeopleWithMostStatuesRequest.send();

// MOST APPEARED SHOWS
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
  "http://localhost:3456/statistics/mostAppearedShows"
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

    Plotly.newPlot("MostAppearedShows", fig.data, fig.layout, figConfig);
  } else {
    console.error("Error fetching most appeared shows:", mashowsRequest.status);
  }
};

mashowsRequest.send();

// PEOPLE THAT MOST APPEARED

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
  "http://localhost:3456/statistics/mostAppearedPeople"
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

    Plotly.newPlot("MostAppearedPeople", fig.data, fig.layout, figConfig);
  } else {
    console.error(
      "Error fetching most appeared shows:",
      pmashowsRequest.status
    );
  }
};

pmashowsRequest.send();

//CATEGORY THAT MOST APPEARED

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
  "http://localhost:3456/statistics/mostAppearedCategories"
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

    Plotly.newPlot("MostAppearedCategories", fig.data, fig.layout, figConfig);
  } else {
    console.error(
      "Error fetching most appeared categories:",
      cmaCategoriesRequest.status
    );
  }
};

cmaCategoriesRequest.send();

// ACTORS VS ACTRESESS

const actorActressProportionsRequest = new XMLHttpRequest();
actorActressProportionsRequest.open(
  "GET",
  "http://localhost:3456/statistics/actorActressProportions"
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
      "ActorVsActressProportions",
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

// SHOW BY YEAR - NOMINEES

const nomineesRequest = new XMLHttpRequest();
nomineesRequest.open(
  "GET",
  "http://localhost:3456/statistics/showByYearNominees"
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
      "ShowByYearNominees",
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

//SHOW BY YEAR WINNERS

const showByYearWinnerRequest = new XMLHttpRequest();
showByYearWinnerRequest.open(
  "GET",
  "http://localhost:3456/statistics/showByYearWinners"
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
      "ShowByYearWinners",
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

//PEOPLE BY YEAR NOMINNES

const peopleByYearNomineesRequest = new XMLHttpRequest();
peopleByYearNomineesRequest.open(
  "GET",
  "http://localhost:3456/statistics/peopleByYearNominees"
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
      "PeopleByYearNominees",
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

// PEOPLE BY TEAR WINNERS

const peopleByYearWinnersRequest = new XMLHttpRequest();
peopleByYearWinnersRequest.open(
  "GET",
  "http://localhost:3456/statistics/peopleByYearWinners"
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
      "PeopleByYearWinners",
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

// WINNING PROPORTION

const winningRequest = new XMLHttpRequest();
winningRequest.open("GET", "http://localhost:3456/statistics/winning");
winningRequest.onload = function () {
  if (winningRequest.status === 200) {
    const winnersData = JSON.parse(winningRequest.responseText);
    console.log("Winners Data:", winnersData); // Log the retrieved data

    const falseCount = winnersData.falseCount;
    const trueCount = winnersData.trueCount;

    console.log("False Count:", falseCount);
    console.log("True Count:", trueCount);

    // Create data array for the pie chart
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

    // Set layout options for the pie chart
    const layout = {
      title: "Winning and Losing Proportions",
    };

    // Plot the pie chart
    Plotly.newPlot("WinningandLosingProportions", data, layout);
  } else {
    console.error("Error fetching winners:", winningRequest.status);
  }
};

winningRequest.send();

// functiile de exportare ale chart-urilor in format csv, webp si svg
function exportChartBiggestWinners(format) {
  if (format === "csv") {
    const winnersRequest = new XMLHttpRequest();
    winnersRequest.open(
      "GET",
      "http://localhost:3456/statistics/biggestWinners"
    );
    winnersRequest.onload = function () {
      if (winnersRequest.status === 200) {
        const winnersData = JSON.parse(winnersRequest.responseText);
        const processedWinnersData = processWinnersData(winnersData);
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
        console.log("s-a descarcat webp-ul");
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
        console.log("s-a descarcat svg-ul");
      })
      .catch(function (error) {
        console.error("Error exporting chart as SVG:", error);
      });
  }
}
