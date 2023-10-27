const express = require("express")

const app = express()

app.use(express.json())

const movieControllers = require("./controllers/movieController")

app.get("/api/movies", movieControllers.getMovies)
app.get("/api/movies/:id", movieControllers.getMovieById)
app.post("/api/movies", movieControllers.createMovie)

const userControllers = require("./controllers/userController")

app.get("/api/users", userControllers.getUsers)
app.get("/api/users/:id", userControllers.getUserById)
app.post("/api/users", userControllers.postUser)

module.exports = app
