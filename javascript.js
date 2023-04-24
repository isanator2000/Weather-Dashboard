 // variables in global scope
 var city;
 var cities;

 var day1 = moment().add(1, "days").format("l");
 var day2 = moment().add(2, "days").format("l");
 var day3 = moment().add(3, "days").format("l");
 var day4 = moment().add(4, "days").format("l");
 var day5 = moment().add(5, "days").format("l");

 var NowMoment = moment().format("l");

//looks for the city chosen in the api
 function search() {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430";
    var coords = [];

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      
      coords.push(response.coord.lat);
      coords.push(response.coord.lon);
      var cityName = response.name;
      var cityCond = response.weather[0].description.toUpperCase();
      var cityTemp = response.main.temp;
      var cityHum = response.main.humidity;
      var cityWind = response.wind.speed;
      var icon = response.weather[0].icon;
      $("#icon").html(
        `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`
      );
      $("#city-name").html(cityName + " " + "(" + NowMoment + ")");
      $("#city-cond").text("Current Conditions: " + cityCond);
      $("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
      $("#humidity").text("Humidity: " + cityHum + "%");
      $("#wind-speed").text("Wind Speed: " + cityWind + "mph");
      $("#date1").text(day1);
      $("#date2").text(day2);
      $("#date3").text(day3);
      $("#date4").text(day4);
      $("#date5").text(day5);

      getUV(response.coord.lat, response.coord.lon);
    })


    function getUV(lat, lon) {
     
        
        $.ajax({
          url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly" + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430",
          method: "GET",
        }).then(function (response) {
  
          var uvIndex = response.current.uvi;
          $("#uv-index").text("UV Index:" + " " + uvIndex);
          if (uvIndex >= 8) {
            $("#uv-index").css("color", "#9b5de5");
          } else if (uvIndex > 4 && uvIndex < 8) {
            $("#uv-index").css("color", "#00bbf9");
          } else {
            $("#uv-index").css("color", "#00f5d4");
          }
          var cityHigh = response.daily[0].temp.max;
          $("#high").text("Expected high (F): " + " " + cityHigh);
  
          var day1temp = response.daily[1].temp.max;
          var day2temp = response.daily[2].temp.max;
          var day3temp = response.daily[3].temp.max;
          var day4temp = response.daily[4].temp.max;
          var day5temp = response.daily[5].temp.max;
          var day1hum = response.daily[1].humidity;
          var day2hum = response.daily[2].humidity;
          var day3hum = response.daily[3].humidity;
          var day4hum = response.daily[4].humidity;
          var day5hum = response.daily[5].humidity;
          var icon1 = response.daily[1].weather[0].icon;
          var icon2 = response.daily[2].weather[0].icon;
          var icon3 = response.daily[3].weather[0].icon;
          var icon4 = response.daily[4].weather[0].icon;
          var icon5 = response.daily[5].weather[0].icon;

          $("#temp1").text("Temp(F):" + " " + day1temp.toFixed(1));
          $("#temp2").text("Temp(F):" + " " + day2temp.toFixed(1));
          $("#temp3").text("Temp(F):" + " " + day3temp.toFixed(1));
          $("#temp4").text("Temp(F):" + " " + day4temp.toFixed(1));
          $("#temp5").text("Temp(F):" + " " + day5temp.toFixed(1));
  
          $("#hum1").text("Hum:" + " " + day1hum + "%");
          $("#hum2").text("Hum:" + " " + day2hum + "%");
          $("#hum3").text("Hum:" + " " + day3hum + "%");
          $("#hum4").text("Hum:" + " " + day4hum + "%");
          $("#hum5").text("Hum:" + " " + day5hum + "%");
  
          $("#icon1").html(
            `<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`
          );
          $("#icon2").html(
            `<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`
          );
          $("#icon3").html(
            `<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`
          );
          $("#icon4").html(
            `<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`
          );
          $("#icon5").html(
            `<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`
          );
        });
      }
    }

//loads the most recent city searched that was stored in the local storage to show when refreshing the page
 function loadMostRecent() {
    var lastSearch = localStorage.getItem("mostRecent");
    city = lastSearch ? lastSearch : "Monterrey";
    search();
  }

  loadMostRecent()

  //loads the list of the most recent cities searched to show them in a list
  function loadRecentCities() {
    const storedCities = localStorage.getItem("cities");
    
    if (storedCities !== null) {
      cities = JSON.parse(storedCities);
    } else {
      cities = [];
    }
  }

  loadRecentCities()

  //retrieves the info of the city the user chose
  function getCity() {
    city = $("#city-input").val();
    if (city && cities.includes(city) === false) {
      saveinLocalStorage();
      return city;
    }
  }

  //saves the city in the local storage
  function saveinLocalStorage() {
    localStorage.setItem("mostRecent", city);
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }

            //event listener for the submit button
            $("#submit").click(function(e) {
            e.preventDefault();
            getCity();
            search();
            $("#city-input").val("");
            listCities();
            });


    //SHOWS the list obtained on the loadRecentCities function on the page
    function listCities() {
    $("#citiesList").text("");
    cities.forEach((city) => {
    $("#citiesList").prepend("<tr><td>" + city + "</td></tr>");
    });
    }

    listCities();

        //event listener to display one of the cities of the previously searched cities when you click on it
        $(document).click("td", function(e) {
            e.preventDefault();
            var listedCity = $(e.target).text();
            city = listedCity;
            search();
        });

        //event listener for the clear button, clears the recently searched cities
        $("#clearButton").click(function() {
            localStorage.removeItem("cities");
            loadRecentCities();
            listCities();
        });

  