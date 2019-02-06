
$(document).ready(function () {

  var topics = ["Fairy Tail", "Inuyasha", "Death Note", "Fushigi Yugi", "Yu Yu Hakusho", "Fate Zero",
    "Hunter X Hunter", "Bleach", "Full Metal Alchemist", "Fate Zero", "Sword Art Online", "Nanatsu no Taizai"];

  updateButtons(topics);
  function updateButtons(topics) {
    var thead = $("<thead>").append($("<tr>").html("<td colspan='3'> <h2>Anime List</h2> </td>"));
    $("table").append(thead);

    var tbody = $("<tbody>");
    var tableRow = $("<tr>");
    for (var i = 0; i < topics.length; i++) {

      tableRow.append($("<td>").append("<button class='btn btn-info btn-sm'>" + topics[i] + "</button>"));
      // Creating and storing a div tag

      if ((i + 1) % 3 == 0) {
        tbody.append(tableRow);
        tableRow = $("<tr>");
      }
      else if ((i + 1) == topics.length) {
        tableRow.append($("<td>").append(" "));
        tableRow.append($("<td>").append(" "));
        tbody.append(tableRow);
      }
    }
    $("table").append(tbody);
  }
  // Adding click event listen listener to all buttons
  $("button").on("click", function () {

    var anime = $(this).html();

    // Constructing a queryURL using the animal name
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + anime + "&api_key=dc6zaTOxFJmzC&limit=12";
    console.log(queryURL);

    // Performing an AJAX request with the queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })

      .then(function (response) {
        for (i in response.data) {
          console.log("    ");
          var rating = response.data[i].rating;
          var still_image = response.data[i].images.original_still.url;
          var gif_image = response.data[i].images.preview_webp.url;
          $("#gifs-col").append($("<span>").text(rating));
          // $("#gifs-col").append($("<img>", { src: still_image }));
          $("#gifs-col").append($("<img>", { src: gif_image }));

        console.log(rating, still_image, gif_image);
        }

      });
  });
});