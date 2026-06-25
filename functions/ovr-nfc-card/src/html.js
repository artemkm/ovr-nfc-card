const { formatCardPrintNumber } = require('./member-numbers');

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}

function layout(title, body) {
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f5f7f8;
      --panel: #ffffff;
      --text: #1d2429;
      --muted: #64727d;
      --line: #d8e0e5;
      --brand: #0076bd;
      --brand-dark: #005f98;
      --danger: #b42318;
      --ok-bg: #dff4ee;
      --warn-bg: #fff1d6;
      --no-bg: #eef1f3;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.45;
    }

    button, input {
      font: inherit;
    }

    button {
      border: 0;
      border-radius: 6px;
      padding: 10px 14px;
      background: var(--brand);
      color: #fff;
      cursor: pointer;
      min-height: 40px;
    }

    button:hover { background: var(--brand-dark); }
    button.secondary { background: #e8eef1; color: var(--text); }
    button.secondary:hover { background: #dce5e9; }
    button.danger { background: var(--danger); }
    button.small { min-height: 34px; padding: 7px 10px; }

    input {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 11px 12px;
      background: #fff;
      color: var(--text);
    }

    .page {
      width: min(960px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 40px;
    }

    .surface {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 22px;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }

    .brand-lockup {
      display: flex;
      align-items: flex-start;
      gap: 22px;
      min-width: 0;
    }

    .brand-logo {
      width: auto;
      max-width: 94px;
      max-height: 32px;
      height: auto;
      flex: 0 0 auto;
      display: block;
    }

    .brand-title {
      color: var(--brand);
      margin-bottom: 4px;
    }

    .public-org-lockup {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin: 2px 0 0;
    }

    .public-org-mark {
      width: 34px;
      height: 34px;
      object-fit: contain;
      flex: 0 0 auto;
      display: block;
    }

    .profile-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 18px;
      align-items: start;
    }

    .public-profile-top {
      align-items: flex-start;
      gap: 22px;
    }

    .public-profile-info {
      min-width: 0;
    }

    .public-member-status {
      margin-top: 12px;
    }

    .public-profile-photo {
      margin-left: auto;
      width: 124px;
      height: 124px;
    }

    .profile-photo,
    .profile-photo-placeholder {
      width: 124px;
      height: 124px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: #eef1f3;
      object-fit: cover;
      display: block;
    }

    .profile-photo-placeholder {
      display: grid;
      place-items: center;
      color: var(--muted);
      font-size: 13px;
      text-align: center;
      padding: 10px;
    }

    .photo-panel {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 16px;
      align-items: start;
      margin: 0 0 18px;
    }

    .photo-controls {
      display: grid;
      gap: 10px;
      justify-items: start;
    }

    .photo-controls input[type="file"] {
      max-width: 280px;
      padding: 9px;
    }

    h1, h2, h3, p { margin-top: 0; }
    h1 { font-size: 28px; line-height: 1.15; margin-bottom: 8px; }
    h2 { font-size: 22px; margin-bottom: 14px; }
    h3 { font-size: 16px; margin-bottom: 8px; }

    .muted { color: var(--muted); }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .field { border-top: 1px solid var(--line); padding-top: 12px; }
    .field span { display: block; color: var(--muted); font-size: 13px; margin-bottom: 3px; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 999px;
      padding: 5px 9px;
      font-size: 13px;
      white-space: nowrap;
    }

    .badge.ok { background: var(--ok-bg); color: #075e54; }
    .badge.no { background: var(--no-bg); color: #4b5962; }
    .badge.warn { background: var(--warn-bg); color: #8a4b00; }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
      margin-top: 16px;
    }

    .contact-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      border-radius: 6px;
      padding: 10px 14px;
      background: var(--brand);
      color: #fff;
      text-decoration: none;
      min-height: 40px;
    }

    .contact-link:hover {
      background: var(--brand-dark);
    }

    .contact-link svg {
      width: 18px;
      height: 18px;
      flex: 0 0 auto;
    }

    .url-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      margin-top: 12px;
    }

    .qr-block {
      display: grid;
      justify-items: center;
      gap: 8px;
      margin-top: 20px;
      padding-top: 18px;
      border-top: 1px solid var(--line);
      text-align: center;
    }

    .qr-code {
      width: min(260px, 70vw);
      aspect-ratio: 1;
    }

    .qr-code svg {
      display: block;
      width: 100%;
      height: auto;
    }

    .result-list {
      display: grid;
      gap: 8px;
      margin-top: 14px;
    }

    .list-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-top: 18px;
    }

    .pager {
      display: grid;
      grid-template-columns: auto auto auto;
      gap: 10px;
      align-items: center;
    }

    .result {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      width: 100%;
      text-align: left;
      background: #fff;
      color: var(--text);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
    }

    .result:hover { background: #f7fbfb; }
    .result strong { display: block; }
    .result small { color: var(--muted); }

    .hidden { display: none !important; }
    .login { max-width: 420px; margin: 12vh auto 0; }
    .login form { display: grid; gap: 12px; }
    .error { color: var(--danger); margin-bottom: 12px; }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(10, 20, 24, .45);
    }

    .modal {
      width: min(420px, 100%);
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid var(--line);
      box-shadow: 0 18px 60px rgba(0, 0, 0, .2);
    }

    @media (max-width: 680px) {
      .page { width: min(100% - 20px, 960px); padding-top: 16px; }
      .surface { padding: 16px; }
      .topbar { align-items: flex-start; flex-direction: column; }
      .brand-lockup { flex-direction: column; gap: 8px; }
      .brand-logo { max-width: 104px; max-height: 36px; }
      .public-org-mark { width: 32px; height: 32px; }
      .profile-head,
      .photo-panel {
        grid-template-columns: 1fr;
      }
      .public-profile-top {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: start;
      }
      .public-profile-info {
        grid-column: 1;
      }
      .public-profile-photo {
        grid-column: 2;
        margin-left: 0;
      }
      .profile-photo,
      .profile-photo-placeholder {
        width: 112px;
        height: 112px;
      }
      .list-head { align-items: stretch; flex-direction: column; }
      .pager {
        grid-template-columns: 1fr 1fr;
        width: 100%;
      }
      .pager #pageInfo {
        grid-column: 1 / -1;
        grid-row: 1;
      }
      .pager #prevPage {
        grid-column: 1;
        grid-row: 2;
        justify-self: start;
      }
      .pager #nextPage {
        grid-column: 2;
        grid-row: 2;
        justify-self: end;
      }
      .grid { grid-template-columns: 1fr; }
      .url-row { grid-template-columns: 1fr; }
      .result { grid-template-columns: 1fr; }
      h1 { font-size: 24px; }
    }

    @media (max-width: 520px) {
      .public-profile-top {
        grid-template-columns: 1fr;
      }
      .public-profile-photo {
        grid-column: 1;
        margin-top: 6px;
      }
    }
  </style>
