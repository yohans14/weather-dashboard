let weather = { 
fetchweather: function (city){
fetch("https://api.openweathermap.org/data/2.5/forecast?" +
"q=" + city +
"&units=imperial&appid=0ac1781e4e58355720795bec8018d18e")

            .then((response) => response.json())
            .then((data) => this.displayWeather(data));
      },
      
           displayWeather: function(data) {
             const { name } = data;
            const { icone, description } = data.weather[0];
            const { temp, humidity } = data.main;
            const { speed } = data.wind;

            console.log(name, icone, description, temp, speed);
          }
        }  
