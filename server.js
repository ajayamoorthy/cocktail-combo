const express = require( 'express' ),
      port = 3000;
const path = require("path");
const { MongoClient, ObjectId } = require('mongodb');
const session = require("express-session");
const cookieSession = require("cookie-session");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret', 
    resave: false,  
    saveUninitialized: true, 
    cookie: { secure: false }
}))


const uri = `mongodb+srv://rosestrobel:uyrwe45@a3.5wbb0.mongodb.net/?retryWrites=true&w=majority&appName=a3?ssl=true`;
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

connectToMongoDB();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    console.log('Login attempt:', req.body);

    const { username, password } = req.body;

    try {
        const database = client.db('users');
        const usersCollection = database.collection('usernames and passwords');

        const user = await usersCollection.findOne({ username: username });

        if (user) {
            if (user.password === password) {
                req.session.login = true;
                req.session.username = username; 
                console.log('Login successful');
                res.redirect("/"); 
            } else {
                console.log('Incorrect password');
                res.redirect("/")
            }
        } else {
            console.log('User not found');
            res.redirect("/")
        }
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.post('/register', async (req, res) => {
    console.log('Signup attempt:', req.body);

    const { username, password } = req.body;

    try {
        const database = client.db('users'); 
        const usersCollection = database.collection('usernames and passwords'); 

        const existingUser = await usersCollection.findOne({ username: username });

        if (existingUser) {
            console.log('User already exists');
            res.redirect("/")
        } else {

            await usersCollection.insertOne({ username: username, password: password });
            console.log('Signup successful');
            res.redirect('/'); 
        }
    } catch (err) {
      //  console.error("Error during signup:", err);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(`Cocktail Combo listening on port ${port}`);
})
