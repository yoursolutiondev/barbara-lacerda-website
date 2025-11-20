# 💇‍♀️ Na Cadeira de Bárbara Lacerda

Sistema completo de marcações online para salão de beleza

---

## 🚀 DEPLOY RÁPIDO NO VERCEL

**👉 [SIGA ESTE GUIA: README-VERCEL.md](./README-VERCEL.md)**

Tempo estimado: **5 minutos**

---

## 📦 O Que Está Incluído

- ✅ Website completo em React
- ✅ Sistema de marcações online (4 etapas)
- ✅ Painel administrativo
- ✅ Integração com Supabase (PostgreSQL)
- ✅ Design responsivo (mobile + desktop)
- ✅ Pronto para produção

---

## 🎯 Funcionalidades

### Para Clientes:
- 📅 Marcação online em 4 passos
- 👥 Escolha de profissional
- 📆 Calendário interativo
- ⏰ Horários disponíveis em tempo real
- 💬 WhatsApp direto
- 📱 Totalmente responsivo

### Para Administração:
- 📊 Dashboard com estatísticas
- ✅ Confirmar/cancelar marcações
- 💇 Gestão de serviços
- 👤 Gestão de profissionais
- ⏰ Gestão de horários
- 📈 Relatórios

---

## 🛠️ Tecnologias

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel
- **Ícones**: Lucide React

---

## 📋 Início Rápido

### Opção 1: Deploy Direto no Vercel (Recomendado)

**[👉 Siga o guia completo: README-VERCEL.md](./README-VERCEL.md)**

### Opção 2: Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo .env.local com suas credenciais
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 3. Executar em modo desenvolvimento
npm start

# 4. Abrir no navegador
# http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```
📁 vercel-project/
├── 📁 public/               # Arquivos públicos
│   ├── index.html          # HTML principal
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # SEO
├── 📁 src/                 # Código fonte
│   ├── App.js              # Componente principal (website)
│   ├── AdminDashboard.jsx  # Painel admin
│   ├── supabaseClient.js   # Config Supabase
│   ├── hooks.js            # Custom hooks
│   ├── index.js            # Entry point
│   └── index.css           # Estilos globais
├── package.json            # Dependências
├── tailwind.config.js      # Config Tailwind
├── vercel.json             # Config Vercel
├── .env.example            # Template variáveis
├── supabase-schema.sql     # Schema do banco
├── README.md               # Este arquivo
└── README-VERCEL.md        # Guia de deploy
```

---

## ⚙️ Configuração

### 1. Supabase

1. Crie conta no [Supabase](https://supabase.com)
2. Crie novo projeto
3. Execute `supabase-schema.sql` no SQL Editor
4. Copie credenciais (Project Settings > API)

### 2. Variáveis de Ambiente

Crie arquivo `.env.local`:

```env
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 3. Deploy

```bash
# Via Vercel CLI
npm install -g vercel
vercel

# Ou conecte repositório GitHub no Vercel Dashboard
```

---

## 🎨 Personalização

### Cores
Edite `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* suas cores */ }
    }
  }
}
```

### Textos
Edite `src/App.js` - todos os textos em português

### Logo
Substitua placeholder "BL" por sua logo em `src/App.js`

---

## 📞 Informações de Contacto

**Negócio**: Na Cadeira de Bárbara Lacerda  
**Localização**: Caldas da Rainha, Portugal  
**Telefone**: +351 935 279 765  
**Horário**: Terça a Sábado, 10:00-20:00

**Redes Sociais**:
- Facebook: [facebook.com/nacadeiradebarbaralacerda](https://facebook.com/nacadeiradebarbaralacerda)
- Instagram: [@nacadeiradebarbaralacerda](https://instagram.com/nacadeiradebarbaralacerda)

---

## 🐛 Problemas Comuns

### Build falha no Vercel
- Verifique variáveis de ambiente
- Veja logs do build

### Marcações não salvam
- Execute schema SQL no Supabase
- Verifique conexão com banco

### Admin não funciona
- Crie usuário com `role: admin` no Supabase
- Verifique autenticação

**Mais detalhes em [README-VERCEL.md](./README-VERCEL.md)**

---

## 📚 Documentação

- **Deploy no Vercel**: [README-VERCEL.md](./README-VERCEL.md) ⭐
- **Documentação Técnica**: Ver pasta `/outputs`
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

---

## 🔒 Segurança

- ✅ HTTPS automático (Vercel)
- ✅ Row Level Security (Supabase)
- ✅ Variáveis de ambiente seguras
- ✅ Validação de dados
- ✅ Autenticação JWT

---

## 📄 Licença

© 2025 Na Cadeira de Bárbara Lacerda. Todos os direitos reservados.

---

## 👨‍💻 Desenvolvedor

**YourSolution Dev**  
Email: yoursolution.dev@gmail.com

---

## ⭐ Próximos Passos

Depois do deploy:

1. ✅ Configurar domínio personalizado
2. ✅ Adicionar fotos reais na galeria
3. ✅ Treinar equipe no painel admin
4. ✅ Divulgar nas redes sociais
5. ✅ Configurar Google Analytics (opcional)

---

**Desenvolvido com ❤️ para transformar a gestão de salões de beleza**