const express = require('express');

const server = express();

server.use(express.json());

let numRequest = 0;

const projects = [];

function checkProject(req,res, next) {
  const { id } = req.params;
  console.log('find: '+id);
  const project = projects.find(x => x.id == id);
  console.log(project);

  if (!project)
  {
    return res.status(400).json({message: 'Projeto nao existente.'});
  }

  return next();
}

function logRequest(req,res, next) {

  numRequest++;
  
  console.log(`Numero de requisicoes: ${numRequest}`);

  return next();
}

server.use(logRequest);

server.get('/projects', (req, res) => {
  return res.json(projects);
});


server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({id: id, title: title, tasks: [] });

  return res.json(projects);
});

server.put('/projects/:id', checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(it => it.id == id);

  console.log(project);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProject, (req, res) => {
    const { id } = req.params;

    const index = projects.findIndex(it => it.id == id);

    projects.splice(index, 1)

    return res.status(200).json({message: 'Projeto removido.'})
  });

  server.post('/projects/:id/tasks', checkProject, (req, res) => {
    const { id } = req.params;
    const { task } = req.body;
    console.log('id:'+id);

    const project = projects.find(it => it.id == id);

    project.tasks.push(task);

    return res.json(project);
  });

server.listen(3000);

