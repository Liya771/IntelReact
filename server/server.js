require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For OTP generation
const fs = require('fs');
const PDFDocument = require('pdfkit');


const app = express();
const port = 5000
const saltRounds = 10;


app.use(cors());

// Serve React frontend
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
})



// Database Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Password validation function
function isValidPassword(password) {
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  return passwordPattern.test(password);
}

// In-memory OTP store
const otpStore = {};

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// **Send OTP API**
app.post('/send-otp', async (req, res) => {
  const { email, full_name } = req.body;

  try {
    const otp = generateOTP();
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // OTP valid for 10 minutes

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Registration',
      text: `Hi ${full_name},\n\nYour OTP for registration is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nBest regards,\nYour Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
      }
      res.json({ success: true, message: 'OTP sent successfully.' });
    });
  } catch (err) {
    console.error('Error generating OTP:', err);
    res.status(500).json({ error: 'An error occurred while generating OTP.' });
  }
});

// **Verify OTP and Register User**
app.post('/verify-otp', async (req, res) => {
  const { full_name, email, username, password, otp } = req.body;
  console.log(full_name)
  if (!otpStore[email] || otpStore[email].otp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP.' });
  }

  if (Date.now() > otpStore[email].expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      error: 'Password must include uppercase, lowercase, number, and special character.',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.query(
      'INSERT INTO users (full_name, email, username, password) VALUES ($1, $2, $3, $4)',
      [full_name, email, username, hashedPassword]
    );

    delete otpStore[email];

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Registration Successful',
      text: `Hi ${full_name},\n\nYour account has been created successfully.\n\nBest regards,\nYour Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending confirmation email:', error);
        return res.status(500).json({ error: 'Account created, but email not sent.' });
      }
      res.json({ success: true, message: 'Account created successfully.' });
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Error while registering the user.' });
  }
});

// **Login API**
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email does not exist.' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return res.json({ success: true });
    } else {
      return res.status(401).json({ error: 'Incorrect password.' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Error while logging in.' });
  }
});


