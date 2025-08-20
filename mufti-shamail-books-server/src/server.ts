import express, {
  NextFunction,
  Request,
  Response,
  RequestHandler,
} from "express";
import dotenv from "dotenv";
import connectDB from "./configs/db";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import userRoutes from "./routes/userRoutes";
import cartRoutes from "./routes/cartRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import addressRoutes from "./routes/addressRoutes";
import orderRoutes from "./routes/orderRoutes";
import passwordRoutes from "./routes/passwordRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import fatwahRoutes from "./routes/fatwahRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import {
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
} from "./services/emailService";
import path from "path";

// const envFile =
// 	process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev";
dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "Mufti Shamail Books API",
    version: "1.0.0",
    status: "running",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://srv705671.hstgr.cloud",
  "https://srv705671.hstgr.cloud",
  "https://mufti-shamail-books.onrender.com",
  // Add frontend domain here once froneend is deployed
];

// app.use((req: Request, res: Response, next: NextFunction) => {
// 	const origin = req.headers.origin;
// 	if (origin && allowedOrigins.includes(origin)) {
// 		res.setHeader("Access-Control-Allow-Origin", origin);
// 	}
// 	res.setHeader(
// 		"Access-Control-Allow-Methods",
// 		"GET, POST, PUT, PATCH, DELETE, OPTIONS"
// 	);
// 	res.setHeader(
// 		"Access-Control-Allow-Headers",
// 		"Content-Type, Authorization"
// 	);
// 	res.setHeader("Access-Control-Allow-Credentials", "true");

// 	if (req.method === "OPTIONS") {
// 		return res.sendStatus(200);
// 	}
// 	next();
// });

// app.use(
// 	cors({
// 		origin: function (origin, callback) {
// 			if (!origin || allowedOrigins.includes(origin)) {
// 				callback(null, true);
// 			} else {
// 				callback(new Error("Not allowed by CORS"));
// 			}
// 		},
// 		credentials: true,
// 		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
// 	})
// );

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Serve static files from the "uploads" directory
app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/fatwahs", fatwahRoutes);
app.post("/api/email/test", (req, res) => {
  sendOrderShippedEmail({
    orderNumber: "1234567890",
    contactDetails: {
      email: "mdfarhan9304@gmail.com",
    },
  });
  res.json({ message: "Email sent successfully" });
});
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port https://localhost:${PORT}`);
});
