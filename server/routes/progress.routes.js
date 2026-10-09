'use strict';

const { Router } = require('express');
const progress = require('../services/progress.service');
const { validate } = require('../validation');
const { requireAuth } = require('../middleware/auth');

const router = Router();
router.use(requireAuth);

router.post('/complete', validate('completeLesson'), (req, res) => {
  const { courseId, lessonIndex } = req.body;
  res.json(progress.completeLesson(req.user.id, courseId, lessonIndex));
});

module.exports = router;
