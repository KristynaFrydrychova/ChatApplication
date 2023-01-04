/* Routes */

const express = require('express');
const { signup, login } = require('../controllers/auth.js');
const router = express.Router();

//post cesty pro zaslání dat z frontendu na backend
router.post('/signup', signup); //funkce - co se stane při kliknutí na tlačítko registrovat - v controllers
router.post('/login', login);

module.exports = router;