# Os Baileiros — landing page

Projeto em HTML, CSS e JavaScript puro, sem framework e sem etapa de build.

## Abrir e publicar

- A página e todos os arquivos públicos estão em `dist/` neste repositório.
- No ZIP de entrega, `index.html`, `css/`, `js/` e `assets/` ficam na raiz para facilitar o uso.
- Use o Live Server do VS Code ou um servidor HTTP local para conferir a página. Não é necessário `npm install`.
- Para hospedagem estática, envie os arquivos de `dist/` para a raiz pública do domínio.
- YouTube e Spotify precisam de conexão com a internet e podem limitar a incorporação conforme o navegador, as preferências do visitante ou as regras do vídeo. Todos os players oferecem acesso direto à plataforma.

## Arquivos principais

- `dist/index.html`: estrutura, texto e metadados.
- `dist/css/style.css`: identidade visual e responsividade.
- `dist/js/content.js`: contatos, URLs, clipes, faixas e galeria.
- `dist/js/main.js`: menu, modais, players, carrossel e galeria ampliada.
- `dist/assets/`: imagens reais e recursos visuais locais.
- `dist/assets/fonts/`: Barlow Condensed ExtraBold e DM Sans, carregadas localmente.

## Funcionalidades

- Layout inspirado na referência Kauan Furacão: preto, branco e prata do ônibus, com roxo da marca nos destaques e cores das plataformas nos acessos.
- Logo oficial no header, hero e rodapé, preservando os detalhes roxos da arte original.
- Header integrado ao hero e navegação móvel recolhível.
- Hero mobile em sequência vertical: imagem/vídeo do grupo, logo, textos e chamadas, plataformas, vinil grande centralizado e card de Meio Bruta.
- Disco de vinil e card de Meio Bruta com acesso ao clipe. A imagem estática mobile usa uma fotografia real do grupo no palco como alternativa ao vídeo.
- WhatsApp em verde, Spotify em verde, YouTube em vermelho e Instagram em rosa/roxo, inclusive nos modais.
- Menu recolhível até 1024 px e ajustes para 780, 480 e 380 px, incluindo controles de toque, formulários e cards.
- Seções claras e escuras e cards de conexão com Spotify, YouTube e Instagram.
- O clipe de Meio Bruta roda no fundo da página inteira (camada fixa), sem som. Os botões "Ouvir Meio Bruta" / "Ligar o som aqui" ativam o áudio do próprio clipe; um aviso flutuante permite silenciar de qualquer ponto da página. Se o navegador bloquear o som, o clipe abre no player com áudio.
- Modal de Meio Bruta (botão "Ouvir Meio Bruta" no hero): abre tocando com som, com troca entre as três versões (clipe oficial, participação Talagaço e áudio) no mesmo player e o botão "Continuar ouvindo enquanto navego", que fecha o modal e liga o som do clipe de fundo.
- Seção de Parceiros (#parceiros): cards dos patrocinadores com logo, ramo, cidade, descrição e links para site, Instagram e WhatsApp. O patrocinador `tier: 'master'` ganha um card maior. Os cadastros ficam em `sponsors` no `js/content.js` (os campos estão comentados lá). Sem patrocinadores cadastrados, a seção mostra espaços disponíveis que abrem a conversa de parceria no WhatsApp.
- Sobre o grupo, referência a Neném e Zeca Knirsch, foto dos músicos e ônibus na mesma seção.
- Player principal, quatro clipes selecionáveis e sete faixas em carrossel automático.
- O player principal inicia sem som quando entra no campo de visão. Use os controles do YouTube para ativar o áudio. Se o navegador impedir autoplay, use o botão de reprodução.
- Podcasts de Neném (#418) e Zeca Knirsch (#426), conforme os links enviados.
- Galeria filtrável de fotos e artes, com ampliação e navegação por teclado.
- Modais centralizados para Instagram, Spotify, YouTube, contratação e material de divulgação, com cabeçalho e botão de fechar sempre visíveis.
- Vídeos em janela compacta de até 880 px, limitados também pela altura da tela e preservando o formato 16:9. Fotos e formulário têm rolagem interna quando necessário.
- Formulário em uma coluna em telas de até 600 px, foco inicial no título, retorno de foco ao fechar e bloqueio da rolagem da página ao fundo.
- Formulário opcional de contratação prepara a mensagem no WhatsApp. Não envia mensagens automaticamente e não armazena dados.
- Dois destinos para contratação: escritório e Neném.
- Carrossel pausável, suporte a toque/teclado, foco visível, dialogs nativos e preferência por movimento reduzido.

## Contatos conferidos

Os números foram transcritos da captura do perfil @osbaileiros enviada pelo cliente:

- Escritório: +55 54 99961-3792.
- Neném: +55 48 99618-8563.

## Conteúdo e referências

- Perfil: https://www.instagram.com/osbaileiros/
- Ônibus: https://www.instagram.com/reel/DWpG0j7kYBo/
- YouTube: https://www.youtube.com/@GrupoOsBaileiros
- Spotify: https://open.spotify.com/artist/0IVVbHhETDKOLQrjuJlvEC
- Meio Bruta, versão do canal do grupo com Marlon Moraes: https://www.youtube.com/watch?v=ob75k7LWSkg
- Meio Bruta, participação Talagaço: https://www.youtube.com/watch?v=9_XHwKSvvw0
- Meio Bruta, áudio distribuído: https://www.youtube.com/watch?v=wp1_Usv7eK8
- Neném / YouTchê: https://www.youtube.com/watch?v=KPllYceEB8Q
- Zeca Knirsch / YouTchê: https://www.youtube.com/watch?v=TxptZmDVnYM

O hero e o player principal usam a versão em vídeo de Meio Bruta publicada no canal do grupo. A versão com Talagaço também está disponível na seleção de clipes e nas faixas.

As artes de eventos ficam na galeria como exemplos de divulgação, sem apresentar datas como agenda futura. As fontes específicas das imagens estão em `ASSET-REPORT.json` e `THUMBNAIL-REPORT.json`. As imagens não foram geradas nem tiveram pessoas inventadas.

## Referência visual e identidade

A composição foi adaptada da página https://kauan-furacao-landinpage.vercel.app/ indicada pelo cliente: header integrado, marca em grande escala, card de música com vinil, seção clara de apresentação, discografia e bloco final para contratações. O conteúdo, as imagens do grupo e a programação da página permanecem próprios deste projeto.

A base da interface é preto, branco e prata/cinza, baseada na pintura do ônibus mostrada no reel. Os destaques e o botão de play usam o roxo presente na logo, e os acessos às plataformas usam suas cores correspondentes. As fotos, os clipes e a marca oficial mantêm as cores originais. O vinil e as fontes locais têm suas origens registradas em `DESIGN-REFERENCES.json`.

## Próximos refinamentos de conteúdo

O cliente pode fornecer a relação atual de músicos com nomes e instrumentos, biografia oficial detalhada, logotipo em PNG/SVG transparente e foto/arte do ônibus em alta resolução. Não foram inventados nomes, cargos, datas de fundação, quantidades de shows ou cidades visitadas.

A imagem do ônibus foi obtida da capa do reel enviado (640 × 1136). É uma imagem autêntica, mas um original horizontal em alta resolução permitirá um acabamento melhor. A logo no header, hero e rodapé é a marca original que aparece na imagem promocional do canal oficial. Ela é exibida com uma janela e máscara em CSS sobre `banda.png`, sem redesenhar as letras nem alterar as cores. Não foi localizado um arquivo avulso transparente em alta resolução; ele poderá substituir essa técnica quando for fornecido pela produção. A origem está em `OFFICIAL-LOGO-RESEARCH.json`.

## Validação desta entrega

Foram verificados sintaxe JavaScript, estrutura e referências locais, arquivos de imagem, destinos de contato e regras responsivas. Não foi realizada verificação visual em navegador nesta execução, pois o ambiente de prévia não oferece servidor compatível para projetos estáticos puros. Revise a prévia publicada em desktop e celular antes da divulgação pública.
