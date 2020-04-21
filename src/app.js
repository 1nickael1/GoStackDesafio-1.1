const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repo);
  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const { title, url, techs } = request.body;
  const repoIndex = repositories.findIndex(e => e.id == `${id}`)
  if (repoIndex === -1) {
    return response.status(400).json({ error: "Erro ao encontrar repositorio" })
  }
  repositories[repoIndex] = {
    id: repositories[repoIndex].id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }
  return response.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;
  const repoIndex = repositories.findIndex(e => e.id == `${id}`)
  if (repoIndex === -1) {
    return response.status(400).json({ error: "Erro ao encontrar repositorio" })
  }

  // Caso seja o primeiro item
  if (repoIndex == 0) {
    repositories.shift();
    return response.status(204).json({});
  }

  // Caso seja o ultimo elemento
  const lengh = repositories.length - 1;
  if (repoIndex == lengh) {
    repositories.pop();
    return response.status(204).json({});
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).json({});
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;
  const repoIndex = repositories.findIndex(e => e.id == `${id}`)
  if (repoIndex === -1) {
    return response.status(400).json({ error: "Erro ao encontrar repositorio" })
  }

  repositories[repoIndex] = {
    ...repositories[repoIndex],
    likes: repositories[repoIndex].likes + 1
  }

  return response.json(repositories[repoIndex]);
});

module.exports = app;
