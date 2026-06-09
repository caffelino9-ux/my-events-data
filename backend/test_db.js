const mongoose = require("mongoose");
const Event = require("./models/Event");
const Registration = require("./models/Registration");
const Cafe = require("./models/Cafe/Cafe_login");

const uri = "mongodb://admin:bunny944051@ac-pubtxwb-shard-00-00.ughxwax.mongodb.net:27017,ac-pubtxwb-shard-00-01.ughxwax.mongodb.net:27017,ac-pubtxwb-shard-00-02.ughxwax.mongodb.net:27017/caffelino?ssl=true&replicaSet=atlas-cnaapn-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("MongoDB Connected Successfully!");

    const eventCount = await Event.countDocuments();
    const regCount = await Registration.countDocuments();
    const cafeCount = await Cafe.countDocuments();

    console.log(`\n--- DATABASE DIAGNOSTIC ---`);
    console.log(`Events count: ${eventCount}`);
    console.log(`Registrations count: ${regCount}`);
    console.log(`Organizers (Cafes) count: ${cafeCount}`);
    
    console.log("\nIf these numbers are 0, your database is empty. If they are >0, data exists!");
    process.exit(0);
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1);
  }
}

testConnection();
