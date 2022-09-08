var express = require("express");
var app = express();
var cors = require('cors');
var mongoose = require("mongoose");
const {ObjectId} = require('mongodb');
mongoose.connect("mongodb+srv://sinehan001:%40Mongodb001@cluster0.3y9rlfp.mongodb.net/Users?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    _id: String,
    floor: String,
    garbage: String,
    status: Number
}, { collection : 'Garbage' });

const Garbage = mongoose.model("Garbage", userSchema);

app.use(express.json());

app.get('/display', cors(), (req, res) => {

    Garbage.find({}, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            res.send(docs);
        }
    });
});

app.get('/', (req, res) => {
    res.send("Index page");
});

app.post('/update', (req, res) => {

Garbage.find({floor: req.body.floor, garbage: req.body.garbage}, function (err, docs) {
    if (err){
        console.log(err);
    }
    else{
        console.log(docs);
        if(docs.length == 0) {
            var gar = new Garbage({
            _id: new ObjectId(),
            floor: req.body.floor,
            garbage: req.body.garbage,
            status: req.body.status
        });
        gar.save((err, doc) => {
            if (!err) {
                res.send("Successfully Added");
            }
            else{
                console.log('Error during record insertion : ' + err);
            }
        });
        }
        else {
            res.send("Successfully Updated");
            try {
                console.log(req.body.status);
                Garbage.findOneAndUpdate({"_id": docs[0]._id}, {$set: { "status": req.body.status }},{new: true},(error,docs)=>{
                    console.log("doc = ",docs);
                });
            }
            catch(err) {
                console.log(err);
            }
        }
    }
});
});

app.listen(process.env.PORT || 2000, () => {
    console.log("Server is Running On port 2000");
  });
