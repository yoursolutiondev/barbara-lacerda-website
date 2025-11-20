# 🚀 GUIA DE DEPLOY NO VERCEL

## Deploy do Website Bárbara Lacerda no Vercel

---

## 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se de ter:

1. ✅ Conta no Supabase (gratuita) - [https://supabase.com](https://supabase.com)
2. ✅ Conta no Vercel (gratuita) - [https://vercel.com](https://vercel.com)
3. ✅ Conta no GitHub (gratuita) - [https://github.com](https://github.com)
4. ✅ Git instalado no seu computador

---

## 🎯 OPÇÃO 1: DEPLOY AUTOMÁTICO (RECOMENDADO)

### Tempo estimado: 5 minutos

### Passo 1: Configurar Supabase (2 minutos)

1. Acesse [https://supabase.com](https://supabase.com) e faça login
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `barbara-lacerda`
   - **Database Password**: [escolha uma senha forte e GUARDE]
   - **Region**: `Europe West (London)`
4. Clique em **"Create new project"** e aguarde (~2 minutos)

5. Execute o Schema SQL:
   - No menu lateral, clique em **SQL Editor**
   - Clique em **"+ New Query"**
   - Copie TODO o conteúdo do arquivo `supabase-schema.sql`
   - Cole no editor
   - Clique em **"RUN"** (canto inferior direito)
   - Aguarde a mensagem de sucesso

6. Crie o usuário admin:
   - No menu lateral, clique em **Authentication > Users**
   - Clique em **"Add User" > "Create new user"**
   - Preencha:
     * Email: `admin@barbaralacerda.com`
     * Password: [senha forte - GUARDE ESTA SENHA]
     * Confirm password: [mesma senha]
   - Clique em **"Create User"**
   
7. Configure o admin:
   - Clique no usuário que você acabou de criar
   - Procure **"Raw User Meta Data"**
   - Cole este JSON:
   ```json
   {
     "role": "admin"
   }
   ```
   - Clique em **"Save"**

8. Copie suas credenciais:
   - No menu lateral, clique em **⚙️ Project Settings > API**
   - **COPIE E GUARDE**:
     * **Project URL**: `https://xxxxxxxxx.supabase.co`
     * **anon public key**: `eyJhbGc...` (chave longa)

---

### Passo 2: Criar Repositório no GitHub (1 minuto)

1. Acesse [https://github.com/new](https://github.com/new)
2. Preencha:
   - **Repository name**: `barbara-lacerda-website`
   - **Description**: "Sistema de marcações para salão de beleza"
   - Deixe como **Public** (ou Private se preferir)
   - ✅ Marque **"Add a README file"**
3. Clique em **"Create repository"**
4. **DEIXE ESTA ABA ABERTA** - você vai precisar dela

---

### Passo 3: Fazer Upload do Código (2 minutos)

#### Opção A: Via Interface do GitHub (Mais Fácil)

1. Na página do seu repositório no GitHub, clique em **"uploading an existing file"** (ou **"Add file" > "Upload files"**)

2. Arraste TODOS os arquivos e pastas do projeto:
   ```
   📁 Arraste estas pastas/arquivos:
   - 📁 public/
   - 📁 src/
   - 📄 package.json
   - 📄 tailwind.config.js
   - 📄 postcss.config.js
   - 📄 vercel.json
   - 📄 .gitignore
   - 📄 .env.example
   - 📄 README-VERCEL.md (este arquivo)
   ```

3. Na caixa de commit, escreva: `Initial commit - Barbara Lacerda Website`

4. Clique em **"Commit changes"**

#### Opção B: Via Terminal (Para Quem Sabe Git)

```bash
# 1. Abra o terminal na pasta do projeto
cd caminho/para/vercel-project

# 2. Inicialize o git
git init

# 3. Adicione todos os arquivos
git add .

# 4. Faça o commit
git commit -m "Initial commit - Barbara Lacerda Website"

# 5. Adicione o repositório remoto (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/barbara-lacerda-website.git

# 6. Envie o código
git branch -M main
git push -u origin main
```

---

### Passo 4: Deploy no Vercel (2 minutos)

1. Acesse [https://vercel.com](https://vercel.com) e faça login com GitHub

2. No dashboard do Vercel, clique em **"Add New..." > "Project"**

3. Na lista de repositórios, encontre `barbara-lacerda-website`
   - Se não aparecer, clique em **"Adjust GitHub App Permissions"** e dê acesso

4. Clique em **"Import"** no repositório

5. **Configure as Variáveis de Ambiente**:
   - Clique em **"Environment Variables"**
   - Adicione as seguintes variáveis (use suas credenciais do Supabase):
   
   ```
   Name: REACT_APP_SUPABASE_URL
   Value: https://seu-projeto.supabase.co
   
   Name: REACT_APP_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   
   - Para cada variável:
     * Cole o **Name** no campo "Key"
     * Cole o **Value** no campo "Value"
     * Clique em **"Add"**

6. Clique em **"Deploy"**

7. Aguarde 2-3 minutos enquanto o Vercel faz o build e deploy

8. Quando aparecer 🎉 **"Congratulations!"**, clique em **"Visit"**

---

### ✅ PRONTO! Seu site está no ar!

URL do seu site: `https://barbara-lacerda-website.vercel.app`

Você pode configurar um domínio personalizado depois.

---

## 🎯 OPÇÃO 2: DEPLOY VIA VERCEL CLI

### Para desenvolvedores que preferem linha de comando

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Na pasta do projeto, rodar
vercel

# 4. Seguir as instruções:
# - Set up and deploy? Yes
# - Which scope? [sua conta]
# - Link to existing project? No
# - What's your project's name? barbara-lacerda-website
# - In which directory is your code located? ./
# - Want to override the settings? No

# 5. Adicionar variáveis de ambiente
vercel env add REACT_APP_SUPABASE_URL
# Cole a URL do Supabase e pressione Enter

vercel env add REACT_APP_SUPABASE_ANON_KEY
# Cole a chave anon e pressione Enter

# 6. Deploy em produção
vercel --prod
```

---

## 🔧 CONFIGURAÇÃO ADICIONAL

### Domínio Personalizado (Opcional)

1. No dashboard do Vercel, clique no seu projeto
2. Clique em **"Settings"** > **"Domains"**
3. Adicione seu domínio (ex: `barbaralacerda.com`)
4. Siga as instruções para configurar DNS

### SSL/HTTPS

✅ Automático! Vercel configura SSL gratuitamente.

---

## 🧪 TESTAR O SITE

### Teste no Cliente:

1. Acesse a URL do Vercel
2. Navegue pelas páginas
3. Tente fazer uma marcação:
   - Escolha um serviço
   - Escolha uma profissional
   - Selecione data e hora
   - Preencha seus dados
   - Confirme
4. Verifique no Supabase se a marcação foi criada:
   - Supabase > Table Editor > bookings

### Teste no Admin:

1. Acesse `https://seu-site.vercel.app/admin` (ou clique no botão admin)
2. Faça login com:
   - Email: `admin@barbaralacerda.com`
   - Password: [senha que você criou]
3. Verifique:
   - Dashboard com estatísticas
   - Lista de marcações
   - Gestão de serviços
   - Gestão de profissionais

---

## 🔄 ATUALIZAR O SITE

### Quando quiser fazer mudanças:

#### Via GitHub Web:

1. Acesse seu repositório no GitHub
2. Navegue até o arquivo que quer editar
3. Clique no ícone de lápis (Edit)
4. Faça as alterações
5. Clique em **"Commit changes"**
6. Vercel fará deploy automático em 2-3 minutos

#### Via Git (Terminal):

```bash
# 1. Faça suas alterações nos arquivos

# 2. Adicione as mudanças
git add .

# 3. Commit
git commit -m "Descrição das mudanças"

# 4. Envie para GitHub
git push

# 5. Vercel faz deploy automático!
```

---

## 📊 MONITORAMENTO

### No Vercel:

- **Deployments**: Ver histórico de deploys
- **Analytics**: Estatísticas de visitantes
- **Logs**: Ver erros e logs do sistema
- **Speed Insights**: Performance do site

### No Supabase:

- **Database**: Ver dados em tempo real
- **Authentication**: Usuários logados
- **Storage**: Arquivos enviados
- **Logs**: Atividade no banco de dados

---

## ⚙️ VARIÁVEIS DE AMBIENTE NO VERCEL

Se precisar adicionar/editar variáveis:

1. Vercel Dashboard > Seu Projeto
2. Clique em **"Settings"**
3. Clique em **"Environment Variables"**
4. Adicione ou edite as variáveis
5. Clique em **"Save"**
6. **IMPORTANTE**: Faça um redeploy:
   - Vá em **"Deployments"**
   - Clique nos 3 pontinhos da última deployment
   - Clique em **"Redeploy"**

---

## 🐛 PROBLEMAS COMUNS

### "Build Failed"

**Causa**: Erro no código ou dependências faltando

**Solução**:
1. Verifique os logs do build no Vercel
2. Teste localmente: `npm install && npm start`
3. Corrija erros e faça novo commit

### "Supabase connection error"

**Causa**: Variáveis de ambiente não configuradas

**Solução**:
1. Verifique em Vercel > Settings > Environment Variables
2. Certifique-se que as variáveis estão corretas
3. Redeploy o projeto

### Site funciona mas marcação não salva

**Causa**: Schema SQL não foi executado no Supabase

**Solução**:
1. Supabase > SQL Editor
2. Execute o arquivo `supabase-schema.sql`
3. Verifique se tabelas foram criadas: Table Editor

### "Not Found" em /admin

**Causa**: Roteamento não configurado

**Solução**: 
- Já está configurado em `vercel.json`
- Se persistir, limpe cache do Vercel e redeploy

---

## 📱 TESTAR EM DISPOSITIVOS

### Desktop:
- Chrome: F12 > Toggle device toolbar
- Firefox: F12 > Responsive Design Mode

### Mobile Real:
1. Abra o site no celular
2. Teste todas as funcionalidades
3. Verifique se botão WhatsApp funciona

---

## 🎨 PERSONALIZAR

### Cores:
Editar `tailwind.config.js` > `theme.extend.colors`

### Textos:
Editar `src/App.js` - todos os textos estão lá

### Logo:
Substituir placeholder "BL" por imagem real em `src/App.js`

### Fotos:
Adicionar fotos reais via Supabase Storage

---

## 📊 ANALYTICS (OPCIONAL)

### Adicionar Google Analytics:

1. Crie propriedade no Google Analytics
2. Copie o ID (ex: G-XXXXXXXXXX)
3. Adicione em `public/index.html` antes de `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔐 SEGURANÇA

### Checklist de Segurança:

- ✅ HTTPS ativado (automático no Vercel)
- ✅ Variáveis de ambiente seguras (não no código)
- ✅ RLS ativado no Supabase (já configurado)
- ✅ Senha de admin forte
- ⬜ Configurar 2FA no Supabase (recomendado)
- ⬜ Configurar 2FA no Vercel (recomendado)
- ⬜ Backup regular do Supabase (automático)

---

## 💰 CUSTOS

### Vercel (Hobby Plan - Gratuito):
- ✅ Largura de banda ilimitada
- ✅ 100 GB transferência/mês
- ✅ Builds ilimitados
- ✅ SSL incluído

### Supabase (Free Tier):
- ✅ 500 MB de database
- ✅ 1 GB de storage
- ✅ 50,000 usuários ativos/mês
- ✅ 2 GB de transferência/mês

**Para um salão de beleza, o plano gratuito é MAIS que suficiente!**

Se crescer muito:
- Vercel Pro: $20/mês
- Supabase Pro: $25/mês

---

## 📞 SUPORTE

### Documentação:
- Vercel: [https://vercel.com/docs](https://vercel.com/docs)
- Supabase: [https://supabase.com/docs](https://supabase.com/docs)

### Comunidade:
- Discord do Vercel: [https://vercel.com/discord](https://vercel.com/discord)
- Discord do Supabase: [https://discord.supabase.com](https://discord.supabase.com)

### Desenvolvedor:
- Email: yoursolution.dev@gmail.com

---

## ✅ CHECKLIST FINAL

Antes de considerar o deploy completo:

- [ ] Supabase configurado e schema executado
- [ ] Admin criado com role "admin"
- [ ] Repositório GitHub criado
- [ ] Código enviado para GitHub
- [ ] Projeto criado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Site abre corretamente
- [ ] Marcação de teste funciona
- [ ] Admin login funciona
- [ ] Testado em mobile
- [ ] URLs das redes sociais corretas
- [ ] Número de telefone correto
- [ ] Email correto

---

## 🎉 PARABÉNS!

Seu site está no ar e funcionando!

**URL**: `https://barbara-lacerda-website.vercel.app`

Próximos passos:
1. ⬜ Adicionar domínio personalizado
2. ⬜ Adicionar fotos reais
3. ⬜ Treinar equipe no painel admin
4. ⬜ Divulgar nas redes sociais

---

## 📈 PRÓXIMAS FEATURES

Depois que estiver tudo funcionando, você pode adicionar:

- [ ] Notificações por email (SendGrid)
- [ ] Pagamentos online (Stripe)
- [ ] Sistema de fidelização
- [ ] App mobile
- [ ] Chat de atendimento

Documentação completa em `DOCUMENTATION.md`

---

**Desenvolvido com ❤️ por YourSolution Dev**

Para dúvidas ou suporte: yoursolution.dev@gmail.com