// add invoice api
app.post('/add-invoice', async (req, res) => {
  const { invoiceDate, invoiceNumber, customerName, customerAddress, customerEmail, taxPercentage, items } = req.body;

  try {
    const client = await pool.connect();
    await client.query('BEGIN'); // Start transaction

    // ✅ Add Invoice
    const invoiceResult = await client.query(
      `INSERT INTO invoices (invoice_date, invoice_number, customer_name, customer_address, customer_email, tax_percentage) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING invoice_id;`,
      [invoiceDate, invoiceNumber, customerName, customerAddress, customerEmail, taxPercentage]
    );

    const invoiceId = invoiceResult.rows[0].invoice_id;

    // ✅ Add Invoice Items
    for (const item of items) {
      await client.query(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, tax_percentage) 
         VALUES ($1, $2, $3, $4, $5)`,
        [invoiceId, item.description, item.quantity, item.unitPrice, item.taxPercentages]
      );
    }

    // ✅ Automatically Add Contact if not exists
    await client.query(
      `INSERT INTO contacts (name, address, email) 
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING;`,
      [customerName, customerAddress, customerEmail]
    );

    await client.query('COMMIT'); // Commit transaction
    client.release();

    // ✅ Ensure invoices folder exists
    const invoicesFolder = './invoices';
    if (!fs.existsSync(invoicesFolder)) {
      fs.mkdirSync(invoicesFolder, { recursive: true });
    }

    // ✅ Generate PDF Invoice
    const pdfPath = `./invoices/invoice_${invoiceNumber}.pdf`;
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(20).text('Invoice', { align: 'center' }).moveDown();
    doc.fontSize(14)
      .text(`Invoice Number: ${invoiceNumber}`)
      .text(`Date: ${invoiceDate}`)
      .text(`Customer: ${customerName}`)
      .text(`Address: ${customerAddress}`)
      .text(`Email: ${customerEmail}`)
      .text(`Tax Rate: ${taxPercentage}%`)
      .moveDown(1);
    
    doc.fontSize(12).text('Items:', { underline: true });
    doc.moveDown();

    const tableTop = doc.y;
    const startX = 50;
    const columnWidths = [30, 200, 60, 80, 80, 80];
    const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
    const rowHeight = 20;

    doc.rect(startX, tableTop, tableWidth, rowHeight).fill('#f0f0f0');
    doc.fillColor('black').font('Helvetica-Bold')
      .text('No', startX, tableTop + 5, { width: columnWidths[0], align: 'center' })
      .text('Description', startX + columnWidths[0], tableTop + 5, { width: columnWidths[1] })
      .text('Qty', startX + columnWidths[0] + columnWidths[1], tableTop + 5, { width: columnWidths[2], align: 'center' })
      .text('Unit Price', startX + columnWidths[0] + columnWidths[1] + columnWidths[2], tableTop + 5, { width: columnWidths[3], align: 'right' })
      .text('Tax', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], tableTop + 5, { width: columnWidths[4], align: 'right' })
      .text('Total', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], tableTop + 5, { width: columnWidths[5], align: 'right' });
    doc.moveTo(startX, tableTop + rowHeight).lineTo(startX + tableWidth, tableTop + rowHeight).stroke();

    let totalAmount = 0;
    let yPos = tableTop + rowHeight;

    items.forEach((item, index) => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemTax = itemTotal * (taxPercentage / 100);
      const itemTotalWithTax = itemTotal + itemTax;
      totalAmount += itemTotalWithTax;

      if (index % 2 === 0) {
        doc.rect(startX, yPos, tableWidth, rowHeight).fill('#fafafa');
      }

      doc.fillColor('black').font('Helvetica')
        .text(index + 1, startX, yPos + 5, { width: columnWidths[0], align: 'center' })
        .text(item.description, startX + columnWidths[0], yPos + 5, { width: columnWidths[1] })
        .text(item.quantity, startX + columnWidths[0] + columnWidths[1], yPos + 5, { width: columnWidths[2], align: 'center' })
        .text(`$${item.unitPrice.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2], yPos + 5, { width: columnWidths[3], align: 'right' })
        .text(`$${itemTax.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], yPos + 5, { width: columnWidths[4], align: 'right' })
        .text(`$${itemTotalWithTax.toFixed(2)}`, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], yPos + 5, { width: columnWidths[5], align: 'right' });

      yPos += rowHeight;
    });

    doc.font('Helvetica-Bold').text(`Grand Total: $${totalAmount.toFixed(2)}`, { align: 'right' });
    doc.end();

    setTimeout(() => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: `Invoice #${invoiceNumber}`,
        text: `Hi ${customerName},\n\nYour invoice is attached.\n\nBest regards,\nYour Company`,
        attachments: [{ filename: `invoice_${invoiceNumber}.pdf`, path: pdfPath }],
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending invoice email:', error);
          return res.status(500).json({ error: 'Invoice added, but email not sent.' });
        }
        res.json({ success: true, message: 'Invoice added and emailed successfully.' });
      });
    }, 3000);

  } catch (err) {
    console.error('Error adding invoice:', err);
    res.status(500).json({ error: 'Error while adding invoice.' });
  }
});

// contact 
app.get("/get-contacts", async (req, res) => {
  try {
      const result = await pool.query("SELECT * FROM contacts");
      res.json(result.rows);  // ✅ Make sure you're sending JSON
  } catch (err) {
      console.error("Error fetching contacts:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/update-contact/:id", async (req, res) => {
  const { id } = req.params;
  const { phone, department, company } = req.body;

  try {
      await pool.query(
          "UPDATE contacts SET phone_number = $1, department = $2, company_name = $3 WHERE id = $4",
          [phone, department, company, id]
      );
      res.json({ message: "Contact updated successfully" });
  } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ error: "Failed to update contact" });
  }
});




