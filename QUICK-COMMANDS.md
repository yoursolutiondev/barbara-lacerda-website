# ⚡ COMANDOS RÁPIDOS

Referência rápida de comandos para desenvolvimento e deploy

---

## 🚀 DEPLOY NO VERCEL

### Via Vercel Dashboard (Mais Fácil)
```
1. Acesse vercel.com
2. Conecte repositório GitHub
3. Configure variáveis de ambiente
4. Deploy!
```

### Via Vercel CLI
```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

---

## 💻 DESENVOLVIMENTO LOCAL

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
# Abre em: http://localhost:3000

# Build para produção
npm run build

# Testar build localmente
npx serve -s build
```

---

## 🗄️ SUPABASE

### Executar Schema SQL
```
1. Supabase Dashboard
2. SQL Editor
3. New Query
4. Copiar supabase-schema.sql
5. RUN
```

### Criar Admin User
```
1. Authentication > Users
2. Add User
3. Email: admin@barbaralacerda.com
4. Password: [sua-senha]
5. Editar usuário
6. Raw User Meta Data:
   {"role": "admin"}
7. Save
```

---

## 🔧 CONFIGURAÇÃO

### Variáveis de Ambiente (Local)
```bash
# Criar arquivo .env.local
cp .env.example .env.local

# Editar com suas credenciais
nano .env.local
```

### Variáveis de Ambiente (Vercel)
```
1. Vercel Dashboard > Seu Projeto
2. Settings > Environment Variables
3. Adicionar:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_ANON_KEY
4. Save
5. Redeploy
```

---

## 📦 GIT

### Push para GitHub
```bash
# Primeira vez
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU-USUARIO/barbara-lacerda-website.git
git push -u origin main

# Atualizações
git add .
git commit -m "Descrição das mudanças"
git push
```

### Clonar Projeto
```bash
git clone https://github.com/SEU-USUARIO/barbara-lacerda-website.git
cd barbara-lacerda-website
npm install
```

---

## 🧪 TESTES

### Testar Conexão Supabase
```bash
# No terminal do projeto
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
console.log('Supabase conectado:', supabase);
"
```

### Testar Build
```bash
npm run build
# Se build com sucesso, está pronto para deploy
```

---

## 🔄 ATUALIZAR SITE

### Via GitHub Web
```
1. GitHub > Seu Repositório
2. Navegar até arquivo
3. Clicar no lápis (Edit)
4. Fazer mudanças
5. Commit changes
6. Vercel faz deploy automático
```

### Via Terminal
```bash
# 1. Fazer mudanças nos arquivos

# 2. Commit e push
git add .
git commit -m "Descrição"
git push

# 3. Vercel deploy automático!
```

---

## 🐛 TROUBLESHOOTING

### Limpar Cache
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar cache do npm
npm cache clean --force
```

### Ver Logs do Vercel
```bash
vercel logs [deployment-url]
```

### Forçar Redeploy no Vercel
```
1. Vercel Dashboard
2. Deployments
3. ... (três pontos) > Redeploy
```

---

## 📊 MONITORAMENTO

### Ver Estatísticas Vercel
```
vercel inspect [deployment-url]
```

### Ver Logs do Supabase
```
Supabase Dashboard > Logs
```

---

## 🔐 SEGURANÇA

### Verificar Variáveis de Ambiente
```bash
# Local
cat .env.local

# Vercel
vercel env ls
```

### Rotacionar Credenciais Supabase
```
1. Supabase > Settings > API
2. Reset JWT Secret (gera novas keys)
3. Atualizar no Vercel
4. Redeploy
```

---

## 🎨 PERSONALIZAÇÃO

### Mudar Cores
```bash
# Editar
nano tailwind.config.js

# Build e testar
npm run build
```

### Adicionar Nova Página
```bash
# 1. Criar componente em src/
# 2. Importar no App.js
# 3. Adicionar no menu
# 4. Commit e push
```

---

## 📱 TESTE EM DISPOSITIVOS

### Chrome DevTools
```
F12 > Toggle Device Toolbar (Ctrl+Shift+M)
```

### Ngrok (Testar em celular real)
```bash
# Instalar ngrok
npm install -g ngrok

# Expor localhost
ngrok http 3000

# Usar URL no celular
```

---

## 💾 BACKUP

### Backup Supabase
```
1. Supabase Dashboard
2. Settings > Database
3. Backups
4. Download
```

### Backup Código
```bash
# Já está no GitHub! Mas pode fazer zip local:
zip -r backup-$(date +%Y%m%d).zip . -x "node_modules/*" ".git/*"
```

---

## 📦 DEPENDÊNCIAS

### Atualizar Dependências
```bash
# Ver outdated
npm outdated

# Atualizar todas (cuidado)
npm update

# Atualizar específica
npm update nome-do-pacote
```

### Adicionar Nova Dependência
```bash
npm install nome-do-pacote

# Commit
git add package.json package-lock.json
git commit -m "Add nome-do-pacote"
git push
```

---

## 🚨 EMERGÊNCIAS

### Site Caiu
```
1. Verificar Vercel Status: vercel.com/status
2. Verificar Supabase Status: status.supabase.com
3. Ver logs: Vercel Dashboard > Logs
4. Rollback: Vercel > Deployments > Deploy anterior > Promote
```

### Banco de Dados Corrompido
```
1. Supabase > Database > Backups
2. Restore último backup
3. Ou re-executar supabase-schema.sql
```

### Variáveis Erradas
```
1. Vercel > Settings > Environment Variables
2. Corrigir valores
3. Save
4. Redeploy
```

---

## 📞 OBTER AJUDA

### Documentação
```bash
# React
https://react.dev

# Tailwind
https://tailwindcss.com/docs

# Supabase
https://supabase.com/docs

# Vercel
https://vercel.com/docs
```

### Comunidades
```
Discord Supabase: discord.supabase.com
Discord Vercel: vercel.com/discord
Stack Overflow: stackoverflow.com
```

---

## 🎓 DICAS

1. **Sempre teste localmente antes de fazer push**
   ```bash
   npm start
   ```

2. **Use commits descritivos**
   ```bash
   git commit -m "Fix: corrigir validação de email"
   ```

3. **Faça backup antes de grandes mudanças**
   ```bash
   git tag -a v1.0 -m "Versão estável"
   ```

4. **Monitore erros no Vercel Dashboard**
   ```
   Deployments > Ver logs
   ```

5. **Mantenha dependências atualizadas**
   ```bash
   npm outdated # Verificar semanalmente
   ```

---

**Este arquivo é sua referência rápida - marque nos favoritos! ⭐**