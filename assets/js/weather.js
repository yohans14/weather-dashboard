$(document).ready(function () {
    // EventListener for search input
    $("#searchbtn").on("click", function (e) {
      e.preventDefault();
      // GNews api url with query input.text
      var query = $("#cityName").val();
      var url ="https://api.openweathermap.org/data/2.5/forecast?" +
      "q=" + query +
      "&units=imperial&appid=0ac1781e4e58355720795bec8018d18e"
      if (query !== "") {
        $.ajax({
          url: url,
          method: "GET",
          dataType: "json",
  
          // loader UI display until news url return and hide after complete
          beforeSend: function () {
            $("#loader").show();
          },
          complete: function () {
            $("#loader").hide();
          },
          // if ajax request return true the array data passed through for() loop
          success: function (weather) {
            let output = "";
            let currentweather = weather.list;

            console.log(weather)

            for (var i in weather.current) {
              output += `
              
                   `;
            }if(output !==""){
              $("#currentWeather").html(output);
            }
  
          },
          error: function () {
            M.toast({
              html: "There is an error, please try again",
              classes: "red rounded",
            });
          },
        });
      } 
    });
  });
  