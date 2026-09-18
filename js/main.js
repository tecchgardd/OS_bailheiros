(() => {
  'use strict';
  const data = window.BAILEIROS;
  if (!data) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = (name, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const videoURL = (id) => `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
  const thumbnail = (id) => `assets/${id}.jpg`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData === true;
  const actionModal = $('#action-modal');
  const mediaModal = $('#media-modal');
  let lastFocus = null;
  let galleryIndex = 0;
  let galleryFilter = 'all';
  let heroPlayer;
  let heroPaused = reduceMotion.matches || saveData;
  let heroVisible = true;
  let activeClip = data.clips[0];
  let mainPlaying = false;

  function enhanceImages(root = document) {
    $$('img', root).forEach(img => {
      if (img.dataset.guarded) return;
      img.dataset.guarded = 'true';
      img.addEventListener('error', () => {
        // Remote cover is a fallback; if the provider blocks it, retain a real group image.
        if (!img.dataset.remoteTried && /assets\/[A-Za-z0-9_-]{11}\.jpg$/.test(img.getAttribute('src'))) {
          img.dataset.remoteTried = 'true';
          const id = img.getAttribute('src').split('/').pop().replace('.jpg', '');
          img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        } else if (!img.dataset.fallbackTried) {
          img.dataset.fallbackTried = 'true';
          img.src = 'assets/banda.png';
          img.alt = 'Grupo Os Baileiros';
        }
      });
      if (img.complete && !img.naturalWidth) img.dispatchEvent(new Event('error'));
    });
  }

  function closeNavigation() {
    $('#navigation').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
    $('#menu-toggle').setAttribute('aria-label', 'Abrir menu');
    $('#menu-toggle').innerHTML = icon('menu');
  }
  $('#menu-toggle').addEventListener('click', () => {
    const open = $('#navigation').classList.toggle('open');
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
    $('#menu-toggle').setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('#menu-toggle').innerHTML = icon(open ? 'close' : 'menu');
  });
  $$('#navigation a').forEach(a => a.addEventListener('click', closeNavigation));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNavigation(); });
  document.addEventListener('click', e => { if (!e.composedPath().includes($('#header'))) closeNavigation(); });
  window.addEventListener('scroll', () => $('#header').classList.toggle('scrolled', window.scrollY > 180), { passive: true });
  $('#year').textContent = new Date().getFullYear();

  function pauseMain() {
    const frame = $('#main-video iframe');
    frame?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), 'https://www.youtube.com');
  }
  function pauseAll() {
    heroPlayer?.pauseVideo?.();
    pauseMain();
  }
  function openDialog(dialog) {
    lastFocus = document.activeElement;
    closeNavigation();
    pauseAll();
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
    dialog.showModal();
    const content = dialog === actionModal ? $('#modal-content') : $('#media-content');
    content.scrollTop = 0;
    const title = dialog.querySelector('h2');
    title?.setAttribute('tabindex', '-1');
    title?.focus({ preventScroll: true });
  }
  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
  }
  [actionModal, mediaModal].forEach(dialog => {
    dialog.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) closeDialog(dialog);
      if (e.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) closeDialog(dialog);
      }
    });
    dialog.addEventListener('close', () => {
      if (dialog === mediaModal) { $('#media-content').replaceChildren(); $('#media-footer').replaceChildren(); }
      if (dialog === actionModal) $('#modal-content').replaceChildren();
      if (!actionModal.open && !mediaModal.open) {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
      }
      if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
      if (heroVisible && !heroPaused && !document.hidden) heroPlayer?.playVideo?.();
    });
  });

  function whatsappURL(contact, message) {
    return `https://wa.me/${data.contacts[contact].phone}?text=${encodeURIComponent(message)}`;
  }
  function bookingHTML(contact = 'office') {
    return `<div class="modal-icon">${icon('whatsapp')}</div><p class="eyebrow">VAMOS FAZER UM BAILE?</p><h2 id="modal-title">LEVE ESSA ENERGIA<br><em>AO SEU EVENTO.</em></h2><p>Conte um pouco sobre a sua ideia. Vamos abrir uma conversa com a produção no WhatsApp.</p>
      <form id="booking-form" class="modal-form"><div class="form-row"><label>Cidade do evento<input name="city" placeholder="Ex.: Florianópolis / SC" autocomplete="address-level2" maxlength="90"></label><label>Data prevista<input name="date" type="date"></label></div><div class="form-row"><label>Tipo de evento<select name="event"><option>Baile</option><option>Festa de cidade</option><option>Rodeio / CTG</option><option>Evento particular</option><option>Outro evento</option></select></label><label>Com quem falar<select name="contact"><option value="office" ${contact === 'office' ? 'selected' : ''}>Escritório · Shows</option><option value="nenem" ${contact === 'nenem' ? 'selected' : ''}>Neném</option></select></label></div><button class="button" type="submit">${icon('whatsapp')} Consultar disponibilidade ${icon('up-right')}</button></form><a class="modal-secondary" href="${whatsappURL(contact, 'Olá! Gostaria de informações para contratar o Grupo Os Baileiros para um evento.')}" target="_blank" rel="noopener noreferrer">Prefiro conversar direto, sem preencher</a><span class="modal-note">Os campos são opcionais. A mensagem será preparada para você revisar e enviar no WhatsApp.</span>`;
  }
  function showAction(kind, contact = 'office') {
    actionModal.dataset.kind = kind;
    $('#modal-context').textContent = ({ booking: 'Shows e eventos', press: 'Material de divulgação', instagram: 'Instagram', spotify: 'Ouça Os Baileiros', youtube: 'Canal no YouTube' })[kind] || 'Os Baileiros';
    const container = $('#modal-content');
    if (kind === 'booking') container.innerHTML = bookingHTML(contact);
    else if (kind === 'press') {
      container.innerHTML = `<div class="modal-icon">${icon('download')}</div><p class="eyebrow">MATERIAL DE DIVULGAÇÃO</p><h2 id="modal-title">SEU BAILE<br><em>BEM APRESENTADO.</em></h2><p>Fale com a produção para receber fotos oficiais, logotipo e artes atualizadas para divulgar o seu evento.</p><a class="button wide" href="${whatsappURL('office', 'Olá! Gostaria de solicitar fotos oficiais, logotipo e artes do Grupo Os Baileiros para divulgar um evento.')}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')} Solicitar à produção ${icon('up-right')}</a><span class="modal-note">A equipe envia o material adequado para a sua divulgação.</span>`;
    } else if (kind === 'instagram') {
      container.innerHTML = `<div class="modal-icon">${icon('instagram')}</div><p class="eyebrow">VEM COM A GENTE</p><h2 id="modal-title">O BAILE ACABA.<br><em>A RESENHA NÃO.</em></h2><p>Agenda, bastidores, estrada e os momentos que só quem acompanha de perto vê. Encontre a gente no <strong>@osbaileiros</strong>.</p><a class="button wide" href="${data.instagram}" target="_blank" rel="noopener noreferrer">${icon('instagram')} Acompanhar no Instagram ${icon('up-right')}</a>`;
    } else if (kind === 'spotify') {
      container.innerHTML = `<div class="modal-icon">${icon('spotify')}</div><p class="eyebrow">SUA TRILHA, NOSSO SOM</p><h2 id="modal-title">DEIXA TOCAR.<br><em>DEIXA NO REPEAT.</em></h2><p>Escute os sucessos e siga o Grupo Os Baileiros no Spotify para acompanhar as próximas faixas.</p><iframe class="spotify-embed" src="${data.spotifyEmbed}" title="Grupo Os Baileiros no Spotify" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe><a class="button wide" href="${data.spotify}" target="_blank" rel="noopener noreferrer">${icon('spotify')} Abrir no Spotify ${icon('up-right')}</a>`;
    } else if (kind === 'youtube') {
      container.innerHTML = `<div class="modal-icon">${icon('youtube')}</div><p class="eyebrow">O NOSSO PALCO NA SUA TELA</p><h2 id="modal-title">DÊ O PLAY.<br><em>CANTE JUNTO.</em></h2><p>Clipes, participações e músicas para voltar quantas vezes quiser. Inscreva-se no canal e acompanhe o grupo.</p><a class="button wide" href="${data.youtube}" target="_blank" rel="noopener noreferrer">${icon('youtube')} Assistir no YouTube ${icon('up-right')}</a><button class="modal-secondary" id="go-to-clips">Prefiro assistir aqui na página</button>`;
    } else return;
    openDialog(actionModal);
    const form = $('#booking-form');
    if (form) {
      const dateInput = $('input[name="date"]', form);
      const today = new Date();
      dateInput.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      form.addEventListener('submit', e => {
        e.preventDefault();
        const values = new FormData(form);
        const city = String(values.get('city') || '').trim();
        const date = String(values.get('date') || '');
        const formatted = date ? date.split('-').reverse().join('/') : '';
        const msg = `Olá! Vim pelo site e gostaria de contratar o Grupo Os Baileiros.\n\nTipo de evento: ${values.get('event')}${city ? '\nCidade: ' + city : ''}${formatted ? '\nData: ' + formatted : ''}\n\nPodemos conversar sobre disponibilidade e proposta?`;
        window.open(whatsappURL(String(values.get('contact')), msg), '_blank', 'noopener,noreferrer');
      });
    }
    $('#go-to-clips')?.addEventListener('click', () => { closeDialog(actionModal); $('#musica').scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' }); });
  }

  function videoFrame(id, title, muted = false) {
    const iframe = document.createElement('iframe');
    const parameters = new URLSearchParams({ autoplay: '1', mute: muted ? '1' : '0', playsinline: '1', rel: '0', enablejsapi: '1' });
    if (location.protocol.startsWith('http')) parameters.set('origin', location.origin);
    iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?${parameters}`;
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    return iframe;
  }
  function showVideo(id, title) {
    mediaModal.dataset.media = 'video';
    $('#media-title').textContent = title || 'Grupo Os Baileiros';
    const wrap = document.createElement('div');
    wrap.className = 'media-video-wrap';
    wrap.append(videoFrame(id, title || 'Grupo Os Baileiros'));
    $('#media-content').replaceChildren(wrap);
    $('#media-footer').innerHTML = `<a class="video-fallback" href="${videoURL(id)}" target="_blank" rel="noopener noreferrer">Se o vídeo não carregar, assista no YouTube ↗</a>`;
    openDialog(mediaModal);
  }
  function startMain(muted = false) {
    heroPlayer?.pauseVideo?.();
    $('#main-video').replaceChildren(videoFrame(activeClip.id, `${activeClip.title} · ${activeClip.subtitle}`, muted));
    mainPlaying = true;
    $('#video-type').textContent = `${activeClip.type} • ${activeClip.subtitle}${muted ? ' • INICIADO SEM SOM' : ''}`;
  }
  function selectClip(index) {
    activeClip = data.clips[index];
    $('#video-title').textContent = activeClip.title;
    $('#main-youtube-link').href = videoURL(activeClip.id);
    $$('.clip-card').forEach((card, i) => { card.classList.toggle('active', index === i); card.setAttribute('aria-pressed', String(index === i)); });
    startMain(false);
  }
  $('#clip-list').innerHTML = data.clips.map((clip, index) => `<button class="clip-card ${index === 0 ? 'active' : ''}" data-clip="${index}" aria-pressed="${index === 0}" aria-label="Reproduzir ${escape(clip.title)} ${escape(clip.subtitle)}"><span class="clip-thumb"><img src="${thumbnail(clip.id)}" alt="" loading="lazy" width="480" height="270">${icon('play')}</span><span class="clip-meta"><strong>${escape(clip.title)}</strong><small>${escape(clip.subtitle)}</small></span></button>`).join('');
  $('#main-play').addEventListener('click', () => startMain(false));
  $('#tracks').innerHTML = data.tracks.map(track => `<button class="track" data-play="${track.id}" data-title="${escape(track.title)} · ${escape(track.subtitle)}" aria-label="Ouvir ${escape(track.title)} ${escape(track.subtitle)}"><span class="track-cover"><img src="${thumbnail(track.id)}" alt="Capa de ${escape(track.title)}" loading="lazy" width="480" height="480"><span class="track-play">${icon('play')}</span></span><strong>${escape(track.title)}</strong><small>${escape(track.subtitle)}</small></button>`).join('');

  // Carousel: automatic advance with keyboard, touch, hover and a persistent pause control.
  const tracks = $('#tracks');
  let carouselPaused = reduceMotion.matches;
  let carouselVisible = false;
  let carouselHover = false;
  let userInteractedUntil = 0;
  function stepTracks(direction = 1) {
    const step = $('.track', tracks).getBoundingClientRect().width + parseFloat(getComputedStyle(tracks).gap || 0);
    const max = tracks.scrollWidth - tracks.clientWidth;
    let target = tracks.scrollLeft + step * direction;
    if (direction === 1 && tracks.scrollLeft >= max - 5) target = 0;
    if (direction === -1 && tracks.scrollLeft <= 5) target = max;
    tracks.scrollTo({ left: Math.max(0, Math.min(target, max)), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }
  function updateCarouselButton() {
    $('#tracks-pause').innerHTML = icon(carouselPaused ? 'play' : 'pause');
    $('#tracks-pause').setAttribute('aria-label', carouselPaused ? 'Retomar carrossel de faixas' : 'Pausar carrossel de faixas');
    $('#tracks-pause').setAttribute('aria-pressed', String(carouselPaused));
  }
  $('#tracks-pause').addEventListener('click', () => { carouselPaused = !carouselPaused; updateCarouselButton(); });
  $('#tracks-next').addEventListener('click', () => { userInteractedUntil = Date.now() + 8000; stepTracks(1); });
  $('#tracks-prev').addEventListener('click', () => { userInteractedUntil = Date.now() + 8000; stepTracks(-1); });
  tracks.addEventListener('mouseenter', () => carouselHover = true);
  tracks.addEventListener('mouseleave', () => carouselHover = false);
  tracks.addEventListener('touchstart', () => userInteractedUntil = Date.now() + 8000, { passive: true });
  tracks.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); stepTracks(e.key === 'ArrowRight' ? 1 : -1); userInteractedUntil = Date.now() + 8000; }
  });
  window.setInterval(() => {
    if (!carouselPaused && carouselVisible && !carouselHover && !tracks.contains(document.activeElement) && !document.hidden && !actionModal.open && !mediaModal.open && Date.now() > userInteractedUntil) stepTracks();
  }, 3800);
  updateCarouselButton();

  function renderGallery() {
    $('#gallery-grid').innerHTML = data.gallery.map((item, index) => `<button class="gallery-item ${item.className || ''}" data-gallery="${index}" ${galleryFilter !== 'all' && item.type !== galleryFilter ? 'hidden' : ''} aria-label="Ampliar ${escape(item.title)}"><img src="${item.src}" alt="${escape(item.alt)}" loading="lazy" width="800" height="800"><span>${escape(item.title)} ${icon('expand')}</span></button>`).join('');
    $('#gallery-grid').classList.toggle('filtered', galleryFilter !== 'all');
    enhanceImages($('#gallery-grid'));
  }
  function renderLightbox() {
    mediaModal.dataset.media = 'image';
    const item = data.gallery[galleryIndex];
    $('#media-title').textContent = item.title;
    $('#media-content').innerHTML = `<img class="lightbox-image" src="${item.src}" alt="${escape(item.alt)}">`;
    const visible = data.gallery.map((x, i) => ({ ...x, i })).filter(x => galleryFilter === 'all' || x.type === galleryFilter);
    $('#media-footer').innerHTML = `<div class="lightbox-nav"><button class="icon-button" data-gallery-step="-1" aria-label="Imagem anterior">${icon('arrow', 'rotate')}</button><span>${visible.findIndex(x => x.i === galleryIndex) + 1} / ${visible.length}</span><button class="icon-button" data-gallery-step="1" aria-label="Próxima imagem">${icon('arrow')}</button></div>`;
  }
  function stepGallery(direction) {
    const indexes = data.gallery.map((x, i) => ({ ...x, i })).filter(x => galleryFilter === 'all' || x.type === galleryFilter).map(x => x.i);
    galleryIndex = indexes[(indexes.indexOf(galleryIndex) + direction + indexes.length) % indexes.length];
    renderLightbox();
    // Keep keyboard focus inside the updated navigation.
    $(`[data-gallery-step="${direction}"]`)?.focus({ preventScroll: true });
  }
  renderGallery();

  const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });
  const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'short' });
  function renderAgenda() {
    const list = $('#agenda-list');
    if (!list) return;
    const todayKey = new Date().toISOString().slice(0, 10);
    const upcoming = (data.agenda || []).filter(item => item.date >= todayKey).sort((a, b) => a.date.localeCompare(b.date));
    if (!upcoming.length) {
      list.innerHTML = `<div class="agenda-empty"><div class="modal-icon">${icon('headphones')}</div><h3>Agenda em atualização.</h3><p>Os próximos bailes confirmados serão publicados aqui. Para consultar disponibilidade para o seu evento, fale com a produção.</p><button class="button button-outline" data-modal="booking">${icon('whatsapp')} Consultar disponibilidade</button></div>`;
      return;
    }
    list.innerHTML = upcoming.map(item => {
      const day = new Date(`${item.date}T00:00:00`);
      const dd = String(day.getDate()).padStart(2, '0');
      const month = monthFormatter.format(day).replace('.', '').toUpperCase();
      const weekday = weekdayFormatter.format(day);
      return `<div class="agenda-item"><div class="agenda-date"><strong>${dd}</strong><span>${escape(month)}</span></div><div class="agenda-info"><span class="mini-label">${escape(weekday)}</span><h3>${escape(item.venue)}</h3><p>${escape(item.city)}</p></div></div>`;
    }).join('');
  }
  renderAgenda();

  document.addEventListener('click', e => {
    const modalButton = e.target.closest('[data-modal]');
    const playButton = e.target.closest('[data-play]');
    const clipButton = e.target.closest('[data-clip]');
    const filterButton = e.target.closest('[data-filter]');
    const galleryButton = e.target.closest('[data-gallery]');
    const galleryStep = e.target.closest('[data-gallery-step]');
    const contactButton = e.target.closest('[data-contact]');
    if (modalButton) showAction(modalButton.dataset.modal);
    else if (playButton) showVideo(playButton.dataset.play, playButton.dataset.title);
    else if (clipButton) selectClip(Number(clipButton.dataset.clip));
    else if (contactButton) showAction('booking', contactButton.dataset.contact);
    else if (filterButton) {
      galleryFilter = filterButton.dataset.filter;
      $$('[data-filter]').forEach(button => { const selected = button === filterButton; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
      renderGallery();
    } else if (galleryButton) { galleryIndex = Number(galleryButton.dataset.gallery); renderLightbox(); openDialog(mediaModal); }
    else if (galleryStep) stepGallery(Number(galleryStep.dataset.galleryStep));
  });
  mediaModal.addEventListener('keydown', e => {
    if (!$('.lightbox-image', mediaModal)) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); stepGallery(e.key === 'ArrowRight' ? 1 : -1); }
  });

  function updateHeroControl() {
    $('#hero-toggle').innerHTML = icon(heroPaused ? 'play' : 'pause');
    $('#hero-toggle').setAttribute('aria-label', heroPaused ? 'Reproduzir vídeo de fundo' : 'Pausar vídeo de fundo');
    $('#hero-toggle').setAttribute('aria-pressed', String(heroPaused));
  }
  let heroSoundEnabled = false;
  let heroSoundRequested = false;
  function fadeInHeroSound(player) {
    if (!player || heroSoundEnabled) return;
    heroSoundEnabled = true;
    player.unMute();
    player.setVolume(0);
    const frame = player.getIframe?.();
    if (frame) frame.title = 'Meio Bruta, vídeo de fundo';
    let volume = 0;
    const target = 55;
    const step = window.setInterval(() => {
      volume = Math.min(target, volume + 6);
      player.setVolume(volume);
      if (volume >= target) window.clearInterval(step);
    }, 70);
  }
  function requestHeroSound() {
    if (heroSoundRequested || heroPaused || reduceMotion.matches || saveData) return;
    heroSoundRequested = true;
    if (heroPlayer && heroVisible) fadeInHeroSound(heroPlayer);
  }
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(evt => document.addEventListener(evt, requestHeroSound, { once: true, passive: true }));
  function createHeroPlayer() {
    if (!window.YT?.Player || heroPlayer) return;
    const host = document.createElement('div');
    host.id = 'hero-youtube';
    $('#hero-video').append(host);
    heroPlayer = new window.YT.Player('hero-youtube', {
      videoId: data.heroVideo,
      playerVars: { autoplay: heroPaused ? 0 : 1, mute: 1, playsinline: 1, controls: 0, disablekb: 1, loop: 1, playlist: data.heroVideo, rel: 0, start: 16, cc_load_policy: 0, iv_load_policy: 3, ...(location.protocol.startsWith('http') ? { origin: location.origin } : {}) },
      events: {
        onReady(event) { event.target.mute(); const frame = event.target.getIframe(); frame.tabIndex = -1; frame.title = 'Meio Bruta, vídeo de fundo sem som'; if (!heroPaused && heroVisible) event.target.playVideo(); if (heroSoundRequested) fadeInHeroSound(event.target); },
        onStateChange(event) { if (event.data === 1) $('#hero-video').classList.add('playing'); },
        onError() { $('#hero-video').classList.remove('playing'); $('#hero-toggle').hidden = true; }
      }
    });
  }
  function loadHeroVideo() {
    if (window.YT?.Player) return createHeroPlayer();
    if ($('#youtube-api')) return;
    window.onYouTubeIframeAPIReady = createHeroPlayer;
    const script = document.createElement('script');
    script.id = 'youtube-api'; script.src = 'https://www.youtube.com/iframe_api'; script.async = true;
    script.onerror = () => $('#hero-toggle').hidden = true;
    document.head.append(script);
  }
  $('#hero-toggle').addEventListener('click', () => {
    heroPaused = !heroPaused;
    updateHeroControl();
    if (heroPaused) heroPlayer?.pauseVideo?.();
    else { $('#hero-video').classList.add('user-enabled'); loadHeroVideo(); heroPlayer?.playVideo?.(); }
  });
  updateHeroControl();
  if (!heroPaused) loadHeroVideo();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible && !heroPaused && !document.hidden && !mediaModal.open && !actionModal.open) heroPlayer?.playVideo?.();
      else heroPlayer?.pauseVideo?.();
    }, { threshold: .1 }).observe($('#inicio'));
    new IntersectionObserver(entries => { carouselVisible = entries[0].isIntersecting; }, { threshold: .2 }).observe(tracks);
    new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      if (visible && !mainPlaying && !reduceMotion.matches && !saveData && !mediaModal.open && !actionModal.open) startMain(true);
      else if (!visible) pauseMain();
    }, { threshold: .4 }).observe($('#main-video'));
    if (!reduceMotion.matches) {
      const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.remove('pending'); reveal.unobserve(entry.target); }
      }), { threshold: .06 });
      $$('.about-grid,.road-story,.title-row,.podcast-section,.contact-inner').forEach(element => { element.classList.add('reveal', 'pending'); reveal.observe(element); });
    }
  } else carouselVisible = true;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseAll();
    else if (heroVisible && !heroPaused && !mediaModal.open && !actionModal.open) heroPlayer?.playVideo?.();
  });
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) { heroPaused = true; carouselPaused = true; pauseAll(); updateCarouselButton(); updateHeroControl(); $$('.reveal.pending').forEach(el => el.classList.remove('pending')); }
  });
  enhanceImages();
})();
