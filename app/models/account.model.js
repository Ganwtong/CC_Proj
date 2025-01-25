module.exports = (sequelize, Sequelize) => {
    const Model = sequelize.define("account", {
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING(5),
        defaultValue: "user",
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status:{
        type: Sequelize.TINYINT,
        defaultValue: 1,
        allowNull: false,
      },
    });
  
    return Model;
  };
  