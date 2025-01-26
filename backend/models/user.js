const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Import the Sequelize instance
const bcrypt = require('bcrypt');  // Ensure bcrypt is required

// User Model definition
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null since it will be set after registration
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'), // Add role column with user and admin options
    defaultValue: 'user', // Default role is user
  },
}, {
  timestamps: true, // Adds 'createdAt' and 'updatedAt'
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);  // Hash password before saving
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);  // Re-hash if password changes
      }
    }
  }
});

module.exports = User;
