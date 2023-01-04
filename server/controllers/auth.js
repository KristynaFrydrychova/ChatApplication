/* Logika serveru - co se stane po kliknutí na tlačítko registrace a přihlášení, když dostaneme data z frontendu */

const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => {
    try {
        const { username, fullName, password } = req.body; //získání dat z frontendu pro uložení do databáze
        const userId = crypto.randomBytes(16).toString('hex'); //vytvoření random userID pro každého uživatele
        const serverClient = connect(api_key, api_secret, app_id); //připojení ke Stream API
        const hashedPassword = await bcrypt.hash(password, 10); //zahashování hesla, 10 - level of encryption
        const token = serverClient.createUserToken(userId); //token pro uživatele
        res.status(200).json({ token, username, fullName, userId, hashedPassword }); //vrátí data na frontend z backnedu pro větší bezpečnost
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;        
        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret); //nová instance stream-chat
        const { users } = await client.queryUsers({ name: username }); //zkontroluje uživatele v databázi, zda najde shodu
        if(!users.length) return res.status(400).json({ message: 'Uživatel neexistuje.' }); //pokud nenajde shodu - vypíše "Uživatel neexistuje"
        const success = await bcrypt.compare(password, users[0].hashedPassword); //pokud uživatel existuje, zkontroluje správnost hesla
        const token = serverClient.createUserToken(users[0].id); //vytvoření tokenu
        if(success) {
            res.status(200).json({ token, username, fullName: users[0].fullName, userId: users[0].id});
        } else {
            res.status(500).json({ message: 'Nesprávné heslo.' });
        }
    } catch (error) {ads
        console.log(error);
        res.status(500).json({ message: error });
    }
};

module.exports = { signup, login }