import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const STUDENT_AUTH_URL = 'https://functions.poehali.dev/728bc52d-a39c-44ce-ab69-5c93ec031b38';
const LOGO_URL =
  'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/4fc5576b-3629-4a6b-aaae-c60e197389cd.jpg';

interface Homework {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  status: string;
}

interface Material {
  id: number;
  title: string;
  description: string;
  fileUrl: string | null;
  createdAt: string;
}

interface Student {
  id: number;
  fullName: string;
  kidName: string;
  phone: string;
  course: string;
  homework: Homework[];
  materials: Material[];
}

const Teacher = () => {
  const [teacherPassword, setTeacherPassword] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = sessionStorage.getItem('kasalia_teacher_password');
    if (saved) {
      setTeacherPassword(saved);
    }
  }, []);

  const loadStudents = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${STUDENT_AUTH_URL}?action=students`, {
        headers: { 'X-Teacher-Password': pwd },
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Ошибка входа');
        setTeacherPassword('');
        sessionStorage.removeItem('kasalia_teacher_password');
        return;
      }
      setStudents(data.students || []);
      setTeacherPassword(pwd);
      sessionStorage.setItem('kasalia_teacher_password', pwd);
      setAuthError('');
    } catch {
      setAuthError('Ошибка сети, попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teacherPassword) {
      loadStudents(teacherPassword);
    }
  }, [teacherPassword]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword.trim()) return;
    loadStudents(inputPassword.trim());
  };

  const logout = () => {
    setTeacherPassword('');
    setStudents([]);
    sessionStorage.removeItem('kasalia_teacher_password');
  };

  if (!teacherPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border-2 border-border/40 p-8">
          <div className="text-center mb-6">
            <img src={LOGO_URL} alt="Клуб Kasalia" className="h-14 w-auto object-contain mx-auto mb-4" />
            <h1 className="font-display text-2xl font-extrabold">Кабинет преподавателя</h1>
            <p className="text-sm text-muted-foreground mt-1">Введите пароль для входа</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-pass">Пароль</Label>
              <Input
                id="teacher-pass"
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl h-12"
              />
            </div>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button type="submit" disabled={loading} className="w-full rounded-xl h-12 font-bold text-base">
              {loading ? 'Входим...' : 'Войти'}
            </Button>
          </form>
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              ← На сайт
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 bg-white border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Клуб Kasalia" className="h-10 w-auto object-contain" />
            <span className="font-display font-bold">Кабинет преподавателя</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full font-bold border-2" asChild>
              <Link to="/">
                <Icon name="ArrowLeft" size={16} className="mr-1" /> На сайт
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout} className="rounded-full">
              <Icon name="LogOut" size={16} className="mr-1" /> Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 grid lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-4">
          <AddStudentForm
            teacherPassword={teacherPassword}
            onAdded={() => loadStudents(teacherPassword)}
          />

          <div className="bg-white rounded-3xl shadow-md border-2 border-border/40 p-4">
            <p className="font-display font-bold text-sm mb-3 px-2">Ученики ({students.length})</p>
            {loading && <p className="text-sm text-muted-foreground px-2">Загружаем...</p>}
            <div className="space-y-1">
              {students.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                    selectedStudentId === s.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <p className="font-semibold text-sm">{s.kidName || s.fullName}</p>
                  <p className={`text-xs ${selectedStudentId === s.id ? 'opacity-80' : 'text-muted-foreground'}`}>
                    {s.course || 'Курс не указан'}
                  </p>
                </button>
              ))}
              {!loading && students.length === 0 && (
                <p className="text-sm text-muted-foreground px-2">Учеников пока нет</p>
              )}
            </div>
          </div>
        </div>

        <div>
          {!selectedStudent && (
            <div className="bg-white rounded-3xl shadow-md border-2 border-border/40 p-10 text-center text-muted-foreground">
              Выберите ученика слева, чтобы выдать задание или материал
            </div>
          )}
          {selectedStudent && (
            <StudentPanel
              student={selectedStudent}
              teacherPassword={teacherPassword}
              onChanged={() => loadStudents(teacherPassword)}
              toast={toast}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const AddStudentForm = ({ teacherPassword, onAdded }: { teacherPassword: string; onAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [kidName, setKidName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim() || !phone.trim() || !password.trim()) {
      setError('Заполните имя родителя, телефон и пароль');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${STUDENT_AUTH_URL}?action=add-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Teacher-Password': teacherPassword },
        body: JSON.stringify({ fullName, kidName, phone, password, course }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Не удалось добавить ученика');
        return;
      }
      toast({ title: 'Ученик добавлен 🎉' });
      setFullName('');
      setKidName('');
      setPhone('');
      setPassword('');
      setCourse('');
      setOpen(false);
      onAdded();
    } catch {
      setError('Ошибка сети, попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full rounded-2xl h-12 font-bold">
        <Icon name="UserPlus" size={18} className="mr-2" /> Добавить ученика
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl shadow-md border-2 border-border/40 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-display font-bold text-sm">Новый ученик</p>
        <button type="button" onClick={() => setOpen(false)}>
          <Icon name="X" size={18} className="text-muted-foreground" />
        </button>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="fullName" className="text-xs">Имя родителя</Label>
        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="kidName" className="text-xs">Имя ребёнка</Label>
        <Input id="kidName" value={kidName} onChange={(e) => setKidName(e.target.value)} className="rounded-xl h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-xs">Телефон (логин)</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7..." className="rounded-xl h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs">Пароль ученика</Label>
        <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl h-10" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="course" className="text-xs">Курс</Label>
        <Input id="course" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Английский" className="rounded-xl h-10" />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full rounded-xl h-10 font-bold">
        {loading ? 'Добавляем...' : 'Добавить'}
      </Button>
    </form>
  );
};

const StudentPanel = ({
  student,
  teacherPassword,
  onChanged,
  toast,
}: {
  student: Student;
  teacherPassword: string;
  onChanged: () => void;
  toast: ReturnType<typeof useToast>['toast'];
}) => {
  const [tab, setTab] = useState<'homework' | 'materials'>('homework');

  return (
    <div className="bg-white rounded-3xl shadow-md border-2 border-border/40 overflow-hidden">
      <div className="p-6 border-b border-border/40">
        <h2 className="font-display text-2xl font-extrabold">{student.kidName || student.fullName}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {student.fullName} · {student.phone} · {student.course || 'курс не указан'}
        </p>
      </div>

      <div className="flex border-b border-border/40">
        <button
          onClick={() => setTab('homework')}
          className={`flex-1 py-3 font-semibold text-sm ${tab === 'homework' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        >
          Задания ({student.homework.length})
        </button>
        <button
          onClick={() => setTab('materials')}
          className={`flex-1 py-3 font-semibold text-sm ${tab === 'materials' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        >
          Материалы ({student.materials.length})
        </button>
      </div>

      <div className="p-6">
        {tab === 'homework' && (
          <HomeworkTab student={student} teacherPassword={teacherPassword} onChanged={onChanged} toast={toast} />
        )}
        {tab === 'materials' && (
          <MaterialsTab student={student} teacherPassword={teacherPassword} onChanged={onChanged} toast={toast} />
        )}
      </div>
    </div>
  );
};

const HomeworkTab = ({
  student,
  teacherPassword,
  onChanged,
  toast,
}: {
  student: Student;
  teacherPassword: string;
  onChanged: () => void;
  toast: ReturnType<typeof useToast>['toast'];
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${STUDENT_AUTH_URL}?action=add-homework`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Teacher-Password': teacherPassword },
        body: JSON.stringify({ studentId: student.id, title, description, dueDate: dueDate || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.error || 'Не удалось выдать задание', variant: 'destructive' });
        return;
      }
      toast({ title: 'Задание выдано ✅' });
      setTitle('');
      setDescription('');
      setDueDate('');
      onChanged();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-3 bg-muted/50 rounded-2xl p-4">
        <p className="font-display font-bold text-sm">Новое задание</p>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Выучить 10 слов по теме Animals"
          className="rounded-xl h-11 bg-white"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Подробности (необязательно)"
          className="rounded-xl bg-white"
          rows={2}
        />
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-xl h-11 bg-white w-auto"
          />
          <Button type="submit" disabled={loading} className="rounded-xl h-11 font-bold flex-1">
            {loading ? 'Выдаём...' : 'Выдать задание'}
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        {student.homework.map((h) => (
          <div key={h.id} className="bg-muted rounded-xl p-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">{h.title}</p>
              {h.dueDate && (
                <span className="text-xs text-muted-foreground">до {new Date(h.dueDate).toLocaleDateString('ru-RU')}</span>
              )}
            </div>
            {h.description && <p className="text-xs text-muted-foreground mt-1">{h.description}</p>}
          </div>
        ))}
        {student.homework.length === 0 && (
          <p className="text-sm text-muted-foreground">Заданий пока нет</p>
        )}
      </div>
    </div>
  );
};

