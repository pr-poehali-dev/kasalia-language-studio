import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';

const LEAD_URL = 'https://functions.poehali.dev/ad987ba9-5309-4dde-bca4-4b2f991cc308';
const COURSE_DETAILS_URL = 'https://functions.poehali.dev/33a4f8af-112e-46b1-9986-3061871e4b13';
const STUDENT_AUTH_URL = 'https://functions.poehali.dev/728bc52d-a39c-44ce-ab69-5c93ec031b38';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/a1ab755a-6797-4235-bfd5-375aa4882cd6.JPG';

const nav = [
  { label: 'О студии', href: '#about' },
  { label: 'Курсы', href: '#courses' },
  { label: 'Цены', href: '#prices' },
  { label: 'Преподаватели', href: '#teachers' },
  { label: 'Расписание', href: '#schedule' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Блог', href: '#blog' },
  { label: 'Контакты', href: '#contacts' },
];

const prices = [
  { slug: 'english', name: 'Английский · групповое', emoji: '🇬🇧', price: '6 000 ₽', unit: '8 занятий', color: 'text-primary', bg: 'bg-primary/10' },
  { slug: 'chinese', name: 'Китайский · групповое', emoji: '🇨🇳', price: '6 500 ₽', unit: '8 занятий', color: 'text-secondary', bg: 'bg-secondary/10' },
  { slug: 'english', name: 'Английский · индивидуально', emoji: '🇬🇧', price: '1 100 ₽', unit: 'занятие', color: 'text-primary', bg: 'bg-primary/10' },
  { slug: 'chinese', name: 'Китайский · индивидуально', emoji: '🇨🇳', price: '1 300 ₽', unit: 'занятие', color: 'text-secondary', bg: 'bg-secondary/10' },
  { slug: 'teatr', name: 'Театральное искусство', emoji: '🎭', price: '6 500 ₽', unit: '8 занятий', color: 'text-purple', bg: 'bg-purple/10' },
  { slug: 'mini-sad', name: 'Мини-сад', emoji: '🧸', price: '10 000 ₽', unit: 'абонемент · 4 посещения по 3 часа, по субботам', color: 'text-pink', bg: 'bg-pink/10' },
];

const courses = [
  {
    slug: 'english',
    lang: 'Английский',
    icon: 'Sparkles',
    color: 'bg-primary text-primary-foreground',
    tint: 'bg-gradient-to-br from-primary/20 to-accent/30',
    text: 'text-primary',
    emoji: '🇬🇧',
    groups: 'Дошкольники 4–6 · Школьники 7–14',
    desc: 'Игровые занятия, песни, ролевые игры и живое общение с носителями культуры.',
    border: 'border-primary/20',
  },
  {
    slug: 'chinese',
    lang: 'Китайский',
    icon: 'Languages',
    color: 'bg-secondary text-secondary-foreground',
    tint: 'bg-gradient-to-br from-secondary/20 to-purple/20',
    text: 'text-secondary',
    emoji: '🇨🇳',
    groups: 'Дошкольники 5–6 · Школьники 7–14',
    desc: 'Иероглифы через рисунки, интонации через музыку и культуру Поднебесной.',
    border: 'border-secondary/20',
  },
  {
    slug: 'mini-sad',
    lang: 'Мини-сад',
    icon: 'Baby',
    color: 'bg-purple text-white',
    tint: 'bg-gradient-to-br from-purple/20 to-primary/20',
    text: 'text-purple',
    emoji: '🧸',
    groups: 'Дети 2–6 лет · Суббота',
    desc: 'Утренние занятия для малышей: игры, творчество и первые слова на английском.',
    border: 'border-purple/20',
  },
  {
    slug: 'teatr',
    lang: 'Театральные постановки',
    icon: 'Drama',
    color: 'bg-purple text-white',
    tint: 'bg-gradient-to-br from-purple/20 to-primary/20',
    text: 'text-purple',
    emoji: '🎭',
    groups: 'Пятница · 17:00–19:00',
    desc: 'Погружение в английский через спектакли, роли и книги — язык через творчество.',
    border: 'border-purple/20',
  },
  {
    slug: 'vyhodnoy',
    lang: 'Группа выходного дня',
    icon: 'Users2',
    color: 'bg-purple text-white',
    tint: 'bg-gradient-to-br from-purple/20 to-primary/20',
    text: 'text-purple',
    emoji: '🎈',
    groups: '1–4 класс · Суббота',
    desc: 'Насыщенные субботние занятия английским для школьников через игру и театр.',
    border: 'border-purple/20',
  },
];

const teachers = [
  { name: 'Казакова Ксения Фёдоровна', role: 'Английский · Китайский · 2–14 лет', emoji: '👩‍🏫', color: 'bg-primary/10' },
];

const SCHEDULE_URL = 'https://functions.poehali.dev/e1e7212e-ad96-499d-b675-c86e6a8084b9';
const REVIEWS_URL = 'https://functions.poehali.dev/f1850cc6-69d7-4c87-8bd1-145de1010827';

interface ScheduleItem {
  id: number;
  days: string;
  time: string;
  course: string;
  color: string;
}

interface ReviewItem {
  id: number;
  name: string;
  kid: string;
  text: string;
  stars: number;
}

interface CourseDetails {
  slug: string;
  lang: string;
  fullDescription: string;
  teacherName: string;
  teacherRole: string;
  teacherPhoto: string;
  photos: string[];
}

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [openCourseSlug, setOpenCourseSlug] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <a href="#" className="flex items-center">
            <img
              src="https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/4fc5576b-3629-4a6b-aaae-c60e197389cd.jpg"
              alt="Студия Kasalia"
              className="h-14 w-auto object-contain"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <StudentCabinet />
            <button
              className="lg:hidden grid place-items-center w-10 h-10 rounded-xl bg-muted"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="lg:hidden container pb-4 flex flex-col gap-1 animate-fade-in">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 px-3 rounded-xl font-semibold hover:bg-muted"
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute top-40 right-0 w-80 h-80 rounded-full bg-secondary/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full bg-purple/20 blur-3xl" />
        <div className="container grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24 relative">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/40 text-sm font-bold mb-6">
              🚀 Языки — это приключение!
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6">
              Английский и китайский для{' '}
              <span className="text-primary">маленьких</span>{' '}
              <span className="text-secondary">гениев</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Студия Kasalia превращает уроки в игру. Дошкольники и школьники учат языки с
              удовольствием, а родители видят результат.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full text-base font-bold h-14 px-8 hover-scale shadow-lg shadow-primary/30" asChild>
                <a href="#contacts">Записаться на пробный урок</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-base font-bold h-14 px-8 border-2"
                asChild
              >
                <a href="#courses">Выбрать курс</a>
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <Stat value="50+" label="учеников" />
              <Stat value="6 лет" label="опыта" />
              <Stat value="2–14" label="лет детям" />
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-accent/20 to-secondary/20 rounded-[3rem] rotate-6" />
            {/* Фото детей — фон */}
            <img
              src={HERO_IMG}
              alt="Дети учат языки в студии Kasalia"
              className="relative rounded-[3rem] shadow-2xl w-full object-cover"
            />

            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 animate-wiggle">
              <span className="text-2xl">🎉</span>
              <div className="leading-tight">
                <p className="font-display font-bold text-sm">Первый урок</p>
                <p className="text-xs text-muted-foreground">бесплатно!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 section-pink">
        <div className="container">
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { icon: 'Gamepad2', t: 'Через игру', d: 'Песни, квесты и ролевые игры вместо зубрёжки', c: 'text-primary', bg: 'bg-primary/15' },
            { icon: 'Users', t: 'Мини-группы', d: 'До 6 детей — внимание каждому ученику', c: 'text-secondary', bg: 'bg-secondary/15' },
            { icon: 'Drama', t: 'Театр и книги', d: 'Театральные постановки и погружение в язык через книги', c: 'text-purple', bg: 'bg-purple/15' },
            { icon: 'Trophy', t: 'Результат', d: 'Прогресс виден уже через месяц', c: 'text-pink', bg: 'bg-pink/15' },
          ].map((f) => (
            <div key={f.t} className="bg-white rounded-3xl p-6 border-2 border-white card-hover shadow-md">
              <div className={`w-14 h-14 rounded-2xl ${f.bg} grid place-items-center mb-4 ${f.c}`}>
                <Icon name={f.icon} size={28} />
              </div>
              <h3 className="font-display font-bold text-lg mb-1">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-16">
        <div className="container">
        <SectionTitle emoji="📚" title="Наши курсы" subtitle="Выбери язык — открой новый мир" />
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.lang}
              onClick={() => setOpenCourseSlug(c.slug)}
              className={`relative rounded-[2rem] p-8 overflow-hidden card-hover shadow-md bg-white border-2 ${c.border} cursor-pointer`}
            >
              <div className={`absolute -right-8 -top-8 w-48 h-48 rounded-full ${c.tint}`} />
              <span className="text-5xl mb-4 block relative">{c.emoji}</span>
              <h3 className="font-display text-3xl font-extrabold mb-2 relative">{c.lang}</h3>
              <p className={`font-bold text-sm mb-3 relative ${c.text}`}>{c.groups}</p>
              <p className="text-muted-foreground mb-6 relative">{c.desc}</p>
              <div className="flex items-center gap-3 relative">
                <Button
                  variant="outline"
                  className="rounded-full font-bold border-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenCourseSlug(c.slug);
                  }}
                >
                  Подробнее
                </Button>
                <Button
                  className={`rounded-full font-bold ${c.color} hover:opacity-90`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourse(c.lang);
                  }}
                  asChild
                >
                  <a href="#contacts">
                    Записаться <Icon name="ArrowRight" size={18} className="ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      <CourseModal
        slug={openCourseSlug}
        onClose={() => setOpenCourseSlug(null)}
        onEnroll={(lang) => {
          setSelectedCourse(lang);
          setOpenCourseSlug(null);
        }}
      />

      {/* Prices */}
      <section id="prices" className="py-16 section-purple">
        <div className="container">
        <SectionTitle emoji="💳" title="Прайс-лист" subtitle="Прозрачные цены без скрытых доплат" />
        <div className="grid md:grid-cols-3 gap-6">
          {prices.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-3xl p-6 border-2 border-white card-hover shadow-md flex flex-col"
            >
              <div className={`w-14 h-14 rounded-2xl ${p.bg} grid place-items-center mb-4 text-2xl`}>
                {p.emoji}
              </div>
              <h3 className="font-display font-bold text-lg mb-1">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{p.unit}</p>
              <p className={`font-display text-3xl font-extrabold mt-auto ${p.color}`}>{p.price}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button size="lg" className="rounded-full text-base font-bold h-14 px-8 hover-scale shadow-lg shadow-primary/30" asChild>
            <a href="#contacts">Записаться на пробный урок</a>
          </Button>
        </div>
        </div>
      </section>

      {/* Teachers */}
      <section id="teachers" className="py-16 section-teal">
        <div className="container">
          <SectionTitle emoji="🧑‍🏫" title="Преподаватели" subtitle="Добрые, весёлые и очень опытные" />
          <div className="flex justify-center">
            <div className="bg-white rounded-3xl p-10 text-center border-2 border-white card-hover shadow-md max-w-sm w-full">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-lg mb-5">
                <img
                  src="https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/4fc5576b-3629-4a6b-aaae-c60e197389cd.jpg"
                  alt="Казакова Ксения Фёдоровна"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <h3 className="font-display font-bold text-2xl">Казакова Ксения Фёдоровна</h3>
              <p className="text-muted-foreground mt-2">Английский · Китайский · 2–14 лет</p>
              <div className="flex gap-2 justify-center mt-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">Английский</span>
                <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold">Китайский</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="py-16 section-purple">
        <div className="container">
        <SectionTitle emoji="🗓️" title="Расписание · август" subtitle="Удобное время для будней и выходных" />
        <ScheduleList onSelect={setSelectedCourse} />
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-16 section-pink">
        <div className="container">
        <SectionTitle emoji="⭐" title="Отзывы родителей" subtitle="Нам доверяют самое дорогое" />
        <ReviewsList />
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-16 section-teal">
        <div className="container">
        <SectionTitle emoji="✍️" title="Блог студии" subtitle="Полезное для детей и родителей" />
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((b) => (
            <Link
              key={b.slug}
              to={`/blog/${b.slug}`}
              className="group bg-white rounded-3xl p-7 border-2 border-white card-hover shadow-md block"
            >
              <span className="text-4xl mb-4 block">{b.emoji}</span>
              <span className="text-xs font-bold uppercase tracking-wide text-primary">{b.tag}</span>
              <h3 className="font-display font-bold text-lg mt-2 group-hover:text-primary transition-colors">
                {b.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{b.excerpt}</p>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Contacts / CTA */}
      <section id="contacts" className="container py-16">
        <div className="relative rounded-[2.5rem] bg-primary text-primary-foreground p-8 lg:p-14 overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute right-24 top-6 w-32 h-32 rounded-full bg-accent/40" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display text-4xl font-extrabold mb-4">Запишитесь на бесплатный урок 🎈</h2>
              <p className="text-lg opacity-90 mb-8">
                Оставьте контакты — мы подберём удобное время и группу для вашего ребёнка.
              </p>
              <div className="flex flex-col gap-4">
                <ContactItem icon="MapPin" text="Томск, ул. Никитина, 15а" />
                <ContactItem icon="Phone" text="+7 (913) 850-33-38" />
                <ContactItem icon="Mail" text="kasalia@yandex.ru" />
              </div>
            </div>
            <LeadForm selectedCourse={selectedCourse} onCourseChange={setSelectedCourse} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img
              src="https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/4fc5576b-3629-4a6b-aaae-c60e197389cd.jpg"
              alt="Студия Kasalia"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Языковая студия Kasalia. Учим с любовью.</p>
          <div className="flex gap-3">
            {['Send', 'Instagram', 'Youtube'].map((s) => (
              <a key={s} href="#" className="w-10 h-10 rounded-xl bg-muted grid place-items-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Icon name={s} size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <p className="font-display text-2xl font-extrabold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const SectionTitle = ({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) => (
  <div className="text-center mb-10">
    <span className="text-3xl">{emoji}</span>
    <h2 className="font-display text-4xl font-extrabold mt-2">{title}</h2>
    <p className="text-muted-foreground mt-2">{subtitle}</p>
  </div>
);

const LeadForm = ({
  selectedCourse,
  onCourseChange,
}: {
  selectedCourse: string;
  onCourseChange: (v: string) => void;
}) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast({ title: 'Заполните имя и телефон', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, course: selectedCourse }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Заявка отправлена! 🎉', description: 'Мы свяжемся с вами в ближайшее время.' });
      setForm({ name: '', phone: '', comment: '' });
      onCourseChange('');
    } catch {
      toast({ title: 'Не удалось отправить', description: 'Попробуйте позже или позвоните нам.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl p-6 space-y-4 text-foreground shadow-xl">
      <div className="space-y-2">
        <Label htmlFor="lead-name">Имя ребёнка или родителя</Label>
        <Input
          id="lead-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Как к вам обращаться?"
          className="rounded-xl h-12"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lead-phone">Телефон</Label>
        <Input
          id="lead-phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+7 (___) ___-__-__"
          className="rounded-xl h-12"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lead-course">Интересующий курс</Label>
        <Input
          id="lead-course"
          value={selectedCourse}
          onChange={(e) => onCourseChange(e.target.value)}
          placeholder="Например: Английский, Театральные постановки..."
          className="rounded-xl h-12"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lead-comment">Комментарий</Label>
        <Textarea
          id="lead-comment"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="Возраст ребёнка, удобное время..."
          className="rounded-xl min-h-[80px]"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full rounded-xl h-12 font-bold text-base">
        {loading ? 'Отправляем...' : 'Оставить заявку'}
      </Button>
    </form>
  );
};

const ContactItem = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-center gap-2 font-semibold">
    <Icon name={icon} size={20} />
    <span>{text}</span>
  </div>
);

const ScheduleList = ({ onSelect }: { onSelect: (course: string) => void }) => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SCHEDULE_URL)
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-muted-foreground py-10">Загружаем расписание...</div>;
  }

  return (
    <div className="bg-white rounded-[2rem] border-2 border-white overflow-hidden shadow-md">
      {items.map((s) => (
        <div
          key={s.id}
          className="flex items-center gap-4 p-5 border-b border-border/30 last:border-0 hover:bg-purple/5 transition-colors"
        >
          <span className="w-24 font-bold text-sm text-muted-foreground">{s.days}</span>
          <span className={`font-display text-xl font-extrabold w-32 ${s.color}`}>{s.time}</span>
          <span className="font-semibold flex-1">{s.course}</span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full font-bold border-2 hidden sm:flex"
            onClick={() => onSelect(s.course)}
            asChild
          >
            <a href="#contacts">Записаться</a>
          </Button>
        </div>
      ))}
    </div>
  );
};

const ReviewsList = () => {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(REVIEWS_URL)
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-3 gap-6">
        {loading && <p className="text-center text-muted-foreground col-span-3 py-6">Загружаем отзывы...</p>}
        {!loading && items.length === 0 && (
          <p className="text-center text-muted-foreground col-span-3 py-6">
            Пока нет отзывов — станьте первыми! 🎈
          </p>
        )}
        {items.map((r) => (
          <div key={r.id} className="bg-white rounded-3xl p-7 border-2 border-white card-hover shadow-md">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: r.stars }).map((_, i) => (
                <Icon key={i} name="Star" size={18} className="text-accent fill-accent" />
              ))}
            </div>
            <p className="mb-6 leading-relaxed">«{r.text}»</p>
            <div>
              <p className="font-display font-bold">{r.name}</p>
              <p className="text-sm text-muted-foreground">{r.kid}</p>
            </div>
          </div>
        ))}
      </div>
      <ReviewForm onSubmitted={load} />
    </div>
  );
};

