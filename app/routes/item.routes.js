const Validators = require ("../middleware/requestValidate.js")
const auth = require ("../middleware/userauth.js")

module.exports = (app) => {
    const controller = require("../controller/item.controller.js");
    
    var router = require("express").Router();
    
    router.post     ("/"   , Validators.new_item,auth, controller.create);
    router.get      ("/",auth,controller.findAll);
    router.get      ("/:id",auth, controller.findOne);
    router.put      ("/quantity/:id",auth, controller.update);
    router.put      ("/price/:id",auth, controller.updatePrice);
    router.delete   ("/delete/:id",auth, controller.delete)    
    app.use("/api/item", router);
};
    