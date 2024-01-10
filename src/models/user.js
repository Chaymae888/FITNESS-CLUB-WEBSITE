var mongoose=require("mongoose")
const userSchema = new mongoose.Schema({
    name: String,
    prenoun: String,
    email: String,
    gender: String,
    password: String
});

// Créer un modèle à partir du schéma
const User = mongoose.model('User', userSchema);

module.exports = User; 
