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
/*Login*/ 
const LoginBtn = document.getElementById("UserBtn");
const LoginPannel = document.querySelector(".UserLogin");
LoginBtn.addEventListener("click", () => {
  if (LoginPannel.classList.contains("active"))
    LoginPannel.classList.remove("active");
  else LoginPannel.classList.add("active");
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
    };

    const winnersLayout = {
      title: "Top 10 Biggest Winners",
    };

    const winnersConfig = {
      responsive: true
    };

    Plotly.newPlot("BiggestWinners", [winnersTrace], winnersLayout, winnersConfig);
  } else {
    console.error("Error fetching biggest winners:", winnersRequest.status);
  }
};
winnersRequest.send();

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
    };

    const showsLayout = {
      title: "Biggest Nominees",
    };

    const showsConfig = {
      responsive: true,
    };

    Plotly.newPlot("BiggestNominees", [showsTrace], showsLayout, showsConfig);
  } else {
    console.error("Error fetching biggest nominees (shows):", showsRequest.status);
  }
};
showsRequest.send();

// SHOW BY YEAR - NOMINEES 

function showByYearNomineeData(data) {
  return {
    show: data.show,
    count: data.count,
  };
}
  
  

const showByYearNomineeRequest = new XMLHttpRequest();
showByYearNomineeRequest.open("GET", "http://localhost:3456/statistics/showWithHighestFalseCount");
showByYearNomineeRequest.onload = function () {
  if (showByYearNomineeRequest.status === 200) {
    const showData = JSON.parse(showByYearNomineeRequest.responseText);
    const processedShowData = showByYearNomineeData(showData);

    const showsTrace = {
      x: [processedShowData.show],
      y: [processedShowData.count],
      type: "bar",
    };

    const showsLayout = {
      title: "Show with Highest Number of False (won)",
    };

    const showsConfig = {
      responsive: true,
    };

    Plotly.newPlot("ShowByYearNominees", [showsTrace], showsLayout, showsConfig);
  } else {
    console.error("Error fetching show with highest number of false (won):", showByYearNomineeRequest.status);
  }
};
showByYearNomineeRequest.send();
  

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
peopleRequest.open("GET", "http://localhost:3456/statistics/mostNominatedPeople");
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
    };

    const peopleLayout = {
      title: "Most Nominated People",
    };

    const peopleConfig = {
      responsive: true,
    };

    Plotly.newPlot("MostNominatedPeople", [peopleTrace], peopleLayout, peopleConfig);
  } else {
    console.error("Error fetching most nominated people:", peopleRequest.status);
  }
};
peopleRequest.send();

//PEOPLE WITH MOST STATUES


const PeopleWithMostStatuesRequest = new XMLHttpRequest();
PeopleWithMostStatuesRequest.open("GET", "http://localhost:3456/statistics/peopleWithMostStatues");
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
    };

    const peopleLayout = {
      title: "People With Most Statues",
    };

    const peopleConfig = {
      responsive: true,
    };

    Plotly.newPlot("PeopleWithMostStatues", [peopleTrace], peopleLayout, peopleConfig);
  } else {
    console.error("Error fetching most nominated people:", PeopleWithMostStatuesRequest.status);
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
mashowsRequest.open("GET", "http://localhost:3456/statistics/mostAppearedShows");
mashowsRequest.onload = function () {
  if (mashowsRequest.status === 200) {
    const showsData = JSON.parse(mashowsRequest.responseText);
    const processedShowsData = processMAShowsData(showsData);

    const fig = {
      data: [],
      layout: {
        title: 'Shows with Most Appearances',
        barmode: 'stack',
      },
    };

    const colors = processedShowsData.map(() => ["rgba(0, 0, 255, 1)", "rgba(255, 0, 0, 1)"]);

    const totalCountY = processedShowsData.map((item) => item.totalCount);

    const falseProportionY = processedShowsData.map((item) => item.falseProportion * item.totalCount);

    const trueProportionY = processedShowsData.map((item) => item.trueProportion * item.totalCount);

    const falseProportionTrace = {
      x: processedShowsData.map((item) => item.show),
      y: falseProportionY,
      text: falseProportionY,
      textposition: 'auto',
      name: 'Nominee',
      type: 'bar',
      marker: {
        color: colors.map(([, color2]) => color2),
      },
    };

    const trueProportionTrace = {
      x: processedShowsData.map((item) => item.show),
      y: trueProportionY,
      text: trueProportionY,
      textposition: 'auto',
      name: 'Won',
      type: 'bar',
      marker: {
        color: colors.map(([color1]) => color1),
      },
    };
    fig.data.push(trueProportionTrace);
    fig.data.push(falseProportionTrace);

    Plotly.newPlot('MostAppearedShows', fig.data, fig.layout);
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
      show: item.show,
      totalCount: totalCount,
      falseProportion: falseProportion,
      trueProportion: trueProportion,
      falseCount: falseCount,
      trueCount: trueCount,
    };
  });
}

const pmashowsRequest = new XMLHttpRequest();
pmashowsRequest.open("GET", "http://localhost:3456/statistics/mostAppearedPeople");
pmashowsRequest.onload = function () {
  if (pmashowsRequest.status === 200) {
    const showsData = JSON.parse(pmashowsRequest.responseText);
    const processedShowsData = processPMAShowsData(showsData);

    const fig = {
      data: [],
      layout: {
        title: 'Most Appeared People',
        barmode: 'stack',
      },
    };

    const colors = processedShowsData.map(() => ["rgba(255, 0, 0, 1)", "rgba(0, 0, 255, 1)"]);

    const totalCountY = processedShowsData.map((item) => item.totalCount);

    const falseCountY = processedShowsData.map((item) => item.falseCount);

    const trueCountY = processedShowsData.map((item) => item.trueCount);

    const falseCountTrace = {
      x: processedShowsData.map((item) => item.show),
      y: falseCountY,
      text: falseCountY,
      textposition: 'auto',
      name: 'Nominee',
      type: 'bar',
      marker: {
        color: colors.map(([, color2]) => color2),
      },
    };

    const trueCountTrace = {
      x: processedShowsData.map((item) => item.show),
      y: trueCountY,
      text: trueCountY,
      textposition: 'auto',
      name: 'Won',
      type: 'bar',
      marker: {
        color: colors.map(([color1]) => color1),
      },
    };
    fig.data.push(trueCountTrace);
    fig.data.push(falseCountTrace);

    Plotly.newPlot('MostAppearedPeople', fig.data, fig.layout);
  } else {
    console.error("Error fetching most appeared shows:",pmashowsRequest.status);
  }
};

pmashowsRequest.send();
