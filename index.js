const express = require('express');

const server = express();

server.use(express.json());

const projects = [{id: '1', title: "Project 1", tasks:[]}];
let numberOfRequests = 0;

/**
 * Middleware 
 * Logging the number of requests to the server.
 */
function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Número de requisições: ${numberOfRequests}`);

  return next();
}

server.use(logRequests);

/**
 * Middleware
 * Check if project exists
 */
function checkProjectExists(req, res, next){
  const { id } = req.params;

  project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found"});
  }

  return next();
}

/**
 * Projects
 */
server.post('/projects/', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  res.send();
});

/**
 * Tasks
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
})

server.listen(3000);