const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
]

const getMovies = (req, res) => {
  res.json(movies)
}

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id)

  const movie = movies.find((movie) => movie.id === id)

  if (movie != null) {
    res.json(movie)
  } else {
    res.status(404).send("Not Found")
  }
}

const createMovie = (req, res) => {
  const movie = req.body

  console.log(movie)

  if (Object.keys(movie).length !== 5) return res.sendStatus(400)

  movie.id = Math.max(...movies.map((movie) => movie.id)) + 1

  movies.push(movie)

  res.status(201).json({ id: movie.id })
}

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
}
