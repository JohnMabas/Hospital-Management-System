'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlogPost extends Model {
    static associate(models) {
      BlogPost.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
    }
  }

  BlogPost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(400),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'BlogPost',
      tableName: 'BlogPosts',
      indexes: [
        { unique: true, fields: ['slug'] },
        { fields: ['authorId'] },
        { fields: ['isPublished'] },
      ],
    }
  );

  return BlogPost;
};
