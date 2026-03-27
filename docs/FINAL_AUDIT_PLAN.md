# 🎼 PLAN: Auditoria Final do Bar do Ari (Pro Max)

## 🎯 Objetivo
Realizar uma revisão técnica profunda de 360° no sistema após a implementação das melhorias visuais e estruturais, garantindo que o produto final seja impecável em todos os dispositivos e seguro.

## 👥 Agentes e Responsabilidades

### 1. Frontend Specialist (@frontend-specialist)
- **Foco**: UX/UI Premium.
- **Tarefas**:
  - Validar responsividade em dispositivos mobile (iPhone SE até Ultra).
  - Verificar consistência do Glassmorphism e sombras (block-shadow).
  - Auditar animações do Framer Motion para garantir que não haja "jank" (engasgos).

### 2. Security Auditor (@security-auditor)
- **Foco**: Proteção de Dados e Infra.
- **Tarefas**:
  - Verificar se a rota `/setup` foi realmente removida e não é acessível via cache.
  - Revisar Middlewares de proteção de rota (`admin/*`).
  - Auditar imports do Firebase no cliente para evitar vazamento de lógica sensível.

### 3. Performance Optimizer (@performance-optimizer)
- **Foco**: Velocidade e SEO.
- **Tarefas**:
  - Analisar o tamanho do bundle gerado pelo `next build`.
  - Verificar o carregamento de fontes (Google Fonts) e imagens.
  - Otimizar o tempo de First Contentful Paint (FCP).

### 4. Test Engineer (@test-engineer)
- **Foco**: Estabilidade Funcional.
- **Tarefas**:
  - Executar todos os testes unitários (`npm test`).
  - Validar o fluxo de "Checkout -> WhatsApp" manualmente (mock).

---

## 📅 Cronograma (Simulação de Orquestração)
1. **Fase 1**: Planejamento (Atual).
2. **Fase 2**: Execução Paralela (Após Aprovação).
3. **Fase 3**: Relatório de Sintetização e Entrega Final.

---

## ⏸️ CHECKPOINT
**Aprova este plano de auditoria final para iniciarmos a execução paralela? (Y/N)**
