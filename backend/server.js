const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PDFDocument = require("pdfkit");
const fs = require("fs");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_EMAIL,
    pass: process.env.ETHEREAL_PASSWORD
  }
});

const UserModel = require("./models/Users");
const ProductModel = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");

const cors = require("cors");

app.use(cors({
  origin: "https://ajiioclone.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.use("/images", express.static("images"));

app.post("/signin", async (req, res) => {
  const { mobile } = req.body;
  let user = await UserModel.findOne({ mobile });
  if (!user) {
    user = await UserModel.create({ mobile });
  }
  res.json(user);
});

app.post("/add-product", upload.single("image"), async (req, res) => {
  const { name, price, category, quantity } = req.body;
  const product = await ProductModel.create({
    name,
    price,
    category,
    quantity,
    image: req.file.filename
  });
  res.json(product);
});

app.get("/products", async (req, res) => {
  const products = await ProductModel.find();
  res.json(products);
});

app.delete("/products/:id", async (req, res) => {
  await ProductModel.findByIdAndDelete(req.params.id);
  res.json("deleted");
});

app.get("/products/:id", async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  res.json(product);
});

app.put("/update-product/:id", upload.single("image"), async (req, res) => {
  await ProductModel.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    quantity: req.body.quantity,
    image: req.file.filename
  });
  res.json("updated");
});

app.post("/cart", async (req, res) => {
  const { userId, name, price, image } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Login first" });
  }

  const existing = await Cart.findOne({ userId, name });

  if (existing) {
    existing.quantity += 1;
    await existing.save();
    return res.json(existing);
  }

  const item = await Cart.create({
    userId,
    name,
    price,
    image,
    quantity: 1
  });

  res.json(item);
});

app.get("/cart/:userId", async (req, res) => {
  const data = await Cart.find({ userId: req.params.userId });
  res.json(data);
});

app.put("/cart/:id", async (req, res) => {
  const updated = await Cart.findByIdAndUpdate(
    req.params.id,
    { quantity: req.body.quantity },
    { new: true }
  );
  res.json(updated);
});

app.delete("/cart/:id", async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json("deleted");
});

app.post("/order", async (req, res) => {
  const { userId, name, email, mobile, address, city, pincode, paymentMethod } = req.body;

  const cartItems = await Cart.find({ userId });

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart empty" });
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const totalAmount = subtotal + gst;

  const order = await Order.create({
    userId,
    items: cartItems,
    totalAmount,
    name,
    email,
    mobile,
    address,
    city,
    pincode,
    paymentMethod
  });

  await Cart.deleteMany({ userId });

  const filePath = `./invoices/invoice_${Date.now()}.pdf`;

  const doc = new PDFDocument();
  const writeStream = fs.createWriteStream(filePath);

  doc.pipe(writeStream);

  doc.text("INVOICE");
  doc.text("----------------");

  doc.text(`Name: ${name}`);
  doc.text(`Email: ${email}`);

  doc.text("\nItems:");
  cartItems.forEach((item) => {
    doc.text(`${item.name} - ₹${item.price} x ${item.quantity}`);
  });

  doc.text("\nSubtotal: ₹" + subtotal);
  doc.text("GST (18%): ₹" + gst.toFixed(2));
  doc.text("Total: ₹" + totalAmount.toFixed(2));

  doc.end();

  writeStream.on("finish", async () => {
    const info = await transporter.sendMail({
      from: "shop@test.com",
      to: email,
      subject: "Order Invoice",
      text: "Invoice attached",
      attachments: [
        {
          filename: "invoice.pdf",
          path: filePath
        }
      ]
    });

    console.log("Preview:", nodemailer.getTestMessageUrl(info));

    res.json(order);
  });
});

app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.put("/order/:id", async (req, res) => {
  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
});

app.post("/create-checkout-session", async (req, res) => {
  const { cartItems, userId, name, email, mobile, address, city, pincode } = req.body;

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: { name: item.name },
      unit_amount: item.price * 100
    },
    quantity: item.quantity
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `https://ajiioclone.netlify.app/success?userId=${userId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(mobile)}&address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&pincode=${encodeURIComponent(pincode)}`,
    cancel_url: "https://ajiioclone.netlify.app/cancel"
  });

  res.json({ url: session.url });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});