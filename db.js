const { MongoClient, ServerApiVersion } = require('mongodb');
const dbName = 'testappdb';
console.log('dbName:', dbName)

const uri = "mongodb+srv://loane:1234abcd@testingapp.9docc62.mongodb.net/?retryWrites=true&w=majority&appName=testingApp";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log("trying to connect to db", uri);
    
    await client.connect();
    console.log("Connected successfully to server");
 
    const db = await client.db(dbName);
  } finally {
  
    await client.close();
  }
}
const getDb = function(callback) {
    console.log("trying to connect to db", uri)
    client.connect().then(() => {
        
        console.log("Connected successfully to server");
        const db = client.db(dbName);


        function closeCallback() {
            console.log("closing connection");

            client.close();
        }
        callback(db, closeCallback);
    });
    


}
module.exports = getDb;




