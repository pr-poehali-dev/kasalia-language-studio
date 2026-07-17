import { useEffect, useState } from 'react';
import PrintLayout from '@/components/PrintLayout';

const SCHEDULE_URL = 'https://functions.poehali.dev/e1e7212e-ad96-499d-b675-c86e6a8084b9';

interface ScheduleItem {
  id: number;
  days: string;
  time: string;
  course: string;
  color: string;
}

const SchedulePrint = () => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SCHEDULE_URL)
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PrintLayout emoji="🗓️" title="Расписание занятий" subtitle="Удобное время для будней и выходных">
      {loading ? (
        <p className="text-center text-muted-foreground py-10">Загружаем расписание...</p>
      ) : (
        <div className="rounded-2xl border-2 border-border/40 overflow-hidden">
          {items.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center gap-4 p-4 ${i !== items.length - 1 ? 'border-b-2 border-border/40' : ''} ${i % 2 === 0 ? 'bg-muted/20' : 'bg-white'}`}
            >
              <span className="w-20 shrink-0 font-bold text-sm text-muted-foreground">{s.days}</span>
              <span className="font-display text-lg font-extrabold w-28 shrink-0 text-primary">{s.time}</span>
              <span className="font-semibold">{s.course}</span>
            </div>
          ))}
        </div>
      )}
    </PrintLayout>
  );
};

export default SchedulePrint;
