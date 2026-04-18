const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Place order (commission)
router.post("/", upload.array('referenceImages', 5), async (req, res) => {
  try {
    const filePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const order = new Order({
      // We will allow guests to commission, so userId is optional. 
      // If we use auth middleware later for users, we can attach req.user.id
      userId: req.user ? req.user.id : null,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      address: req.body.address,
      paperSize: req.body.paperSize,
      portraitType: req.body.portraitType,
      description: req.body.description,
      referenceImages: filePaths,
    });

    await order.save();

    // Send Notification Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to the owner
      subject: `New Commission Request from ${req.body.customerName}`,
      html: `
        <h2>New Commission Request!</h2>
        <p><strong>Customer Name:</strong> ${req.body.customerName}</p>
        <p><strong>Email:</strong> ${req.body.customerEmail}</p>
        <p><strong>Phone:</strong> ${req.body.customerPhone || 'N/A'}</p>
        <p><strong>Address:</strong> ${req.body.address}</p>
        <p><strong>Paper Size:</strong> ${req.body.paperSize}</p>
        <p><strong>Drawing Type:</strong> ${req.body.portraitType}</p>
        <p><strong>Description:</strong> ${req.body.description}</p>
        <p><strong>Number of Reference Images:</strong> ${filePaths.length}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email notification:", error);
      } else {
        console.log("Email notification sent:", info.response);
      }
    });

    res.status(201).json({ message: "Commission placed successfully", order });
  } catch (error) {
    console.error("Error creating commission:", error);
    res.status(500).json({ error: "Failed to place commission" });
  }
});

// Place shop order
router.post("/shop", async (req, res) => {
  try {
    const order = new Order({
      orderType: 'shop',
      userId: req.user ? req.user.id : null,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      address: req.body.address,
      items: req.body.items,
      total: req.body.total
    });

    await order.save();

    // Send Notification Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to the owner
      subject: `New Shop Order from ${req.body.customerName}`,
      html: `
        <h2>New Shop Order!</h2>
        <p><strong>Customer Name:</strong> ${req.body.customerName}</p>
        <p><strong>Email:</strong> ${req.body.customerEmail}</p>
        <p><strong>Total Items:</strong> ${req.body.items ? req.body.items.length : 0}</p>
        <p><strong>Total Price:</strong> $${req.body.total}</p>
        <h3>Items:</h3>
        <ul>
          ${req.body.items ? req.body.items.map(item => `<li>${item.name} - $${item.price}</li>`).join('') : 'No items'}
        </ul>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email notification:", error);
      } else {
        console.log("Email notification sent:", info.response);
      }
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Admin: Get all orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Admin: Update order status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

module.exports = router;