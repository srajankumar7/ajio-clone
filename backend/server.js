const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PDFDocument = require("pdfkit");
const fs = require("fs");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'wava87@ethereal.email',
        pass: 'G6kt55YZcw7RwUK5kf'
    }
    });


const UserModel = require("./models/Users");
const ProductModel = require("./models/Product");
const Cart = require("./models/Cart");
const Order = require("./models/Order");
const upload = require("./multer");

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)



app.post('/signin', async (req, res) => {
    const { mobile } = req.body;
    let user = await UserModel.findOne({ mobile });
    if (!user) {
        user = await UserModel.create({ mobile });
    }
    res.json(user);
});

app.post('/add-product', upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, quantity } = req.body;
    const imageUrl = req.file ? req.file.path : "";
    const product = await ProductModel.create({ name, price, category, quantity, image: imageUrl });
    res.json(product);
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});
 
app.get('/products', async (req, res) => {
    const products = await ProductModel.find();
    res.json(products);
});

app.delete('/products/:id', async (req, res) => {
    const id  = req.params.id;
    await ProductModel.findByIdAndDelete(id);
    res.json("Product deleted");
});
app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const products = await ProductModel.findById(id);
    res.json(products);
});

app.put('/update-product/:id', upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    let updateData =
    {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity,
    }
    if (req.file) {
      updateData.image = req.file.path;
    }
    const updated = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updated);
  }
  catch (err) {
    console.log(err);
    res.status(500).send("error updating product");
  }
});

app.post("/cart", async(req, res)=> {
    const { userId, name, price, image } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User not logged in" }); 
    }
    const existing = await Cart.findOne({userId, name });
    if (existing) {
        existing.quantity += 1;
        await existing.save();
        return res.json(existing);
    }
    const item = await Cart.create({
       userId, name,price,image,quantity:1
    });
    res.json(item)
    
});
app.get('/cart/:userId', async (req, res) => {
    const data = await Cart.find({ userId: req.params.userId });
    res.json(data);
});
app.put("/cart/:id", async (req, res) => {
    const { quantity } = req.body;
    const updated = await Cart.findByIdAndUpdate(
        req.params.id,
        { quantity },
        { new: true }
    );
    res.json(updated);
});
app.delete('/cart/:id', async (req, res) => {
    await Cart.findByIdAndDelete(req.params.id);
    res.json(" deleted");
});

app.post("/order", async (req, res) => {
  try {
    const { userId, name, email, mobile, address, city, pincode, paymentMethod } = req.body;

    const cartItems = await Cart.find({ userId });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

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

    if (!fs.existsSync("./invoices")) {
      fs.mkdirSync("./invoices");
    }

    const filePath = `./invoices/invoice_${Date.now()}.pdf`;

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(18).text("INVOICE", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Mobile: ${mobile}`);
    doc.text(`Address: ${address}, ${city} - ${pincode}`);

    doc.moveDown();
    doc.text("Items:");

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      doc.text(`${item.name} - Rs.${item.price} x ${item.quantity} = Rs.${itemTotal}`);
    });

    doc.moveDown();
    doc.text(`Subtotal: Rs.${subtotal}`);
    doc.text(`GST (18%): Rs.${gst.toFixed(2)}`);
    doc.text(`Total: Rs.${totalAmount.toFixed(2)}`);

    doc.end();

    stream.on("finish", async () => {
      const info = await transporter.sendMail({
        from: process.env.ETHEREAL_EMAIL,
        to: email,
        subject: "Order Invoice",
        text: `Your order placed successfully check the attached invoice for details. Total Amount: Rs.${totalAmount.toFixed(2)}`,
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

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/orders", async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});
app.put("/order/:id", async (req, res) => {
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    res.json(updated);
});

app.post("/create-checkout-session", async (req, res) => {
  const {
    cartItems,
    userId,
    name,
    email,
    mobile,
    address,
    city,
    pincode
  } = req.body;

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",

    success_url: `https://ajiioclone.netlify.app/success?userId=${userId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(mobile)}&address=${encodeURIComponent(address)}&city=${encodeURIComponent(city)}&pincode=${encodeURIComponent(pincode)}`,

    cancel_url: "https://ajiioclone.netlify.app/cancel",
  });

  res.json({ url: session.url });
});








app.listen(3001, () => {
    console.log("Server is running on port 3001");
})