
$(document).ready(function () {

  var topics = ["Fairy Tail", "Inuyasha", "Death Note", "Fushigi Yugi", "Yu Yu Hakusho", "Fate Zero",
    "Hunter X Hunter", "Bleach", "Full Metal Alchemist", "Fate Zero", ];//"Sword Art Online", "Nanatsu no Taizai"];

 

  updatePage(topics,"button");
  

  function updatePage(updateArr, btnORimg ) {
    
    var tbody;
    var tableRow;
    var noOfCols;
    
  
    if (btnORimg == "button") 
      {
        noOfCols = 2;
        tbody =$("#buttons-col");
       $("#buttons-head").html("<tr> <td colspan='" + noOfCols + "'> <h2>Anime List</h2> </td> </tr>");
  
        
      }

    else 
      {
        noOfCols = 5;
        tbody =$("#gifs-col");
        $("#gifs-head").html("<tr> <td colspan='" + noOfCols + "'> <h2>Images </h2> </td> </tr>");
        
      }

      tableRow =$("<tr>");
  
    for (var i in updateArr) {
      
      if (btnORimg == "button")
      {
        tableRow.append($("<td>").append("<button class='btn btn-info btn-sm'>" + updateArr[i] + "</button>"));
      }
      else
      {
        var tableCol = $("<td>")
        tableCol.append("<h6> Rating : " + updateArr[i].gif_rating + "</h6>");
        tableCol.append("<h6> Rating : " + updateArr[i].width + "</h6>");
        tableCol.append("<h6> Rating : " + updateArr[i].height + "</h6>");
        tableCol.append("<img src='" + updateArr[i].gif_img + "' />");
        tableRow.append(tableCol);
      }

      tbody.append(tableRow);
      // Creating and storing a div tag
      if (((parseInt(i) + 1) % noOfCols) == 0) {
        tableRow = $("<tr>");
      }
    }
  }
  // Adding click event listen listener to all buttons
  $("button").on("click", function () {

    var anime = $(this).html();

    // Constructing a queryURL using the animal name
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + anime + "&api_key=dc6zaTOxFJmzC&limit=10";
    console.log(queryURL);

    // Performing an AJAX request with the queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })

      .then(function (response) {
        $("#gifs-col").html("");
        var gif_Arr = [];
        for (i in response.data) {
          console.log("    ");
          var rating = response.data[i].rating;
          var still_image = response.data[i].images.original_still.url;
          var gif_image = response.data[i].images.preview_webp.url;
          // var gif_width = response.data[i].images.preview_webp.width;
          // var gif_height = response.data[i].images.preview_webp.height;
          gif_Arr.push ({gif_rating : rating, gif_img : gif_image, still_img : still_image, width: gif_width, height : gif_height });
          
        console.log(rating, still_image, gif_image);
        }
        updatePage(gif_Arr, "gifs");
      });
  });
});