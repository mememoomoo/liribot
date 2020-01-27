require("dotenv").config();
const Spotify = require("node-spotify-api");
const keys = require("./keys");
const spotify = new Spotify(keys.spotify);
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

const commands = function(caseData, functionData) {
  if (caseData === "concert-this") {
    getConcert(functionData);
  } else if (caseData === "spotify-this-song") {
    getSong(functionData);
  } else if (caseData === "movie-this") {
    getMovie(functionData);
  } else if (caseData === "do-what-it-says") {
    doWhatItSays(functionData);
  } else {
    console.log(
      "Unknown command. You can say, concert-this, spotify-this-song, movie-this, or do-what-it-says."
    );
  }
};

const runCommands = function(argOne, argTwo) {
  commands(argOne, argTwo);
};

function getConcert(artist) {
  const queryUrl =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";

  axios.get(queryUrl).then(function(response) {
    let responseData = response.data;

    if (responseData.length === 0) {
      console.log("Sorry. " + artist + " has no results. Please search again.");
    }

    for (let i = 0; i < responseData.length; i++) {
      const element = responseData[i];
      console.log(
        moment(element.datetime).format("MM/DD/YYYY") +
          " " +
          element.venue.name +
          " in " +
          element.venue.city +
          "," +
          " " +
          element.venue.region
      );
    }
  });
}

function getSong(songName) {
  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log(err);
      }

      let song = data.tracks.items;

      for (let i = 0; i < song.length; i++) {
        const artist = song[i].artists[(0, 0)].name;
        const songTitle = song[i].name;
        const preview = song[i].preview_url;
        const album = song[i].album.name;

        console.log(
          artist + " | " + " | " + songTitle + " | " + preview + " | " + album
        );
      }
    }
  );

  if (songName === undefined) {
    songName = "The Sign";
  }
}

function getMovie(movieTitle) {
  const queryUrl =
    "http://www.omdbapi.com/?t=" + movieTitle + "&apikey=trilogy";

  axios.get(queryUrl).then(function(response) {
    let resData = response.data;
    let title = resData.Title;
    let year = resData.Year;
    let ratingImdb = resData.Ratings[0].Value;
    let ratingRottenTomatoes = resData.Ratings[1].Value;
    let country = resData.Country;
    let language = resData.Language;
    let plot = resData.Plot;
    let actors = resData.Actors;

    console.log(
      "Title: " +
        title +
        " | " +
        "Year: " +
        year +
        " | " +
        "IMDB Rating: " +
        ratingImdb +
        " | " +
        "Rotten Tomatoes Rating: " +
        ratingRottenTomatoes +
        " | " +
        "Country: " +
        country +
        " | " +
        "Language: " +
        language +
        " | " +
        "Plot: " +
        plot +
        " | " +
        "Actors: " +
        actors
    );
  });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error)
        } else {
            let input = data.split(",");
            let command = input[0];
            let query = input[1];
            
            commands(command, query)
        }
    })
}

runCommands(process.argv[2], process.argv.slice(3).join(" "));
