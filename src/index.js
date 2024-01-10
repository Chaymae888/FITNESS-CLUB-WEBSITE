var express = require("express")
var bodyParser= require("body-parser")
var mongoose=require("mongoose")
var ejsMate = require('ejs-mate');

const app = express();

app.engine('ejs', ejsMate); 
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))



mongoose.connect("mongodb://localhost:27017/ClubClientInformations");
var db=mongoose.connection
db.on('error',()=>console.log("Error in Connecting to Database"))
db.once('open',()=>console.log("Connected to database"))



app.post("/signup",(req,res)=>{
    var name=req.body.name
    var prenoun=req.body.prenoun
    var email=req.body.email
    var gender =req.body.selectedGender
    var password=req.body.password

    var data={
        "name":name,
        "prenoun":prenoun,
        "email":email,
        "gender":gender,
        "password":password
    }
    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("record inserted successfully")
    })
    return res.render('signup_succesful')
} );
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await db.collection('users').findOne({ email: email });

        if (!user) {
            console.log('Information does not match. Please create an account first');
        } else {
            if (user.password === password) {
                console.log("Login successful");
                return res.render('login_successful',{ user: user });
            } else {
                console.log("Incorrect password");
            }
        }
    } catch (error) {
        console.log("Error:", error);
    }
});
const User = require('./models/user');
app.post("/update", async (req, res) => {
    try {
        const name=req.body.name
        const prenoun=req.body.prenoun
        const email=req.body.email
        const email1=req.body.email1
        const gender =req.body.selectedGender
        const password=req.body.password

        const user = await User.findOne({ email: email1 });
        if (user) {
            
            user.name = name;
            user.prenoun = prenoun;
            user.email = email;
            user.gender = gender;
            user.password = password;

            
            await user.save();

            return res.render('login_successful',{ user: user });
        } else {
            console.log('Utilisateur non trouvé');
            // Gérer le cas où l'utilisateur n'est pas trouvé
        }
    } catch (error) {
        console.log("Error:", error);
        // Gérer les erreurs
    }

        
});
app.post("/delete", async (req, res) => {
    try {
         email = req.body.email;

       
         const deletedUser = await User.findOneAndDelete({ email: email });

        if (deletedUser) {
            console.log('Utilisateur supprimé avec succès');
            
            return res.redirect('./signup.html');
        } else {
            console.log('Utilisateur non trouvé');
            
        }
    } catch (error) {
        console.log("Error:", error);
        // Gérer les erreurs
    }
});


app.get("/",(req,res)=>{
    res.set({
        "Allow-acces-Allow-Origin":'*'
    })
    
}).listen(3000);
console.log("Listening on port 3000")

