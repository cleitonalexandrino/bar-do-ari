'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { addMenuItem, uploadImage } from '@/lib/api';
import { searchImages, imageUrlToBlob, SearchResult } from '@/lib/imageSearch';
import { processImageForMenu } from '@/lib/imageProcessor';
import { Loader2, PlusCircle, ChefHat, Tag, DollarSign, TextQuote, Camera, X, Wand2, Search, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AddProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Magic Search States
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMagicSearch = async () => {
    if (!name) {
      alert("Digite o nome do item primeiro para eu buscar a foto certa! ✨");
      return;
    }
    setIsSearching(true);
    setShowSearch(true);
    try {
      const results = await searchImages(name);
      if (results.length === 0) {
        alert("Nenhuma imagem encontrada para este item. Tente um nome mais simples! 🧐");
      }
      setSearchResults(results);
    } catch (error: any) {
      console.error(error);
      alert(`ERRO NA BUSCA IA: ${error.message}\n\nVerifique se você ATIVOU a 'Custom Search API' no Console do Google Cloud!`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectWebImage = async (result: SearchResult) => {
    setIsProcessing(true);
    try {
      // 1. Converter URL para Blob (contornando CORS se possível ou via Proxy se configurado)
      // Nota: Em produção, o backend geralmente faz o download para evitar erros de CORS no navegador.
      // Aqui tentaremos via fetch direto (funciona para Unsplash e outros abertos).
      const blob = await imageUrlToBlob(result.link);
      const file = new File([blob], `web-image-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // 2. Tratar com fundo branco e padrão Pro Max
      const processedDataUrl = await processImageForMenu(result.link);
      
      // 3. Atualizar estado
      setImagePreview(processedDataUrl);
      
      // Converter dataUrl de volta para File para o upload final no Firebase
      const response = await fetch(processedDataUrl);
      const processedBlob = await response.blob();
      const processedFile = new File([processedBlob], `item-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      setImageFile(processedFile);
      setShowSearch(false);
    } catch (error) {
      console.error("Erro ao processar imagem web:", error);
      alert("Não consegui baixar esta imagem específica devido a restrições do site de origem. Tente outra da lista! ✨");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    console.log("Iniciando cadastro de item...");
    try {
      let image_url = '';
      if (imageFile) {
        console.log("Subindo imagem para o Storage...");
        try {
          image_url = await uploadImage(imageFile, (progress) => {
            setUploadProgress(Math.round(progress));
          });
          console.log("Upload concluído! URL:", image_url);
        } catch (storageError: any) {
          console.error("Erro no Storage:", storageError);
          alert(`ERRO DE UPLOAD: ${storageError.message}`);
          setLoading(false);
          return;
        }
      }

      console.log("Salvando item no Firestore...");
      await addMenuItem({
        name,
        description,
        price: parseFloat(price.replace(',', '.')),
        category,
        is_available: true,
        image_url,
      });
      console.log("Item salvo com sucesso!");
      onSuccess();
    } catch (dbError: any) {
      console.error("Erro no Firestore:", dbError);
      alert(`Erro ao salvar no banco: ${dbError.message}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-8 space-y-8 max-h-[90vh] overflow-y-auto">
      <div className="flex flex-col border-b-4 border-black pb-4 mb-4">
        <h2 className="text-4xl font-heading font-black tracking-tighter text-black uppercase italic">
           Novo Item
        </h2>
        <span className="text-[11px] font-black bg-black text-white px-2 self-start mt-1">ADICIONAR AO MENU FIXO</span>
      </div>
 
       <form onSubmit={handleSubmit} className="space-y-8">
         <div className="grid grid-cols-1 gap-6">
           {/* Foto do Item */}
            <div className="space-y-4">
              <Label className="text-[12px] font-black uppercase tracking-tighter flex items-center gap-2 text-black">
                <Camera className="w-4 h-4" /> Foto do Item
              </Label>
                          <div className="relative group">
                {imagePreview ? (
                  <div className="relative h-64 w-full border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white p-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className={`w-full h-full object-contain transition-opacity duration-500 ${isProcessing ? 'opacity-20' : 'opacity-100'}`} 
                    />
                    
                    {isProcessing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/60 backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 animate-spin text-black" />
                        <span className="text-[11px] font-black uppercase bg-black text-white px-2">APLICANDO MAGIA IA...</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex gap-2">
                       <button 
                         type="button"
                         onClick={handleMagicSearch}
                         className="brutal-btn p-2"
                         title="Trocar por outra da Web"
                       >
                         <Wand2 className="w-4 h-4" />
                       </button>
                       <button 
                         type="button"
                         onClick={() => { setImageFile(null); setImagePreview(null); }}
                         className="border-2 border-black bg-red-600 text-white p-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none translate-x-[-1px]"
                       >
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <label className="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-black bg-zinc-50 hover:bg-primary transition-all cursor-pointer group relative overflow-hidden">
                      <div className="flex flex-col items-center gap-2 text-black group-hover:scale-110 transition-transform">
                        <Camera className="w-8 h-8" />
                        <span className="text-[11px] font-black uppercase">Enviar Foto Local</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    
                    <button 
                      type="button"
                      onClick={handleMagicSearch}
                      className="brutal-btn-black h-12 flex items-center justify-center gap-3"
                    >
                      {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 text-primary" />}
                      <span className="text-[11px] font-black uppercase italic tracking-tight">Magic Search IA</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Grid de Resultados da Busca */}
              <AnimatePresence>
                {showSearch && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] space-y-4">
                      <div className="flex items-center justify-between border-b-2 border-black pb-2">
                        <div className="flex items-center gap-2">
                           <Search className="w-4 h-4" />
                           <span className="text-[11px] font-black uppercase tracking-tight">Resultados da Web: "{name}"</span>
                        </div>
                        <button onClick={() => setShowSearch(false)} className="text-black hover:scale-110">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {isSearching ? (
                        <div className="grid grid-cols-3 gap-2 min-h-[180px]">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton aspect-square border-2 border-black/10" />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 min-h-[180px]">
                          {searchResults.map((result, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectWebImage(result)}
                              className="group relative aspect-square overflow-hidden border-2 border-black hover:shadow-[2px_2px_0_0_rgba(255,215,0,1)] transition-all"
                            >
                              <img src={result.thumbnail} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover transition-transform" />
                              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <p className="text-[9px] text-blue-600 font-medium leading-tight">
                          O "Magic Search" busca imagens públicas e aplica automaticamente um fundo branco padronizado e tratamento de nitidez estilo catálogo premium.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
 
           <div className="space-y-4">
             <Label className="text-[12px] font-black uppercase tracking-tight flex items-center gap-2 text-black">
               <ChefHat className="w-4 h-4" /> Nome do Item
             </Label>
            <Input 
              placeholder="Ex: Picanha na Chapa" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 border-2 border-black bg-white focus:bg-primary/10 text-sm font-black uppercase"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label className="text-[12px] font-black uppercase tracking-tight flex items-center gap-2 text-black">
                <DollarSign className="w-4 h-4" /> Preço (R$)
              </Label>
              <Input 
                placeholder="R$ 0,00" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="h-12 border-2 border-black bg-white focus:bg-primary/10 text-center font-black"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[12px] font-black uppercase tracking-tight flex items-center gap-2 text-black">
                <Tag className="w-4 h-4" /> Categoria
              </Label>
              <Input 
                placeholder="Ex: Pratos do Dia" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="h-12 border-2 border-black bg-white focus:bg-primary/10 text-sm font-black uppercase"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[12px] font-black uppercase tracking-tight flex items-center gap-2 text-black">
              <TextQuote className="w-4 h-4" /> Descrição Curta
            </Label>
            <Input 
              placeholder="Ex: Acompanha arroz, feijão e fritas." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 border-2 border-black bg-white focus:bg-primary/10 text-sm font-black uppercase"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="brutal-btn w-full h-16 text-sm flex gap-3 shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:shadow-none"
        >
          {loading ? (
             <div className="flex items-center gap-3">
               <Loader2 className="w-6 h-6 animate-spin" />
               <span className="animate-pulse">{uploadProgress > 0 ? `${uploadProgress}%` : 'PREPARANDO...'}</span>
             </div>
          ) : (
            <>
              <PlusCircle className="w-6 h-6" /> 
              ADICIONAR AO CARDÁPIO
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
