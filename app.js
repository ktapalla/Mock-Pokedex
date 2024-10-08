/*
  app.js -- This creates an Express webserver with login/register/logout authentication
*/

// *********************************************************** //
//  Loading packages to support the server
// *********************************************************** //
// First we load in all of the packages we need for the server...
const createError = require("http-errors"); // to handle the server errors
const express = require('express');
const path = require("path");  // to refer to local paths
const cookieParser = require("cookie-parser"); // to handle cookies
const session = require("express-session"); // to handle sessions using cookies
const debug = require("debug")("personalapp:server"); 
const layouts = require("express-ejs-layouts");
const axios = require("axios")
// var MongoDBStore = require('conect-mongodb-session')(session);

// *********************************************************** //
//  Loading models
// *********************************************************** //
const Pokemon = require('./models/Pokemon')
const PersonalData = require('./models/PersonalData')


// *********************************************************** //
//  Loading JSON datasets
// *********************************************************** //
const pokemons = require('./public/data/pokedex.json')


// *********************************************************** //
//  Connecting to the database
// *********************************************************** //

const mongoose = require( 'mongoose' );
var mongodb_URI = 'mongodb://localhost:27017/cs103a_todo'
if (process.env.mongodb_URI != undefined) {
  mongodb_URI = process.env.mongodb_URI
}


mongoose.connect( mongodb_URI, { useNewUrlParser: true, useUnifiedTopology: true } );
// fix deprecation warnings 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("we are connected!!!")});





// *********************************************************** //
// Initializing the Express server 
// This code is run once when the app is started and it creates
// a server that respond to requests by sending responses
// *********************************************************** //
const app = express();

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// this allows us to use page layout for the views 
// so we don't have to repeat the headers and footers on every page ...
// the layout is in views/layout.ejs
app.use(layouts);

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling using cookies
app.use(
  session({
    secret: "zzbbyanana789sdfa8f9ds8f90ds87f8d9s789fds", // this ought to be hidden in process.env.SECRET
    resave: false,
    saveUninitialized: false
  })
);

// *********************************************************** //
//  Defining the routes the Express server will respond to
// *********************************************************** //

// here is the code which handles all /login /signin /logout routes
const auth = require('./routes/auth');
const { deflateSync } = require("zlib");
app.use(auth)

// middleware to test is the user is logged in, and if not, send them to the login page
const isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  }
  else res.redirect('/login')
}

// specify that the server should render the views/index.ejs page for the root path
// and the index.ejs code will be wrapped in the views/layouts.ejs code which provides
// the headers and footers for all webpages generated by this app
app.get("/", (req, res, next) => {
  res.render("index");
});



/* ************************
  Loading (or reloading) the data into a collection
   ************************ */
// this route loads in the pokemons into the Pokemon collection
// or updates the pokemons if it is not a new collection

app.get('/upsertDB',
  async (req,res,next) => {
    for (pokemon of pokemons){
      const {
        id,name,type1,type2,abilities,category,height,weight,
        captureRate,eggSteps,expGroup,total,hp,attack,defense,
        spAttack,spDefense,speed,moves,
      }=pokemon;
      const imgNum = id + ".png" 
      const imgURL = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" + imgNum
      await Pokemon.findOneAndUpdate(
        {id,name,type1,type2,abilities,category,height,weight,
          captureRate,eggSteps,expGroup,total,hp,attack,defense,
          spAttack,spDefense,speed,moves,imgURL},
          pokemon,{upsert:true})
    }
    const num = await Pokemon.find({}).count();
    res.send("data uploaded: "+num)
  }
)

app.post('/pokemon/byName',
  // show data for a pokemon w/ a specific name
  async (req,res,next) => {
    const {name} = req.body;
    const pokemon = await Pokemon.findOne({ name : {$regex: name, $options: 'i'}})
    res.locals.pokemon = pokemon
    res.render('pokemon')
  }
)

app.get('/pokemon/byName/:name',
  // show data for a pokemon w/ a specific name
  async (req,res,next) => {
    const {name } = req.params
    const pokemon = await Pokemon.findOne({ name : {$regex: name, $options: 'i'}})
    res.locals.pokemon = pokemon
    res.render('pokemon')
  } 
)

