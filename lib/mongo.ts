const {MongoClient} = require('mongodb');


const HOST_NAME = '127.0.0.1';
const DATABASE_NAME = 'admin';
const DATABASE_USERNAME = '..';
const DATABASE_PASSWORD = '..';

const mongoClient = new MongoClient(`mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${HOST_NAME}/${DATABASE_NAME}`);
let clientPromise = mongoClient.connect()

  

export default clientPromise