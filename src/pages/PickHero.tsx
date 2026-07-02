import { useState } from 'react';
import { Button } from '@/components/ui/button';

const variants = [
  {
    id: 1,
    label: 'Дети обнимают со всех сторон',
    url: 'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/files/5fb51e9a-58a8-491b-b596-71bf298f9049.jpg',
  },
  {
    id: 2,
    label: 'Сидят в кружке с книгами',
    url: 'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/files/5430d5db-b542-429f-9b93-215f5264db32.jpg',
  },
  {
    id: 3,
    label: 'Дети летят вокруг, конфетти',
    url: 'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/files/0e6d9c5a-1719-47be-a06b-d0a4a3ccc8fc.jpg',
  },
  {
    id: 4,
    label: 'Дети выглядывают, флаги',
    url: 'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/files/a383b371-cc94-41c0-b53e-e4366170c519.jpg',
  },
];

const PickHero = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-5xl">
        <h1 className="font-display text-4xl font-extrabold mb-2 text-center">Выбери Hero-картинку</h1>
        <p className="text-muted-foreground text-center mb-10">Нажми на вариант, чтобы выбрать — и скажи мне номер</p>

        <div className="grid grid-cols-2 gap-6">
          {variants.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelected(v.id)}
              className={`cursor-pointer rounded-3xl overflow-hidden border-4 transition-all duration-200 shadow-md ${
                selected === v.id
                  ? 'border-primary scale-[1.02] shadow-xl shadow-primary/30'
                  : 'border-transparent hover:border-primary/40'
              }`}
            >
              <img src={v.url} alt={v.label} className="w-full aspect-square object-cover" />
              <div className={`p-4 text-center font-display font-bold text-lg ${selected === v.id ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                {v.id}. {v.label}
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-10 p-6 bg-primary/10 rounded-3xl text-center border-2 border-primary/30">
            <p className="font-display text-2xl font-bold">Ты выбрал вариант #{selected}</p>
            <p className="text-muted-foreground mt-2">Напиши мне «<b>поставь вариант {selected}</b>» — и я обновлю сайт!</p>
            <Button className="mt-4 rounded-full font-bold px-8" onClick={() => window.location.href = '/'}>
              Вернуться на сайт
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickHero;
