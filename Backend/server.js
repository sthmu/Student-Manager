const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();



const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;


let users=[
  {id:1, email:"jagath@hotmail.com", password:"jagath123"},
  {id:2, email:"john@example.com", password:"john123"}]


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Student Manager API' });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', userId: user.id });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});