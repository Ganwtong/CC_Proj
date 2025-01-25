module.exports = (sequelize, Sequelize) => {
    const Model = sequelize.define("item", {
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      item_name: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      item_type: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      item_quantity: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      item_price: {
        type: Sequelize.DECIMAL(9, 2),
        allowNull: false,
      },
    });

    return Model;

  
}
