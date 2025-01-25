const db = require("../models");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

const PRIMARY_KEY = "item_id"
const MODEL = "item"

exports.create = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { errors: errors.array() };
        }
        const { item_name, item_type, item_quantity, item_price } = req.body;
        const payload = {
            item_name: item_name,
            item_type: item_type,
            item_quantity: item_quantity,
            item_price: item_price
          };
        var responseData = await db.item.create(payload);

        res.status(200).json(responseData);
    } catch (e) {
        console.log(e)
        res.status(400).json(e);   
    }
};


exports.findAll = async (req, res) => {
    try {
      const allData = await db[MODEL].findAll();
      if (allData.length === 0) throw "No Data Found";
      res.status(200).json(allData);
    } catch (e) {
      res.status(400).json(e);
    }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { item_quantity } = req.body;

    const existingItem = await db[MODEL].findByPk(id);
    if (existingItem == null) throw "Invalid Data";

    const updatedItem = await db[MODEL].update(
      { item_quantity: existingItem.item_quantity + item_quantity },
      { where: { [PRIMARY_KEY]: id } }
    );

    res.status(200).json({updatedItem});
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.updatePrice = async (req, res) => {
  try {
    const id = req.params.id;
    const { item_price } = req.body;

    const existingItem = await db[MODEL].findByPk(id);
    if (existingItem == null) throw "Invalid Data";

    const updatedItem = await db[MODEL].update(
      { item_price: item_price },
      { where: { [PRIMARY_KEY]: id } }
    );

    res.status(200).json({updatedItem});
  } catch (e) {
    res.status(400).json(e);
  }
};

  
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        let eachData = await db[MODEL].findByPk(id);
        if (eachData == null) throw "Invalid Data";
        delete eachData.dataValues.password
        res.status(200).json(eachData);
        } catch (e) {
      res.status(400).json(e);
}
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the item exists
    const existingItem = await db[MODEL].findByPk(id);
    if (!existingItem) {
      throw "Item not found";
    }

    // Delete the item
    await db[MODEL].destroy({
      where: {
        [PRIMARY_KEY]: id
      }
    });

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (e) {
    res.status(400).json(e);
  }
};