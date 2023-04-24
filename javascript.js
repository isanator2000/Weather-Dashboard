 // variables in global scope
 var city;
 var cities;

 var day1 = moment().add(1, "days").format("l");
 var day2 = moment().add(2, "days").format("l");
 var day3 = moment().add(3, "days").format("l");
 var day4 = moment().add(4, "days").format("l");
 var day5 = moment().add(5, "days").format("l");

 var NowMoment = moment().format("l");

 function loadMostRecent() {
    var lastSearch = localStorage.getItem("mostRecent");
    city = lastSearch ? lastSearch : "Monterrey";
    search();
  }

  loadMostRecent()

  function loadRecentCities() {
    const storedCities = localStorage.getItem("cities");
    
    if (storedCities !== null) {
      cities = JSON.parse(storedCities);
    } else {
      cities = [];
    }
  }

  loadRecentCities()

  function getCity() {
    city = $("#city-input").val();
    if (city && cities.includes(city) === false) {
      saveinLocalStorage();
      return city;
    } else if (!city) {
      alert("Please enter a valid city");
    }
  }

  function saveinLocalStorage() {
    localStorage.setItem("mostRecent", city);
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }

  $("#submit").on("click", (e) => {
    e.preventDefault();
    getCity();
    search();
    $("#city-input").val("");
    listCities();
  });

