'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db, auth } from '@/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Database, UserPlus, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

const CATEGORIES = ['Pratos / Refeições', 'Bebidas', 'Porções', 'Sobremesas'];

const MOCK_ITEMS = [
  { name: 'Feijoada Completa', description: 'Arroz, couve, farofa e torresmo.', price: 35.00, category: 'Pratos / Refeições', is_available: true },
  { name: 'Cerveja 600ml', description: 'Original, Skol ou Brahma.', price: 12.00, category: 'Bebidas', is_available: true },
  { name: 'Porção de Batata', description: 'Batata frita crocante 400g.', price: 25.00, category: 'Porções', is_available: true },
];

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [status, setStatus] = useState('');

  const seedDatabase = async () => {
    if (!db) {
      alert('Banco de dados não inicializado.');
      return;
    }
    
    setLoading(true);
    setStatus('Semeando itens...');
    try {
      // Use non-null assertion since we checked it above
      const batch = writeBatch(db!);
      MOCK_ITEMS.forEach((item) => {
        const newDocRef = doc(collection(db!, 'menu_items'));
        batch.set(newDocRef, { ...item, created_at: new Date() });
      });
      await batch.commit();
      alert('Banco de dados semeado com sucesso!');
    } catch (e) {
      console.error(e);
      alert('Erro ao semear banco.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      alert('Sistema de autenticação não inicializado.');
      return;
    }

    setLoading(true);
    setStatus('Criando conta...');
    try {
      await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      alert('Administrador criado! Use esses dados para logar.');
      setAdminEmail('');
      setAdminPassword('');
    } catch (e: any) {
      alert('Erro: ' + e.message);
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary shadow-xl shadow-primary/5">
           <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-heading font-black tracking-tighter text-zinc-900 uppercase">Sala de Comando</h1>
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">Configurações sensíveis do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card className="border-none bg-white shadow-xl shadow-zinc-200/50 rounded-[3rem] overflow-hidden flex flex-col">
          <CardHeader className="p-10 pb-0">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <CardTitle className="text-2xl font-heading font-black text-zinc-900">Banco de Dados</CardTitle>
             </div>
             <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">Pressione para popular o sistema com dados de exemplo iniciais.</p>
          </CardHeader>
          <CardContent className="p-10 mt-auto">
            <Button 
              onClick={seedDatabase} 
              disabled={loading}
              className="w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-200/50 text-white gap-3 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Database className="w-4 h-4" /> Semear Exemplos</>}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-xl shadow-zinc-200/50 rounded-[3rem] overflow-hidden">
          <CardHeader className="p-10 pb-0">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <CardTitle className="text-2xl font-heading font-black text-zinc-900">Novo Admin</CardTitle>
             </div>
             <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">Crie acessos extras para sua equipe de confiança.</p>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={createAdmin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">E-mail</Label>
                <Input 
                  type="email" 
                  value={adminEmail} 
                  onChange={(e) => setAdminEmail(e.target.value)} 
                  required 
                  className="h-12 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Senha Secreta</Label>
                <Input 
                  type="password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                  required 
                  className="h-12 rounded-xl border-zinc-100 bg-zinc-50 focus:bg-white"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-white gap-3 transition-all active:scale-95 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-4 h-4" /> Criar Acesso</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-8">
         <div className="flex items-center gap-3 bg-zinc-100/50 px-6 py-3 rounded-full border border-zinc-200">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Firebase Securty v4 Active</span>
         </div>
      </div>
    </div>
  );
}
