module.exports = (app) => {
    require("./account.routes")(app);
    require("./item.routes")(app);
};