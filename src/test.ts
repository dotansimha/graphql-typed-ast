// create mongodb connection into variable db
var db = mongodb.MongoClient.connect('mongodb://localhost:27017/test');

// connect to mongodb and fetch list of users with promise
function fetch(collection) {
    return new Promise(function (resolve, reject) {
        db.collection(collection).find().toArray(function (err, docs) {
            if (err) reject(err);
            resolve(docs);
        });
    });
}

async function getData() {
  const users = await fetch('users')

  // filter users by admin role and sort by last connection date
   
}