require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const connectDB = require("./config/db");

const app = express();

// Security Middleware - Helmet
app.use(helmet());

// CORS Middleware
const allowedOrigins = [
	process.env.CLIENT_URL,
	"http://localhost:5173",
	"http://localhost:3000",
	"http://localhost:5000",
	"http://127.0.0.1:5173",
].filter(Boolean);

app.use(
	cors({
		origin: function (origin, callback) {
			// allow requests with no origin (like mobile apps or curl requests)
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			}
			return callback(null, true); // fallback allow dev origins
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/auth", require("./routes/auth"));

// Basic route
app.get("/", (req, res) => {
	res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Server was not started because the database is unavailable.");
		process.exit(1);
	}
};

startServer();
