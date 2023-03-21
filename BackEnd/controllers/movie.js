const Movies = require("../models/Movies");
const Videos = require("../models/Videos");
const Genres = require("../models/Genre");
const MediaTypes = require("../models/MediaTypes");
const {
  trendingPaging,
  topRatingPaging,
  genresPaging,
  searchPaging,
  advancedSearchPaging,
} = require("../utils/paging");

exports.getTrendingMovies = (req, res, next) => {
  Movies.fetchAll((movies) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limitOfPage = 20;
    const results = trendingPaging(movies, page, limitOfPage);
    res.statusCode = 200;
    res.send(results);
  });
};

exports.getTopRatingMovies = (req, res, next) => {
  Movies.fetchAll((movies) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 20;
    const results = topRatingPaging(movies, page, limit);
    res.statusCode = 200;
    res.send(results);
  });
};

exports.getGenreMovies = (req, res, next) => {
  Movies.fetchAll((movies) => {
    const genreId = +req.params.genreId;
    const isAvailable = movies.filter((genre) => genre.id === genreId);
    if (!isAvailable) {
      res.statusCode = 400;
      res.setHeader("Content-type", "application/json");
      res.write(JSON.stringify({ message: "Not found that gerne id" }));
      res.end();
      return;
    } else {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = 20;
      const results = genresPaging(movies, page, limit, genreId);
      res.statusCode = 200;
      res.send(results);
    }
  });
};

exports.getGenreMoviesError = (req, res, next) => {
  Movies.fetchAll((movies) => {
    if (req.path) {
      res.statusCode = 400;
      res.setHeader("Content-type", "application/json");
      res.write(JSON.stringify({ message: "Not found gerne parram" }));
      res.end();
      return;
    }
  });
};

exports.getTrailer = (req, res, next) => {
  Videos.fetchAll((video) => {
    const filmId = +req.body.movieId;

    if (!filmId) {
      res.statusCode = 400;
      res.setHeader("Content-type", "application/json");
      res.write(JSON.stringify({ message: "Not found film_id parram" }));
      res.end();
      return;
    } else {
      const videoById = video.filter((video) => video.id === filmId)[0];
      if (!videoById) {
        res.statusCode = 400;
        res.setHeader("Content-type", "application/json");
        res.write(JSON.stringify({ message: "Not found video" }));
        res.end();
        return;
      } else {
        const isSuitable = videoById.videos.filter((vid) => {
          if (vid.official && vid.site === "YouTube") {
            if (vid.type === "Trailer") {
              return vid;
            } else {
              if (vid.type === "Teaser") {
                return vid;
              }
            }
          }
        });
        if (isSuitable !== []) {
          const latestPublishedDate = new Date(
            Math.max(...isSuitable.map((e) => new Date(e.published_at)))
          ).toISOString();
          const latestTrailer = isSuitable.filter(
            (s) => s.published_at === latestPublishedDate
          );
          res.statusCode = 200;
          res.send(latestTrailer);
        } else {
          res.statusCode = 400;
          res.setHeader("Content-type", "application/json");
          res.write(JSON.stringify({ msg: "Not found video" }));
          res.end();
          return;
        }
      }
    }
  });
};

exports.searchMovies = (req, res, next) => {
  Movies.fetchAll((movies) => {
    const query = req.body.query;
    const genre = req.body.genre;
    const type = req.body.type;
    const language = req.body.language;

    if (!query || query === "") {
      res.statusCode = 400;
      res.setHeader("Content-type", "application/json");
      res.write(JSON.stringify({ msg: "Not found keyword parram" }));
      res.end();
      return;
    } else {
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = 20;
      if (!genre && !type && !language) {
        const results = searchPaging(movies, page, limit, query);
        res.statusCode = 200;
        res.send(results);
      }

      if (genre || type || language) {
        const results = advancedSearchPaging(
          movies,
          page,
          limit,
          query,
          genre,
          type,
          language
        );
        res.statusCode = 200;
        res.send(results);
      }
    }
  });
};

exports.fetchAllGenres = (req, res, next) => {
  Genres.fetchAll((genres) => {
    res.statusCode = 200;
    res.send(genres);
  });
};

exports.fetchAllMediaTypes = (req, res, next) => {
  MediaTypes.fetchAll((mediaType) => {
    res.statusCode = 200;
    res.send(mediaType);
  });
};
