// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/registro', authController.showRegistrationForm);
router.post('/registro', authController.processRegistration);

// Rota para exibir o formulário de login
router.get('/login', authController.showLoginForm);

// Rota para processar o envio do formulário de login
router.post('/login', authController.processLogin);

// Rota para logout
router.get('/logout', authController.processLogout);

module.exports = router;