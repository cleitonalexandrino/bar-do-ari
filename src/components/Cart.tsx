'use client';

import { useCartStore } from '@/lib/store';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { CheckoutForm } from './CheckoutForm';
import { motion, AnimatePresence } from 'framer-motion';

export function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setIsCheckoutOpen(false), 300);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
        <Button 
          variant="default" 
          className="relative group overflow-hidden transition-all duration-500 rounded-2xl h-14 px-6 bg-zinc-900 border-b-4 border-zinc-800 active:border-b-0 active:translate-y-1"
        >
          <ShoppingCart className="w-6 h-6 mr-3 text-primary animate-pulse" />
          <span className="font-heading text-lg font-black tracking-tight text-white">Meu Pedido</span>
          {totalItems > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-3 bg-cta text-white text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center shadow-lg shadow-cta/20"
            >
              {totalItems}
            </motion.span>
          )}
        </Button>
      } />
      
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-zinc-100 dark:border-zinc-800" side="right">
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950">
          {!isCheckoutOpen ? (
            <>
              <div className="p-8 space-y-2">
                <SheetHeader>
                  <SheetTitle className="text-4xl font-heading font-black tracking-tighter text-zinc-900 flex items-center gap-3">
                    Meu Pedido
                  </SheetTitle>
                  <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.2em]">Resumo dos desejos</p>
                </SheetHeader>
              </div>

              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 gap-6">
                  <div className="w-24 h-24 bg-zinc-50 rounded-[2.5rem] flex items-center justify-center rotate-6 border-2 border-dashed border-zinc-100">
                    <ShoppingCart className="w-10 h-10 text-zinc-200" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-heading text-xl font-black text-zinc-900">Seu carrinho está vazio</p>
                    <p className="text-xs font-medium max-w-[200px] mx-auto">Adicione alguns pratos deliciosos para começar sua jornada gastronômica.</p>
                  </div>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 px-8">
                    <div className="space-y-6 pt-2 pb-8">
                      <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                          <motion.div 
                            key={item.id} 
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="group relative flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-white dark:hover:bg-zinc-900 hover:shadow-xl hover:shadow-zinc-200/50"
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h4 className="font-heading text-lg font-black text-zinc-900 leading-none">{item.name}</h4>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.category}</p>
                              </div>
                              <p className="text-lg font-black text-primary">R$ {(item.price * item.quantity).toFixed(2)}</p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center bg-white dark:bg-zinc-800 p-1 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors" 
                                  onClick={() => {
                                    if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
                                    else removeItem(item.id);
                                  }}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-10 text-center text-sm font-black text-zinc-900">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors" 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                onClick={() => removeItem(item.id)}
                                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-destructive gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remover
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>

                  <div className="p-8 bg-zinc-50/50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">Total do Pedido</span>
                        <div className="text-4xl font-heading font-black text-zinc-900">R$ {getTotal().toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full h-16 rounded-3xl text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-3 group" 
                      size="lg" 
                      onClick={() => setIsCheckoutOpen(true)}
                    >
                      Check-out Premium
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <CheckoutForm onBack={() => setIsCheckoutOpen(false)} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
