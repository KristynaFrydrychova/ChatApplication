/* Příprava serveru */

const express = require('express');
const cors = require('cors'); //request

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config(); //env variables - aby nebyla sdílená tajná data

//middleware
app.use(cors()); //povolí requesty
app.use(express.json()); //data block that clients send to the server in the body of an HTTP POST, PUT or PATCH message that contains important information about the request
app.use(express.urlencoded()); //url

app.get('/', (req, res) => { //root cesta
    res.send('Hello World!');
});

app.use('/auth', authRoutes); //cesty budou přidány pro celý server

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));