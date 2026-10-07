'use strict';

const { Testimonial, ContactMessage } = require('../models');
const { sendSuccess, sendError, parsePagination, buildPaginationMeta } = require('../utils/response');

// ---- Testimonials ----
const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isVisible: true },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });
    return sendSuccess(res, testimonials);
  } catch (error) {
    next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.create(req.body);
    return sendSuccess(res, t, 'Testimonial created', 201);
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findByPk(req.params.id);
    if (!t) return sendError(res, 'Testimonial not found', 404);
    await t.update(req.body);
    return sendSuccess(res, t, 'Testimonial updated');
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findByPk(req.params.id);
    if (!t) return sendError(res, 'Testimonial not found', 404);
    await t.destroy();
    return sendSuccess(res, null, 'Testimonial deleted');
  } catch (error) {
    next(error);
  }
};

// ---- Contact Messages ----
const submitContact = async (req, res, next) => {
  try {
    const msg = await ContactMessage.create(req.body);
    return sendSuccess(res, null, 'Message sent successfully. We will get back to you within 24 hours.', 201);
  } catch (error) {
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { isRead } = req.query;

    const where = {};
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const { count, rows } = await ContactMessage.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return sendSuccess(res, rows, 'Messages fetched', 200, buildPaginationMeta(count, page, limit));
  } catch (error) {
    next(error);
  }
};

const markMessageRead = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByPk(req.params.id);
    if (!msg) return sendError(res, 'Message not found', 404);
    await msg.update({ isRead: true });
    return sendSuccess(res, msg, 'Message marked as read');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  submitContact,
  getContactMessages,
  markMessageRead,
};
