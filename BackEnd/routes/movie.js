const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie");
const auth = require("../middleware/auth");

router.get(
  "/api/movies/trending/:token",
  auth.isAuth,
  movieController.getTrendingMovies
);

router.get(
  "/api/movies/top-rate/:token",
  auth.isAuth,
  movieController.getTopRatingMovies
);

router.get(
  "/api/movies/discover/:genreId/:token",
  auth.isAuth,
  movieController.getGenreMovies
);

router.get(
  "/api/movies/discover/:token",
  auth.isAuth,
  movieController.getGenreMoviesError
);

router.post(
  "/api/movies/video/:token",
  auth.isAuth,
  movieController.getTrailer
);

router.post(
  "/api/movies/search/:token",
  auth.isAuth,
  movieController.searchMovies
);

router.get(
  "/api/movies/genres/:token",
  auth.isAuth,
  movieController.fetchAllGenres
);

router.get(
  "/api/movies/media-types/:token",
  auth.isAuth,
  movieController.fetchAllMediaTypes
);

module.exports = router;
