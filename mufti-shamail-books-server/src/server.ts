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
import articleRoutes from "./routes/articleRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import {
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
} from "./services/emailService";
import path from "path";

// const envFile =
// 	process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev";
dotenv.config();

// Memory monitoring and garbage collection
const logMemoryUsage = () => {
  const used = process.memoryUsage();
  console.log('Memory Usage:', {
    rss: `${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`,
    external: `${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`,
    arrayBuffers: `${Math.round(used.arrayBuffers / 1024 / 1024 * 100) / 100} MB`
  });
  
  // Force garbage collection if available and memory usage is high
  if (global.gc && used.heapUsed > 200 * 1024 * 1024) { // 200MB threshold
    console.log('Forcing garbage collection...');
    global.gc();
  }
};

// Log memory usage every 5 minutes
setInterval(logMemoryUsage, 5 * 60 * 1000);

// Handle memory warnings
process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning' || warning.message.includes('memory')) {
    console.warn('Memory Warning:', warning.message);
    logMemoryUsage();
  }
});

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
  "https://mufti-shamail-work-1.onrender.com",
  "https://mufti-shamail-work.onrender.com",
  "https://muftishamail.com"
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

// Manual CORS middleware as fallback
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "Content-Range, X-Content-Range");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With", 
      "Content-Type", 
      "Accept", 
      "Authorization",
      "Cache-Control",
      "Pragma"
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
  })
);

// Middleware with memory-efficient limits
app.use(express.json({ limit: '10mb' })); // Limit request body size
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
app.use("/api/articles", articleRoutes);

app.use(errorHandler);

// Error handling for unhandled rejections and exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process in production, just log the error
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Force garbage collection before exit if available
  if (global.gc) {
    global.gc();
  }
  process.exit(1);
});

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port https://localhost:${PORT}`);
  console.log(`Memory limit: ${process.env.NODE_OPTIONS || 'default'}`);
  logMemoryUsage(); // Log initial memory usage
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
