const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const app = $('#app');
const ORDER = ['q12', 'q34', 'q57', 'q810', 'q11'];
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// speak-tutor와 같은 주소(github.io)라 저장 공간을 같이 쓴다 → 이 앱 것은 ts. 을 붙인다
const saved = (k, fallback) => { try { return JSON.parse(localStorage.getItem('ts.' + k)) ?? fallback; } catch { return fallback; } };
const save = (k, v) => { try { localStorage.setItem('ts.' + k, JSON.stringify(v)); } catch { /* 저장 못 해도 연습은 계속 */ } };

// ── 기기 내장 음성 (speak-tutor에서 가져옴) ──
let voice;
function pickVoice() {
  const us = speechSynthesis.getVoices().filter((v) => v.lang.replace('_', '-') === 'en-US');
  voice = us.find((v) => /google/i.test(v.name)) || us[0];
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
let utter; // 재생 중 참조를 잡아둬야 Chrome이 onend 전에 버리지 않는다
function say(text, rate = 0.95, onend) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US'; utter.rate = rate;
  if (voice) utter.voice = voice;
  if (onend) utter.onend = onend;
  speechSynthesis.speak(utter);
}
function speak(text) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) { resolve(); return; }
    const t = setTimeout(resolve, 3000 + text.length * 90); // onend가 안 오는 기기 대비
    say(text, 0.95, () => { clearTimeout(t); resolve(); });
  });
}

let actx;
function beep() {
  const o = actx.createOscillator(), g = actx.createGain();
  o.frequency.value = 880; g.gain.value = 0.2;
  o.connect(g).connect(actx.destination);
  o.start(); o.stop(actx.currentTime + 0.35);
  return new Promise((r) => setTimeout(r, 450));
}

// ── 음성 인식 ──
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const ERR = {
  'not-allowed': '마이크 권한이 꺼져 있어요. 주소창 왼쪽 아이콘에서 마이크를 허용하세요.',
  'no-speech': '소리가 들리지 않았어요. 버튼을 누르고 바로 말해보세요.',
  network: '음성 인식에 인터넷 연결이 필요해요.',
  'audio-capture': '마이크를 찾지 못했어요. 이어폰 연결을 확인하세요.',
  unsupported: '이 브라우저는 받아쓰기를 지원하지 않아요. 안드로이드 Chrome에서 열어주세요.',
};

// 긴 답변 받아쓰기: 한 문장 끝날 때마다 인식이 꺼지므로 답변 시간 동안 계속 다시 켠다.
// ponytail: continuous 모드는 안드로이드에서 결과가 겹쳐 나오는 문제가 있어 안 씀. 다시 켜는 사이 단어가 빠질 수 있음 → 녹음이 기준
function transcribe() {
  if (!SR) return { stop: async () => ({ text: '', err: 'unsupported' }) };
  const parts = [];
  let err = null, stopping = false, over = false, ended = null, r;
  const start = () => {
    r = new SR();
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = (e) => { parts.push(e.results[0][0].transcript.trim()); };
    r.onerror = (e) => { if (e.error !== 'no-speech' && e.error !== 'aborted') err = e.error; };
    r.onend = () => {
      if (!stopping && !err) { try { start(); return; } catch (x) { err = String(x.message || x); } }
      over = true; ended?.();
    };
    r.start();
  };
  try { start(); } catch (x) { err = String(x.message || x); over = true; }
  return {
    stop() {
      stopping = true;
      return new Promise((resolve) => {
        const fin = () => resolve({ text: parts.join(' '), err });
        if (over) { fin(); return; }
        ended = fin;
        try { r.stop(); } catch { fin(); }
        setTimeout(fin, 2000);
      });
    },
  };
}

