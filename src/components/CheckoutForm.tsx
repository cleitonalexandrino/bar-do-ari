'use client';

import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { generateWhatsAppLink } from '@/lib/api';
import { ChevronLeft, Send, MapPin, CreditCard, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function CheckoutForm({ onBack }: { onBack: () => void }) {
  const { items, getTotal } = useCartStore();
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('pix');
  const [notes, setNotes] = useState('');

  const handleCheckout = () => {
    if (!address) {
      alert('Por favor, informe seu endereço.');
      return;
    }
    const link = generateWhatsAppLink(items, getTotal(), address, payment, notes);
    window.open(link, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950"
    >
      <div className="p-8 space-y-6">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="p-0 h-auto hover:bg-transparent text-zinc-400 hover:text-zinc-900 flex items-center gap-2 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Voltar ao Cardápio</span>
        </Button>

        <div className="space-y-1">
          <h2 className="text-4xl font-heading font-black tracking-tighter text-zinc-900">Finalizar</h2>
          <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.2em]">Só mais alguns detalhes</p>
        </div>

        <div className="space-y-8 pt-4">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-500">
               <MapPin className="w-3 h-3 text-primary" /> Endereço de Entrega
            </Label>
            <Input 
              placeholder="Rua, número, bairro..." 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-14 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm font-medium"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-500">
              <CreditCard className="w-3 h-3 text-primary" /> Forma de Pagamento
            </Label>
            <RadioGroup value={payment} onValueChange={setPayment} className="grid grid-cols-2 gap-4">
              <label 
                className={`flex items-center justify-center h-14 rounded-2xl border-2 transition-all cursor-pointer font-bold text-xs ${payment === 'pix' ? 'border-primary bg-primary/5 text-primary' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
              >
                <RadioGroupItem value="pix" className="sr-only" />
                 PIX Instantâneo
              </label>
              <label 
                className={`flex items-center justify-center h-14 rounded-2xl border-2 transition-all cursor-pointer font-bold text-xs ${payment === 'cartao' ? 'border-primary bg-primary/5 text-primary' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
              >
                <RadioGroupItem value="cartao" className="sr-only" />
                 Cartão (Maquininha)
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-500">
              <MessageSquare className="w-3 h-3 text-primary" /> Observações (Opcional)
            </Label>
            <Input 
              placeholder="Ex: Sem cebola, campainha estragada..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-14 rounded-2xl border-zinc-100 bg-zinc-50 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
        </div>
      </div>

      <div className="p-8 mt-auto border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50">
        <Button 
          className="w-full h-16 rounded-3xl text-lg font-black bg-cta hover:bg-cta/90 shadow-xl shadow-cta/20 gap-3 group" 
          size="lg" 
          onClick={handleCheckout}
        >
          Enviar Pedido para o WhatsApp
          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
