'use strict';

const { Op } = require('sequelize');
const { BlogPost, User } = require('../models');
const { sendSuccess, sendError, parsePagination, buildPaginationMeta } = require('../utils/response');

const slugify = (text) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const getAllBlogPosts = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { category, search } = req.query;

    const where = { isPublished: true };
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await BlogPost.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['firstName', 'lastName'] }],
      order: [['publishedAt', 'DESC']],
      attributes: { exclude: ['content'] }, // Exclude body from list view
      limit,
      offset,
    });

    return sendSuccess(res, rows, 'Posts fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const getBlogPostBySlug = async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({
      where: { slug: req.params.slug, isPublished: true },
      include: [{ model: User, as: 'author', attributes: ['firstName', 'lastName'] }],
    });

    if (!post) return sendError(res, 'Post not found', 404);
    await post.increment('viewCount');
    return sendSuccess(res, post);
  } catch (error) {
    next(error);
  }
};

const createBlogPost = async (req, res, next) => {
  try {
    const { title, excerpt, content, imageUrl, category, tags, isPublished } = req.body;
    const slug = slugify(title);

    // Check for slug collision
    const existing = await BlogPost.findOne({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const post = await BlogPost.create({
      title,
      slug: finalSlug,
      excerpt,
      content,
      authorId: req.user.id,
      imageUrl,
      category,
      tags: tags || [],
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
    });

    return sendSuccess(res, post, 'Post created', 201);
  } catch (error) {
    next(error);
  }
};

const updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return sendError(res, 'Post not found', 404);

    const updates = { ...req.body };
    if (updates.isPublished && !post.publishedAt) {
      updates.publishedAt = new Date();
    }

    await post.update(updates);
    return sendSuccess(res, post, 'Post updated');
  } catch (error) {
    next(error);
  }
};

const deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) return sendError(res, 'Post not found', 404);
    await post.destroy();
    return sendSuccess(res, null, 'Post deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost };
