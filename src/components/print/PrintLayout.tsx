import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const LOGO_URL =
  'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/4fc5576b-3629-4a6b-aaae-c60e197389cd.jpg';

interface PrintLayoutProps {
  title: string;
  subtitle: string;
  emoji: string;
  children: ReactNode;
}

const PrintLayout = ({ title, subtitle, emoji, children }: PrintLayoutProps) => {
  return (
    <div className="min-h-screen bg-muted/40 py-8 print:bg-white print:py-0">
      <div className="container max-w-3xl print:max-w-none">
        {/* Toolbar — hidden on print */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button variant="outline" className="rounded-full font-bold border-2" asChild>
            <Link to="/">
              <Icon name="ArrowLeft" size={18} className="mr-1" />
              На сайт
            </Link>
          </Button>
          <Button
            className="rounded-full font-bold shadow-lg shadow-primary/30"
            onClick={() => window.print()}
          >
            <Icon name="Download" size={18} className="mr-1" />
            Скачать PDF
          </Button>
        </div>

        {/* Sheet */}
        <div className="bg-white rounded-[2rem] shadow-xl border-2 border-border/50 p-8 sm:p-12 print:shadow-none print:border-0 print:rounded-none print:p-0">
          <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-border/40">
            <img src={LOGO_URL} alt="Студия Kasalia" className="h-14 w-auto object-contain" />
            <div className="text-right">
              <p className="text-xs font-bold text-muted-foreground">Томск, ул. Никитина, 15а</p>
              <p className="text-xs font-bold text-muted-foreground">+7 (913) 850-33-38</p>
              <p className="text-xs font-bold text-muted-foreground">kasalia@yandex.ru</p>
            </div>
          </div>

          <div className="text-center mb-10">
            <span className="text-4xl">{emoji}</span>
            <h1 className="font-display text-4xl font-extrabold mt-2">{title}</h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>

          {children}

          <div className="mt-12 pt-6 border-t-2 border-border/40 text-center">
            <p className="font-display font-bold text-lg">
              Записаться: <span className="text-primary">+7 (913) 850-33-38</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">kasalia.ru · Учим с любовью 🎈</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 14mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default PrintLayout;
