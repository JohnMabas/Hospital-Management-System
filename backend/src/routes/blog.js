'use strict';

const express = require('express');
const router = express.Router();

const { getAllBlogPosts, getBlogPostBySlug, createBlogPost, updateBlogPost, deleteBlogPost } = require('../controllers/blogController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', getAllBlogPosts);
router.get('/:slug', getBlogPostBySlug);
router.post('/', authenticate, authorize('admin', 'doctor'), createBlogPost);
router.put('/:id', authenticate, authorize('admin', 'doctor'), updateBlogPost);
router.delete('/:id', authenticate, authorize('admin'), deleteBlogPost);

module.exports = router;
