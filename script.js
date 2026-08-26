(() => {
  "use strict";

  /* ============================================================
     NAV: scroll shadow + mobile toggle
     ============================================================ */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Buka menu');
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Buka menu');
      navToggle.focus();
    }
  });

  /* ============================================================
     SCROLLSPY — highlight active nav link
     ============================================================ */
  const spySections = ['iman', 'islam', 'ihsan', 'hubungan', 'perilaku', 'uji']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const spyLinks = navLinks.querySelectorAll('a');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        spyLinks.forEach(a => a.classList.toggle('current', a.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  spySections.forEach(section => spyObserver.observe(section));

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  const revealTargets = document.querySelectorAll(
    '.kicker, .chapter h2, .lead, .unsur-card, .tri-item, .flip-card, ' +
    '.hadith-card, .tingkat-card, .diagram-wrap, .analogi-card, .tabs, ' +
    '.hikmah-card, .quiz-box, .pull-quote'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => io.observe(el));

  /* ============================================================
     FLIP CARDS — Rukun Iman & Rukun Islam
     ============================================================ */
  const rukunIman = [
    { title: 'Allah SWT', text: 'Meyakini keesaan Allah sebagai satu-satunya Pencipta, Pemilik, dan Pengatur alam semesta.' },
    { title: 'Malaikat', text: 'Meyakini keberadaan makhluk gaib yang senantiasa taat menjalankan tugas dari Allah.' },
    { title: 'Kitab-kitab Allah', text: 'Meyakini kitab suci yang diturunkan kepada para rasul, dengan Al-Qur\u2019an sebagai penyempurna.' },
    { title: 'Rasul-rasul Allah', text: 'Meyakini para utusan yang membawa wahyu dan menjadi teladan bagi umat manusia.' },
    { title: 'Hari Akhir', text: 'Meyakini adanya hari kiamat, kebangkitan, dan pertanggungjawaban atas segala amal.' },
    { title: 'Qada & Qadar', text: 'Meyakini ketetapan dan takdir Allah, baik yang terasa baik maupun yang terasa berat.' },
  ];

  const rukunIslam = [
    { title: 'Syahadat', text: 'Bersaksi bahwa tiada Tuhan selain Allah dan Muhammad adalah utusan-Nya — pintu masuk keislaman.' },
    { title: 'Shalat', text: 'Mendirikan shalat lima waktu sebagai tiang agama dan penghubung langsung dengan Allah.' },
    { title: 'Zakat', text: 'Menunaikan hak orang lain dari harta yang dimiliki, wujud kepedulian sosial dalam Islam.' },
    { title: 'Puasa Ramadan', text: 'Menahan diri dari yang membatalkan puasa untuk melatih kesabaran dan ketakwaan.' },
    { title: 'Haji', text: 'Menunaikan ibadah haji ke Baitullah bagi yang mampu secara fisik maupun materi.' },
  ];

  function buildFlipGrid(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    data.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'flip-card reveal';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-pressed', 'false');
      card.setAttribute('aria-label', `${item.title} — sentuh atau tekan Enter untuk membaca penjelasan`);
      card.innerHTML = `
        <div class="flip-inner">
          <div class="flip-face flip-front">
            <span class="fc-no">${String(i + 1).padStart(2, '0')}</span>
            <h4>${item.title}</h4>
            <span class="fc-hint">sentuh untuk membaca ↻</span>
          </div>
          <div class="flip-face flip-back">
            <p>${item.text}</p>
          </div>
        </div>`;
      const toggleFlip = () => {
        const flipped = card.classList.toggle('flipped');
        card.setAttribute('aria-pressed', String(flipped));
      };
      card.addEventListener('click', toggleFlip);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFlip();
        }
      });
      container.appendChild(card);
      io.observe(card);
    });
  }

  buildFlipGrid('rukunIman', rukunIman);
  buildFlipGrid('rukunIslam', rukunIslam);

  /* ============================================================
     SIGNATURE DIAGRAM — Hubungan Iman, Islam, Ihsan
     ============================================================ */
  const diagramContent = {
    islam: {
      eyebrow: 'Islam — Lingkaran Terluar',
      title: 'Lingkaran Perbuatan',
      text: 'Lapisan terluar dan paling tampak: syariat, rukun, dan amal lahiriah. Inilah yang bisa dilihat orang lain — shalat, puasa, zakat. Ibarat bangunan, Islam adalah wujud fisiknya.'
    },
    iman: {
      eyebrow: 'Iman — Lingkaran Tengah',
      title: 'Lingkaran Keyakinan',
      text: 'Lapisan tengah yang tidak selalu tampak: keyakinan hati terhadap enam rukun iman. Ibarat bangunan, Iman adalah pondasi yang menopang berdirinya seluruh amal.'
    },
    ihsan: {
      eyebrow: 'Ihsan — Inti Terdalam',
      title: 'Inti Kesempurnaan',
      text: 'Lapisan paling dalam dan tertinggi: kesadaran senantiasa diawasi Allah, yang menghadirkan keikhlasan. Ibarat bangunan, Ihsan adalah ruh yang menghidupkan Iman dan Islam.'
    }
  };

  const dpTitle = document.getElementById('dpTitle');
  const dpText = document.getElementById('dpText');
  const dpEyebrow = document.querySelector('.dp-eyebrow');
  const rings = document.querySelectorAll('.mring');

  function setActiveRing(key) {
    rings.forEach(r => {
      const isActive = r.dataset.key === key;
      r.classList.toggle('active', isActive);
      r.setAttribute('aria-pressed', String(isActive));
    });
    const c = diagramContent[key];
    if (!c) return;
    dpEyebrow.textContent = c.eyebrow.split(' — ')[0];
    dpTitle.textContent = c.title;
    dpText.textContent = c.text;
  }

  rings.forEach(r => {
    r.addEventListener('click', () => setActiveRing(r.dataset.key));
    r.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveRing(r.dataset.key);
      }
    });
  });
  setActiveRing('islam');

  /* ============================================================
     TABS — Contoh Perilaku
     ============================================================ */
  const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(btn) {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => {
      const isActive = b === btn;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', String(isActive));
      b.tabIndex = isActive ? 0 : -1;
    });
    tabPanels.forEach(p => {
      const isActive = p.dataset.panel === target;
      p.classList.toggle('active', isActive);
      p.hidden = !isActive;
    });
  }

  tabBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => activateTab(btn));
    btn.addEventListener('keydown', (e) => {
      let newIndex = null;
      if (e.key === 'ArrowRight') newIndex = (i + 1) % tabBtns.length;
      else if (e.key === 'ArrowLeft') newIndex = (i - 1 + tabBtns.length) % tabBtns.length;
      else if (e.key === 'Home') newIndex = 0;
      else if (e.key === 'End') newIndex = tabBtns.length - 1;
      if (newIndex !== null) {
        e.preventDefault();
        tabBtns[newIndex].focus();
        activateTab(tabBtns[newIndex]);
      }
    });
  });

  /* ============================================================
     QUIZ
     ============================================================ */
  const quizData = [
    {
      q: 'Menurut hadis Jibril, ihsan adalah menyembah Allah seakan-akan…',
      options: [
        'Melihat-Nya, dan jika tidak mampu maka sadar bahwa Dia melihat kita',
        'Berada di sisi Ka\u2019bah setiap saat',
        'Sedang diuji oleh malaikat',
        'Sudah mencapai surga'
      ],
      correct: 0,
      explain: 'Ihsan adalah beribadah seakan melihat Allah, atau menyadari bahwa Allah senantiasa melihat kita (HR. Muslim).'
    },
    {
      q: 'Berapa jumlah Rukun Iman?',
      options: ['4', '5', '6', '7'],
      correct: 2,
      explain: 'Rukun Iman berjumlah enam: Allah, malaikat, kitab, rasul, hari akhir, serta qada dan qadar.'
    },
    {
      q: 'Dalam analogi bangunan, Iman diibaratkan sebagai…',
      options: ['Atap', 'Pondasi', 'Pintu', 'Cat dinding'],
      correct: 1,
      explain: 'Iman adalah pondasi yang tidak selalu tampak, namun menopang kokohnya seluruh amal (Islam).'
    },
    {
      q: 'Rukun Islam yang menjadi pintu masuk keislaman seseorang adalah…',
      options: ['Zakat', 'Puasa', 'Syahadat', 'Haji'],
      correct: 2,
      explain: 'Dua kalimat syahadat adalah ikrar dasar yang menjadikan seseorang resmi memeluk Islam.'
    },
    {
      q: 'Sikap mana yang paling mencerminkan Ihsan?',
      options: [
        'Belajar giat hanya ketika diawasi guru',
        'Jujur saat ujian meski tidak ada pengawas',
        'Beribadah agar dipuji orang lain',
        'Membantu teman hanya bila diminta'
      ],
      correct: 1,
      explain: 'Ihsan tercermin dari kesadaran diawasi Allah — sehingga tetap berbuat baik dan jujur tanpa pengawasan manusia.'
    }
  ];

  let qIndex = 0;
  let score = 0;
  let answered = false;

  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizFeedback = document.getElementById('quizFeedback');
  const quizNext = document.getElementById('quizNext');
  const quizCount = document.getElementById('quizCount');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const quizBox = document.getElementById('quizBox');
  const quizResult = document.getElementById('quizResult');
  const qrScore = document.getElementById('qrScore');
  const qrMsg = document.getElementById('qrMsg');
  const quizRestart = document.getElementById('quizRestart');

  function renderQuestion() {
    answered = false;
    quizNext.disabled = true;
    quizFeedback.textContent = '';
    const item = quizData[qIndex];
    quizCount.textContent = `Soal ${qIndex + 1} dari ${quizData.length}`;
    quizProgressBar.style.width = `${((qIndex) / quizData.length) * 100}%`;
    quizQuestion.textContent = item.q;
    quizOptions.innerHTML = '';

    item.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(i, btn));
      quizOptions.appendChild(btn);
    });
  }

  function handleAnswer(i, btn) {
    if (answered) return;
    answered = true;
    const item = quizData[qIndex];
    const allBtns = quizOptions.querySelectorAll('.quiz-opt');
    allBtns.forEach(b => b.disabled = true);

    if (i === item.correct) {
      btn.classList.add('correct');
      btn.setAttribute('aria-label', `${btn.textContent} — jawaban benar`);
      score++;
      quizFeedback.textContent = `Benar — ${item.explain}`;
      quizFeedback.style.color = 'var(--jade)';
    } else {
      btn.classList.add('wrong');
      btn.setAttribute('aria-label', `${btn.textContent} — jawaban salah`);
      allBtns[item.correct].classList.add('correct');
      allBtns[item.correct].setAttribute('aria-label', `${allBtns[item.correct].textContent} — jawaban benar`);
      quizFeedback.textContent = `Kurang tepat — ${item.explain}`;
      quizFeedback.style.color = '#B8543F';
    }
    quizNext.disabled = false;
    quizNext.textContent = qIndex === quizData.length - 1 ? 'Lihat Skor →' : 'Lanjut →';
  }

  quizNext.addEventListener('click', () => {
    qIndex++;
    if (qIndex >= quizData.length) {
      showResult();
    } else {
      renderQuestion();
    }
  });

  function showResult() {
    quizBox.hidden = true;
    quizResult.hidden = false;
    qrScore.textContent = `${score}/${quizData.length}`;
    let msg;
    if (score === quizData.length) msg = 'Sempurna! Pemahamanmu tentang Iman, Islam, dan Ihsan sangat matang.';
    else if (score >= quizData.length - 1) msg = 'Bagus sekali — hampir sempurna, tinggal sedikit lagi!';
    else if (score >= quizData.length / 2) msg = 'Cukup baik — coba baca ulang bagian yang masih kurang yakin.';
    else msg = 'Yuk gulir ke atas dan baca ulang materinya sebelum mencoba lagi.';
    qrMsg.textContent = msg;
  }

  quizRestart.addEventListener('click', () => {
    qIndex = 0;
    score = 0;
    quizResult.hidden = true;
    quizBox.hidden = false;
    renderQuestion();
  });

  renderQuestion();

})();
