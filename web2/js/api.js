$(document).ready(function() {
      var displayResources = $("#countries");
      
      console.log("Loading data from JSON source...");
      displayResources.text("Loading data from JSON source...");
  
      $.ajax({
        type: "GET",
        url: "http://localhost:8081/countries.json",
        success: function(result) {
          console.log(result);
          var output =
            "<table><thead><tr><th>Name</th><th>Provider</th></thead><tbody>";
          for (var i in result) {
            output +=
              "<tr><td>" +
              result[i].name +
              "</td><td>" +
              result[i].code +
              "</td></tr>";
          }
          output += "</tbody></table>";
  
          displayResources.html(output);
          $("table").addClass("table");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          console.log("Status: " + textStatus);
          console.log("Error: " + errorThrown);
        }
      });
  });