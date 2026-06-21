require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");

const authRoutes = require("./routes/auth");
const predictRoutes = require("./routes/predict");

const app = express();

// ============ MONGODB CONNECTION ============
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ============ SESSION STORE ============
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

// ============ MIDDLEWARE ============
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files from frontend
app.use(express.static(path.join(__dirname, "../frontend/static")));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  }),
);

// ============ VIEW ENGINE ============
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/templates"));

// ============ ROUTES ============
app.get("/", (req, res) => {
  if (req.session.userId) return res.redirect("/dashboard");
  res.redirect("/login");
});

app.get("/dashboard", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("dashboard", { userName: req.session.userName });
});

app.use("/", authRoutes);
app.use("/", predictRoutes);

// ============ START SERVER ============
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
