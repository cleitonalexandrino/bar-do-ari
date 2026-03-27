'use client';

export const dynamic = 'force-dynamic';

import { MenuCard } from '@/components/MenuCard';
import { Cart } from '@/components/Cart';
import { MenuItem } from '@/types';
import { getMenuItems } from '@/lib/api';
import { useEffect, useState, useRef } from 'react';
import { Loader2, Clock, CheckCircle2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    getMenuItems().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const categories = Array.from(new Set(items.map(item => item.category.trim().toUpperCase()))).sort();

  // Atualiza categoria ativa baseado no scroll (Scroll Spy)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.getAttribute('data-category'));
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    Object.values(categoryRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  // Auto-dismiss do toast após 2s
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    categoryRefs.current[cat]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddItem = (item: MenuItem) => {
    setToast(`${item.name} adicionado! 🛒`);
  };

  return (
    <div className="min-h-screen bg-white pb-24 relative overflow-hidden selection:bg-black selection:text-white font-sans">
      {/* Remover decorativos suaves — Brutalismo é direto */}

      {/* Header Brutalista */}
      <header className="sticky top-0 z-50 w-full bg-primary border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0"
          >
            <div className="border-2 border-black bg-white p-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <Image
                src="/logo.png"
                alt="Bar do Ari"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="font-heading text-2xl font-black leading-none text-black tracking-tighter uppercase italic">Bar do Ari</h1>
              <span className="text-[10px] font-black bg-black text-white px-1 self-start mt-1">VILA FORMOSA</span>
            </div>
          </motion.div>
          <div className="scale-110">
            <Cart />
          </div>
        </div>

        {/* Categoria Nav Brutalista */}
        {!loading && categories.length > 0 && (
          <div className="bg-black py-2 overflow-x-auto scrollbar-hide border-t-2 border-black">
            <div className="container mx-auto px-4 flex gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`category-pill flex-shrink-0 ${activeCategory === cat ? 'category-pill-active' : 'category-pill-inactive'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-10 relative">
        <section className="mb-12 flex flex-col md:grid md:grid-cols-2 gap-8 items-center pt-4">
          {/* Coluna Esquerda: Texto */}
          <div className="space-y-6 order-2 md:order-1">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-heading font-black tracking-tighter text-black sm:text-7xl lg:text-8xl leading-[0.85] uppercase italic"
            >
              O tempero que<br />
              <span className="bg-black text-primary px-2">você já conhece.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2 text-black font-black uppercase tracking-tight text-[10px] border-b-2 border-black pb-1">
                <Clock className="w-4 h-4" /> 45-60 MIN
              </div>
              <div className="flex items-center gap-2 text-black font-black uppercase tracking-tight text-[10px] border-b-2 border-black pb-1">
                <CheckCircle2 className="w-4 h-4" /> QUALIDADE ARI
              </div>
            </motion.div>
          </div>

          {/* Coluna Direita: Motoboy e Tag */}
          <div className="relative order-1 md:order-2 w-full flex flex-col items-center md:items-end">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 border-2 border-black bg-emerald-400 text-black px-3 py-1 text-[11px] font-black uppercase tracking-tighter shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:mr-4"
            >
              Cozinha On • Entrega via Motoboy
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative w-64 h-64 md:w-80 md:h-80"
            >
              <Image 
                src="/images/motoboy.png"
                alt="Motoboy Bar do Ari"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* Menu */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="font-bold text-zinc-400 animate-pulse tracking-[0.2em] uppercase text-xs">Preparando o Cardápio...</p>
          </div>
        ) : (
          <div className="space-y-20">
            {categories.map((category) => (
              <section
                key={category}
                data-category={category}
                ref={el => { categoryRefs.current[category] = el; }}
                className="space-y-8 scroll-mt-36"
              >
                <div className="flex items-center gap-4">
                  <h3 className="text-4xl sm:text-6xl font-heading font-black text-black uppercase italic tracking-tighter">
                    {category}
                  </h3>
                  <div className="h-[4px] flex-1 bg-black" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {items
                      .filter(item => item.category.trim().toUpperCase() === category && item.is_available)
                      .map(item => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          onAddCallback={() => handleAddItem(item)}
                        />
                      ))}
                  </AnimatePresence>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Toast de Feedback (Peak-End Rule) */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold"
          >
            <ShoppingBag className="w-4 h-4 text-cta" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-24 border-t border-zinc-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="text-xl font-heading font-black text-zinc-900">Bar do Ari</div>
          <div className="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-400">
            <span>Vila Formosa - SP</span>
            <span>Seg - Sáb: 11h às 16h</span>
          </div>
          <p className="text-zinc-400 text-[10px] pt-4 opacity-50">© 2026 Bar do Ari Delivery.</p>
        </div>
      </footer>
    </div>
  );
}
