'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Utensils, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';

interface Sale {
  id: string;
  amount: number;
  items_count: number;
  payment_method: string;
  sale_date: Timestamp;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [salesToday, setSalesToday] = useState<Sale[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    itemsCount: 0,
    ticketMedio: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfToday = Timestamp.fromDate(today);

      const qToday = query(
        collection(db, 'sales'),
        where('sale_date', '>=', startOfToday)
      );
      const snapshotToday = await getDocs(qToday);
      const todayData = snapshotToday.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      
      const total = todayData.reduce((acc, s) => acc + s.amount, 0);
      const items = todayData.reduce((acc, s) => acc + s.items_count, 0);

      setSalesToday(todayData);
      setStats({
        totalAmount: total,
        itemsCount: items,
        ticketMedio: todayData.length > 0 ? total / todayData.length : 0
      });

      const qRecent = query(
        collection(db, 'sales'),
        orderBy('sale_date', 'desc'),
        limit(5)
      );
      const snapshotRecent = await getDocs(qRecent);
      setRecentSales(snapshotRecent.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale)));

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Analizando dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tighter text-zinc-900 uppercase">Quartel General</h1>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Dados reais do Bar do Ari</p>
        </div>
        <Button 
          onClick={fetchStats} 
          variant="outline" 
          size="sm" 
          className="rounded-xl font-black text-[10px] uppercase tracking-widest border-zinc-200 hover:bg-zinc-50 gap-2 h-10 px-5"
        >
          <RefreshCw className="w-3 h-3" /> Atualizar Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Faturamento Hoje', value: `R$ ${stats.totalAmount.toFixed(2)}`, icon: DollarSign, color: 'emerald', detail: `${salesToday.length} vendas` },
          { title: 'Itens Cozinhados', value: stats.itemsCount, icon: Utensils, color: 'primary', detail: 'Saindo agora' },
          { title: 'Ticket Médio', value: `R$ ${stats.ticketMedio.toFixed(2)}`, icon: TrendingUp, color: 'cta', detail: 'Por cliente' },
        ].map((stat, i) => (stat.color === 'primary' || stat.color === 'cta' || stat.color === 'emerald') && (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none bg-white shadow-xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-8 px-8">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.title}</CardTitle>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${
                  stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                  stat.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-cta/10 text-cta'
                }`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="text-4xl font-black text-zinc-900 tracking-tighter">{stat.value}</div>
                <div className="flex items-center gap-2 mt-4">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    stat.color === 'emerald' ? 'bg-emerald-500' : 
                    stat.color === 'primary' ? 'bg-primary' : 'bg-cta'
                  }`} />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">{stat.detail}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-none bg-white shadow-xl shadow-zinc-200/50 rounded-[3rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-zinc-50 flex flex-row items-center justify-between">
          <div>
             <CardTitle className="text-2xl font-heading font-black text-zinc-900">Últimos Pedidos</CardTitle>
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Atividade em tempo real</p>
          </div>
          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] tracking-widest uppercase py-1 px-3">Live</Badge>
        </CardHeader>
        <CardContent className="p-4 sm:p-8">
          <div className="space-y-4">
            {recentSales.length === 0 ? (
              <div className="text-center py-20 text-zinc-300 font-bold uppercase tracking-widest text-xs italic">Nenhum rastro de venda no radar...</div>
            ) : recentSales.map((sale) => (
              <motion.div 
                key={sale.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-6 rounded-[2rem] bg-zinc-50/50 hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100 group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-zinc-300 shadow-sm border border-zinc-100 group-hover:text-primary transition-colors">
                    #{sale.id.slice(-3).toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-black text-lg text-zinc-900 tracking-tight">Venda Confirmada</span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                      {sale.sale_date.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {sale.payment_method.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-black text-zinc-900 tracking-tighter">
                  <span className="text-sm font-bold text-zinc-400 mr-1 italic">R$</span>
                  {sale.amount.toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
