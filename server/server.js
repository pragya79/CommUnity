const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const msgRoutes = require("./routes/msgRoutes");
const cloudinaryRoutes = require("./routes/cloudinaryRoutes");

const app = express();
const PORT = 5000;

app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
}));
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use("/api/users", userRoutes);
app.use("/api/chatConvo", chatRoutes);
app.use("/api/msg", msgRoutes);
app.use("/api/cloudinary",cloudinaryRoutes)

mongoose
  .connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server running on ${process.env.BACKEND_URL}`);
});