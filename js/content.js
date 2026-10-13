/* Conteúdo editável. Contatos conferidos na imagem de @osbaileiros enviada pelo cliente. */
window.BAILEIROS = {
  name: 'Grupo Os Baileiros',
  instagram: 'https://www.instagram.com/osbaileiros/',
  youtube: 'https://www.youtube.com/@GrupoOsBaileiros',
  spotify: 'https://open.spotify.com/artist/0IVVbHhETDKOLQrjuJlvEC',
  spotifyEmbed: 'https://open.spotify.com/embed/artist/0IVVbHhETDKOLQrjuJlvEC?utm_source=generator&theme=0',
  contacts: {
    office: { name: 'Escritório', phone: '5554999613792', display: '(54) 9 9961-3792' },
    nenem: { name: 'Neném', phone: '5548996188563', display: '(48) 9 9618-8563' }
  },
  heroVideo: 'ob75k7LWSkg',
  // Agenda de shows, conforme post @osbaileiros "AGENDA DE SETEMBRO" (09/09). Somente datas de hoje em diante aparecem no site.
  agenda: [
    { date: '2026-09-03', venue: 'Mister Chopp', city: 'Florianópolis / SC' },
    { date: '2026-09-04', venue: 'CTG Silva Neto', city: 'Canelinha / SC' },
    { date: '2026-09-05', venue: 'CTG Silva Neto', city: 'Canelinha / SC' },
    { date: '2026-09-06', venue: 'Clube Canto do Rio', city: 'Florianópolis / SC' },
    { date: '2026-09-10', venue: 'Blanco Pub', city: 'Içara / SC' },
    { date: '2026-09-11', venue: 'Estância Campeira', city: 'Imbituba / SC' },
    { date: '2026-09-12', venue: 'Acampamento Farropilha', city: 'Itapema / SC' },
    { date: '2026-09-12', venue: 'Solares Show', city: 'Balneário Camboriú / SC' },
    { date: '2026-09-13', venue: '2º Churrasqueada da AMOSC', city: 'Florianópolis / SC' },
    { date: '2026-09-15', venue: 'Gourmet Chopperia', city: 'Palhoça / SC' },
    { date: '2026-09-18', venue: 'Vilarejo Beat', city: 'Florianópolis / SC' },
    { date: '2026-09-19', venue: 'Rancho Xaxim', city: 'Curitibanos / SC' },
    { date: '2026-09-20', venue: 'Festa de Comunidade', city: 'Biguaçu / SC' },
    { date: '2026-09-25', venue: 'Villa 51', city: 'Forquilhinhas / SC' },
    { date: '2026-09-26', venue: 'Baile de Casais', city: 'Rio Grande, Palhoça / SC' },
    { date: '2026-09-27', venue: 'Festa de Comunidade Linha Bouer', city: 'Águas Mornas / SC' },
    { date: '2026-09-27', venue: 'Domingueira Show', city: 'Tijucas / SC' }
  ],
  // Meio Bruta has its own section (#meio-bruta), so the clip player opens on the next hits.
  clips: [
    { id: 'B_PvYDWzkpQ', title: 'Prendinha de Rodeio', subtitle: 'Feat. JJSV', type: 'Clipe' },
    { id: 'Q1BGIpWKeUs', title: 'Inclusive Eu', subtitle: 'Feat. Sorriso Lindo', type: 'Clipe' },
    { id: 'ob75k7LWSkg', title: 'Meio Bruta', subtitle: 'Feat. Marlon Moraes', type: 'Clipe' },
    { id: '9_XHwKSvvw0', title: 'Meio Bruta', subtitle: 'Participação Talagaço', type: 'Vídeo' }
  ],
  // Patrocinadores e apoiadores: cada item vira um card na seção "Parceiros".
  // Campos (só "name" é obrigatório):
  //   name        Nome da empresa
  //   tier        'master' (card grande, primeiro da lista) ou 'apoio' (padrão)
  //   logo        Caminho da logo, ex.: 'assets/parceiros/marca.png' (PNG/SVG, de preferência com fundo transparente)
  //   logoBg      Cor de fundo atrás da logo, ex.: '#ffffff' ou '#111111' (padrão: cinza bem claro)
  //   category    Ramo da empresa, ex.: 'Concessionária', 'Agropecuária'
  //   city        Cidade / UF
  //   description Uma ou duas frases sobre a empresa
  //   site        Link do site
  //   instagram   Link do Instagram
  //   whatsapp    Número com DDI e DDD, só dígitos, ex.: '5548999999999'
  // Exemplo:
  //   { name: 'Nome da Empresa', tier: 'master', logo: 'assets/parceiros/empresa.png', category: 'Agropecuária',
  //     city: 'Biguaçu / SC', description: 'Frase curta sobre a empresa.', site: 'https://empresa.com.br',
  //     instagram: 'https://www.instagram.com/empresa/', whatsapp: '5548999999999' },
  // Enquanto a lista estiver vazia, a seção mostra espaços abertos convidando novas marcas.
  sponsors: [],
  tracks: [
    { id: 'wp1_Usv7eK8', title: 'Meio Bruta', subtitle: 'Os Baileiros · Talagaço' },
    { id: 'B_PvYDWzkpQ', title: 'Prendinha de Rodeio', subtitle: 'Os Baileiros · JJSV' },
    { id: 'Q1BGIpWKeUs', title: 'Inclusive Eu', subtitle: 'Os Baileiros · Sorriso Lindo' },
    { id: 'ob75k7LWSkg', title: 'Meio Bruta', subtitle: 'Os Baileiros · Marlon Moraes' },
    { id: '5cTPZbz32dU', title: 'Saudade Dela', subtitle: 'Os Baileiros' },
    { id: 'jXY4yGZ3bBo', title: 'Bye Bye Amor', subtitle: 'Os Baileiros' },
    { id: 'bRBDs3T30_0', title: 'Puro Fogo', subtitle: 'Os Baileiros' }
  ],
  gallery: [
    { src: 'assets/banda.png', title: 'Os Baileiros · os músicos', type: 'foto', className: 'band-photo', alt: 'Os cinco músicos do Grupo Os Baileiros em foto de divulgação, usando camisas cinza e lenços' },
    { src: 'assets/ao-vivo.jpg', title: 'A energia do nosso palco', type: 'foto', className: 'stage-photo', alt: 'Os Baileiros durante uma apresentação ao vivo' },
    { src: 'assets/arte-rancho.jpg', title: 'Arte de divulgação · Rancho Xaxim', type: 'arte', alt: 'Arte de divulgação de baile do Grupo Os Baileiros no Rancho Xaxim' },
    { src: 'assets/onibus.jpg', title: 'O nosso companheiro de estrada', type: 'foto', className: 'bus-photo', alt: 'Ônibus branco e preto do Grupo Os Baileiros, com o nome do grupo na lateral' },
    { src: 'assets/arte-sao-mateus.jpg', title: 'Arte de divulgação · São Mateus', type: 'arte', alt: 'Arte de divulgação de evento do grupo em São Mateus, Três Riachos' }
  ]
};
