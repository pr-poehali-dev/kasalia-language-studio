import { useState } from 'react';
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

const LEAD_URL = 'https://functions.poehali.dev/ad987ba9-5309-4dde-bca4-4b2f991cc308';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/files/aeb8788f-6070-489b-b9c1-8073465ad54d.jpg';

const nav = [
  { label: 'О студии', href: '#about' },
  { label: 'Курсы', href: '#courses' },
  { label: 'Преподаватели', href: '#teachers' },
  { label: 'Расписание', href: '#schedule' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Блог', href: '#blog' },
  { label: 'Контакты', href: '#contacts' },
];

const courses = [
  {
    lang: 'Английский',
    icon: 'Sparkles',
    color: 'bg-primary',
    tint: 'bg-primary/10',
    text: 'text-primary',
    emoji: '🇬🇧',
    groups: 'Дошкольники 4–6 · Школьники 7–14',
    desc: 'Игровые занятия, песни, ролевые игры и живое общение с носителями культуры.',
  },
  {
    lang: 'Китайский',
    icon: 'Languages',
    color: 'bg-secondary',
    tint: 'bg-secondary/10',
    text: 'text-secondary',
    emoji: '🇨🇳',
    groups: 'Дошкольники 5–6 · Школьники 7–14',
    desc: 'Иероглифы через рисунки, интонации через музыку и культуру Поднебесной.',
  },
];

const teachers = [
  { name: 'Мария Соколова', role: 'Английский · дошкольники', emoji: '👩‍🏫', color: 'bg-primary/10' },
  { name: 'Ли Вэй', role: 'Китайский · носитель языка', emoji: '🧑‍🏫', color: 'bg-secondary/10' },
  { name: 'Анна Петрова', role: 'Английский · школьники', emoji: '👩‍🎓', color: 'bg-accent/20' },
  { name: 'Дэвид Смит', role: 'Английский · носитель', emoji: '🧑‍💼', color: 'bg-purple/10' },
];

const schedule = [
  { day: 'Пн / Ср', time: '16:00', course: 'Английский · малыши', color: 'text-primary' },
  { day: 'Вт / Чт', time: '17:30', course: 'Китайский · школьники', color: 'text-secondary' },
  { day: 'Пн / Ср', time: '18:00', course: 'Английский · подростки', color: 'text-primary' },
  { day: 'Сб', time: '11:00', course: 'Разговорный клуб', color: 'text-purple' },
];

const reviews = [
  {
    name: 'Ольга',
    kid: 'мама Софии, 6 лет',
    text: 'София бежит на занятия с восторгом! За полгода запела песни на английском.',
    stars: 5,
  },
  {
    name: 'Дмитрий',
    kid: 'папа Артёма, 9 лет',
    text: 'Китайский казался нам чем-то невозможным. Преподаватели сделали его игрой.',
    stars: 5,
  },
  {
    name: 'Екатерина',
    kid: 'мама Вани, 11 лет',
    text: 'Кабинет ученика — находка. Всегда вижу задания и прогресс сына.',
    stars: 5,
  },
];

const blog = [
  { tag: 'Советы', title: 'Как влюбить ребёнка в язык с первого урока', emoji: '💡' },
  { tag: 'Китайский', title: '5 иероглифов, которые дети запоминают за минуту', emoji: '🀄' },
  { tag: 'Родителям', title: 'Билингвы: мифы и реальная польза для мозга', emoji: '🧠' },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <a href="#" className="flex items-center gap-2">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-primary text-primary-foreground font-display font-extrabold text-xl rotate-3">
              K
            </span>
            <span className="font-display text-2xl font-extrabold tracking-tight">Kasalia</span>
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
        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute top-40 right-0 w-72 h-72 rounded-full bg-secondary/20 blur-3xl" />
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
              <Stat value="500+" label="учеников" />
              <Stat value="12" label="преподавателей" />
              <Stat value="8 лет" label="опыта" />
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-accent/20 to-secondary/20 rounded-[3rem] rotate-6" />
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
      <section id="about" className="container py-16">
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { icon: 'Gamepad2', t: 'Через игру', d: 'Песни, квесты и ролевые игры вместо зубрёжки', c: 'text-primary' },
            { icon: 'Users', t: 'Мини-группы', d: 'До 6 детей — внимание каждому ученику', c: 'text-secondary' },
            { icon: 'Globe', t: 'Носители языка', d: 'Живое произношение с первых занятий', c: 'text-purple' },
            { icon: 'Trophy', t: 'Результат', d: 'Прогресс виден уже через месяц', c: 'text-pink' },
          ].map((f) => (
            <div key={f.t} className="bg-card rounded-3xl p-6 border border-border/50 hover-scale shadow-sm">
              <div className={`w-14 h-14 rounded-2xl bg-muted grid place-items-center mb-4 ${f.c}`}>
                <Icon name={f.icon} size={28} />
              </div>
              <h3 className="font-display font-bold text-lg mb-1">{f.t}</h3>
              <p className="text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="container py-16">
        <SectionTitle emoji="📚" title="Наши курсы" subtitle="Выбери язык — открой новый мир" />
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <div
              key={c.lang}
              className="relative rounded-[2rem] p-8 border border-border/50 bg-card overflow-hidden hover-scale shadow-sm"
            >
              <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full ${c.tint}`} />
              <span className="text-5xl mb-4 block relative">{c.emoji}</span>
              <h3 className="font-display text-3xl font-extrabold mb-2 relative">{c.lang}</h3>
              <p className={`font-bold text-sm mb-3 relative ${c.text}`}>{c.groups}</p>
              <p className="text-muted-foreground mb-6 relative">{c.desc}</p>
              <Button className={`rounded-full font-bold relative ${c.color} hover:opacity-90`}>
                Подробнее <Icon name="ArrowRight" size={18} className="ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Teachers */}
      <section id="teachers" className="container py-16">
        <SectionTitle emoji="🧑‍🏫" title="Преподаватели" subtitle="Добрые, весёлые и очень опытные" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {teachers.map((t) => (
            <div key={t.name} className="bg-card rounded-3xl p-6 text-center border border-border/50 hover-scale shadow-sm">
              <div className={`w-24 h-24 mx-auto rounded-full ${t.color} grid place-items-center text-5xl mb-4`}>
                {t.emoji}
              </div>
              <h3 className="font-display font-bold text-lg">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="container py-16">
        <SectionTitle emoji="🗓️" title="Расписание" subtitle="Удобное время для будней и выходных" />
        <div className="bg-card rounded-[2rem] border border-border/50 overflow-hidden shadow-sm">
          {schedule.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-5 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
            >
              <span className="w-20 font-bold text-sm text-muted-foreground">{s.day}</span>
              <span className={`font-display text-2xl font-extrabold w-20 ${s.color}`}>{s.time}</span>
              <span className="font-semibold flex-1">{s.course}</span>
              <Button variant="outline" size="sm" className="rounded-full font-bold border-2 hidden sm:flex">
                Записаться
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="container py-16">
        <SectionTitle emoji="⭐" title="Отзывы родителей" subtitle="Нам доверяют самое дорогое" />
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="bg-card rounded-3xl p-7 border border-border/50 shadow-sm">
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
      </section>

      {/* Blog */}
      <section id="blog" className="container py-16">
        <SectionTitle emoji="✍️" title="Блог студии" subtitle="Полезное для детей и родителей" />
        <div className="grid md:grid-cols-3 gap-6">
          {blog.map((b) => (
            <a
              key={b.title}
              href="#"
              className="group bg-card rounded-3xl p-7 border border-border/50 hover-scale shadow-sm block"
            >
              <span className="text-4xl mb-4 block">{b.emoji}</span>
              <span className="text-xs font-bold uppercase tracking-wide text-primary">{b.tag}</span>
              <h3 className="font-display font-bold text-lg mt-2 group-hover:text-primary transition-colors">
                {b.title}
              </h3>
            </a>
          ))}
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
                <ContactItem icon="MapPin" text="Москва, ул. Языковая, 5" />
                <ContactItem icon="Phone" text="+7 (900) 123-45-67" />
                <ContactItem icon="Mail" text="hello@kasalia.ru" />
              </div>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-foreground font-display font-extrabold">
              K
            </span>
            <span className="font-display font-extrabold text-lg">Kasalia</span>
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

const LeadForm = () => {
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
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Заявка отправлена! 🎉', description: 'Мы свяжемся с вами в ближайшее время.' });
      setForm({ name: '', phone: '', comment: '' });
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
        <Label htmlFor="lead-comment">Комментарий</Label>
        <Textarea
          id="lead-comment"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="Возраст ребёнка, желаемый язык..."
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

const StudentCabinet = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="rounded-full font-bold gap-2 hover-scale">
        <Icon name="GraduationCap" size={18} />
        <span className="hidden sm:inline">Кабинет ученика</span>
      </Button>
    </DialogTrigger>
    <DialogContent className="rounded-3xl">
      <DialogHeader>
        <DialogTitle className="font-display text-2xl flex items-center gap-2">
          <span className="text-3xl">🎒</span> Кабинет ученика
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-2">
        <p className="text-sm text-muted-foreground">
          Войдите, чтобы посмотреть материалы, домашние задания и расписание занятий.
        </p>
        <div className="space-y-2">
          <Label htmlFor="login">Логин или телефон</Label>
          <Input id="login" placeholder="+7 (___) ___-__-__" className="rounded-xl h-12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pass">Пароль</Label>
          <Input id="pass" type="password" placeholder="••••••••" className="rounded-xl h-12" />
        </div>
        <Button className="w-full rounded-xl h-12 font-bold text-base">Войти</Button>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { i: 'BookOpen', t: 'Материалы' },
            { i: 'Calendar', t: 'Расписание' },
            { i: 'ClipboardCheck', t: 'Задания' },
          ].map((x) => (
            <div key={x.t} className="bg-muted rounded-2xl p-4 text-center">
              <Icon name={x.i} size={24} className="mx-auto text-primary mb-1" />
              <p className="text-xs font-semibold">{x.t}</p>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default Index;