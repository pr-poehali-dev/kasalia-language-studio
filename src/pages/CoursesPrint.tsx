import PrintLayout from '@/components/PrintLayout';

const courses = [
  {
    lang: 'Английский',
    emoji: '🇬🇧',
    groups: 'Дошкольники 4–6 · Школьники 7–14',
    desc: 'Игровые занятия, песни, ролевые игры и живое общение с носителями культуры.',
  },
  {
    lang: 'Китайский',
    emoji: '🇨🇳',
    groups: 'Дошкольники 5–6 · Школьники 7–14',
    desc: 'Иероглифы через рисунки, интонации через музыку и культуру Поднебесной.',
  },
  {
    lang: 'Мини-сад',
    emoji: '🧸',
    groups: 'Дети 2–6 лет · Суббота',
    desc: 'Утренние занятия для малышей: игры, творчество и первые слова на английском.',
  },
  {
    lang: 'Театральные постановки',
    emoji: '🎭',
    groups: 'Пятница · 17:00–19:00',
    desc: 'Погружение в английский через спектакли, роли и книги — язык через творчество.',
  },
  {
    lang: 'Группа выходного дня',
    emoji: '🎈',
    groups: '1–4 класс · Суббота',
    desc: 'Насыщенные субботние занятия английским для школьников через игру и театр.',
  },
];

const CoursesPrint = () => {
  return (
    <PrintLayout emoji="📚" title="Наши курсы" subtitle="Выбери язык — открой новый мир">
      <div className="grid sm:grid-cols-2 gap-4">
        {courses.map((c, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border-2 border-border/40 bg-muted/20"
          >
            <span className="text-3xl mb-2 block">{c.emoji}</span>
            <p className="font-display font-bold text-xl leading-tight">{c.lang}</p>
            <p className="text-sm font-bold text-primary mt-1">{c.groups}</p>
            <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
          </div>
        ))}
      </div>
    </PrintLayout>
  );
};

export default CoursesPrint;
