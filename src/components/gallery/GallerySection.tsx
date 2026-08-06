import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const GALLERY_URL = 'https://functions.poehali.dev/gallery-placeholder';

interface GalleryItem {
  id: number;
  mediaType: 'photo' | 'video';
  url: string;
  caption: string | null;
  sortOrder: number;
  createdAt: string;
}

const GallerySection = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItem, setOpenItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch(GALLERY_URL)
      .then((res) => res.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <>
      <section id="gallery" className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-4xl mb-2 block">📸</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold">Фото и видео с занятий</h2>
            <p className="text-muted-foreground mt-2">Живые моменты из жизни клуба</p>
          </div>

          {loading && <p className="text-center text-muted-foreground">Загружаем...</p>}

          {!loading && items.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setOpenItem(item)}
                  className="group relative rounded-2xl overflow-hidden aspect-square border-2 border-white shadow-md card-hover"
                >
                  {item.mediaType === 'photo' ? (
                    <img
                      src={item.url}
                      alt={item.caption || 'Фото с занятия'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                      <div className="absolute inset-0 bg-black/20 grid place-items-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 grid place-items-center">
                          <Icon name="Play" size={22} className="text-primary ml-0.5" />
                        </div>
                      </div>
                    </>
                  )}
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.caption}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!openItem} onOpenChange={(open) => !open && setOpenItem(null)}>
        <DialogContent className="rounded-3xl max-w-2xl p-2 sm:p-4">
          {openItem && (
            <div>
              {openItem.mediaType === 'photo' ? (
                <img
                  src={openItem.url}
                  alt={openItem.caption || 'Фото с занятия'}
                  className="w-full max-h-[75vh] object-contain rounded-2xl"
                />
              ) : (
                <video
                  src={openItem.url}
                  controls
                  autoPlay
                  className="w-full max-h-[75vh] object-contain rounded-2xl"
                />
              )}
              {openItem.caption && (
                <p className="text-center text-sm text-muted-foreground mt-3">{openItem.caption}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GallerySection;
