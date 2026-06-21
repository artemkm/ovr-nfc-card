function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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
      --brand: #0f766e;
      --brand-dark: #115e59;
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

    .url-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      margin-top: 12px;
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
      .grid { grid-template-columns: 1fr; }
      .url-row { grid-template-columns: 1fr; }
      .result { grid-template-columns: 1fr; }
      h1 { font-size: 24px; }
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
        <h1>ОВР NFC</h1>
        <p class="muted">Техническая админка MVP</p>
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
        <div>
          <h1>ОВР NFC</h1>
          <p class="muted">Поиск участника и выпуск NFC-ссылки</p>
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
          <div id="pager" class="actions" style="margin-top: 0;">
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

        memberNfcBadge.className = 'badge ' + (hasCard ? 'ok' : 'no');
        memberNfcBadge.textContent = hasCard ? 'NFC есть' : 'NFC нет';

        const fields = [
          ['Членский номер', profile.member_number],
          ['Специальность', profile.specialty],
          ['Должность', profile.position],
          ['Город', profile.city],
          ['Телефон', profile.public_phone || 'Не указан'],
          ['Email', profile.public_email || 'Не указан'],
          ['Статус членства', profile.is_active_member ? 'Активен' : 'Неактивен']
        ];

        const publicUrl = hasCard ? card.public_url : '';
        const cardBlock = hasCard
          ? '<h3>NFC-ссылка</h3>' +
            '<div class="url-row">' +
              '<input id="publicUrl" readonly value="' + escapeAttr(publicUrl) + '">' +
              '<button id="copyButton" type="button">Скопировать</button>' +
            '</div>' +
            '<div class="actions">' +
              '<button id="regenerateButton" class="danger" type="button">Перегенерировать</button>' +
              '<span class="muted">Сканирований: ' + Number(card.scan_count || 0) + '</span>' +
            '</div>'
          : '<div class="actions"><button id="generateButton" type="button">Сгенерировать NFC</button></div>';

        memberCard.innerHTML =
          '<h2>' + escapeHtml(profile.full_name) + '</h2>' +
          '<div class="grid">' +
            fields.map(([label, value]) => '<div class="field"><span>' + escapeHtml(label) + '</span>' + escapeHtml(value) + '</div>').join('') +
          '</div>' +
          '<div style="margin-top: 20px;">' + cardBlock + '</div>';

        const generateButton = document.querySelector('#generateButton');
        const regenerateButton = document.querySelector('#regenerateButton');
        const copyButton = document.querySelector('#copyButton');

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
    </script>
  `);
}

function renderPublicCardPage(profile, card) {
  const memberStatus = profile.is_active_member ? 'Активный член общества' : 'Членство неактивно';

  return layout(`${profile.full_name} | ОВР`, `
    <main class="page">
      <section class="surface">
        <div class="topbar">
          <div>
            <h1>${escapeHtml(profile.full_name)}</h1>
            <p class="muted">Общество врачей России</p>
          </div>
          <span class="badge ${profile.is_active_member ? 'ok' : 'warn'}">${escapeHtml(memberStatus)}</span>
        </div>
        <div class="grid">
          <div class="field"><span>Членский номер</span>${escapeHtml(profile.member_number)}</div>
          <div class="field"><span>Специальность</span>${escapeHtml(profile.specialty)}</div>
          <div class="field"><span>Должность</span>${escapeHtml(profile.position)}</div>
          <div class="field"><span>Город</span>${escapeHtml(profile.city)}</div>
          ${profile.public_phone ? `<div class="field"><span>Телефон</span>${escapeHtml(profile.public_phone)}</div>` : ''}
          ${profile.public_email ? `<div class="field"><span>Email</span>${escapeHtml(profile.public_email)}</div>` : ''}
        </div>
        <p class="muted" style="margin-top: 20px;">NFC-карта проверена. Открытий: ${Number(card.scan_count || 0) + 1}</p>
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
