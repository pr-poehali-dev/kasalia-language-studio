import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { STUDENT_AUTH_URL, LOGO_URL, Student } from '@/components/teacher/types';
import { TeacherLogin } from '@/components/teacher/TeacherLogin';
import { AddStudentForm } from '@/components/teacher/AddStudentForm';
import { StudentPanel } from '@/components/teacher/StudentPanel';

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
      <TeacherLogin
        inputPassword={inputPassword}
        setInputPassword={setInputPassword}
        authError={authError}
        loading={loading}
        onSubmit={login}
      />
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

export default Teacher;
