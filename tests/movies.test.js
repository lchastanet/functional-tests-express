const request = require("supertest")
const app = require("../src/app")
const database = require("../database")

describe("GET /api/movies", () => {
  it("should return all movies", async () => {
    const response = await request(app).get("/api/movies")

    expect(response.headers["content-type"]).toMatch(/json/)
    expect(response.status).toEqual(200)
  })
})

describe("GET /api/movies/:id", () => {
  it("should return one movie", async () => {
    const response = await request(app).get("/api/movies/1")

    expect(response.headers["content-type"]).toMatch(/json/)
    expect(response.status).toEqual(200)
  })

  it("should return no movie", async () => {
    const response = await request(app).get("/api/movies/0")

    expect(response.status).toEqual(404)
  })
})

describe("POST /api/movies", () => {
  it("should return created movie", async () => {
    const newMovie = {
      title: "Star Wars",
      director: "George Lucas",
      year: "1977",
      color: true,
      duration: 120,
    }

    const response = await request(app).post("/api/movies").send(newMovie)

    expect(response.status).toEqual(201)
    expect(response.header).toHaveProperty("location")

    const getResponse = await request(app).get(response.header.location)

    expect(getResponse.headers["content-type"]).toMatch(/json/)
    expect(getResponse.status).toEqual(200)

    expect(getResponse.body).toHaveProperty("id")

    expect(getResponse.body).toHaveProperty("title")
    expect(getResponse.body.title).toStrictEqual(newMovie.title)

    expect(getResponse.body).toHaveProperty("director")
    expect(getResponse.body.director).toStrictEqual(newMovie.director)

    expect(getResponse.body).toHaveProperty("year")
    expect(getResponse.body.year).toStrictEqual(newMovie.year)

    expect(getResponse.body).toHaveProperty("color")
    expect(Boolean(getResponse.body.color)).toStrictEqual(newMovie.color)

    expect(getResponse.body).toHaveProperty("duration")
    expect(getResponse.body.duration).toStrictEqual(newMovie.duration)
  })

  it("should return an error", async () => {
    const missingPropMovie = { title: "Harry Potter" }

    const response = await request(app)
      .post("/api/movies")
      .send(missingPropMovie)

    expect(response.status).toEqual(422)
  })
})

describe("PUT /api/movies", () => {
  it("should return edited movie", async () => {
    const newMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: true,
      duration: 162,
    }

    const { body } = await request(app).get("/api/movies")
    const lastId = Math.max(...body.map((movie) => movie.id))

    const response = await request(app)
      .put(`/api/movies/${lastId}`)
      .send(newMovie)

    expect(response.status).toEqual(204)

    const getResponse = await request(app).get(`/api/movies/${lastId}`)

    expect(getResponse.headers["content-type"]).toMatch(/json/)
    expect(getResponse.status).toEqual(200)

    expect(getResponse.body).toHaveProperty("id")

    expect(getResponse.body).toHaveProperty("title")
    expect(getResponse.body.title).toStrictEqual(newMovie.title)

    expect(getResponse.body).toHaveProperty("director")
    expect(getResponse.body.director).toStrictEqual(newMovie.director)

    expect(getResponse.body).toHaveProperty("year")
    expect(getResponse.body.year).toStrictEqual(newMovie.year)

    expect(getResponse.body).toHaveProperty("color")
    expect(Boolean(getResponse.body.color)).toStrictEqual(newMovie.color)

    expect(getResponse.body).toHaveProperty("duration")
    expect(getResponse.body.duration).toStrictEqual(newMovie.duration)
  })

  it("should return an error", async () => {
    const missingPropMovie = { title: "Harry Potter" }

    const { body } = await request(app).get("/api/movies")
    const lastId = Math.max(...body.map((movie) => movie.id))

    const response = await request(app)
      .put(`/api/movies/${lastId}`)
      .send(missingPropMovie)

    expect(response.status).toEqual(422)
  })

  it("should return no movie", async () => {
    const newMovie = {
      title: "Avatar",
      director: "James Cameron",
      year: "2009",
      color: true,
      duration: 162,
    }

    const response = await request(app).put("/api/movies/0").send(newMovie)

    expect(response.status).toEqual(404)
  })
})

describe("DELETE /api/movies/:id", () => {
  it("should return 204 status code", async () => {
    const { body } = await request(app).get("/api/movies")
    const lastId = Math.max(...body.map((movie) => movie.id))

    const response = await request(app).delete(`/api/movies/${lastId}`)

    expect(response.status).toEqual(204)
  })

  it("should return an error", async () => {
    const response = await request(app).delete(`/api/movies/0`)

    expect(response.status).toEqual(404)
  })
})

afterAll(() => database.end())
