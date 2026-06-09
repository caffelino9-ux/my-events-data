const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv=require("dotenv").config();

const app = express();
const PORT = 4000;

const cafeRoutes = require("./routes/Cafe.routes");
const adminRoutes = require("./routes/Admin.routes.js");
const authRoutes = require("./routes/auth.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const eventRoutes = require("./routes/eventRoutes");

app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/cafe", cafeRoutes);
app.get("/api/admin/debug", (req, res) => res.json({ msg: "debug ok" }));
console.log("adminRoutes mounted: ", typeof adminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/events", eventRoutes);
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
