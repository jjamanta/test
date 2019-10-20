const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = {"name": Eduardo, "email": "jjamanta@hotmail.com"}

// CRUD - Create, Read, Update, Delete

const users = ['Diego', 'Eduardo', 'Victor']

// Global Middleware

server.use((req, res, next) => {
    console.time('Request');
    console.log(`Metodo: ${req.method}; URL: ${req.url}`);
    next();
    console.timeEnd('Request');
})

// Middleware

function chekUserExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({message:'User name is required'});
    }

    return next();
}

function chekUserInArray(req, res, next) {
    if (!users[req.params.index]) {
        return res.status(400).json({message:'User does not exists'});
    }

    return next();
}

server.get('/users', (req, res) => {
    return res.json(users);
});

server.get('/users/:index', chekUserInArray, (req, res) => {
    //const name = req.query.name;
    const { index } = req.params;
    //return res.json({ message: `Hello ${name}` });
    return res.json(users[index]);
});

server.post('/users', chekUserExists, (req, res) => {
    //const name = req.query.name;
    const { name } = req.body;

    users.push(name);
    return res.json(users);
});

server.put('/users/:index', chekUserInArray, chekUserExists, (req, res) => {
    //const name = req.query.name;
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;
    //return res.json({ message: `Hello ${name}` });
    return res.json(users);
});

server.delete('/users/:index', chekUserInArray, (req, res) => {
    //const name = req.query.name;
    const { index } = req.params;

    users.splice(index, 1);
    //return res.json({ message: `Hello ${name}` });
    return res.json(users);
});

server.listen(3000);