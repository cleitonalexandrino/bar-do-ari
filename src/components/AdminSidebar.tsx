'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Utensils, 
  Settings, 
  ShoppingBag, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Resumo', href: '/admin' },
  { icon: ShoppingBag, label: 'Mini Caixa', href: '/admin/caixa' },
  { icon: Utensils, label: 'Cardápio', href: '/admin/menu' },
  { icon: Settings, label: 'Configurações', href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  return (
    <aside className={`h-screen sticky top-0 bg-white border-r-2 border-black transition-all duration-300 flex flex-col z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 mb-4 flex items-center justify-between border-b-2 border-black bg-primary">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <h2 className="text-black font-heading font-black text-lg tracking-tighter leading-none uppercase italic">ARI ADMIN</h2>
            <p className="text-[10px] font-black bg-black text-white px-1 self-start mt-1">SISTEMA v2.0</p>
          </motion.div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-black hover:bg-black/10 border-2 border-black bg-white rounded-none shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none translate-x-[-2px]"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`
                flex items-center gap-4 px-4 h-12 transition-all relative group border-2 border-black mb-2
                ${isActive ? 'bg-primary text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white text-black hover:bg-zinc-100'}
              `}>
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-black' : 'text-black'}`} />
                {!isCollapsed && (
                  <span className="font-black text-xs uppercase tracking-tight">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="absolute right-4 w-2 h-2 bg-black rotate-45" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t-2 border-black bg-zinc-50">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full h-12 justify-start gap-4 text-black font-black uppercase text-[10px] hover:bg-red-500 hover:text-white border-2 border-black bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none transition-all px-4"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Sair do Sistema</span>}
        </Button>
      </div>
    </aside>
  );
}