app.post('/pokemon/byPokedexNum',
  // show data for a pokemon w/ a specific pokedex number
  async (req,res,next) => {
    const {pokedexNum} = req.body;
    const pokemon = await Pokemon.findOne({id:pokedexNum})
    res.locals.pokemon = pokemon
    res.render('pokemon')
  }
)

app.get('/pokemon/byPokedexNum/:id',
  // show data for a pokemon w/ a specific pokedex number
  async (req,res,next) => {
    const pokedexNum = req.params.id
    const pokemon = await Pokemon.findOne({id:pokedexNum})
    res.locals.pokemon = pokemon
    res.render('pokemon')
  } 
)

app.post('/pokemon/byType',
  // show list of Pokemons of a specific type 
  async (req,res,next) => {
    const {type} = req.body;
    const pokemons = await Pokemon.find({ $or : [{type1: {$regex: type, $options: 'i'}}, {type2: {$regex: type, $options: 'i'}}]}).sort({id:1})
    res.locals.pokemons = pokemons
    res.render('searchlist')
  }
    )
    
app.get('/pokemon/byType/:type',
  // show list of Pokemons of a specific type 
  async (req,res,next) => {
    const {type} = req.params
    const pokemons = await Pokemon.find({ $or : [{type1: {$regex: type, $options: 'i'}}, {type2: {$regex: type, $options: 'i'}}]}).sort({id:1})
    res.locals.pokemons = pokemons
    res.render('searchlist')
  } 
)

app.post('/pokemon/byCategory',
  // show list of Pokemons of a specific category
  async (req,res,next) => {
    const {category} = req.body;
    const pokemons = await Pokemon.find({ category : {$regex: category, $options: 'i'}}).sort({id:1})
    res.locals.pokemons = pokemons
    res.render('searchlist')
  }
)

app.get('/pokemon/byCategory/:category',
  // show list of Pokemons of a specific category
  async (req,res,next) => {
    const {category} = req.params
    const pokemons = await Pokemon.find({ category : {$regex: category, $options: 'i'}}).sort({id:1})
    res.locals.pokemons = pokemons
    res.render('searchlist')
  } 
)

app.post('/pokemon/byCaptureRate',
  // show list of Pokemons w/ a capture rate greater than or equal to the entered value
  async (req,res,next) => {
    const {captureRate} = req.body;
    const pokemons = await Pokemon.find({ captureRate : {$gte: captureRate}}).sort({id:1})
    res.locals.pokemons = pokemons
    res.render('searchlist')
  }
)

app.get('/pokemon/byCaptureRate/:captureRate',
  // show list of Pokemons w/ a capture rate greater than or equal to the entered value
  async (req,res,next) => {
    const {captureRate} = req.params
    const pokemons = await Pokemon.find({ captureRate : {$gte: captureRate}}).sort({id:1})
    res.locals.pokemons = pokemons
    res.render('searchlist')
  } 
)

app.post('/pokemon/addData/:pokemonName',
//add pokemon to personal data/lists; (seen,caught,fav)
isLoggedIn,
  async (req,res,next) => { 
    try {
      const pokemonName = req.params.pokemonName
      let userId = res.locals.user._id
      let {seen,caught,favorite} = req.body
      if (seen == null) {
        seen = false
      }
      if (caught == null) {
        caught = false
      }
      if (favorite == null) {
        favorite = false
      }
      // check to make sure it's not already loaded
      const lookup = await PersonalData.find({userId,pokemonName,})
      if (lookup.length==0){
        const personalData= new PersonalData({userId,pokemonName,seen,caught,favorite,})
        await personalData.save()
      } else {
        await PersonalData.findOneAndUpdate({userId,pokemonName,},{seen,caught,favorite},{upsert:true})
      }
      // res.redirect()
    } catch(e){
      next(e)
    } 
  }

)