// 🟢 Create a new quotation, ensure customer & employee exist
app.post("/quotations", async (req, res) => {
  try {
    const { customerName, customerAddress, customerEmail, employeeName, employeeId, date, number, items } = req.body;

    if (!employeeId || !employeeName) {
      return res.status(400).json({ error: "Both employeeName and employeeId are required" });
    }

    // 1️⃣ Insert Employee
    const employeeResult = await pool.query(
      `INSERT INTO employees (employee_id, name) 
       VALUES ($1, $2) 
       ON CONFLICT (employee_id) DO UPDATE SET name = EXCLUDED.name 
       RETURNING employee_id`,
      [employeeId, employeeName]
    );
    const empId = employeeResult.rows[0].employee_id;

    // 2️⃣ Insert Customer
    const customerResult = await pool.query(
      `INSERT INTO customers (name, address, email) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address 
       RETURNING id`,
      [customerName, customerAddress, customerEmail]
    );
    const customerId = customerResult.rows[0].id;

    // 3️⃣ Insert Quotation
    const total_amount = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const quotationResult = await pool.query(
      `INSERT INTO quotations (quotation_date, quotation_number, customer_id, employee_id, total_amount) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING quotation_id`,
      [date, number, customerId, empId, total_amount]
    );
    const quotationId = quotationResult.rows[0].quotation_id;

    // 4️⃣ Insert Quotation Items
    const insertItemQuery = `INSERT INTO quotation_items (quotation_id, description, quantity, unit_price) VALUES ($1, $2, $3, $4)`;
    for (const item of items) {
      await pool.query(insertItemQuery, [quotationId, item.description, item.quantity, item.unitPrice]);
    }

    // 5️⃣ Generate PDF with Table
    const pdfPath = `quotation_${quotationId}.pdf`;
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(pdfPath));

    // Title
    doc.fontSize(20).text("Quotation", { align: "center" }).moveDown();
    doc.fontSize(14).text(`Quotation Number: ${number}`);
    doc.text(`Date: ${date}`);
    doc.text(`Customer Name: ${customerName}`);
    doc.text(`Address: ${customerAddress}`);
    doc.text(`Email: ${customerEmail}`);
    doc.moveDown();

    // Draw Table Headers
    let startX = 50;
    let startY = doc.y + 10;
    const rowHeight = 30;
    const colWidths = [50, 200, 80, 100, 100]; // Column widths

    // Draw Header Background
    doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), rowHeight).fill("#dddddd").stroke();

    // Header Text
    doc.fillColor("black").fontSize(12).text("#", startX + 10, startY + 10);
    doc.text("Description", startX + colWidths[0] + 10, startY + 10);
    doc.text("Quantity", startX + colWidths[0] + colWidths[1] + 10, startY + 10);
    doc.text("Unit Price", startX + colWidths[0] + colWidths[1] + colWidths[2] + 10, startY + 10);
    doc.text("Total", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 10, startY + 10);

    doc.moveDown();
    startY += rowHeight;

    // Draw Table Rows
    items.forEach((item, index) => {
      const itemTotal = item.quantity * item.unitPrice;
      
      // Draw Row Border
      doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), rowHeight).stroke();

      // Row Text
      doc.text(index + 1, startX + 10, startY + 10);
      doc.text(item.description, startX + colWidths[0] + 10, startY + 10);
      doc.text(item.quantity, startX + colWidths[0] + colWidths[1] + 10, startY + 10);
      doc.text(`$${item.unitPrice.toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + 10, startY + 10);
      doc.text(`$${itemTotal.toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 10, startY + 10);

      startY += rowHeight;
    });

    // Total Row
    doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), rowHeight).fill("#dddddd").stroke();
    doc.fillColor("black").text("Total", startX + colWidths[0] + colWidths[1] + colWidths[2] + 10, startY + 10);
    doc.text(`$${total_amount.toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 10, startY + 10);

    doc.end();

    // 6️⃣ Send Email with PDF
      const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: "Your Quotation",
      text: `Dear ${customerName},\n\nPlease find attached your quotation.\n\nBest regards,\nYour Company`,
      attachments: [{ filename: `Quotation_${quotationId}.pdf`, path: pdfPath }],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
        fs.unlinkSync(pdfPath); // Delete the file after sending
      }
    });

    res.json({ message: "Quotation created and emailed successfully", quotationId });
  } catch (err) {
    console.error("Error creating quotation:", err);
    res.status(500).json({ error: err.message });
  }
});


app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend requests
    credentials: true // Allow sending cookies
}));
// 🔹 **Logout Route** (Removes the JWT)
app.post('/api/logout', (req, res) => {
  res.clearCookie('token'); // Remove token from cookies
  res.json({ message: 'Logged out successfully' });
});

// 🔹 **Protected Route** (Requires Authentication)
app.get('/api/protected', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
      jwt.verify(token, SECRET_KEY);
      res.json({ message: 'Protected content accessed successfully!' });
  } catch {
      res.status(403).json({ message: 'Invalid token' });
  }
});

// **Start Server**
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
