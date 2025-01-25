const Validators = require ("../middleware/requestValidate.js")
const adminauth = require ("../middleware/adminauth.js")
const auth = require ("../middleware/userauth.js")

module.exports = (app) => {
    const controller = require("../controller/account.controller.js");
    
    var router = require("express").Router();
    
    router.post     ("/"   , Validators.createAccount, controller.create);//create account
    router.get      ("/:id",adminauth,controller.findOne); //get account by id
    router.put      ("/:id",adminauth,controller.updateOne); //   update account by id
    router.get      ("/"   ,adminauth,controller.findAll); //get all account
    router.put      ("/change/pass",Validators.changePassword ,controller.updatePassword); //update password

    
    app.use("/api/account", router);
};
    