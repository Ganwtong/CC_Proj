const sales = {
  databse: "item_manage",
  password: "",
  user: "root",
  config: {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false,
    charset: "utf8",
    collate: "utf8_general_ci",
    dialectOptions: {
      timezone: "local",
      dateStrings: true,
      typeCast: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 50000,
      idle: 15000,
    },
  }
}

module.exports = {
  sales
};
