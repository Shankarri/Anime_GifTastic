
$(document).ready(function () {

  var topics = ["Fairy Tail", "Inuyasha", "Death Note", "Fushigi Yugi", "Yu Yu Hakusho", "Fate Zero",
    "Hunter X Hunter", "Bleach", "Full Metal Alchemist", "Fate Zero",];//"Sword Art Online", "Nanatsu no Taizai"];
    var datalimit = 12;
    $("#user-msg").hide();
    $("#limit-msg").hide();

    updatePage(topics, "button");

  function updatePage(updateArr, btnORimg) {
    var contentbody;
    var divCol;
    $("#user-msg").hide();

    if (btnORimg == "button") {
      contentbody = $("#buttons-col");
    }

    else {

      contentbody = $("#gifs-col");
    }

    for (var i in updateArr) {

      if (btnORimg == "button") {
        divCol = $("<div>").addClass("col-md-6 col-sm-6 p-2");
        divCol.append("<button class='btn btn-info btn-sm anime-btn'>" + updateArr[i] + "</button>");
        contentbody.append(divCol);
      }
      else {
        divCol = $("<div>").addClass("col-md-3 col-sm-4 col-xs-6 pb-2 gif-border");
        divCol.append("<p> Rating : " + updateArr[i].gif_rating + "</p>");
        // tableCol.append("<h6> Rating : " + updateArr[i].width + "</h6>");
        // tableCol.append("<h6> Rating : " + updateArr[i].height + "</h6>");
        divCol.append("<img src='" + updateArr[i].gif_img + "' />");
        contentbody.append(divCol);
      }
    }

  }
  $("#submit-btn").on("click", function () {
    var userInput = $("#user_anime").val().trim();

    var newAnime = [];
    if(userInput != "")
    {  
      newAnime[0] = userInput;
      updatePage(newAnime, "button");
      $("#user_anime").val("");
    }
    else
    {
      $("#user-msg").show();
      setTimeout(function(){  $("#user-msg").hide(); }, 4000);
    }
    // $("#user-msg").show();
  });

  $(document).on("click", "button" , function() {
    
  // Adding click event listen listener to all buttons
  // $("button").on("click", function () {

    var anime = $(this).html();
    
    // Constructing a queryURL using the animal name
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + anime + "&api_key=dc6zaTOxFJmzC&limit=" + datalimit;
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
          
          var rating = response.data[i].rating;
          var still_image = response.data[i].images.original_still.url;
          var gif_image = response.data[i].images.preview_webp.url;
          var gif_width = response.data[i].images.preview_webp.width;
          var gif_height = response.data[i].images.preview_webp.height;
          gif_Arr.push({ gif_rating: rating, gif_img: gif_image, still_img: still_image, width: gif_width, height: gif_height });

          // console.log(rating, still_image, gif_image);
        }
        updatePage(gif_Arr, "gifs");
      });
  });
  $("[type=number]").change(function(){
    $("#limit-msg").hide();
    var limitVal=$(this).val();
    if(limitVal >=10 && limitVal<=20)
    { 
    datalimit = limitVal;
    $("#limit-display").text(limitVal);
    
    }
    else
    {
      $("#limit-msg").show();
      setTimeout(function(){  $("#limit-msg").hide(); }, 4000);
    }
  });
});