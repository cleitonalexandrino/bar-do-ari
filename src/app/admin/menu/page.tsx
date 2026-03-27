'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, RefreshCw, ChefHat, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { getMenuItems, toggleMenuItemAvailability, deleteMenuItem } from '@/lib/api';
import { MenuItem } from '@/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AddProductForm } from '@/components/AddProductForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await getMenuItems();
    setItems(data);
    setLoading(false);
  };

  const handleToggle = async (id: string, is_available: boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_available } : i));
    try {
      await toggleMenuItemAvailability(id, is_available);
    } catch (e) {
      console.error(e);
      alert("Erro ao alterar disponibilidade.");
      loadItems();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja deletar "${name}"? Esta ação não pode ser desfeita.`)) return;
    
    try {
      await deleteMenuItem(id);
      loadItems();
    } catch (e) {
      console.error(e);
      alert("Erro ao deletar item.");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-4xl font-heading font-black tracking-tighter text-zinc-900 uppercase">Gestão de Cardápio</h1>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Controle o que o cliente vê agora</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            onClick={loadItems} 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-2xl border-zinc-200 hover:bg-zinc-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger 
              render={
                <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-white font-black text-xs uppercase tracking-widest h-12 px-8 rounded-2xl gap-2 transition-all active:scale-95">
                  <Plus className="w-5 h-5" /> Novo Item
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl">
              <AddProductForm onSuccess={() => {
                setIsModalOpen(false);
                loadItems();
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-none bg-white shadow-xl shadow-zinc-200/50 rounded-[3rem] overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="flex h-[500px] flex-col items-center justify-center text-zinc-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Consultando o Freezer...</p>
          </div>
        ) : (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-50 bg-zinc-50/30 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                    <th className="px-10 py-6">Nome do Item</th>
                    <th className="px-10 py-6">Categoria</th>
                    <th className="px-10 py-6">Preço base</th>
                    <th className="px-10 py-6 text-center">Status</th>
                    <th className="px-10 py-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  <AnimatePresence mode="popLayout">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-10 py-24 text-center">
                           <div className="flex flex-col items-center gap-4 text-zinc-300">
                              <ChefHat className="w-12 h-12 opacity-20" />
                              <p className="text-xs font-bold uppercase tracking-widest">Nenhum prato cadastrado ainda.</p>
                           </div>
                        </td>
                      </tr>
                    ) : items.map((item, idx) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-zinc-50/50 transition-colors"
                      >
                        <td className="px-10 py-6">
                           <div className="flex flex-col">
                             <span className="font-heading text-lg font-black text-zinc-900 leading-tight group-hover:text-primary transition-colors">{item.name}</span>
                             <span className="text-[10px] text-zinc-400 font-bold max-w-[200px] truncate">{item.description}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="bg-zinc-100 text-zinc-600 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg">
                             {item.category}
                           </span>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-lg font-black text-zinc-900">
                             <span className="text-xs font-bold text-zinc-300 mr-1 italic">R$</span>
                             {item.price.toFixed(2)}
                           </span>
                        </td>
                        <td className="px-10 py-6">
                           <div className="flex items-center justify-center gap-4">
                             <span className={`text-[10px] font-black uppercase tracking-widest ${item.is_available ? 'text-emerald-500' : 'text-zinc-300'}`}>
                               {item.is_available ? 'Online' : 'Offline'}
                             </span>
                             <Switch 
                               checked={item.is_available} 
                               onCheckedChange={(checked: boolean) => handleToggle(item.id, checked)}
                               className="data-[state=checked]:bg-emerald-500" 
                             />
                           </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <Button 
                             onClick={() => handleDelete(item.id, item.name)}
                             variant="ghost" 
                             size="icon"
                             className="h-10 w-10 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all"
                           >
                             <Trash2 className="w-5 h-5" />
                           </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