// 녹음 + 받아쓰기를 같이 돌린다. 녹음이 기준, 받아쓰기는 보조
function capture(stream) {
  const chunks = [];
  const mr = new MediaRecorder(stream);
  mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  mr.start();
  const tr = transcribe();
  return {
    async stop() {
      const audio = new Promise((r) => { mr.onstop = () => r(URL.createObjectURL(new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' }))); });
      mr.stop();
      const [url, t] = await Promise.all([audio, tr.stop()]);
      return { url, ...t };
    },
  };
}

// 표현 익히기용 한 문장 인식 (speak-tutor에서 가져옴)
let rec = null;
function hear() {
  return new Promise((resolve, reject) => {
    rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
    let got = '';
    rec.onresult = (e) => { got = e.results[0][0].transcript; };
    rec.onerror = (e) => reject(e.error);
    rec.onend = () => { rec = null; got ? resolve(got) : reject('no-speech'); };
    rec.start();
  });
}
async function mic(btn, out, render) {
  if (!SR) { out.innerHTML = `<p class="note">${ERR.unsupported}</p>`; return; }
  if (rec) { rec.stop(); return; }
  speechSynthesis.cancel();
  const label = btn.textContent;
  btn.classList.add('live'); btn.textContent = '듣는 중… 다 말했으면 탭';
  try { const heard = await hear(); out.innerHTML = render(heard); }
  catch (err) { out.innerHTML = `<p class="note">${ERR[err] || '음성 인식에 실패했어요 (' + esc(err) + ')'}</p>`; }
  finally { btn.classList.remove('live'); btn.textContent = label.startsWith('다시') ? label : '다시 ' + label; }
}

// ── 화면 전환 시 진행 중인 것 전부 멈추기 ──
let run = 0, tick = null, live = null, stream = null;
function stopAll() {
  run++;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  clearInterval(tick);
  live?.stop(); live = null;
  stream?.getTracks().forEach((t) => t.stop()); stream = null;
  rec?.abort();
}

function countdown(box, label, sec, kind, skip) {
  return new Promise((resolve) => {
    const end = Date.now() + sec * 1000;
    box.innerHTML = `<div class="clock ${kind}"><span class="phase">${label}</span>
      <span class="num">${fmt(sec)}</span><i class="drain"><b></b></i></div>
      ${skip ? `<button class="ghost skip">${skip}</button>` : ''}`;
    const num = $('.num', box), bar = $('.drain b', box);
    const done = () => { clearInterval(tick); resolve(); };
    clearInterval(tick);
    tick = setInterval(() => {
      const left = Math.max(0, end - Date.now());
      num.textContent = fmt(Math.ceil(left / 1000));
      bar.style.transform = `scaleX(${left / (sec * 1000)})`;
      if (!left) done();
    }, 100);
    if (skip) $('.skip', box).onclick = done;
  });
}

// ── 조각 ──
const qStart = (T) => parseInt(T.no, 10);
const timesText = (T) => [...new Set(T.times.map(([p, r]) => `준비 ${p}초 · 답변 ${r}초`))].join(' / ');
const frameHtml = (T) => `<dl class="frame">${T.frame.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;
const tableHtml = (t) => `<figure class="sheet"><figcaption><b>${esc(t.title)}</b><span>${esc(t.sub)}</span></figcaption>
  <table>${t.rows.map(([a, b]) => `<tr><th>${esc(a)}</th><td>${esc(b)}</td></tr>`).join('')}</table></figure>`;
const COMMON = Object.keys(EXPR).filter((g) => EXPR[g].common);
const groupsOf = (id) => Object.keys(EXPR).filter((g) => EXPR[g].type === id);
const exprRow = (g, done) => {
  const G = EXPR[g], n = G.items.filter((e) => done.has(e.id)).length;
  return `<li><a href="#/e/${g}/0"><span class="no">${n}/${G.items.length}</span><span><b>${G.name}</b><small>${esc(G.about)}</small></span></a></li>`;
};

function strip() {
  const cells = [], groups = [];
  for (const id of ORDER) {
    const T = TYPES[id];
    let sum = 0;
    T.times.forEach(([p, r], i) => {
      const prep = p + (i === 0 && T.read ? T.read : 0);
      cells.push(`<span class="cell${T.later ? ' later' : ''}" style="flex-grow:${prep + r}">
        <i class="p" style="flex-grow:${prep}"></i><i class="r" style="flex-grow:${r}"></i></span>`);
      sum += prep + r;
    });
    groups.push(`<span style="flex-grow:${sum}">${T.no}</span>`);
  }
  return `<figure class="strip" aria-label="11문항의 준비·답변 시간 비율">
    <div class="cells">${cells.join('')}</div><div class="groups">${groups.join('')}</div>
    <figcaption><i class="p"></i>준비 <i class="r"></i>답변 — 문항 11개를 시간 비율대로 그렸어요</figcaption></figure>`;
}

function dday(date) {
  if (!date) return '';
  const days = Math.round((new Date(date + 'T00:00') - new Date(new Date().toDateString())) / 864e5);
  return days > 0 ? `D-${days}` : days === 0 ? 'D-DAY' : `D+${-days}`;
}

// ── 화면 ──
function home() {
  const goal = saved('goal', {});
  const done = new Set(saved('done', []));
  const kakao = /KAKAOTALK/i.test(navigator.userAgent);
  app.innerHTML = `
    ${kakao ? '<p class="warn">카카오톡 안에서는 음성 기능이 동작하지 않아요. 오른쪽 아래 ⋮ → 다른 브라우저로 열기(Chrome)</p>' : ''}
    <header class="top">
      <p class="eyebrow">TOEIC Speaking · 개인 연습</p>
      <h1>토익스피킹<br>연습장</h1>
      <p class="dday">${esc(dday(goal.date))}${goal.level ? ` <span>${esc(goal.level)}</span>` : ''}</p>
    </header>
    ${strip()}
    <section>
      <h2>유형별 연습</h2>
      <ul class="rows">${ORDER.map((id) => {
        const T = TYPES[id];
        return T.later
          ? `<li class="off"><span class="no">${T.no}</span><span><b>${T.name}</b><small>다음 단계에 추가</small></span></li>`
          : `<li><a href="#/t/${id}"><span class="no">${T.no}</span><span><b>${T.name}</b><small>${timesText(T)}</small></span></a></li>`;
      }).join('')}</ul>
    </section>
    <section>
      <h2>표현 익히기</h2>
      <p class="lede">답변 틀의 빈칸을 채우는 표현이에요. 듣고, 따라 하고, 내 문장에 넣어 봐요.</p>
      <h3>말 잇기 · 모든 유형</h3>
      <ul class="rows">${COMMON.map((g) => exprRow(g, done)).join('')}</ul>
      ${ORDER.filter((id) => groupsOf(id).length).map((id) => `<h3>${TYPES[id].no} ${TYPES[id].name}</h3>
      <ul class="rows">${groupsOf(id).map((g) => exprRow(g, done)).join('')}</ul>`).join('')}
    </section>
    <section class="goal">
      <h2>목표</h2>
      <label>목표 레벨 <input id="level" value="${esc(goal.level || '')}" placeholder="예: 지원할 회사 공고의 기준 레벨…"></label>
      <label>시험일 <input id="date" type="date" value="${esc(goal.date || '')}"></label>
      <p class="note">목표는 지원하는 회사의 채용 공고 기준으로 정하세요. 이 앱은 예상 점수를 보여주지 않아요.</p>
    </section>`;
  const keep = () => { save('goal', { level: $('#level').value.trim(), date: $('#date').value }); $('.dday').textContent = dday($('#date').value); };
  $('#level').onchange = keep; $('#date').onchange = keep;
}

function typePage(id) {
  const T = TYPES[id], done = new Set(saved('done', []));
  app.innerHTML = `
    <nav class="bar"><a href="#/">← 처음으로</a></nav>
    <header class="head"><p class="eyebrow">Question ${T.no}</p><h1>${T.name}</h1><p class="lede">${esc(T.about)}</p></header>
    <p class="facts"><span>${timesText(T)}${T.read ? ` · 자료 읽기 ${T.read}초` : ''}</span><span>평가: ${T.checks} (ETS 공개 기준)</span></p>
    <section><h2>${id === 'q12' ? '읽는 요령' : '답변 틀'}</h2>${frameHtml(T)}</section>
    ${groupsOf(id).length ? `<section><h2>이 유형에 쓰는 표현</h2><ul class="rows">${groupsOf(id).map((g) => exprRow(g, done)).join('')}</ul></section>` : ''}
    ${id === 'q12' ? '' : `<section><h2>말 잇기 표현</h2><ul class="rows">${COMMON.map((g) => exprRow(g, done)).join('')}</ul></section>`}
    <section><h2>실전 시간으로 연습</h2><ul class="rows">${T.sets.map((s, i) =>
      `<li><a href="#/p/${id}/${i}"><span class="no">${i + 1}</span><span><b>세트 ${i + 1}</b><small>문항 ${T.times.length}개 · 자동 녹음</small></span></a></li>`).join('')}</ul></section>`;
}

function itemHtml(id, set, it, qno) {
  if (id === 'q12') return `<p class="qno">Question ${qno}</p><p class="passage">${esc(it.text)}</p>`;
  if (id === 'q810') return tableHtml(set.table) + `<p class="qno">Question ${qno}${it.repeat ? ' · 두 번 들려줘요' : ''}</p>
    <details class="peek"><summary>질문 글로 보기</summary><p>${esc(it.ask)}</p></details>`;
  return (set.intro ? `<p class="intro">${esc(set.intro)}</p>` : '') + `<p class="qno">Question ${qno}</p><p class="ask">${esc(it.ask)}</p>`;
}

function practice(id, si) {
  const T = TYPES[id], set = T?.sets?.[si];
  if (!set) { home(); return; }
  const [p0, r0] = T.times[0];
  app.innerHTML = `
    <nav class="bar"><a href="#/t/${id}">← ${T.name}</a><span>세트 ${si + 1}</span></nav>
    <section class="stage">
      <div class="material">${set.table ? tableHtml(set.table) : ''}${set.intro ? `<p class="intro">${esc(set.intro)}</p>` : ''}</div>
      <div class="timer">
        <p class="lede">${T.read ? `자료 읽기 ${T.read}초 → ` : ''}${id === 'q12' ? '' : '질문 듣기 → '}준비 ${p0}초 → 삐 소리 → 답변 ${r0}초${T.times.length > 1 ? `, 문항 ${T.times.length}개 연속` : ''}. 답변은 자동으로 녹음돼요.</p>
        <button class="primary start">시작하기</button>
      </div>
      <details class="hint"><summary>답변 틀 보기</summary>${frameHtml(T)}
        ${groupsOf(id).map((g) => `<p class="phr"><small>${EXPR[g].name}</small>${EXPR[g].items.map((e) => esc(e.phrase)).join('<br>')}</p>`).join('')}
        ${id === 'q12' ? '' : `<p class="phr">${COMMON.map((g) => `<small>${EXPR[g].name}</small>${esc(EXPR[g].items[0].phrase)}`).join('')}</p>`}</details>
    </section>`;
  $('.start').onclick = () => runSet(id, T, set);
}

async function runSet(id, T, set) {
  const my = run, alive = () => my === run;
  const material = $('.material'), timer = $('.timer');
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { timer.innerHTML = `<p class="note">이 브라우저는 녹음을 지원하지 않아요. 안드로이드 Chrome에서 열어주세요.</p>`; return; }
  actx ||= new (window.AudioContext || window.webkitAudioContext)();
  actx.resume();
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch { timer.innerHTML = `<p class="note">${ERR['not-allowed']}</p>`; return; }
  if (!alive()) return;
  const takes = [];
  if (T.read) { await countdown(timer, '자료 읽기', T.read, 'prep', '다 읽었어요'); if (!alive()) return; }
  if (set.intro) { timer.innerHTML = '<p class="listen">듣는 중…</p>'; await speak(set.intro); if (!alive()) return; }
  for (let i = 0; i < set.items.length; i++) {
    const it = set.items[i], [prep, resp] = T.times[i], qno = qStart(T) + i;
    material.innerHTML = itemHtml(id, set, it, qno);
    if (it.ask) {
      timer.innerHTML = '<p class="listen">질문 듣는 중…</p>';
      await speak(it.ask); if (it.repeat && alive()) await speak(it.ask);
      if (!alive()) return;
    }
    await countdown(timer, `${qno}번 준비`, prep, 'prep', prep > 3 ? '바로 답하기' : '');
    if (!alive()) return;
    await beep();
    live = capture(stream);
    await countdown(timer, `${qno}번 답변 · 녹음 중`, resp, 'resp', '답변 끝내기');
    if (!alive()) return;
    const take = await live.stop(); live = null;
    takes.push({ ...take, qno, resp, q: it.ask || it.text });
  }
  stream.getTracks().forEach((t) => t.stop()); stream = null;
  review(id, material, timer, takes);
}

function review(id, material, timer, takes) {
  material.innerHTML = `<h2>다시 듣기</h2>${takes.map((t) => {
    const words = t.text ? Judge.tokens(t.text).length : 0;
    return `<article class="take"><p class="qno">Question ${t.qno}</p><p class="q">${esc(t.q)}</p>
      <audio controls src="${t.url}"></audio>
      <p class="said">${t.text ? esc(t.text) : '(받아쓰기 없음 — 녹음으로 확인하세요)'}</p>
      <p class="meta">받아쓴 단어 ${words}개 · 답변 ${t.resp}초</p>
      ${t.err ? `<p class="note">받아쓰기: ${ERR[t.err] || esc(t.err)}</p>` : ''}</article>`;
  }).join('')}
  <p class="note">받아쓰기는 중간에 빠진 말이 있을 수 있어요. 녹음이 기준이에요.</p>`;
  timer.innerHTML = `<button class="primary again">다시 하기</button> <a class="ghost" href="#/t/${id}">유형으로</a>`;
  $('.again').onclick = route;
}

function judgeHtml(target, heard) {
  const r = Judge.judge(target, heard);
  const h = `<p class="heard">“${esc(heard)}”</p>`;
  if (r.passed) return h + '<p class="ok">알아들을 수 있게 전달됐어요.</p>';
  if (r.confusions.length) return h + r.confusions.map((c) => `<p class="bad">말하려던 ‘${esc(c.meant)}’ → 들린 ‘${esc(c.said)}’</p>`).join('');
  return h + `<p class="bad">빠지거나 다르게 들린 말: ${r.missing.map(esc).join(', ')}</p>`;
}

function exprCard(g, i) {
  const G = EXPR[g], e = G?.items[i];
  if (!e) { home(); return; }
  const done = new Set(saved('done', []));
  app.innerHTML = `
    <nav class="bar">${G.type ? `<a href="#/t/${G.type}">← ${TYPES[G.type].name}</a>` : '<a href="#/">← 처음으로</a>'}
      <span>${G.type ? TYPES[G.type].no + ' ' : ''}${G.name} ${i + 1}/${G.items.length}</span></nav>
    <header class="head"><p class="eyebrow">${esc(e.slot)}</p><h1 class="en">${esc(e.phrase)}</h1>
      <p class="lede">${esc(e.ko)}${done.has(e.id) ? ' <span class="badge">익힘</span>' : ''}</p>
      ${e.tip ? `<p class="note">${esc(e.tip)}</p>` : ''}</header>
    <section class="step"><h2>듣고 따라 말하기</h2><p class="en line">${esc(e.say)}</p>
      <button class="ghost listen-say">듣기</button> <button class="primary repeat">따라 말하기</button><div class="out o1" aria-live="polite"></div></section>
    <section class="step"><h2>내 문장에 넣기</h2>
      ${e.given ? `<p class="given">${esc(e.given)}</p>` : ''}<p class="en line">${esc(e.ask)}</p>
      <p class="lede">‘${esc(e.phrase)}’를 넣어서 답해 보세요.</p>
      <button class="ghost listen-ask">질문 듣기</button> <button class="primary mine">내 답 말하기</button><div class="out o2" aria-live="polite"></div></section>
    <nav class="pager">${i > 0 ? `<a href="#/e/${g}/${i - 1}">← 이전</a>` : '<span></span>'}
      ${i < G.items.length - 1 ? `<a href="#/e/${g}/${i + 1}">다음 →</a>` : '<a href="#/">목록으로</a>'}</nav>`;
  $('.listen-say').onclick = () => say(e.say);
  $('.listen-ask').onclick = () => say(e.ask);
  $('.repeat').onclick = (ev) => mic(ev.target, $('.o1'), (heard) => judgeHtml(e.say, heard));
  $('.mine').onclick = (ev) => mic(ev.target, $('.o2'), (heard) => {
    const used = Judge.usesPattern(e.key, heard);
    if (used) { done.add(e.id); save('done', [...done]); }
    return `<p class="heard">“${esc(heard)}”</p>${used ? '<p class="ok">표현을 넣어 답했어요.</p>' : `<p class="bad">‘${esc(e.phrase)}’가 들리지 않았어요.</p>`}
      <p class="example"><small>이렇게 답할 수도 있어요</small>${esc(e.example)}</p>`;
  });
}

function route() {
  stopAll();
  const [, a, b, c] = location.hash.split('/');
  if (a === 't' && TYPES[b]?.sets) typePage(b);
  else if (a === 'p') practice(b, +c);
  else if (a === 'e') exprCard(b, +c);
  else home();
  scrollTo(0, 0);
}
addEventListener('hashchange', route);
route();
