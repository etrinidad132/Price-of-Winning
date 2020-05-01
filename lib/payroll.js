document.addEventListener("DOMContentLoaded", () => {
  let header = document.getElementById("payroll-header");

  const filter = {
    type: "TeamPayroll",
    league: "MLB",
    division: "all",
    render: false,
  };

  const headerSetter = function () {
    //changes the header of the chart
    let headerText;

    if (filter.type === "TeamPayroll") {
      headerText =
        filter.division === "all"
          ? `${filter.league}: Payroll By Team 2019`
          : `${filter.league} ${filter.division}: Payroll By Team 2019`;
    } else {
      headerText =
        filter.division === "all"
          ? `${filter.league}: Cost Per Win 2019`
          : `${filter.league} ${filter.division}: Cost Per Win 2019`;
    }
    header.innerText = headerText;
  };

  const button0 = document.getElementById("cost-win-0"); //  Data Toggle
  button0.onclick = (event) => {
    let type = "";
    let text = event.currentTarget.innerText;

    if (text === "Cost Per Win") {
      type = "WinCost";
      text = "MLB Total Salary";
    } else {
      type = "TeamPayroll";
      text = "Cost Per Win";
    }

    event.currentTarget.innerText = text;
    filter.type = type;
    headerSetter();
    update(filter);
  };

  const button1 = document.getElementById("mlb-1"); //  MLB
  button1.onclick = () => {
    filter.type = "TeamPayroll";
    filter.league = "MLB";
    filter.division = "all";
    filter.render = true;
    headerSetter();

    update(filter);
    filter.render = false;
  };

  const button2 = document.getElementById("al-2"); //  AL
  button2.onclick = () => {
    if (filter.league !== "AL") filter.render = true;
    filter.league = "AL";
    filter.division = "all";
    headerSetter();

    update(filter);
    filter.render = false;
  };

  const button3 = document.getElementById("nl-3"); //  NL
  button3.onclick = () => {
    if (filter.league !== "NL") filter.render = true;
    filter.league = "NL";
    filter.division = "all";
    headerSetter();

    update(filter);
    filter.render = false;
  };

  const button4 = document.getElementById("al-east-4"); // AL EAST
  button4.onclick = () => {
    if (filter.league !== "East") filter.render = true;
    filter.league = "AL";
    filter.division = "East";
    headerSetter();

    update(filter);
    filter.render = false;
  };

  const button5 = document.getElementById("al-central-5"); // AL Central
  button5.onclick = () => {
    if (filter.league !== "Central") filter.render = true;
    filter.league = "AL";
    filter.division = "Central";
    headerSetter();

    update(filter);
    filter.render = false;
  };

  const button6 = document.getElementById("al-west-6"); // AL West
  button6.onclick = () => {
    if (filter.league !== "West") filter.render = true;
    filter.league = "AL";
    filter.division = "West";
    headerSetter();

    update(filter);
    filter.render = false;
  };

  const button7 = document.getElementById("nl-east-7"); // NL East
  button7.onclick = () => {
    if (filter.league !== "East") filter.render = true;
    filter.league = "NL";
    filter.division = "East";
    headerSetter();

    update(filter);
    filter.render = false;
  };

  const button8 = document.getElementById("nl-central-8"); // NL Central
  button8.onclick = () => {
    if (filter.league !== "Central") filter.render = true;
    filter.league = "NL";
    filter.division = "Central";
    headerSetter();

    update(filter);
    filter.render = false;
  };

  const button9 = document.getElementById("nl-west-9"); // NL West
  button9.onclick = () => {
    if (filter.league !== "West") filter.render = true;
    filter.league = "NL";
    filter.division = "West";
    headerSetter();

    update(filter);
    filter.render = false;
  };

  const margin = { top: 60, right: 60, bottom: 140, left: 120 },
    width = 1400 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  const svg = d3
    .select("#payroll")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const x = d3.scaleBand().range([0, width]).padding(1);

  const xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")");

  const y = d3.scaleLinear().range([height, 0]);

  const yAxis = svg.append("g");

  function update(filter) {
    if (filter.render) {
      // determines if rendering the entire chart is needed
      const lines = Array.from(document.querySelectorAll("line"));

      lines.forEach((line) => {
        line.parentNode.removeChild(line);
      });

      const images = Array.from(document.querySelectorAll("image"));

      images.forEach((image) => {
        image.parentNode.removeChild(image);
      });
    }

    const numberWithCommas = function (x) {
      // turns numbers into a comma seperated number string (ex 1000000 => 1,000,000) from stack overflow
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    d3.csv("../data/payroll.csv", function (data) {
      data.forEach((team) => {
        // adds winCost property to team objects
        let winCost = Math.floor(
          +team.TeamPayroll.split(",").join("") / team.W
        );
        team["WinCost"] = numberWithCommas(winCost);
      });

      switch (
        filter.league // filters data from csv by the league selected
      ) {
        case "MLB":
          break;
        case "AL":
          data = data.filter((team) => {
            return team.League === filter.league;
          });
          break;

        case "NL":
          data = data.filter((team) => {
            return team.League === filter.league;
          });
          break;

        default:
          break;
      }

      switch (
        filter.division // filters data from csv by the division selected
      ) {
        case "all":
          break;
        case "East":
          data = data.filter((team) => {
            return team.Division === filter.division;
          });
          break;

        case "Central":
          data = data.filter((team) => {
            return team.Division === filter.division;
          });
          break;

        case "West":
          data = data.filter((team) => {
            return team.Division === filter.division;
          });
          break;

        default:
          break;
      }

      x.domain(
        data.map(function (d) {
          return d.TeamName; /// x axis angle labels
        })
      );
      xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x))
        .attr("transform", "translate(-0.2," + height + ")")
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-40)") // angle on x-axis labels
        .style("text-anchor", "end")
        .attr("x", -8);

      const maxY = d3.max(data, function (d) {
        return +d[filter.type].split(",").join(""); // + to coerce into number
      });

      y.domain([0, maxY]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      const line = svg.selectAll(".Line").data(data);

      line // individual lines in graph
        .enter()
        .append("line")
        .attr("class", "Line")
        .merge(line)
        .transition()
        .duration(1000)
        .attr("x1", function (d) {
          return x(d.TeamName);
        })
        .attr("x2", function (d) {
          return x(d.TeamName);
        })
        .attr("y1", y(0))
        .attr("y2", function (d) {
          return y(d[filter.type].split(",").join(""));
        })
        .attr("opacity", 0.5)
        .attr("color", "red");

      const logos = svg.selectAll("image").data(data);

      logos
        .enter()
        .append("svg:image")
        .merge(logos)
        .transition()
        .duration(1000)
        .attr("x", function (d) {
          return x(d.TeamName) - 20;
        })
        .attr("y", function (d) {
          return y(d[filter.type].split(",").join("")) - 20;
        })
        .attr("width", 40)
        .attr("height", 40)
        .attr("xlink:href", function (d) {
          return `../images/team/${d.Code}.png`; // cycles image for the top of the team line based on the teams unique code
        });

      svg
        .selectAll("image")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

      function handleMouseOver(d, i) {
        svg
          .append("text")
          .attr("class", "hoverValue")
          .attr("x", x(d.TeamName) - 80)
          .attr("y", y(d[filter.type].split(",").join("")) - 35) // y-axis height of hover
          .text("$" + d[filter.type]) // text on hover
          .attr("style", "font-size: 30px");

      }

      function handleMouseOut(d, i) {
        d3.select(".hoverValue").remove();
      }

      svg
        .append("text")
        .attr("class", "source")
        .attr("x", width - 150)
        .attr("y", height + 100)
        .attr("text-anchor", "start")
        .text("Baseball Prospectus, 2019");
    });
  }

  update({
    type: "TeamPayroll",
    league: "MLB",
    division: "all",
  }); 
});
