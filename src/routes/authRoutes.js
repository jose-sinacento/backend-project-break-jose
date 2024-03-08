const express = require('express')
const router = express.Router()
const { generateToken, verifyToken } = require('../middlewares/authMiddleware')
const user = require('../models/user');

router.get('/', (req, res) => {
    if (req.session.token) {
        res.send(`
    <h1>Bienvenido</h1>
    <a href='/dashboard'>Dashboard></a>
    <form actiona="/logout" method="post">
        <button type="submit">Cerrar sesión</button>
    </form>
    `)
    } else {
        `
    <form action="/login" method="post">
    <label for="userName">Usuario</label>
    <input type="text" id="username" name="username" required><br>

    <label for="password">password</label>
    <input type="password" id="password" name="password" required><br>
    <button> type="submit">Entrar</button>
    </form>   
    `
    }
})

router.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user
    const user = user.find(user => user.id === userId)
    if(user) {res.send(
        `
        <h1>Bienvenido${user.name}</h1>
        <p>ID ${user.id}</p>
        <p>User Name: ${user.username}</p>
        <form action="/logout" method="post">
            <button type="submit"> Cerrar sesión </button>
        </form>
        `)
    }else {
        res.status(401).json({menssage: "user not found"})
    }
})

router.get('/login', (req, res) => {
    const {username, password} = req.body
    const user = user.find(user => user.username === username && user.password === password)

    if(user) {
        const token  = generateToken(user)
        req.session.token = token
        res.redirect('/dashboard')
    } else {
        res.status(401).json({menssage: "Incorrect credentials"})
    }
})

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

module.exports = router;