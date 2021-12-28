const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const mongoose = require('mongoose');



const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/cryptoDB");

const cryptoSchema = new mongoose.Schema({
  id: Number,
  name: String,
  last: String,
  buyValue: String,
  sellValue: String,
  volume: String,
  baseUnit: String
});
const Crypto = mongoose.model("Crypto", cryptoSchema);



const options = "https://api.wazirx.com/api/v2/tickers";
https.get(options, function(res) {
var body = '';

res.on('data', function(chunk) {
  body += chunk;
});

res.on('end', function() {
    if (res.statusCode == 200) { // Check the status code returned in the response
      try { // Add try catch block to handle corrupted json in response
        if (body != '') { // Check that the body isn't empty
          //console.log(body); // Print the body to check if it's actually a valid JSON
          var price = JSON.parse(body);
          const objArray = [];
          Object.keys(price).forEach(key => objArray.push({
            name: key,
            rating: price[key]
          }));

          for (let i = 0; i < 10; i++) {

            // Crypto.findOneAndUpdate({name:objArray[i].name},{$set:{last:"ho gya kya"}},{new:true},(err,fl)=>{
            //   if(err)
            //   throw err;
            // });
            Crypto.findOneAndUpdate({name:objArray[i].name},{$set:{last:objArray[i].rating.last, buyValue:objArray[i].rating.buy,sellValue:objArray[i].rating.sell,volume:objArray[i].rating.volume,baseUnit:objArray[i].rating.name}}, {new:true}, (error, doc) => {
              if(error)
              throw error;
  // error: any errors that occurred
  // doc: the document before updates are applied if `new: false`, or after updates if `new = true`
               });
            // let crypt=new Crypto({
            //   id:i+1,
            //   name:objArray[i].name,
            //   last:objArray[i].rating.last,
            //   buyValue:objArray[i].rating.buy,
            //   sellValue:objArray[i].rating.sell,
            //   volume:objArray[i].rating.volume,
            //   baseUnit:objArray[i].rating.name
            // })
            //
            // crypt.save(function(err){
            // if (!err){
            // console.log("successfull");
        //  }
        //});
    }
    //console.log(objArray[0].rating.at);
    //console.log(price);
  } else {
    console.log('Body is empty');
  }
}
catch (err) {
  console.log(err);
}
} else {
console.log('Status code: ' + res.statusCode);
}
});
}).end();


app.get("/", function(req, res) {
  Crypto.find({}, function(err, posts){
  res.render("home", {
    posts:posts
  });
//  console.log(posts[2].name);
});
})

app.get("/connect/telegram",function(req,res){
  res.render("telegram")
})

//

// https.get(url, function(response) {
//   response.on("data", function(data) {
//     //const weatherData = JSON.parse(data);
//     //const size=10;
//     //const items = weatherData.slice(0, size);
//     console.log(JSON.parse(data));;
//   })
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