app.get('/pokemon/myData',
  // show the current user's data
  isLoggedIn,
  async (req,res,next) => {
    try{
      const userId = res.locals.user._id;
      const seenNames = 
         (await PersonalData.find({userId, seen:"seen"}))
                        .map(x => x.pokemonName)
      res.locals.seenPokemon = await Pokemon.find({name:{$in: seenNames}})
      const caughtNames = 
         (await PersonalData.find({userId, caught:"caught"}))
                        .map(x => x.pokemonName)
      res.locals.caughtPokemon = await Pokemon.find({name:{$in: caughtNames}})
      const favoriteNames = 
         (await PersonalData.find({userId, favorite:"favorite"}))
                        .map(x => x.pokemonName)
      res.locals.favoritePokemon = await Pokemon.find({name:{$in: favoriteNames}})
      res.render('personaldata')
    } catch(e){
      next(e)
    }
  }
)

app.get('/pokemon/myData/seen',
  // show the current user's data for seen pokemon
  isLoggedIn,
  async (req,res,next) => {
    try{
      const userId = res.locals.user._id;
      const seenNames = 
         (await PersonalData.find({userId, seen:"seen"}))
                        .map(x => x.pokemonName)
      res.locals.seenPokemon = await Pokemon.find({name:{$in: seenNames}})
      res.render('seenlist')
    } catch(e){
      next(e)
    }
  }
)


app.get('/pokemon/myData/seen/remove/:pokemonName',
  // remove a pokemon from the user's seen pokemon list
  isLoggedIn,
  async (req,res,next) => {
    try {
      const userId = res.locals.user._id;
      const pokemonName = req.params.pokemonName
      await PersonalData.findOneAndUpdate (
        {userId:userId,
        pokemonName:pokemonName}, { $set : {seen:"false"}}, {upsert:true},)         
        res.redirect('/pokemon/myData/seen')
      } catch(e){
        next(e)
    }
  }
)

app.get('/pokemon/myData/caught',
  // show the current user's data for caught pokemon
  isLoggedIn,
  async (req,res,next) => {
    try{
      const userId = res.locals.user._id;
      const caughtNames = 
         (await PersonalData.find({userId, caught:"caught"}))
                        .map(x => x.pokemonName)
      res.locals.caughtPokemon = await Pokemon.find({name:{$in: caughtNames}})
      res.render('caughtlist')
    } catch(e){
      next(e)
    }
  }
)

app.get('/pokemon/myData/caught/remove/:pokemonName',
  // remove a pokemon from the user's caught pokemon list
  isLoggedIn,
  async (req,res,next) => {
    try {
      const userId = res.locals.user._id;
      const pokemonName = req.params.pokemonName
      await PersonalData.findOneAndUpdate (
        {userId:userId,
        pokemonName:pokemonName}, { $set : {caught:"false"}}, {upsert:true},)         
        res.redirect('/pokemon/myData/caught')
      } catch(e){
        next(e)
    }
  }
)

app.get('/pokemon/myData/favorite',
  // show the current user's data for favorite pokemon
  isLoggedIn,
  async (req,res,next) => {
    try{
      const userId = res.locals.user._id;
      const favoriteNames = 
         (await PersonalData.find({userId, favorite:"favorite"}))
                        .map(x => x.pokemonName)
      res.locals.favoritePokemon = await Pokemon.find({name:{$in: favoriteNames}})
      res.render('favlist')
    } catch(e){
      next(e)
    }
  }
)

app.get('/pokemon/myData/favorite/remove/:pokemonName',
  // remove a pokemon from the user's favorite pokemon list
  isLoggedIn,
  async (req,res,next) => {
    try {
      const userId = res.locals.user._id;
      const pokemonName = req.params.pokemonName
      await PersonalData.findOneAndUpdate (
        {userId:userId,
        pokemonName:pokemonName}, { $set : {favorite:"false"}}, {upsert:true},)         
        res.redirect('/pokemon/myData/favorite')
      } catch(e){
        next(e)
    }
  }
)

app.use(isLoggedIn)

// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// this processes any errors generated by the previous routes
// notice that the function has four parameters which is how Express indicates it is an error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


// *********************************************************** //
//  Starting up the server!
// *********************************************************** //
//Here we set the port to use between 1024 and 65535  (2^16-1)
const port = process.env.PORT || '3000';
app.set("port", port);
console.log('Express server listening on port ' + port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);


function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}


server.on("error", onError);

server.on("listening", onListening);

module.exports = app;