</head>
<body>${body}</body>
</html>`;
}

function renderLoginPage(error = '') {
  return layout('Вход в админку ОВР NFC', `
    <main class="page">
      <section class="surface login">
        <div class="brand-lockup" style="margin-bottom: 14px;">
          <img class="brand-logo" src="/assets/ovr-logo.png" alt="Общество врачей России">
          <div>
            <h1 class="brand-title">ОВР NFC</h1>
            <p class="muted" style="margin-bottom: 0;">Техническая админка MVP</p>
          </div>
        </div>
        ${error ? `<p class="error">${escapeHtml(error)}</p>` : ''}
        <form method="post" action="/admin/login">
          <label>
            <span class="muted">Логин</span>
            <input name="username" autocomplete="username" autofocus>
          </label>
          <label>
            <span class="muted">Пароль</span>
            <input name="password" type="password" autocomplete="current-password">
          </label>
          <button type="submit">Войти</button>
        </form>
      </section>
    </main>
  `);
}

function renderAdminPage() {
  return layout('Админка ОВР NFC', `
    <main class="page">
      <div class="topbar">
        <div class="brand-lockup">
          <img class="brand-logo" src="/assets/ovr-logo.png" alt="Общество врачей России">
          <div>
            <h1 class="brand-title">ОВР NFC</h1>
            <p class="muted">Поиск участника и выпуск NFC-ссылки</p>
          </div>
        </div>
        <form method="post" action="/admin/logout">
          <button class="secondary small" type="submit">Выйти</button>
        </form>
      </div>

      <section id="searchView" class="surface">
        <h2>Поиск участника</h2>
        <input id="searchInput" type="search" placeholder="ФИО, членский номер, специальность или город" autocomplete="off">
        <div class="list-head">
          <div id="searchHint" class="muted">Все участники в порядке добавления в базу.</div>
          <div id="pager" class="pager">
            <button id="prevPage" class="secondary small" type="button">Назад</button>
            <span id="pageInfo" class="muted"></span>
            <button id="nextPage" class="secondary small" type="button">Вперед</button>
          </div>
        </div>
        <div id="results" class="result-list"></div>
      </section>

      <section id="memberView" class="surface hidden">
        <div class="topbar">
          <div>
            <button id="backButton" class="secondary small" type="button">Назад к поиску</button>
          </div>
          <span id="memberNfcBadge" class="badge"></span>
        </div>
        <div id="memberCard"></div>
      </section>
    </main>

    <div id="confirmModal" class="modal-backdrop hidden" role="dialog" aria-modal="true">
      <div class="modal">
        <h2>Перегенерировать NFC?</h2>
        <p>Старый номер будет стерт, вы уверены?</p>
        <div class="actions">
          <button id="confirmYes" class="danger" type="button">Да, перегенерировать</button>
          <button id="confirmNo" class="secondary" type="button">Нет</button>
        </div>
      </div>
    </div>

    <script>
      const searchView = document.querySelector('#searchView');
      const memberView = document.querySelector('#memberView');
      const searchInput = document.querySelector('#searchInput');
      const searchHint = document.querySelector('#searchHint');
      const results = document.querySelector('#results');
      const pager = document.querySelector('#pager');
      const prevPage = document.querySelector('#prevPage');
      const nextPage = document.querySelector('#nextPage');
      const pageInfo = document.querySelector('#pageInfo');
      const memberCard = document.querySelector('#memberCard');
      const memberNfcBadge = document.querySelector('#memberNfcBadge');
      const backButton = document.querySelector('#backButton');
      const modal = document.querySelector('#confirmModal');
      const confirmYes = document.querySelector('#confirmYes');
      const confirmNo = document.querySelector('#confirmNo');
      const PHOTO_PLACEHOLDER = '<div class="profile-photo-placeholder">Фото не загружено</div>';

      let selectedMemberNumber = '';
      let regenerateTarget = '';
      let searchTimer = null;
      let currentPage = 1;
      let totalPages = 1;

      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(runSearch, 180);
      });

      prevPage.addEventListener('click', () => {
        if (currentPage > 1) loadMembersPage(currentPage - 1);
      });

      nextPage.addEventListener('click', () => {
        if (currentPage < totalPages) loadMembersPage(currentPage + 1);
      });

      backButton.addEventListener('click', () => {
        memberView.classList.add('hidden');
        searchView.classList.remove('hidden');
        searchInput.focus();
      });

      confirmNo.addEventListener('click', closeModal);
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
      });

      confirmYes.addEventListener('click', async () => {
        if (!regenerateTarget) return;
        await regenerateCard(regenerateTarget);
        closeModal();
      });

      loadMembersPage(1);

      async function loadMembersPage(page) {
        searchHint.textContent = 'Загружаю участников...';
        const response = await fetch('/admin/api/members?page=' + encodeURIComponent(page));
        const data = await response.json();

        currentPage = data.page;
        totalPages = data.total_pages;
        renderResults(data.results);
        searchHint.textContent = 'Все участники в порядке добавления в базу.';
        pager.classList.remove('hidden');
        pageInfo.textContent = 'Страница ' + data.page + ' из ' + data.total_pages + ' · всего ' + data.total;
        prevPage.disabled = data.page <= 1;
        nextPage.disabled = data.page >= data.total_pages;
      }

      async function runSearch() {
        const query = searchInput.value.trim();
        results.innerHTML = '';

        if (!query) {
          loadMembersPage(currentPage);
          return;
        }

        searchHint.textContent = 'Ищу...';
        pager.classList.add('hidden');
        const response = await fetch('/admin/api/search?q=' + encodeURIComponent(query));
        const data = await response.json();

        if (!data.results.length) {
          searchHint.textContent = 'Ничего не найдено.';
          return;
        }

        searchHint.textContent = '';
        renderResults(data.results);
      }

      function renderResults(items) {
        results.innerHTML = items.map((item) => {
          const badge = item.has_nfc
            ? '<span class="badge ok">NFC есть</span>'
            : '<span class="badge no">NFC нет</span>';
          const active = item.is_active_member ? '' : ' · членство неактивно';
          return '<button class="result" type="button" data-member="' + escapeAttr(item.member_number) + '">' +
            '<span><strong>' + escapeHtml(item.full_name) + '</strong>' +
            '<small>' + escapeHtml(item.member_number + ' · ' + item.specialty + ' · ' + item.city + active) + '</small></span>' +
            badge +
          '</button>';
        }).join('');

        results.querySelectorAll('[data-member]').forEach((button) => {
          button.addEventListener('click', () => openMember(button.dataset.member));
        });
      }

      async function openMember(memberNumber) {
        selectedMemberNumber = memberNumber;
        const response = await fetch('/admin/api/members/' + encodeURIComponent(memberNumber));
        const data = await response.json();

        if (!data.profile) {
          alert('Участник не найден');
          return;
        }

        renderMember(data);
        searchView.classList.add('hidden');
        memberView.classList.remove('hidden');
      }

      function renderMember(data) {
        const profile = data.profile;
        const card = data.card;
        const hasCard = Boolean(card && card.status === 'active');
        const cardPrintNumber = formatCardPrintNumber(profile.member_number);
        const hasQrCode = Boolean(card && card.qr_svg);

        memberNfcBadge.className = 'badge ' + (hasCard ? 'ok' : 'no');
        memberNfcBadge.textContent = hasCard ? 'NFC есть' : 'NFC нет';

        const fields = [
          ['Членский номер', profile.member_number],
          ['Номер на пластиковой карте', cardPrintNumber || 'Не задан'],
          ['Специальность', profile.specialty],
          ['Научное звание', profile.scientific_title || '-'],
          ['Научная степень', profile.academic_degree || '-'],
          ['Должность', profile.position],
          ['Город', profile.city],
          ['Телефон', profile.public_phone || 'Не указан'],
          ['Email', profile.public_email || 'Не указан'],
          ['Статус членства', profile.is_active_member ? 'Действующий член' : 'Членство неактивно']
        ];

        const publicUrl = hasCard ? card.public_url : '';
        const photoBlock = profile.photo_url
          ? '<img class="profile-photo" src="' + escapeAttr(profile.photo_url) + '" alt="Фото участника">'
          : PHOTO_PLACEHOLDER;
        const photoPanel =
          '<div class="photo-panel">' +
            photoBlock +
            '<div class="photo-controls">' +
              '<h3>Фотография</h3>' +
              '<input id="photoInput" type="file" accept="image/png,image/jpeg,image/webp">' +
              '<div class="actions" style="margin-top: 0;">' +
                '<button id="uploadPhotoButton" type="button">' + (profile.photo_url ? 'Заменить фото' : 'Загрузить фото') + '</button>' +
                (profile.photo_url ? '<button id="deletePhotoButton" class="secondary" type="button">Удалить фото</button>' : '') +
              '</div>' +
              '<span id="photoStatus" class="muted">PNG, JPG или WebP до 5 МБ</span>' +
            '</div>' +
          '</div>';
        const qrBlock = hasCard
          ? '<div class="qr-block">' +
              '<h3>QR-код визитки</h3>' +
              '<div class="qr-code">' + (hasQrCode ? card.qr_svg : '') + '</div>' +
              '<span class="muted">' + (hasQrCode ? 'QR-код сгенерирован' : 'QR-код не сгенерирован') + '</span>' +
            '</div>'
          : '';
        const cardBlock = hasCard
          ? '<h3>NFC-ссылка</h3>' +
            '<div class="url-row">' +
              '<input id="publicUrl" readonly value="' + escapeAttr(publicUrl) + '">' +
              '<button id="copyButton" type="button">Скопировать</button>' +
            '</div>' +
            '<div class="actions">' +
              '<button id="regenerateButton" class="danger" type="button">Перегенерировать</button>' +
              '<span class="muted">Сканирований: ' + Number(card.scan_count || 0) + '</span>' +
            '</div>' +
            qrBlock
          : '<div class="actions"><button id="generateButton" type="button">Сгенерировать NFC</button></div>';

        memberCard.innerHTML =
          '<h2>' + escapeHtml(profile.full_name) + '</h2>' +
          photoPanel +
          '<div class="grid">' +
            fields.map(([label, value]) => '<div class="field"><span>' + escapeHtml(label) + '</span>' + escapeHtml(value) + '</div>').join('') +
          '</div>' +
          '<div style="margin-top: 20px;">' + cardBlock + '</div>';

        const generateButton = document.querySelector('#generateButton');
        const regenerateButton = document.querySelector('#regenerateButton');
        const copyButton = document.querySelector('#copyButton');
        const uploadPhotoButton = document.querySelector('#uploadPhotoButton');
        const deletePhotoButton = document.querySelector('#deletePhotoButton');

        if (generateButton) {
          generateButton.addEventListener('click', () => generateCard(profile.member_number));
        }

        if (regenerateButton) {
          regenerateButton.addEventListener('click', () => {
            regenerateTarget = profile.member_number;
            modal.classList.remove('hidden');
          });
        }

        if (copyButton) {
          copyButton.addEventListener('click', copyPublicUrl);
        }

        if (uploadPhotoButton) {
          uploadPhotoButton.addEventListener('click', () => uploadPhoto(profile.member_number));
        }

        if (deletePhotoButton) {
          deletePhotoButton.addEventListener('click', () => deletePhoto(profile.member_number));
        }
      }

      async function generateCard(memberNumber) {
        const response = await fetch('/admin/api/members/' + encodeURIComponent(memberNumber) + '/card/generate', { method: 'POST' });
        const data = await response.json();
        renderMember(data);
      }

      async function regenerateCard(memberNumber) {
        const response = await fetch('/admin/api/members/' + encodeURIComponent(memberNumber) + '/card/regenerate', { method: 'POST' });
        const data = await response.json();
        renderMember(data);
      }

      async function copyPublicUrl() {
        const input = document.querySelector('#publicUrl');
        await navigator.clipboard.writeText(input.value);
        const button = document.querySelector('#copyButton');
        const original = button.textContent;
        button.textContent = 'Скопировано';
        setTimeout(() => { button.textContent = original; }, 1200);
      }

      async function uploadPhoto(memberNumber) {
        const input = document.querySelector('#photoInput');
        const status = document.querySelector('#photoStatus');

        if (!input.files.length) {
          status.textContent = 'Выберите файл фотографии';
          return;
        }

        const formData = new FormData();
        formData.append('photo', input.files[0]);
        status.textContent = 'Загружаю...';

        const response = await fetch('/admin/api/members/' + encodeURIComponent(memberNumber) + '/photo', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (!response.ok) {
          status.textContent = data.error || 'Не удалось загрузить фото';
          return;
        }

        renderMember(data);
      }

      async function deletePhoto(memberNumber) {
        const response = await fetch('/admin/api/members/' + encodeURIComponent(memberNumber) + '/photo', {
          method: 'DELETE'
        });
        const data = await response.json();
        renderMember(data);
      }

      function closeModal() {
        regenerateTarget = '';
        modal.classList.add('hidden');
      }

      function escapeHtml(value) {
        return String(value ?? '')
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#039;');
      }

      function escapeAttr(value) {
        return escapeHtml(value).replaceAll('\`', '&#096;');
      }

      function formatCardPrintNumber(memberNumber) {
        const digits = String(memberNumber || '').replace(/\\D/g, '');
        return digits.length === 8 ? digits.slice(0, 4) + ' ' + digits.slice(4) : '';
      }
    </script>
  `);
}

function renderPublicCardPage(profile, card) {
  const memberStatus = profile.is_active_member ? 'Действующий член общества' : 'Членство неактивно';
  const cardPrintNumber = formatCardPrintNumber(profile.member_number);
  const contactUrl = `/c/${encodeURIComponent(card.token)}/contact.vcf`;
  const qrBlock = card.qr_svg
    ? `<div class="qr-block">
        <h2>QR-код визитки</h2>
        <div class="qr-code">${card.qr_svg}</div>
      </div>`
    : '';

  return layout(`${profile.full_name} | ОВР`, `
    <main class="page">
      <section class="surface">
        <div class="topbar public-profile-top">
          <div class="public-profile-info">
            <h1>${escapeHtml(profile.full_name)}</h1>
            <p class="muted public-org-lockup">
              <img class="public-org-mark" src="/assets/ovr-mark.png" alt="">
              <span>Общество врачей России</span>
            </p>
            <div class="public-member-status">
              <span class="badge ${profile.is_active_member ? 'ok' : 'warn'}">${escapeHtml(memberStatus)}</span>
            </div>
          </div>
          ${profile.photo_url ? `<img class="profile-photo public-profile-photo" src="${escapeAttr(profile.photo_url)}" alt="Фото участника">` : ''}
        </div>
        <div class="grid">
          <div class="field"><span>Членский номер</span>${escapeHtml(profile.member_number)}</div>
          ${cardPrintNumber ? `<div class="field"><span>Номер на пластиковой карте</span>${escapeHtml(cardPrintNumber)}</div>` : ''}
          <div class="field"><span>Научное звание</span>${escapeHtml(profile.scientific_title || '-')}</div>
          <div class="field"><span>Научная степень</span>${escapeHtml(profile.academic_degree || '-')}</div>
          <div class="field"><span>Должность</span>${escapeHtml(profile.position)}</div>
          <div class="field"><span>Город</span>${escapeHtml(profile.city)}</div>
          ${profile.public_phone ? `<div class="field"><span>Телефон</span>${escapeHtml(profile.public_phone)}</div>` : ''}
          ${profile.public_email ? `<div class="field"><span>Email</span>${escapeHtml(profile.public_email)}</div>` : ''}
        </div>
        <div class="actions">
          <a class="contact-link" href="${escapeAttr(contactUrl)}">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            <span>Добавить в контакты</span>
          </a>
        </div>
        ${qrBlock}
      </section>
    </main>
  `);
}

function renderMessagePage(title, message) {
  return layout(title, `
    <main class="page">
      <section class="surface">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(message)}</p>
      </section>
    </main>
  `);
}

module.exports = {
  renderAdminPage,
  renderLoginPage,
  renderMessagePage,
  renderPublicCardPage
};
