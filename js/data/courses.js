/**
 * data/courses.js — the course catalogue. This is the file you edit to add content.
 *
 * Course fields
 *   id           unique id (used in page URLs)
 *   grade        10 | 11 | 12
 *   subject      subject id from subjects.js
 *   title        course title
 *   teacher      teacher name
 *   cover        cover image URL ('' = coloured placeholder)
 *   description  short description
 *   lessons      list of lessons
 *
 * Lesson helper:  lesson(title, videoUrl, duration)
 *   videoUrl     YouTube link (any format) or a direct .mp4 link; '' = no video yet
 */
(function (Zanko) {
  'use strict';

  const DEFAULT_DURATION = '١٢ خولەک';

  const lesson = (title, videoUrl = '', duration = DEFAULT_DURATION) => ({ title, videoUrl, duration });
  const lessonsFrom = (...titles) => titles.map((title) => lesson(title));

  Zanko.courses = [
    {
      id: 'm10a', grade: 10, subject: 'ma',
      title: 'بیرکاری پۆلی ١٠ – شیکاری تەواو',
      teacher: 'مامۆستا هێمن کەریم',
      cover: '',
      description: 'هەموو بابەتەکانی کتێبی بیرکاری پۆلی دەیەم بە ڕوونکردنەوەی ورد و نموونەی زۆر.',
      lessons: lessonsFrom('کۆمەڵەکان', 'ژمارە ڕاستەقینەکان', 'هاوکێشەی پلەی دووەم', 'نایەکسانییەکان', 'ڕێکخستنی تاقیکردنەوە'),
    },
    {
      id: 'p10a', grade: 10, subject: 'ph',
      title: 'فیزیا بە شێوازێکی سادە',
      teacher: 'مامۆستا شنو ڕەسوڵ',
      cover: '',
      description: 'فیزیای پۆلی ١٠ لە سەرەتاوە تا کۆتایی، لەگەڵ ئەزموونی بەکردەوە.',
      lessons: lessonsFrom('پێوانە و یەکەکان', 'جووڵە لە یەک ئاراستە', 'خێرایی و پەلەکردن', 'هێز و یاساکانی نیوتن'),
    },
    {
      id: 'm11a', grade: 11, subject: 'ma',
      title: 'بیرکاری پۆلی ١١ – کۆرسی تەواو',
      teacher: 'مامۆستا ئاراس ئەحمەد',
      cover: '',
      description: 'کۆرسێکی تەواو بۆ کتێبی بیرکاری پۆلی یازدەیەم، هەموو وانەکان بە ڕوونکردنەوە.',
      lessons: lessonsFrom('فەنکشنەکان', 'سنوور', 'دێریڤەیتیڤ', 'بەکارهێنانی دێریڤەیتیڤ', 'ئینتیگراڵ', 'تاقیکردنەوەی گشتی'),
    },
    {
      id: 'm11b', grade: 11, subject: 'ma',
      title: 'بیرکاری ١١ – خێرا و ئاسان',
      teacher: 'مامۆستا دیلان ساڵح',
      cover: '',
      description: 'شێوازێکی جیاواز: کورتکراوە و ڕێگای خێرا بۆ شیکردنەوەی پرسیارەکان.',
      lessons: lessonsFrom('پوختەی فەنکشن', 'فێڵ و ڕێگای خێرا', 'پرسیاری وەزاری ٢٠٢٤', 'پرسیاری وەزاری ٢٠٢٥'),
    },
    {
      id: 'ph11a', grade: 11, subject: 'ph',
      title: 'فیزیای پۆلی ١١ – کۆرسی تەواو',
      teacher: 'ماموستا دلفين سليم',
      cover: 'https://img.youtube.com/vi/5XzP7JvQ7QI/maxresdefault.jpg',
      description: 'فیزیای پۆلی یازدەیەم بە ڕوونکردنەوەی هاوکێشەکان و چارەسەرکردنی پرسیار.',
      lessons: [
        lesson('ڤێکتەرەکان', 'https://youtu.be/5XzP7JvQ7QI?si=fo4Jqm2Cb6hdyo2P'),
        ...lessonsFrom('جووڵەی دووڕەهەند', 'کار و وزە', 'گەرمی و پلەی گەرمی', 'شەپۆلەکان'),
      ],
    },
    {
      id: 'ph11b', grade: 11, subject: 'ph',
      title: 'فیزیا ١١ – ئامادەکاری وەزاری',
      teacher: 'مامۆستا شنو ڕەسوڵ',
      cover: '',
      description: 'کۆرسی پوختەکراو بۆ ئامادەکاری تاقیکردنەوە.',
      lessons: lessonsFrom('پوختەی بەشی یەکەم', 'پوختەی بەشی دووەم', 'نموونەی وەزاری'),
    },
    {
      id: 'c11a', grade: 11, subject: 'ch',
      title: 'کیمیای پۆلی ١١',
      teacher: 'مامۆستا ڕێباز عومەر',
      cover: '',
      description: 'کیمیا بە شێوەیەکی ڕوون و ڕێکخراو، لەگەڵ هاوکێشە و کێشەکان.',
      lessons: lessonsFrom('پێکهاتەی ئەتۆم', 'خشتەی خولی', 'بەستنەوە کیمیاییەکان', 'هاوکێشە کیمیاییەکان', 'ڕێژەی مۆل'),
    },
    {
      id: 'ar11a', grade: 11, subject: 'ar',
      title: 'اللغة العربية – الصف الحادي عشر',
      teacher: 'الأستاذ محمد علي',
      cover: '',
      description: 'شرح النحو والصرف والأدب بأسلوب مبسط.',
      lessons: lessonsFrom('الجملة الاسمية', 'الجملة الفعلية', 'الأدب العباسي', 'التعبير'),
    },
    {
      id: 'ku11a', grade: 11, subject: 'ku',
      title: 'زمانی کوردی پۆلی ١١',
      teacher: 'مامۆستا ژیان تەها',
      cover: '',
      description: 'ڕێزمان و ئەدەب و دەربڕین بەپێی کتێبی وەزاری.',
      lessons: lessonsFrom('ڕێزمان', 'ئەدەبی کلاسیک', 'شیعری نوێ', 'نووسینی دەربڕین'),
    },
    {
      id: 'e12a', grade: 12, subject: 'en',
      title: 'ئینگلیزی پۆلی ١٢',
      teacher: 'مامۆستا سارا نەجم',
      cover: '',
      description: 'ڕێزمان و وشە و خوێندنەوە بۆ ئامادەکاری تاقیکردنەوەی وەزاری.',
      lessons: lessonsFrom('Tenses', 'Passive Voice', 'Conditionals', 'Reading Skills', 'Writing'),
    },
    {
      id: 'p12a', grade: 12, subject: 'ph',
      title: 'فیزیای پۆلی ١٢ – وەزاری',
      teacher: 'مامۆستا کاروان بەکر',
      cover: '',
      description: 'ئامادەکاری تەواو بۆ فیزیای پۆلی دوازدەیەم.',
      lessons: lessonsFrom('کارەبای نەگۆڕ', 'خولگەی کارەبایی', 'مەگنەتیزم', 'هاندانی کارۆمەگنەتی'),
    },
  ];
})(window.Zanko);
