const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = "mongodb://admin:bunny944051@ac-pubtxwb-shard-00-00.ughxwax.mongodb.net:27017,ac-pubtxwb-shard-00-01.ughxwax.mongodb.net:27017,ac-pubtxwb-shard-00-02.ughxwax.mongodb.net:27017/caffelino?ssl=true&replicaSet=atlas-cnaapn-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function checkEvent() {
  try {
    await mongoose.connect(MONGO_URI);
    const event = await Event.findOne({ eventName: "cheese cake" });
    console.log("Event Bank Details from DB:", {
      upiId: event.upiId,
      accountHolderName: event.accountHolderName,
      bankName: event.bankName,
      accountNumber: event.accountNumber,
      ifscCode: event.ifscCode,
      bankDetailsEncrypted: event.bankDetailsEncrypted
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkEvent();
