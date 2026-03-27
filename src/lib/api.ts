import { db, storage } from './firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { MenuItem } from '@/types';

export interface Sale {
  amount: number;
  items_count: number;
  payment_method: string;
}

const MENU_COLLECTION = 'menu_items';
const SALES_COLLECTION = 'sales';

export async function getMenuItems(): Promise<MenuItem[]> {
  const q = query(collection(db, MENU_COLLECTION), orderBy('category'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MenuItem[];
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>) {
  return await addDoc(collection(db, MENU_COLLECTION), {
    ...item,
    created_at: Timestamp.now()
  });
}

export async function updateMenuItem(id: string, data: Partial<Omit<MenuItem, 'id'>>) {
  const itemRef = doc(db, MENU_COLLECTION, id);
  return await updateDoc(itemRef, data);
}

export async function toggleMenuItemAvailability(id: string, is_available: boolean) {
  return await updateMenuItem(id, { is_available });
}

export async function deleteMenuItem(id: string) {
  const itemRef = doc(db, MENU_COLLECTION, id);
  return await deleteDoc(itemRef);
}

export async function seedDatabase(mockItems: Omit<MenuItem, 'id'>[]) {
  const promises = mockItems.map(item => addMenuItem(item));
  await Promise.all(promises);
}

export async function uploadImage(file: File, onProgress?: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `menu-items/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Timeout de 20 segundos
    const timeout = setTimeout(() => {
      uploadTask.cancel();
      reject(new Error("O upload demorou muito tempo (Timeout). Verifique as regras do Storage no Console do Firebase."));
    }, 20000);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        clearTimeout(timeout);
        reject(error);
      }, 
      async () => {
        clearTimeout(timeout);
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

export async function addSale(sale: Sale) {
  return await addDoc(collection(db, SALES_COLLECTION), {
    ...sale,
    sale_date: Timestamp.now()
  });
}

export function generateWhatsAppLink(items: any[], total: number, address: string, payment: string, notes: string) {
  const phone = "5511999999999"; // TODO: Mover para settings no futuro
  const itemsText = items.map(i => `${i.quantity}x ${i.name} (R$ ${i.price.toFixed(2)})`).join('%0A');
  const message = `*BAR DO ARI - NOVO PEDIDO*%0A%0A*Itens:*%0A${itemsText}%0A%0A*Total:* R$ ${total.toFixed(2)}%0A*Pagamento:* ${payment.toUpperCase()}%0A*Endereço:* ${address}${notes ? `%0A*Obs:* ${notes}` : ''}`;
  return `https://wa.me/${phone}?text=${message}`;
}
