if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express =  require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
// const review = require("./models/review.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

// main().then(()=>{
//     console.log("connect to db");
// })
// .catch(()=>{
//      console.log(err);
// });

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {  // Add err as a parameter
        console.error("Error connecting to DB:", err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}


async function main() {
    await mongoose.connect(dbUrl);  
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.listen(8080,()=>{
    console.log("server is listening on the port !!!!!");
});

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

// store.on("error",(err)=>{
//     console.error("ERROR IN MONGO SESSION STORE",err);
// })
store.on("error", (err) => {  // Add err as a parameter
    console.error("ERROR IN MONGO SESSION STORE:", err);
});


const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
}

// app.get("/", (req,res)=>{
//     res.send(" hii i am root >>");
// });


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{

//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//    let registereduser = await User.register(fakeUser,"helloworld");
//    res.send(registereduser);
// });


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);

//page not found route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

//Error handaling 
app.use((err, req, res, next)=>{
    let{statusCode=500, message="somethig went wrong!"} = err;
    // res.render("error.ejs",{err});

    res.status(statusCode).send(message);
});
