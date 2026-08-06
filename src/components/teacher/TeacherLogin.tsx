import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LOGO_URL } from './types';

export const TeacherLogin = ({
  inputPassword,
  setInputPassword,
  authError,
  loading,
  onSubmit,
}: {
  inputPassword: string;
  setInputPassword: (value: string) => void;
  authError: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border-2 border-border/40 p-8">
        <div className="text-center mb-6">
          <img src={LOGO_URL} alt="Клуб Kasalia" className="h-14 w-auto object-contain mx-auto mb-4" />
          <h1 className="font-display text-2xl font-extrabold">Кабинет преподавателя</h1>
          <p className="text-sm text-muted-foreground mt-1">Введите пароль для входа</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
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
};
