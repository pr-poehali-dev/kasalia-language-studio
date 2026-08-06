import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { STUDENT_AUTH_URL, Student } from './types';

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

export const StudentPanel = ({
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
