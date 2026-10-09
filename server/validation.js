'use strict';

const { z } = require('zod');
const { AppError } = require('./errors');
const { grades, cities } = require('./shared');

const emptyToNull = (value) => (value === '' || value === undefined ? null : value);
const optional = (schema) => z.preprocess(emptyToNull, schema.nullable());

const fullName = z.string({ error: 'ناوی تەواوت بنووسە' }).trim()
  .min(3, 'ناو دەبێت لانی کەم ٣ پیت بێت').max(80, 'ناو زۆر درێژە');

const email = z.string({ error: 'ئیمەیڵەکەت بنووسە' }).trim().toLowerCase()
  .email('ئیمەیڵێکی دروست بنووسە').max(120, 'ئیمەیڵ زۆر درێژە');

const newPassword = z.string({ error: 'وشەی نهێنی بنووسە' })
  .min(8, 'وشەی نهێنی دەبێت لانی کەم ٨ نووسە بێت')
  .max(72, 'وشەی نهێنی زۆر درێژە')
  .regex(/\p{L}/u, 'وشەی نهێنی دەبێت پیتی تێدا بێت')
  .regex(/\d/, 'وشەی نهێنی دەبێت ژمارەی تێدا بێت');

const currentPassword = z.string({ error: 'وشەی نهێنی بنووسە' }).min(1, 'وشەی نهێنی بنووسە').max(72);

const grade = z.coerce.number({ error: 'پۆلەکەت هەڵبژێرە' })
  .refine((value) => grades.includes(value), 'پۆلەکەت هەڵبژێرە');

const profileFields = {
  fullName,
  grade,
  phone: optional(z.string().trim().regex(/^\+?[0-9\s-]{7,15}$/, 'ژمارەی مۆبایل دروست نییە')),
  city: optional(z.enum(cities, { error: 'شارێکی دروست هەڵبژێرە' })),
  school: optional(z.string().trim().max(80, 'ناوی قوتابخانە زۆر درێژە')),
};

const schemas = {
  register: z.object({ ...profileFields, email, password: newPassword }),
  login: z.object({ email: z.string().trim().toLowerCase().min(1, 'ئیمەیڵەکەت بنووسە'), password: currentPassword }),
  profile: z.object(profileFields),
  password: z.object({ currentPassword, newPassword }),
  deleteAccount: z.object({ password: currentPassword }),
  completeLesson: z.object({
    courseId: z.string().min(1).max(40),
    lessonIndex: z.number().int().min(0).max(500),
  }),
};

/** Express middleware: validates req.body, replaces it with the parsed value. */
function validate(schemaName) {
  return (req, res, next) => {
    const result = schemas[schemaName].safeParse(req.body);
    if (result.success) {
      req.body = result.data;
      return next();
    }
    const fields = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] || '_';
      if (!fields[key]) fields[key] = issue.message;
    }
    throw new AppError(400, 'داتاکان دروست نین', fields);
  };
}

module.exports = { validate };
