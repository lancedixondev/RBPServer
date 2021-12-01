const { DataTypes } = require('sequelize');
const db = require('../db');

const Blog = db.define('blog', {
    blogcontent: {
        type: DataTypes.STRING,
        allowNull: false
    },
    feeling: {
        type: DataTypes.STRING
    },
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    }
    
});

module.exports = Blog;