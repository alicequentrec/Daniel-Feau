const { Router } = require("express");
const getDb = require('./db');
const { ObjectId } = require('mongodb');


const router = Router();



router.get('/cart', (req, res) => {
    // Fetch the cart items from the database

    getDb(async (db, closeCallback) => {

        const result = await db.collection('cart_items').find().toArray();
        closeCallback();
        res.send({success: true, data: result});

    })
  });
  
  router.post('/cart', (req, res) => {


    const { name, image, quantity, price } = req.body;

    getDb(async (db, closeCallback) => {
            
            const result = await db.collection('cart_items').insertOne({ name, image, quantity, price });
            closeCallback();
            res.send({success: true, data: result});
    })
    
    // Add a new item to the cart in the database
  });
  
router.put('/cart/:id', (req, res) => {

    const { name, image, quantity, price } = req.body;
    const id = req.params.id;
    const _id = new ObjectId(id);
    getDb(async (db, closeCallback) => {
            
        const result = await db.collection('cart_items').updateOne({ _id: _id }, { $set: { price: price } });
        const result4 = await db.collection('cart_items').updateOne({ _id: _id }, { $set: { name: name } });
        const result2 = await db.collection('cart_items').updateOne({ _id: _id }, { $set: { image: image } });
        const result3 = await db.collection('cart_items').updateOne({ _id: _id }, { $set: { quantity: quantity } });

        closeCallback();
        res.send({ success: true, data: result });
    });

});
  
  router.delete('/cart/:id', (req, res) => {


    const id = req.params.id;

    getDb(async (db, closeCallback) => {
        
        const _id = new ObjectId(id);
        
        const result = await db.collection('cart_items').deleteOne({ _id });
        closeCallback();
        res.send({success: true, data: result});
    });
    // Delete an item from the cart in the database
  });

module.exports = router;