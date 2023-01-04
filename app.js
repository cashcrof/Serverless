const express = require("express");
const app = express();

// Before the other routes
app.use(express.static("dist"));

app.use(express.json());

const pokemons = [
  {
    id: 1,
    name: "Pikachu",
    type: "electric ⚡️",
    level: 99,
    image: "/pikachu.webp"
  }
]

app.get("/api/pokemons", (req, res) => {
  console.log("GET /api/pokemons")
  res.send({pokemons: pokemons})
});

app.post("/api/pokemons", (req, res) => {
  const data = req.body
  console.log("POST /api/pokemons", data)
  data.id = pokemons.length+1
  pokemons.push(data)
  res.send(data)
});

// After all other routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: __dirname })
});

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))

