# Livro&Livro - Plataforma de Troca e Doação de Livros

Uma plataforma web estática para facilitar a troca e doação de livros entre leitores, promovendo o compartilhamento de conhecimento e a sustentabilidade.

## 🚀 Sobre o Projeto

Livro&Livro é uma aplicação web desenvolvida com HTML, CSS e JavaScript puro, focada em proporcionar uma experiência intuitiva e acessível para usuários que desejam trocar ou doar livros.

### ✨ Características Principais

- **100% Estático**: Hospedado no GitHub Pages, sem necessidade de servidor backend
- **Persistência Local**: Utiliza localStorage para armazenar dados no navegador
- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Acessibilidade**: Seguindo padrões WCAG AA
- **SEO Otimizado**: Meta tags e estrutura semântica

## 🎨 Design System

O projeto utiliza uma paleta de cores cuidadosamente escolhida:

- **Primária**: `#1E3A8A` (Azul Escuro) - Cabeçalhos, botões principais, links
- **Secundária**: `#FFFFFF` (Branco) - Fundos
- **Secundária**: `#F3F4F6` (Cinza Claro) - Blocos e rodapés
- **Apoio**: `#9CA3AF` (Cinza Médio) - Texto secundário
- **Apoio**: `#374151` (Cinza Escuro) - Texto principal
- **Acento**: `#3B82F6` (Azul Claro) - Hover e estados ativos

## 📋 Funcionalidades

### Para Usuários

- ✅ Cadastro com validação completa (CPF, idade 18+, endereço completo)
- ✅ Login e autenticação local
- ✅ Painel do usuário com estatísticas
- ✅ Catálogo de livros com busca e filtros
- ✅ Sistema de "Gostaria de Ler" (carrinho)
- 🚧 Cadastro de livros para doação/troca
- 🚧 Acompanhamento de pedidos
- 🚧 Gestão de perfil

### Para Administradores

- 🚧 Painel administrativo
- 🚧 Gerenciamento de usuários
- 🚧 Gerenciamento de livros
- 🚧 Visualização de estatísticas

### Páginas Legais

- 🚧 Termos de Uso
- 🚧 Política de Privacidade
- 🚧 Política de Cookies

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Custom Properties (CSS Variables), Grid, Flexbox
- **JavaScript ES6+**: Modules, Arrow Functions, Async/Await
- **LocalStorage**: Persistência de dados no cliente
- **GitHub Pages**: Hospedagem estática

## 📁 Estrutura do Projeto

```
/
├── index.html              # Página inicial
├── auth/
│   ├── login.html         # Página de login
│   └── cadastro.html      # Página de cadastro
├── categorias/
│   └── index.html         # Catálogo de livros
├── usuario/
│   ├── painel.html        # Painel do usuário
│   ├── pedidos.html       # Pedidos do usuário
│   └── cadastrar-livro.html # Cadastro de livros
├── admin/
│   └── index.html         # Painel administrativo
├── politicas/
│   ├── termos.html        # Termos de Uso
│   ├── privacidade.html   # Política de Privacidade
│   └── cookies.html       # Política de Cookies
├── css/
│   ├── base.css           # Design tokens e reset
│   ├── layout.css         # Layout e grids
│   ├── components.css     # Componentes reutilizáveis
│   └── pages.css          # Estilos específicos de páginas
├── js/
│   ├── main.js            # Entrada principal
│   ├── utils/
│   │   └── validators.js  # Funções de validação
│   ├── models/            # Modelos de dados
│   ├── services/          # Serviços e lógica de negócio
│   └── ui/
│       ├── components/    # Componentes de UI
│       └── pages/         # Scripts de páginas específicas
├── assets/
│   ├── images/            # Imagens do projeto
│   └── icons/             # Ícones
└── img/
    └── logo.png           # Logo do projeto
```

## 🚀 Como Usar

### Acesso Online

Visite: [https://gabriel-fausto.github.io/Sebo-Livro-Livro/](https://gabriel-fausto.github.io/Sebo-Livro-Livro/)

### Desenvolvimento Local

1. Clone o repositório:
```bash
git clone https://github.com/gabriel-fausto/Sebo-Livro-Livro.git
```

2. Navegue até o diretório:
```bash
cd Sebo-Livro-Livro
```

3. Abra o arquivo `index.html` em seu navegador ou use um servidor local:
```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js (http-server)
npx http-server
```

4. Acesse `http://localhost:8000` no navegador

## 📝 Validações Implementadas

### CPF
- Validação completa com verificação de dígitos
- Formatação automática (XXX.XXX.XXX-XX)
- Rejeita CPFs inválidos ou com todos os dígitos iguais

### Idade
- Verifica se o usuário tem 18 anos ou mais
- Baseado na data de nascimento fornecida

### Endereço
- CEP com formatação automática (XXXXX-XXX)
- Todos os campos obrigatórios: rua, número, bairro, cidade, estado

### Senha
- Mínimo de 8 caracteres
- Indicador de força visual
- Validação de confirmação

## 🔒 Segurança e Privacidade

**⚠️ Importante**: Este é um MVP estático para demonstração. As seguintes limitações se aplicam:

- Autenticação é simulada localmente (não há servidor real)
- Senhas são armazenadas no localStorage (não use senhas reais!)
- Não há criptografia de dados
- Não há recuperação de senha por e-mail
- Admin é protegido apenas por senha local

**Para produção**, seria necessário:
- Backend com autenticação real (Firebase, Supabase, etc.)
- Criptografia de senhas (bcrypt, argon2)
- HTTPS obrigatório
- Tokens JWT para sessões
- Proteção contra CSRF e XSS

## 🎯 Roadmap

### Em Desenvolvimento
- [ ] Página de cadastro de livros
- [ ] Carrinho de compras completo
- [ ] Fluxo de checkout
- [ ] Acompanhamento de pedidos
- [ ] Painel administrativo

### Futuro
- [ ] Integração com API de CEP (ViaCEP)
- [ ] Upload real de imagens (Cloudinary, Imgur)
- [ ] Sistema de notificações
- [ ] Chat entre usuários
- [ ] Sistema de avaliações
- [ ] Integração com APIs de frete
- [ ] Backend real (Firebase/Supabase)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Gabriel Fausto** - [GitHub](https://github.com/gabriel-fausto)

## 🙏 Agradecimentos

- Comunidade de desenvolvedores
- Todos que contribuírem com o projeto
- Usuários que testarem e reportarem bugs

---

**Livro&Livro** - Compartilhando conhecimento através da troca e doação de livros 📚
