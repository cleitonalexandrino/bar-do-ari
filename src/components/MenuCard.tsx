'use client';

import { MenuItem } from '@/types';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function MenuCard({ item, onAddCallback }: { item: MenuItem; onAddCallback?: () => void }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="brutal-card group flex flex-col h-full"
    >
      {/* Imagem Brutalista */}
      <div className="relative h-56 bg-white border-b-2 border-black flex items-center justify-center overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl">🍲</span>
            <span className="text-[10px] font-black uppercase bg-black text-white px-2">SEM IMAGEM</span>
          </div>
        )}

        {/* Category Tag Brutal */}
        <div className="absolute top-0 left-0">
          <span className="bg-black text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1">
            {item.category}
          </span>
        </div>
      </div>

      {/* Conteúdo Brutal */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-black text-black leading-none uppercase italic underline decoration-primary decoration-4 underline-offset-4">
            {item.name}
          </h3>
          <p className="text-black/70 text-[11px] font-bold leading-tight h-12 overflow-hidden">
            {item.description}
          </p>
        </div>

        <div className="flex items-end justify-between border-t-2 border-black pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-black font-black uppercase tracking-tighter italic">Preço • UN</span>
            <span className="text-2xl font-black text-black bg-primary px-1 -ml-1">R$ {item.price.toFixed(2)}</span>
          </div>

          <button
            onClick={() => { addItem(item); onAddCallback?.(); }}
            aria-label={`Adicionar ${item.name} ao carrinho`}
            className="brutal-btn-black flex items-center gap-2 group/btn"
          >
            <span className="text-xs font-black">PEGAR</span>
            <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
