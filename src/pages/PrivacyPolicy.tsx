import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const LOGO_URL =
  'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/4fc5576b-3629-4a6b-aaae-c60e197389cd.jpg';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <img src={LOGO_URL} alt="Студия Kasalia" className="h-12 w-auto object-contain" />
          </Link>
          <Button variant="outline" className="rounded-full font-bold border-2" asChild>
            <Link to="/">
              <Icon name="ArrowLeft" size={18} className="mr-1" />
              На сайт
            </Link>
          </Button>
        </div>
      </header>

      <article className="container max-w-2xl py-12">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2">Политика конфиденциальности</h1>
        <p className="text-muted-foreground mb-8">Языковая студия Kasalia · действует с 31 июля 2026 года</p>

        <div className="space-y-6 text-foreground/90 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl mb-2">1. Общие положения</h2>
            <p>
              Настоящая политика конфиденциальности определяет порядок обработки и защиты персональных данных
              пользователей сайта студии Kasalia (далее — «Студия»), которые пользователь предоставляет при
              заполнении форм обратной связи, заявок на пробный урок или регистрации в личном кабинете.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-2">2. Какие данные мы собираем</h2>
            <p>Студия может собирать следующие персональные данные:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Имя родителя и/или ребёнка</li>
              <li>Номер телефона</li>
              <li>Адрес электронной почты (если указан)</li>
              <li>Комментарии и пожелания, оставленные в форме заявки</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-2">3. Цели обработки данных</h2>
            <p>Персональные данные используются исключительно для:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Связи с пользователем для записи на пробный урок и консультации</li>
              <li>Информирования о расписании, курсах и специальных предложениях студии</li>
              <li>Предоставления доступа к личному кабинету ученика</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-2">4. Передача данных третьим лицам</h2>
            <p>
              Студия не передаёт персональные данные пользователей третьим лицам, за исключением случаев,
              предусмотренных законодательством Российской Федерации.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-2">5. Хранение и защита данных</h2>
            <p>
              Персональные данные хранятся на защищённых серверах и обрабатываются с применением технических
              мер безопасности, предотвращающих несанкционированный доступ, изменение или утрату данных.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-2">6. Права пользователя</h2>
            <p>
              Пользователь вправе в любой момент отозвать согласие на обработку персональных данных, направив
              соответствующий запрос на почту студии, указанную в разделе «Контакты» на сайте.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-2">7. Согласие на обработку данных</h2>
            <p>
              Заполняя форму на сайте, пользователь подтверждает своё согласие на обработку персональных данных
              на условиях, изложенных в настоящей политике конфиденциальности.
            </p>
          </section>
        </div>
      </article>

      <footer className="border-t border-border/50 py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={LOGO_URL} alt="Студия Kasalia" className="h-10 w-auto object-contain" />
          <p className="text-sm text-muted-foreground">© 2026 Языковая студия Kasalia. Учим с любовью.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
