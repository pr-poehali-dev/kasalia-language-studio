import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { blogPosts, getBlogPostBySlug } from '@/data/blogPosts';

const LOGO_URL =
  'https://cdn.poehali.dev/projects/916f0912-2e1a-441b-ba48-3e1b39731153/bucket/4fc5576b-3629-4a6b-aaae-c60e197389cd.jpg';

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/#blog" replace />;
  }

  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <img src={LOGO_URL} alt="Студия Kasalia" className="h-12 w-auto object-contain" />
          </Link>
          <Button variant="outline" className="rounded-full font-bold border-2" asChild>
            <Link to="/#blog">
              <Icon name="ArrowLeft" size={18} className="mr-1" />
              К блогу
            </Link>
          </Button>
        </div>
      </header>

      <article className="container max-w-2xl py-12">
        <span className="text-xs font-bold uppercase tracking-wide text-primary">{post.tag}</span>
        <div className="flex items-center gap-4 mt-3 mb-6">
          <span className="text-5xl">{post.emoji}</span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">{post.title}</h1>
        </div>

        <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
          {post.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-[2rem] bg-primary text-primary-foreground text-center">
          <h2 className="font-display text-2xl font-extrabold mb-2">Понравилась статья?</h2>
          <p className="opacity-90 mb-6">Запишите ребёнка на бесплатный пробный урок в студии Kasalia</p>
          <Button size="lg" variant="secondary" className="rounded-full font-bold" asChild>
            <Link to="/#contacts">Записаться на пробный урок</Link>
          </Button>
        </div>
      </article>

      {otherPosts.length > 0 && (
        <section className="container max-w-2xl pb-16">
          <h3 className="font-display text-2xl font-extrabold mb-6">Читайте также</h3>
          <div className="grid sm:grid-cols-3 gap-5">
            {otherPosts.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group bg-white rounded-3xl p-6 border-2 border-border/40 card-hover shadow-md block"
              >
                <span className="text-3xl mb-3 block">{p.emoji}</span>
                <span className="text-xs font-bold uppercase tracking-wide text-primary">{p.tag}</span>
                <h4 className="font-display font-bold text-base mt-2 group-hover:text-primary transition-colors">
                  {p.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-border/50 py-10">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={LOGO_URL} alt="Студия Kasalia" className="h-10 w-auto object-contain" />
          <p className="text-sm text-muted-foreground">© 2026 Языковая студия Kasalia. Учим с любовью.</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
