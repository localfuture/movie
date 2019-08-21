const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');

const app = express();


app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//mongoose.connect("mongodb://localhost:27017/movieDB",{useNewUrlParser: true});
	
//mongoose.connect("mongodb+srv://anand:unicornb1331@cluster0-ubp68.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connect("mongodb+srv://anand:unicornb1331@cluster0-ubp68.mongodb.net/test?retryWrites=true&w=majority");
	
const movieschema = mongoose.Schema({
    movie: String,
    producer: String,
    director: String,
    actor: String,
    actress: String,
    year: String,
    language: String,
    editor: String,
    camera: String,
    dist: String

});

const movieCollection = mongoose.model('movieDetails',movieschema);

app.get("/",(req,res)=>{
    res.render('movies',{title:"Movies"});
});

app.get("/add",(req,res)=>{
    res.render('addmovies',{title:"Add Movies"});
});

app.post("/addition",(req,res)=>{
 var movie = new movieCollection(req.body);
 movie.save((error,data)=>{
     if(error){
         console.log('error occured');
         res.send(error);

     }else {
        console.log('Movie Added');
        res.send(data);

     }
 });
});

app.get("/getdata",(req,res)=>{
    movieCollection.find((error,data)=>{
        if(error){
            console.log(error);
        }else{
            res.send(data);
        }
    });
});


//const display = "http://localhost:3000/getdata";
const display = "https://movielibdata.herokuapp.com/getdata";
	
app.get("/view",(req,res)=>{
    request(display,(error,Response,body)=>{
        console.log("Error :", error);
        console.log("Response :",Response);
        var data = JSON.parse(body);
        res.render("viewmovies",{title:"Movie List", data:data});
        
    });
});

app.get("/search",(req,res)=>{
    res.render("searchmovies",{title:"Search Movies"});
});

app.get("/sea/:y",(req,res)=>{
    var f = req.params.y;
    movieCollection.find({movie:f},(error,data)=>{
        console.log("API passed DATA");
        res.send(data);
    });
});


const sea = "https://movielibdata.herokuapp.com/sea/";

app.post("/find",(req,res)=>{
    var x = req.body.name;
    console.log(x);
    request(sea+x,(error,response,body)=>{
        console.log(error);
        console.log(response);
        var d = JSON.parse(body);
        res.render("viewmovies",{title:"Search Result", data:d});
    });

});

app.get("/delete",(req,res)=>{
    res.render("deletemovies",{title:"Delete Movies"});   
});

app.get("/delet/:id",(req,res)=>{
    var x = req.params.id;
    movieCollection.deleteOne({movie:x},(error)=>{
        if(error){
            console.log(error);
        }else{
            console.log("Sucessfully Deleted");
        }
    });
})


const dele = "https://movielibdata.herokuapp.com/delet/";


app.post("/del",(req,res)=>{
    var del = req.body.name;
    request(dele+del,(error,response,body)=>{

    })
    
})


app.listen(process.env.PORT || 3000, ()=>{
    console.log("SERVER IS UP AND LISTENING");
});