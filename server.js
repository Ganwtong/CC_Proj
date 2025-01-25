
const express = require("express");
const cors = require("cors");
const db = require("./app/models/index.js");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

const bcrypt = require("bcrypt"); 

db.sequelize.sync({ alter: true });
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
require("./app/routes/router.routes")(app);

app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const secretKey = "ajsdhkasdh"


app.post("/api/login/admin", async (req, res) => {
    try {
      // Get user credentials from request body
      const { email, password } = req.body;
      // Find the user account in the database
          // Check if the provided credentials match the default admin credentials
        if (email === 'super@admin.com' && password === 'super@admin.com') {
          const token = jwt.sign({ id: email, type: 'admin' }, secretKey, {
            expiresIn: "23h",
          });
          return res.status(200).json({ token });
        }


      const account = await db.account.findOne({ where: { email } });
      if (!account) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      // Compare the provided password with the hashed password stored in the database
      const passwordMatches = await bcrypt.compare(password, account.password);
      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Check if the account is deactivated
      const checkStat = await account.status;
      if (!checkStat) {
        return res.status(401).json({ error: "Account deactivated" });
      }

      const token = jwt.sign({ id: account.account_id, type: account.type }, secretKey, {
        expiresIn: "23h",
      });
  
      // Check if the account type is admin
      if (account.type !== "admin") {
        return res.status(401).json({ error: "Not authorized to access admin panel" });
      }
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/login/user", async (req, res) => {
    try {
      // Get user credentials from request body
      const { email, password } = req.body;
      // Find the user account in the database
      const account = await db.account.findOne({ where: { email } });
      if (!account) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      // Compare the provided password with the hashed password stored in the database
      const passwordMatches = await bcrypt.compare(password, account.password);
      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Check if the account is deactivated
      const checkStat = await account.status;
      if (!checkStat) {
        return res.status(401).json({ error: "Account deactivated" });
      }

      const token = jwt.sign({ id: account.account_id, type: account.type }, secretKey, {
        expiresIn: "23h",
      });
  
      // Check if the account type is admin
      if (account.type !== "user") {
        return res.status(401).json({ error: "Invalid account type" });
      }
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });  

// set port, listen for requests
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
