'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { addSale } from '@/lib/api';
import { ShoppingBag, CreditCard, Receipt, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MiniCaixa() {
  const [amount, setAmount] = useState('');
  const [itemsCount, setItemsCount] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    setLoading(true);
    try {
      await addSale({
        amount: parseFloat(amount.replace(',', '.')),
        items_count: parseInt(itemsCount),
        payment_method: paymentMethod
      });
      setSuccess(true);
      setAmount('');
      setItemsCount('1');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar venda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-heading font-black tracking-tighter text-zinc-900 uppercase">Mini Caixa PDV</h1>
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Registro rápido de vendas no balcão</p>
      </div>

      <Card className="border-none bg-white shadow-2xl shadow-zinc-200/50 rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
           <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <ShoppingBag className="w-8 h-8" />
           </div>
           <AnimatePresence>
             {success && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
               >
                 <Sparkles className="w-3 h-3" /> Venda Registrada!
               </motion.div>
             )}
           </AnimatePresence>
        </CardHeader>
        
        <CardContent className="p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4 text-center">
              <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Valor Total da Venda</Label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-zinc-300 italic">R$</span>
                <Input 
                  id="amount"
                  type="text" 
                  inputMode="decimal"
                  placeholder="0,00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="h-24 text-5xl font-heading font-black text-center pl-16 rounded-[2rem] bg-zinc-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="items" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Qtd de Itens</Label>
                <Input 
                  id="items"
                  type="number" 
                  value={itemsCount}
                  onChange={(e) => setItemsCount(e.target.value)}
                  min="1"
                  className="h-14 rounded-2xl border-zinc-100 bg-zinc-50 text-center font-black text-lg"
                />
              </div>
              <div className="space-y-3">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pagamento</Label>
                 <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-2">
                    {['dinheiro', 'cartao', 'pix'].map((method) => (
                      <label 
                        key={method}
                        className={`flex-1 h-14 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all ${
                          paymentMethod === method ? 'border-primary bg-primary/5' : 'border-zinc-50 bg-zinc-50 hover:bg-zinc-100'
                        }`}
                      >
                        <RadioGroupItem value={method} className="sr-only" />
                        <span className={`text-[10px] font-black uppercase tracking-tight ${paymentMethod === method ? 'text-primary' : 'text-zinc-400'}`}>
                          {method === 'cartao' ? 'Card' : method === 'pix' ? 'PIX' : 'Din'}
                        </span>
                      </label>
                    ))}
                 </RadioGroup>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-20 rounded-[2rem] text-xl font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 text-white gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Receipt className="w-6 h-6" /> Lançar Venda Now
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start gap-4">
         <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
         <div className="space-y-1">
            <h4 className="font-heading font-black text-amber-900 text-sm">Atenção ao Ari</h4>
            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
               As vendas lançadas aqui impactam imediatamente os gráficos de faturamento e ticket médio da sua Visão Geral. Use com sabedoria!
            </p>
         </div>
      </div>
    </div>
  );
}
