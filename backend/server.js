const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Product = require("./models/Product");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Image upload endpoint (protected)
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder: "sumansi-products" },
      (error, result) => {
        if (error) {
          console.error("[Upload] Cloudinary error:", error);
          return res.status(500).json({ error: "Cloudinary error" });
        }
        res.json({ url: result.secure_url });
      }
    );
    stream.end(req.file.buffer);
  } catch (err) {
    console.error("[Upload] Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Product create endpoint (protected)
app.post("/api/products",  async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdAt: new Date(),
      inStock: req.body.inStock !== undefined ? req.body.inStock : true,
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : req.body.sizes ? req.body.sizes.split(",").map(s => s.trim()) : [],
    };
    if (!productData.name || !productData.image) {
      return res.status(400).json({ error: "Product name and image are required" });
    }
    const product = new Product(productData);
    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error("[Product] Failed to save product:", err);
    res.status(500).json({ error: "Failed to save product" });
  }
});

// Get all products endpoint with search, filter, sort, and pagination
app.get("/api/products", async (req, res) => {
  try {
    const { page = 1, limit = 9, search = "", category = "", sort = "createdAt-desc", id } = req.query;
    const query = {};

    if (id) {
      query.id = id;
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const sortOptions = {};
    const [sortField, sortOrder] = sort.split("-");
    sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("[Product] Failed to fetch products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Update product endpoint (protected)
app.put("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error("[Product] Failed to update product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product endpoint (protected)
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("[Product] Failed to delete product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));