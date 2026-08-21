(() => {
  const tabs = [...document.querySelectorAll('.date-tab')];
  const panels = [...document.querySelectorAll('.schedule-panel')];
  const categoryButtons = [...document.querySelectorAll('[data-category]')].filter((element) => element.matches('button'));
  const stageButtons = [...document.querySelectorAll('[data-stage-filter]')];
  const countNode = document.getElementById('visibleSessionCount');
  let activeCategory = 'all';
  let activeStage = 'all';

  function filterSessions() {
    let count = 0;
    panels.forEach((panel) => {
      panel.querySelectorAll('.session-card').forEach((card) => {
        const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
        const cardStage = panel.dataset.panel === '1028' ? 'a' : 'b';
        const stageMatch = activeStage === 'all' || cardStage === activeStage;
        const visible = categoryMatch && stageMatch;
        card.hidden = !visible;
        if (!panel.hidden && visible) count += 1;
      });
    });
    if (countNode) countNode.textContent = String(count);
  }

  function showAllStages(shouldScroll = false) {
    tabs.forEach((tab) => {
      tab.classList.remove('is-active');
      tab.setAttribute('aria-selected', 'false');
    });
    panels.forEach((panel) => {
      panel.classList.add('is-active');
      panel.hidden = false;
    });
    filterSessions();
    if (shouldScroll) {
      document.getElementById('panel-1028')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showDay(day, shouldScroll = false) {
    tabs.forEach((tab) => {
      const active = tab.dataset.day === day;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel) => {
      const active = panel.dataset.panel === day;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
    filterSessions();
    if (shouldScroll) {
      document.getElementById(`panel-${day}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => {
    activeStage = tab.dataset.day === '1028' ? 'a' : 'b';
    stageButtons.forEach((item) => item.classList.toggle('is-active', item.dataset.stageFilter === activeStage));
    showDay(tab.dataset.day, true);
  }));

  categoryButtons.forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    filterSessions();
  }));

  stageButtons.forEach((button) => button.addEventListener('click', () => {
    activeStage = button.dataset.stageFilter;
    stageButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    if (activeStage === 'all') showAllStages(true);
    else if (activeStage === 'a') showDay('1028', true);
    else if (activeStage === 'b') showDay('1029', true);
  }));

  document.querySelectorAll('.featured-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      const targetId = card.getAttribute('href')?.slice(1);
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;
      event.preventDefault();
      showDay(targetId.startsWith('session-b') ? '1029' : '1028');
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    });
  });

  showAllStages();
})();
