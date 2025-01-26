const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    

    logging: (query, time) => {
        if (query.includes("ERROR")) {  // Пример условия: логировать только ошибки
          console.log(time + " " + query);
        }
      }
});
sequelize.authenticate()
  .then(() => {
    console.log('Connection established successfully');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


module.exports = sequelize;

