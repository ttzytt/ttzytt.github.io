(() => {
  const currentLanguageLinks = [...document.querySelectorAll('.current-language')]
    .map(icon => icon.closest('a'))
    .filter(Boolean);

  for (const link of currentLanguageLinks) {
    link.addEventListener('click', event => event.preventDefault());
  }

  const switchLinks = [...document.querySelectorAll('.multiple-language-switch')]
    .map(icon => icon.closest('a'))
    .filter(Boolean);

  for (const switchLink of switchLinks) switchLink.addEventListener('click', event => {
    event.preventDefault();

    const { pathname, search, hash } = window.location;
    const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
    let targetPath;

    if (isEnglish) {
      targetPath = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
    } else {
      targetPath = `/en${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
    }

    window.location.assign(`${targetPath}${search}${hash}`);
  });
})();
