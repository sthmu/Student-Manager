const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Enable CORS - Allow frontend to connect
app.use(cors());

// Parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 5000;


let users=[
  {id:1, email:"jagath@hotmail.com", password:"jagath123"},
  {id:2, email:"john@example.com", password:"john123"}]


app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Student Manager API' });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email }); // Debug log
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        res.json({ 
            message: 'Login successful', 
            user: { 
                id: user.id, 
                email: user.email 
            }
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});