const MaterialsTab = ({
  student,
  teacherPassword,
  onChanged,
  toast,
}: {
  student: Student;
  teacherPassword: string;
  onChanged: () => void;
  toast: ReturnType<typeof useToast>['toast'];
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${STUDENT_AUTH_URL}?action=add-material`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Teacher-Password': teacherPassword },
        body: JSON.stringify({ studentId: student.id, title, description, fileUrl }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.error || 'Не удалось добавить материал', variant: 'destructive' });
        return;
      }
      toast({ title: 'Материал добавлен ✅' });
      setTitle('');
      setDescription('');
      setFileUrl('');
      onChanged();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-3 bg-muted/50 rounded-2xl p-4">
        <p className="font-display font-bold text-sm">Новый материал</p>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Например: Карточки Animals"
          className="rounded-xl h-11 bg-white"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Подробности (необязательно)"
          className="rounded-xl bg-white"
          rows={2}
        />
        <Input
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="Ссылка на файл или видео (необязательно)"
          className="rounded-xl h-11 bg-white"
        />
        <Button type="submit" disabled={loading} className="w-full rounded-xl h-11 font-bold">
          {loading ? 'Добавляем...' : 'Добавить материал'}
        </Button>
      </form>

      <div className="space-y-2">
        {student.materials.map((m) => (
          <div key={m.id} className="bg-muted rounded-xl p-3">
            <p className="font-semibold text-sm">{m.title}</p>
            {m.description && <p className="text-xs text-muted-foreground mt-1">{m.description}</p>}
            {m.fileUrl && (
              <a href={m.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-primary font-semibold mt-1 inline-block">
                Открыть ссылку →
              </a>
            )}
          </div>
        ))}
        {student.materials.length === 0 && (
          <p className="text-sm text-muted-foreground">Материалов пока нет</p>
        )}
      </div>
    </div>
  );
};

export default Teacher;