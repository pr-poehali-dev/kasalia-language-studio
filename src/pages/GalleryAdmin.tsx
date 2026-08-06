import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const GALLERY_URL = 'https://functions.poehali.dev/gallery-placeholder';
const LOGO_URL =
  'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/4fc5576b-3629-4a6b-aaae-c60e197389cd.jpg';

interface GalleryItem {
  id: number;
  mediaType: 'photo' | 'video';
  url: string;
  caption: string | null;
  sortOrder: number;
  createdAt: string;
}

const GalleryAdmin = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = sessionStorage.getItem('kasalia_admin_password');
    if (saved) {
      setAdminPassword(saved);
    }
  }, []);

  const loadItems = async (pwd: string) => {
    setLoading(true);
    try {
      const res = await fetch(GALLERY_URL, { headers: { 'X-Admin-Password': pwd } });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Ошибка входа');
        return;
      }
      setItems(data.items || []);
    } catch {
      setAuthError('Ошибка сети, попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwd = inputPassword.trim();
    if (!pwd) return;
    setAuthError('');
    setLoading(true);
    try {
      const res = await fetch(GALLERY_URL, { headers: { 'X-Admin-Password': pwd } });
      if (!res.ok) {
        const data = await res.json();
        setAuthError(data.error || 'Неверный пароль');
        return;
      }
      const data = await res.json();
      setItems(data.items || []);
      setAdminPassword(pwd);
      sessionStorage.setItem('kasalia_admin_password', pwd);
    } catch {
      setAuthError('Ошибка сети, попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdminPassword('');
    setItems([]);
    sessionStorage.removeItem('kasalia_admin_password');
  };

  const removeItem = async (id: number) => {
    try {
      const res = await fetch(`${GALLERY_URL}?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Password': adminPassword },
      });
      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.error || 'Не удалось удалить', variant: 'destructive' });
        return;
      }
      toast({ title: 'Удалено' });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    }
  };

  if (!adminPassword) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border-2 border-border/40 p-8">
          <div className="text-center mb-6">
            <img src={LOGO_URL} alt="Клуб Kasalia" className="h-14 w-auto object-contain mx-auto mb-4" />
            <h1 className="font-display text-2xl font-extrabold">Галерея · вход</h1>
            <p className="text-sm text-muted-foreground mt-1">Введите пароль администратора</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-pass">Пароль</Label>
              <Input
                id="admin-pass"
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

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 bg-white border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Клуб Kasalia" className="h-10 w-auto object-contain" />
            <span className="font-display font-bold">Управление галереей</span>
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

      <div className="container py-8 grid lg:grid-cols-[380px_1fr] gap-6">
        <UploadForm adminPassword={adminPassword} onAdded={() => loadItems(adminPassword)} />

        <div>
          <p className="font-display font-bold text-sm mb-4">Медиа в галерее ({items.length})</p>
          {loading && <p className="text-sm text-muted-foreground">Загружаем...</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border-2 border-border/40 overflow-hidden shadow-md">
                <div className="aspect-square relative">
                  {item.mediaType === 'photo' ? (
                    <img src={item.url} alt={item.caption || ''} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" muted />
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 grid place-items-center shadow-md hover:bg-destructive hover:text-white transition-colors"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
                {item.caption && <p className="text-xs p-2 text-muted-foreground truncate">{item.caption}</p>}
              </div>
            ))}
            {!loading && items.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-full">Пока нет ни одного фото или видео</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadForm = ({ adminPassword, onAdded }: { adminPassword: string; onAdded: () => void }) => {
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Выберите файл');
      return;
    }
    setLoading(true);
    try {
      const fileData = await fileToBase64(file);
      const res = await fetch(GALLERY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': adminPassword },
        body: JSON.stringify({ mediaType, caption, fileData, fileName: file.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Не удалось загрузить');
        return;
      }
      toast({ title: 'Добавлено в галерею 🎉' });
      setCaption('');
      setFile(null);
      onAdded();
    } catch {
      setError('Ошибка сети, попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-3xl shadow-md border-2 border-border/40 p-5 space-y-3 h-fit">
      <p className="font-display font-bold text-sm">Добавить в галерею</p>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={mediaType === 'photo' ? 'default' : 'outline'}
          className="flex-1 rounded-xl h-10 font-semibold"
          onClick={() => setMediaType('photo')}
        >
          <Icon name="Image" size={16} className="mr-1" /> Фото
        </Button>
        <Button
          type="button"
          variant={mediaType === 'video' ? 'default' : 'outline'}
          className="flex-1 rounded-xl h-10 font-semibold"
          onClick={() => setMediaType('video')}
        >
          <Icon name="Video" size={16} className="mr-1" /> Видео
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="file" className="text-xs">
          {mediaType === 'photo' ? 'Файл фото' : 'Файл видео'}
        </Label>
        <Input
          id="file"
          type="file"
          accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="rounded-xl h-10"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="caption" className="text-xs">Подпись (необязательно)</Label>
        <Input
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Например: Театральная постановка"
          className="rounded-xl h-10"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full rounded-xl h-10 font-bold">
        {loading ? 'Загружаем...' : 'Добавить'}
      </Button>
    </form>
  );
};

export default GalleryAdmin;
