import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { STUDENT_AUTH_URL } from './types';

export const AddStudentForm = ({ teacherPassword, onAdded }: { teacherPassword: string; onAdded: () => void }) => {
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
