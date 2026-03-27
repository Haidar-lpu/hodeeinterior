require("dotenv").config({ path: __dirname + "/.env" });
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { Parser } = require("json2csv");

const { Pool } = require("pg");


const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: false   // ✅ THIS FIXES YOUR ERROR
});
pool.connect()
   .then(() => console.log("✅ Connected to database"))
   .catch(err => console.error("❌ DB Connection Error:", err));

module.exports = pool;
const app = express();
app.post("/admin/login", (req, res) => {
   const { username, password } = req.body;

   // TEMP credentials (you can change later)
   if (username === "admin" && password === "hodee#2026%10=6") {
      const token = jwt.sign({ role: "admin" }, process.env.API_SECRET, {
         expiresIn: "1d",
      });

      return res.json({ token });
   }
   console.log("JWT SECRET:", process.env.JWT_SECRET);
   res.status(401).json({ msg: "Invalid credentials" });
});
function verifyAdmin(req, res, next) {
   const token = req.headers.authorization;

   if (!token) {
      return res.status(403).json({ msg: "No token" });
   }

   try {
      jwt.verify(token, process.env.API_SECRET);
      next();
   } catch {
      return res.status(403).json({ msg: "Invalid token" });
   }
}

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Serve frontend */
app.use(express.static(path.join(__dirname, "../public")));
app.use("/admin", express.static(path.join(__dirname, "../admin")));

/* Serve uploaded images */
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));


/* =========================
   ADMIN ROUTES
========================= */

app.get("/admin", (req, res) => {
   res.sendFile(path.join(__dirname, "../admin/login.html"));
});

app.get("/admin/login", (req, res) => {
   res.sendFile(path.join(__dirname, "../admin/login.html"));
});

app.get("/admin/dashboard", (req, res) => {
   res.sendFile(path.join(__dirname, "../admin/dashboard.html"));
});

app.get("/admin/projects", (req, res) => {
   res.sendFile(path.join(__dirname, "../admin/projects.html"));
});

app.get("/admin/enquiries", (req, res) => {
   res.sendFile(path.join(__dirname, "../admin/enquiries.html"));
});


/* =========================
   FILE UPLOAD CONFIG
========================= */

const storage = multer.diskStorage({

   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public/uploads"));
   },

   filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
   }

});

const upload = multer({ storage });


/* =========================
   ENQUIRY APIs
========================= */

/* Create enquiry */

app.post("/api/enquiry", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // 1️⃣ Save to DB
    await pool.query(
      "INSERT INTO enquiries(name,email,phone,service,message) VALUES($1,$2,$3,$4,$5)",
      [name, email, phone, service, message]
    );

    console.log("✅ Enquiry saved");

    // 2️⃣ Respond immediately (FAST UX)
    res.json({ message: "Enquiry saved successfully" });

    // 3️⃣ Send email in background (DON'T AWAIT)
    resend.emails.send({
      from: "Hodee Interior <onboarding@resend.dev>",
      to: ["hodeeinterior@gmail.com"],
      reply_to: email,  
      subject: "New Enquiry - Hodee Interior",
      html: `
        <h2>New Enquiry Received</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Service:</b> ${service}</p>
        <p><b>Message:</b> ${message}</p>
      `
    }).then(() => {  
      console.log("✅ Email sent");
    }).catch(err => {
      console.error("❌ Email error:", err);
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
/* Get enquiries */

app.get("/api/enquiries", async (req, res) => {

   try {

      const result = await pool.query(
         "SELECT * FROM enquiries ORDER BY created_at DESC"
      );

      res.json(result.rows);

   } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Failed to fetch enquiries" });

   }

});


/* Delete enquiry */

app.delete("/api/enquiry/:id", async (req, res) => {

   try {

      const id = req.params.id;

      await pool.query(
         "DELETE FROM enquiries WHERE id=$1",
         [id]
      );

      res.json({ message: "Enquiry deleted" });

   } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Delete failed" });

   }

});


/* Update enquiry status */

app.put("/api/enquiry/:id", async (req, res) => {

   try {

      const id = req.params.id;
      const { status } = req.body;

      await pool.query(
         "UPDATE enquiries SET status=$1 WHERE id=$2",
         [status, id]
      );

      res.json({ message: "Status updated" });

   } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Update failed" });

   }

});


/* =========================
   PROJECT APIs
========================= */

/* Upload project */

app.post("/api/projects", upload.single("image"), async (req, res) => {

   try {

      const { title, description, status } = req.body;

      if (!req.file) {
         return res.status(400).json({ error: "Image required" });
      }

      const image = req.file.filename;

      await pool.query(
         "INSERT INTO projects(title,description,image,status) VALUES($1,$2,$3,$4)",
         [title, description, image, status]
      );

      res.json({ message: "Project added" });

   } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Upload failed" });

   }

});


/* Get projects */

app.get("/api/projects", async (req, res) => {

   try {

      const result = await pool.query(
         "SELECT * FROM projects ORDER BY created_at DESC"
      );

      res.json(result.rows);

   } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Fetch failed" });

   }

});


/* Delete project */

app.delete("/api/projects/:id", async (req, res) => {

   try {

      const id = req.params.id;

      await pool.query(
         "DELETE FROM projects WHERE id=$1",
         [id]
      );

      res.json({ message: "Project deleted" });

   } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Delete failed" });

   }

});


/* =========================
   EXPORT CSV
========================= */

app.get("/api/export", async (req, res) => {

   try {

      const result = await pool.query("SELECT * FROM enquiries");

      const parser = new Parser();
      const csv = parser.parse(result.rows);

      res.header("Content-Type", "text/csv");
      res.attachment("enquiries.csv");

      res.send(csv);

   } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Export failed" });

   }

});


/* =========================
   DASHBOARD ANALYTICS
========================= */

app.get("/api/dashboard", async (req, res) => {

   try {

      const total = await pool.query(
         "SELECT COUNT(*) FROM enquiries"
      );

      const interior = await pool.query(
         "SELECT COUNT(*) FROM enquiries WHERE service='Interior Design'"
      );

      const blueprint = await pool.query(
         "SELECT COUNT(*) FROM enquiries WHERE service='Blueprint'"
      );

      const architecture = await pool.query(
         "SELECT COUNT(*) FROM enquiries WHERE service='Architecture'"
      );

      res.json({
         total: total.rows[0].count,
         interior: interior.rows[0].count,
         blueprint: blueprint.rows[0].count,
         architecture: architecture.rows[0].count
      });

   } catch (err) {

      console.error(err);
      res.status(500).json({ error: "Dashboard error" });

   }

});


/* =========================
   ADMIN LOGIN
========================= */

app.post("/api/login", async (req, res) => {

   try {

      const { username, password } = req.body;

      const result = await pool.query(
         "SELECT * FROM admins WHERE email=$1 AND password=$2",
         [username, password]
      );

      if (result.rows.length > 0) {
         res.json({ success: true });
      } else {
         res.json({ success: false });
      }

   } catch (err) {

      console.error(err);
      res.status(500).json({ error: "login error" });

   }

});


/* =========================
   SERVER START
========================= */

const PORT = 3000;

app.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
});