const ReviewForm = ({ onSubmitted }: { onSubmitted: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', kid: '', text: '', stars: 5 });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      toast({ title: 'Заполните имя и текст отзыва', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(REVIEWS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Спасибо! 🎉', description: 'Отзыв появится после проверки модератором.' });
      setForm({ name: '', kid: '', text: '', stars: 5 });
      onSubmitted();
    } catch {
      toast({ title: 'Не удалось отправить', description: 'Попробуйте позже.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl p-7 border-2 border-white shadow-md max-w-xl mx-auto space-y-4">
      <h3 className="font-display font-bold text-xl text-center">Оставьте свой отзыв ✍️</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="review-name">Ваше имя</Label>
          <Input
            id="review-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Как к вам обращаться?"
            className="rounded-xl h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="review-kid">Ребёнок</Label>
          <Input
            id="review-kid"
            value={form.kid}
            onChange={(e) => setForm({ ...form, kid: e.target.value })}
            placeholder="Имя ребёнка, возраст"
            className="rounded-xl h-12"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="review-text">Отзыв</Label>
        <Textarea
          id="review-text"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          placeholder="Расскажите, как проходят занятия"
          className="rounded-xl min-h-[90px]"
        />
      </div>
      <div className="space-y-2">
        <Label>Оценка</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setForm({ ...form, stars: n })}
              className="hover-scale"
            >
              <Icon
                name="Star"
                size={26}
                className={n <= form.stars ? 'text-accent fill-accent' : 'text-muted-foreground'}
              />
            </button>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full rounded-xl h-12 font-bold text-base">
        {loading ? 'Отправляем...' : 'Отправить отзыв'}
      </Button>
    </form>
  );
};

