const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const getDb = require('./db');
const jwt = require('jsonwebtoken');
const shoppingRouter = require('./shopping-cart');

const app = express();  

app.use(cors());

app.use(bodyParser.json()); 
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
   
    

    getDb(async (db, closeCallback) => {


        const result = await db.collection('users').findOne({ email, password });
        if (!result) {
            closeCallback();
            return res.send({success: false, data: "Invalid email or password"});
        }
        closeCallback();

        const secretKey = 'somerandom'; 

        const token = jwt.sign({ id: result._id, username: result.username }, secretKey, {
            expiresIn: 86400 
        });

        res.send({success: true, data: "Login successful", token: token});
        
        

    });
    
});

app.post('/api/register', (req, res) => {
    const { username, registerEmail, registerPassword  } = req.body;
    getDb(async (db, closeCallback) => {
        console.log("finding registering user", registerEmail);

        const result = await db.collection('users').findOne({ email: registerEmail });
        if (result) {

            
            closeCallback();
            return res.send({success: false, data: "Email already exists"});
        }
console.log("Result", result);
        try {
            const insertResult = await db.collection('users').insertOne({ username, email: registerEmail, password: registerPassword });
            console.log("Insert Result", insertResult);
            closeCallback();
            res.send({success: true, data: "register successful"});
        } catch (err) {
            console.log("error", err);
            closeCallback();
            return res.send({success: false, data: "Error while registering"});
        }

    });


});

app.use((req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'somerandom', (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        req.userId = decoded.id;
        next();
    });
});

app.use("/api/shopping", shoppingRouter);

module.exports = app.listen(8080, () => {
  console.log('Server is running on port 8080');
})