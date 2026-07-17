import PrintLayout from '@/components/PrintLayout';

const prices = [
  { name: 'Английский', type: 'Групповое занятие', price: '6 000 ₽', unit: '8 занятий', emoji: '🇬🇧' },
  { name: 'Китайский', type: 'Групповое занятие', price: '6 500 ₽', unit: '8 занятий', emoji: '🇨🇳' },
  { name: 'Английский', type: 'Индивидуальное занятие', price: '1 100 ₽', unit: 'занятие', emoji: '🇬🇧' },
  { name: 'Китайский', type: 'Индивидуальное занятие', price: '1 300 ₽', unit: 'занятие', emoji: '🇨🇳' },
  { name: 'Театральное искусство', type: 'Групповое занятие', price: '6 500 ₽', unit: '8 занятий', emoji: '🎭' },
  { name: 'Мини-сад', type: 'Абонемент', price: '10 000 ₽', unit: '4 посещения по 3 часа, по субботам', emoji: '🧸' },
];

const PricePrint = () => {
  return (
    <PrintLayout emoji="💳" title="Прайс-лист" subtitle="Прозрачные цены без скрытых доплат">
      <div className="space-y-3">
        {prices.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-2xl border-2 border-border/40 bg-muted/20"
          >
            <span className="text-3xl w-10 shrink-0 text-center">{p.emoji}</span>
            <div className="flex-1">
              <p className="font-display font-bold text-lg leading-tight">{p.name}</p>
              <p className="text-sm text-muted-foreground">{p.type} · {p.unit}</p>
            </div>
            <p className="font-display text-2xl font-extrabold text-primary shrink-0">{p.price}</p>
          </div>
        ))}
      </div>
    </PrintLayout>
  );
};

export default PricePrint;