const CourseModal = ({
  slug,
  onClose,
  onEnroll,
}: {
  slug: string | null;
  onClose: () => void;
  onEnroll: (lang: string) => void;
}) => {
  const [details, setDetails] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) {
      setDetails(null);
      return;
    }
    setLoading(true);
    fetch(`${COURSE_DETAILS_URL}?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => setDetails(data.course || null))
      .finally(() => setLoading(false));
  }, [slug]);

  const course = courses.find((c) => c.slug === slug);
  const coursePrices = prices.filter((p) => p.slug === slug);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    if (!slug) return;
    fetch(SCHEDULE_URL)
      .then((res) => res.json())
      .then((data) => setSchedule(data.items || []));
  }, [slug]);

  const courseSchedule = course
    ? schedule.filter((s) => s.course.toLowerCase().includes(course.lang.toLowerCase().slice(0, 5)))
    : [];

  return (
    <Dialog open={!!slug} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-3xl max-w-lg max-h-[85vh] overflow-y-auto">
        {loading && <div className="py-10 text-center text-muted-foreground">Загружаем...</div>}
        {!loading && course && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl flex items-center gap-2">
                <span className="text-3xl">{course.emoji}</span> {course.lang}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 pt-2">
              {details?.photos && details.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {details.photos.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${course.lang} — фото ${i + 1}`}
                      className="rounded-2xl w-full h-32 object-cover"
                    />
                  ))}
                </div>
              )}

              <p className="text-sm text-muted-foreground leading-relaxed">
                {details?.fullDescription || course.desc}
              </p>

              {coursePrices.length > 0 && (
                <div>
                  <p className="font-display font-bold text-sm mb-2 flex items-center gap-1">
                    <Icon name="Wallet" size={16} /> Стоимость
                  </p>
                  <div className="space-y-2">
                    {coursePrices.map((p, i) => (
                      <div key={i} className="flex items-center justify-between bg-muted rounded-xl px-4 py-2">
                        <span className="text-sm">{p.unit}</span>
                        <span className={`font-display font-bold ${p.color}`}>{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {courseSchedule.length > 0 && (
                <div>
                  <p className="font-display font-bold text-sm mb-2 flex items-center gap-1">
                    <Icon name="Calendar" size={16} /> Ближайшее расписание
                  </p>
                  <div className="space-y-2">
                    {courseSchedule.map((s) => (
                      <div key={s.id} className="flex items-center gap-3 bg-muted rounded-xl px-4 py-2 text-sm">
                        <span className="font-semibold text-muted-foreground w-20">{s.days}</span>
                        <span className={`font-display font-bold ${s.color}`}>{s.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {details?.teacherName && (
                <div>
                  <p className="font-display font-bold text-sm mb-2 flex items-center gap-1">
                    <Icon name="GraduationCap" size={16} /> Преподаватель
                  </p>
                  <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
                    {details.teacherPhoto && (
                      <img
                        src={details.teacherPhoto}
                        alt={details.teacherName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-sm">{details.teacherName}</p>
                      <p className="text-xs text-muted-foreground">{details.teacherRole}</p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                className={`w-full rounded-xl h-12 font-bold text-base ${course.color}`}
                onClick={() => onEnroll(course.lang)}
                asChild
              >
                <a href="#contacts">Записаться на пробный урок</a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const StudentCabinet = () => {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState<{ token: string; student: { fullName: string; kidName: string; course: string } } | null>(null);
  const [cabinet, setCabinet] = useState<{ materials: any[]; homework: any[] } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('kasalia_session');
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (session?.token) {
      fetch(STUDENT_AUTH_URL, { headers: { 'X-Session-Token': session.token } })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setSession(null);
            localStorage.removeItem('kasalia_session');
          } else {
            setCabinet(data);
          }
        });
    }
  }, [session?.token]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone.trim() || !password.trim()) {
      setError('Заполните телефон и пароль');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(STUDENT_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Не удалось войти');
        return;
      }
      setSession(data);
      localStorage.setItem('kasalia_session', JSON.stringify(data));
      toast({ title: `Добро пожаловать, ${data.student.fullName}! 🎉` });
    } catch {
      setError('Ошибка сети, попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    setCabinet(null);
    localStorage.removeItem('kasalia_session');
    setPhone('');
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full font-bold gap-2 hover-scale">
          <Icon name="GraduationCap" size={18} />
          <span className="hidden sm:inline">Кабинет ученика</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <span className="text-3xl">🎒</span> Кабинет ученика
          </DialogTitle>
        </DialogHeader>

        {!session && (
          <form onSubmit={login} className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Войдите, чтобы посмотреть материалы и домашние задания.
            </p>
            <div className="space-y-2">
              <Label htmlFor="login">Телефон</Label>
              <Input
                id="login"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass">Пароль</Label>
              <Input
                id="pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl h-12"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full rounded-xl h-12 font-bold text-base">
              {loading ? 'Входим...' : 'Войти'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Данные для входа выдаёт преподаватель после записи на курс
            </p>
          </form>
        )}

        {session && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between bg-muted rounded-2xl p-4">
              <div>
                <p className="font-display font-bold">{session.student.kidName || session.student.fullName}</p>
                <p className="text-xs text-muted-foreground">{session.student.course}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="rounded-full">
                <Icon name="LogOut" size={16} className="mr-1" /> Выйти
              </Button>
            </div>

            <div>
              <p className="font-display font-bold text-sm mb-2 flex items-center gap-1">
                <Icon name="BookOpen" size={16} /> Материалы
              </p>
              {cabinet?.materials?.length ? (
                <div className="space-y-2">
                  {cabinet.materials.map((m) => (
                    <div key={m.id} className="bg-muted rounded-xl p-3">
                      <p className="font-semibold text-sm">{m.title}</p>
                      {m.description && <p className="text-xs text-muted-foreground mt-1">{m.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Материалов пока нет</p>
              )}
            </div>

            <div>
              <p className="font-display font-bold text-sm mb-2 flex items-center gap-1">
                <Icon name="ClipboardCheck" size={16} /> Домашние задания
              </p>
              {cabinet?.homework?.length ? (
                <div className="space-y-2">
                  {cabinet.homework.map((h) => (
                    <div key={h.id} className="bg-muted rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{h.title}</p>
                        {h.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            до {new Date(h.dueDate).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                      {h.description && <p className="text-xs text-muted-foreground mt-1">{h.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Заданий пока нет</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Index;