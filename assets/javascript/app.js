// ------------------------------------------------------------------------ //
$(document).ready(function () {


  // ---------------Start Initializing variables----------------------------------- //
  var topics = ["Fairy_Tail", "Inuyasha", "Death_Note", "Sword_Art_Online", "Bleach", "Fate_Stay_Night", "Full_Metal_Alchemist", "Hunter_X_Hunter"];

  var currentAnime = "";
  var datalimit = 10;
  $("#user-msg").hide();
  $("#limit-msg").hide();

  updatePage(topics, "#buttons-col");

  // ----------------End of Initializing----------------------------------- //

  // ---------------- Start of Function for populating Dynamic Buttons or Dynamic Images as per the array parameter---------------- //
  function updatePage(updateArr, btnORimgCol) {

    var divCol;
    $("#user-msg").hide();

    // Go through loop for every array element
    for (var i in updateArr) {

      // If the passed parameter is buttons then create buttons using passed array values
      if (btnORimgCol == "#buttons-col") {
        divCol = $("<div>").addClass("col-md-6 col-sm-6 p-2");
        divCol.append("<button class='btn btn-info btn-sm anime-btn'> " + (updateArr[i]).replace(/\_/g, ' ') + "</button>");
        divCol.append("<button class='btn btn-danger ml-1 p-0 btn-sm remove-btn' id= " +updateArr[i] +"> X </button>");
        $(btnORimgCol).append(divCol);
      }
      //--------End of If-----------------------

      // If the passed parameter is buttons then create buttons using passed array values
      // Keys in gif_Arr = { gif_title: , gif_rating, still_image , gif_image, gif_size };
      else {
        divCol = $("<div>").addClass("col-md-3 col-sm-4 col-xs-6 pb-2 gif-border");
        divCol.append("<p class='m-0'> Rating : " + updateArr[i].gif_rating + "</p>");
        divCol.append("<p class='m-0'> Title : " + (updateArr[i].gif_title).replace("GIF","").trim() + "</p>");
        divCol.append("<p class='m-0'> Mp4 Size : " + updateArr[i].gif_size + "</p>");

        // Image is created with data attribute for still image, gif image and condition checker animated 
        var image = $('<img>').attr({
            "src": updateArr[i].still_image,
            "data-still_src": updateArr[i].still_image,
            "data-gif_src": updateArr[i].gif_image,
            "data-animated": false
          });

        divCol.append(image);
        $(btnORimgCol).append(divCol);
      }
      //--------End of Else-----------------------
    }
    //--------End of For loop-----------------------
  }

// ---------------- End  of Function for populating Dynamic Buttons or Dynamic Images as per the array parameter---------------- //

  // ---------------- Start of Gifs Click function--------------- //
  $(document).on("click", "img", function () {

    //if the image is animated, then replace it with still image
    if ($(this).data().animated) {
      $(this).attr("src", $(this).data().still_src);
      $(this).data().animated = false;
    }

    //if the image is still, then replace it with gif image
    else {
      //By chance if any other image is animated, then stop the animation of all gifs and play only selected gif animation
      $("img").each(function () {
        $(this).attr("src", $(this).data().still_src);
      });

      $(this).attr("src", $(this).data().gif_src);
      $(this).data().animated = true;
    }
  });

  // ---------------- End of Gifs Click function--------------- //

  // ---------------- Start of anime Button Click function--------------- //
  $(document).on("click", ".anime-btn", function () {

    currentAnime = $(this).html();
    $("#anime_title").text(currentAnime);

    //call the ajax function for the selected anime
      ajaxCall(currentAnime.toLowerCase());
  });
  // ---------------- End of Gifs Click function--------------- //

  // ---------------- Start of remove Button Click function--------------- //
  $(document).on("click", ".remove-btn", function () {

    //if we removed the current topic the remove the gifs for that also 
    if(currentAnime.trim() == (($(this).attr("id")).replace(/\_/g, ' ')).trim()) 
    {
      $("#gifs-col").empty();
      $("#anime_title").text("");
    }

    //remove the topic from the topics aray first
    topics.splice(topics.indexOf($(this).attr("id")),1);
    
    //then empty the buttons column and reload with updated topics array list
    $("#buttons-col").empty();
    updatePage(topics, "#buttons-col");
    
  });
// ---------------- End of remove Button Click function--------------- //

// ---------------- Start of Ajax call function--------------- //
function ajaxCall(currentAnime) {

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + currentAnime
      + "&api_key=gmutM231fWK6pMu04oKqHGDuB1U9GDei&limit=" + datalimit;

    // Performing an AJAX request with the queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function (response) {
        // empty the gifs col first
        $("#gifs-col").html("");
        var gif_Arr = [];

        // if we have any response data  
        if(response.data.length>0)
        {
        $.each(response.data, function () {
          // for every response data get the needed values and store it in variables
          gif_Arr.push({
            gif_title: this.title,
            gif_rating: this.rating,
            still_image: this.images.fixed_height_small_still.url,
            gif_image: this.images.original.webp,
            gif_size: this.images.original.webp_size,
          });
          
        });
        // Update Gifs cols by passing the array
        updatePage(gif_Arr, "#gifs-col");
      }
      // If there are no data in the response then display Error message
      else
      {
        $("#anime_title").text("There are no images under"+ currentAnime);
      }
      });
 }
// ---------------- Start of Ajax call function--------------- //

// ---------------- Start of submit button function--------------- //
  $("#submit-btn").on("click", function () {

    var userInput = $("#user_anime").val().trim();
    var newAnime = [];
    // If the user has entered some text in inout element
    if (userInput != "") {
      newAnime[0] = userInput;
      topics.push(userInput);

      // call updatePage function to add a new button at the end of the buttons col
      updatePage(newAnime, "#buttons-col");
      $("#user_anime").val("");
    }
    // If there is only white space when user clicked submit button, display error message
    else {
      $("#user-msg").show();
      setTimeout(function () { $("#user-msg").hide(); }, 4000);
    }
  });

  // ---------------- End of submit button function--------------- //

  // ---------------- Start of Gifs limit change function--------------- //
  $("[type=number]").change(function () {
    $("#limit-msg").hide();
    var limitVal = $(this).val();

    // If user enters manually any value between 10-20
    if (limitVal >= 10 && limitVal <= 20) {
      datalimit = limitVal;
      $("#limit-display").text(limitVal);

      // If there is currently some gifs that are present,
      if (currentAnime != ""){
        //then rerun the ajax call and display gifs as per user entered gif limit
        ajaxCall(currentAnime.toLowerCase());
      }
    }
    // If user enters manually any value outside 10-20, display error message
    else {
      $("#limit-msg").show();
      setTimeout(function () { $("#limit-msg").hide(); }, 4000);
    }
  });
});

// ---------------- End of Gifs limit change function--------------- //