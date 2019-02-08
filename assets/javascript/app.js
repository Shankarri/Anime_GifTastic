
$(document).ready(function () {

  var topics = ["Fairy_Tail", "Inuyasha", "Death_Note", "Sword_Art_Online", "Bleach", "Fate_Stay_Night", "Full_Metal_Alchemist", "Hunter_X_Hunter"];

  var currentAnime = "";
  var datalimit = 10;
  $("#user-msg").hide();
  $("#limit-msg").hide();

  updatePage(topics, "#buttons-col");

  function updatePage(updateArr, btnORimgCol) {

    var contentbody;
    var divCol;
    $("#user-msg").hide();

    for (var i in updateArr) {

      if (btnORimgCol == "#buttons-col") {
        divCol = $("<div>").addClass("col-md-6 col-sm-6 p-2");
        divCol.append("<button class='btn btn-info btn-sm anime-btn'> " + (updateArr[i]).replace(/\_/g, ' ') + "</button>");
        divCol.append("<button class='btn btn-danger ml-1 p-0 btn-sm close-btn' id= " +updateArr[i] +"> X </button>");
        $(btnORimgCol).append(divCol);
      }
      else {
        // { gif_rating, gif_image, still_image});
        
        divCol = $("<div>").addClass("col-md-3 col-sm-4 col-xs-6 pb-2 gif-border");

        divCol.append("<p class='m-0'> Rating : " + updateArr[i].gif_rating + "</p>");
        divCol.append("<p class='m-0'> Title : " + (updateArr[i].gif_title).replace("GIF","").trim() + "</p>");
        divCol.append("<p class='m-0'> Mp4 Size : " + updateArr[i].gif_size + "</p>");

        var image = $('<img>').attr({
            "src": updateArr[i].still_image,
            "data-still_src": updateArr[i].still_image,
            "data-gif_src": updateArr[i].gif_image,
            "data-animated": false
          });
        
          //  console.log("img",image.date());
        divCol.append(image);
        $(btnORimgCol).append(divCol);
      }
    }

  }

  $(document).on("click", "img", function () {

    console.log("this.data()", $(this).data());

    if ($(this).data().animated) {
      $(this).attr("src", $(this).data().still_src);
      $(this).data().animated = false;
    }
    else {

      $("img").each(function () {
        $(this).attr("src", $(this).data().still_src);
      });

      $(this).attr("src", $(this).data().gif_src);
      $(this).data().animated = true;
    }

  });

  $(document).on("click", ".anime-btn", function () {

    currentAnime = $(this).html();
    $("#anime_title").text(currentAnime);
    // Constructing a queryURL using the anime name

    ajaxCall(currentAnime.toLowerCase());
  });

  $(document).on("click", ".close-btn", function () {

    topics.splice(topics.indexOf($(this).attr("id")),1);
    $("#buttons-col").empty();

    if(currentAnime.trim() == (($(this).attr("id")).replace(/\_/g, ' ')).trim())
    {
      $("#gifs-col").empty();
    }
   
    updatePage(topics, "#buttons-col");
    
  });

  function ajaxCall(currentAnime) {

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + currentAnime
      + "&api_key=gmutM231fWK6pMu04oKqHGDuB1U9GDei&limit=" + datalimit;
   // console.log(queryURL);

    // Performing an AJAX request with the queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {
        $("#gifs-col").html("");
        var gif_Arr = [];
        // console.log(this);
        $.each(response.data, function () {
         // console.log(this);
          gif_Arr.push({
            gif_title: this.title,
            gif_rating: this.rating,
            still_image: this.images.fixed_height_small_still.url,
            gif_image: this.images.original.webp,
            gif_size: this.images.original.webp_size,
            
          });
          
        });
        updatePage(gif_Arr, "#gifs-col");
      });


     var bgQueryURL = "https://api.unsplash.com/search/photos?page=1&query="+currentAnime
       + "&client_id=1306976fd8ac9edfaf357ffc9c2407e3c761108d34cbcca10772eef78a09182b";

     $.ajax({
      url: bgQueryURL,
      method: "GET"
    })  .then(function (response) {
      console.log(response);
 
    });
  }

  // Adding click event listen listener to all buttons

  $("#submit-btn").on("click", function () {
    var userInput = $("#user_anime").val().trim();

    var newAnime = [];
    if (userInput != "") {
      newAnime[0] = userInput;
      topics.push(userInput);
      updatePage(newAnime, "#buttons-col");
      $("#user_anime").val("");
    }
    else {
      $("#user-msg").show();
      setTimeout(function () { $("#user-msg").hide(); }, 4000);
    }
  });

  $("[type=number]").change(function () {
    $("#limit-msg").hide();
    var limitVal = $(this).val();
    if (limitVal >= 10 && limitVal <= 20) {
      datalimit = limitVal;
      $("#limit-display").text(limitVal);
      if (currentAnime != "")
        ajaxCall(currentAnime.toLowerCase());
    }
    else {
      $("#limit-msg").show();
      setTimeout(function () { $("#limit-msg").hide(); }, 4000);
    }
  });
});