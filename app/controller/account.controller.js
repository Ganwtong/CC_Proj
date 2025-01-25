const db = require("../models");
const bcrypt = require("bcrypt"); 
const { validationResult } = require("express-validator");

const MODEL = "account"



exports.create = async (req, res) => {
  
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { errors: errors.array() };
        }

    const { name, email, type, password, confirmed_password } = req.body;
    if (password !== confirmed_password) {
      throw { errors: [{ msg: 'Password and confirmed password do not match.' }] };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
      const payload = {
        name: name,
        email: email,
        type: type,
        password: hashedPassword,
        status: 1,
      };
  
      var responseData = await db.account.create(payload);
      res.status(200).json(responseData);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  };

  exports.findOne = async (req, res) => {
    try {
      const id = req.params.id;
      const eachData = await db[MODEL].findOne({
        attributes: { exclude: ['password'] },
        where: {
          account_id: id,
          type: 'user'
        },
      });
      
      if (!eachData) {
        throw "Invalid Data";
      }
      
      res.status(200).json(eachData);
    } catch (error) {
      res.status(400).json(error);
    }
  };

exports.updateOne = async (req, res) => {
  try {
    const id = req.params.id;
    const existingRecord = await db.account.findByPk(id);
    if (existingRecord === null) {
      return res.status(401).json({ error: "Record not found. Please check your databases." });
    }

    // Check if the account type is 'admin'
    if (existingRecord.type === 'admin') {
      return res.status(401).json({ error: "Access denied. Cannot update for admin accounts." });
    }

    const {status} = req.body;
    existingRecord.status = status;
    await existingRecord.save();
    res.status(200).json(existingRecord);

    } catch (error) {
    console.log(error);
    res.status(400).json(error);
}
};

exports.findAll = async (req, res) => { //find all account with selected attributes
  try {
    const allData = await db[MODEL].findAll({
      attributes: ['account_id', 'name', 'email','status'],
      where: {
        type: 'user'
      }
    });
    if (allData.length === 0) throw "No Data Found";
    res.status(200).json(allData);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, current_password, new_password, confirmed_password } = req.body;
    
    // Retrieve the existing account record
    const existingRecord = await db.account.findOne({ where: { email } });
    if (!existingRecord) {
      return res.status(401).json({ error: "Account not found. Please check your email." });
    }

    // Compare the current password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(current_password, existingRecord.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid current password." });
    }

    // Check if the new password matches the confirmed password
    if (new_password !== confirmed_password) {
      return res.status(401).json({ error: "New password and confirmed password do not match." });
    }

    // Hash the new password and update the record
    const hashedPassword = await bcrypt.hash(new_password, 10);
    existingRecord.password = hashedPassword;
    await existingRecord.save();

    res.status(200).json({ message: "Password updated successfully." });

  } catch (error) {
    res.status(400).json(error);
  }
};