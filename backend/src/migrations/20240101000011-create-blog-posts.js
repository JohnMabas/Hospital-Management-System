'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BlogPosts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: { type: Sequelize.STRING(400), allowNull: false },
      slug: { type: Sequelize.STRING(500), allowNull: false, unique: true },
      excerpt: { type: Sequelize.TEXT, allowNull: true },
      content: { type: Sequelize.TEXT, allowNull: false },
      authorId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      imageUrl: { type: Sequelize.STRING(500), allowNull: true },
      category: { type: Sequelize.STRING(100), allowNull: true },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      isPublished: { type: Sequelize.BOOLEAN, defaultValue: false },
      publishedAt: { type: Sequelize.DATE, allowNull: true },
      viewCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('BlogPosts', ['slug'], { unique: true });
    await queryInterface.addIndex('BlogPosts', ['isPublished']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('BlogPosts');
  },
};
