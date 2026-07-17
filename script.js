const $chat = document.getElementById('chat');
const $recommendBtn = document.getElementById('recommendBtn');
const $threads = document.getElementById('threads');
const $title = document.getElementById('threadTitle');

// 현재 사용자가 선택한 조건을 저장할 비밀 주머니
let currentSelection = {
  time: '',
  type: '',
  flavor: ''
};

// 상단 왼쪽 히스토리 목록 가짜 데이터
const historyList = [
  { id: 'h1', title: '점심 🇰🇷 한식 #매콤칼칼', preview: '낙지볶음 추천' },
  { id: 'h2', title: '저녁 🇺🇸 양식 #상큼달달', preview: '고르곤졸라 조합' },
];

function renderHistory() {
  $threads.innerHTML = historyList
    .map((h) => `<button type="button" class="thread" data-id="${h.id}">⏱️ ${h.title}</button>`)
    .join('');
}
renderHistory();

// 칩 버튼 클릭 이벤트 설정 (같은 카테고리 내에서는 하나만 토글되도록)
document.querySelectorAll('.chip-container').forEach(container => {
  const category = container.dataset.category;
  
  container.addEventListener('click', (e) => {
    const chip = e.target.closest('.option-chip');
    if (!chip) return;

    // 이미 선택된 걸 또 누르면 해제, 아니면 새로 선택
    if (chip.classList.contains('is-selected')) {
      chip.classList.remove('is-selected');
      currentSelection[category] = '';
    } else {
      container.querySelectorAll('.option-chip').forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      currentSelection[category] = chip.dataset.value;
    }
  });
});

// 조건 조합별 추천 데이터베이스 
const menuDatabase = {
  '아침_한식': '🍲 [사골곰탕 또는 북어국]\n\n속을 따뜻하고 부드럽게 달래줄 수 있는 맑은 국물 요리를 추천해요. 깍두기 하나 올려서 든든하게 시작하세요!',
  '아침_디저트': '🥣 [그릭 요거트 볼 또는 아보카도 토스트]\n\n부담 없이 가볍게 비타민과 유산균을 채울 수 있는 웰빙 조합입니다. 따뜻한 아메리카노 한 잔을 곁들이면 금상첨화죠.',
  '점심_한식_매콤/자극적': '🔥 [제육볶음 또는 낙지볶음 정식]\n\n스트레스를 확 날려줄 매콤달콤한 양념의 대명사! 쌈 채소와 함께 밥 두 공기 뚝딱 비워낼 수 있는 최고의 점심입니다.',
  '점심_한식_담백/든든': '🍚 [갈비탕 또는 돌솥비빔밥]\n\n자극적이지 않으면서도 오후 일과를 버틸 수 있는 깊고 진한 에너지를 줍니다. 정갈한 나물 반찬과 함께 드세요.',
  '점심_일식_매콤/자극적': '🍜 [매운 돈코츠 라멘 또는 탄탄면]\n\n진한 고기 육수에 칼칼한 고추기름이 감돌아, 해장용으로도 좋고 알싸한 맛이 일품인 면 요리입니다.',
  '점심_일식_담백/든든': '🍣 [모듬 초밥 또는 돈카츠 정식]\n\n깔끔하고 실패 없는 직장인/학생들의 소울 푸드! 고소하고 바삭한 식감 혹은 깔끔한 바다의 맛을 즐겨보세요.',
  '저녁_한식_매콤/자극적': '🥘 [닭볶음탕 또는 삼겹 주꾸미 볶음]\n\n하루의 피로를 날려버릴 화끈한 저녁! 식사로도 좋고, 가벼운 반주 한 잔 곁들이기 최적의 타이밍입니다.',
  '저녁_양식_담백/든든': '🥩 [안심 스테이크 또는 베이컨 크림 파스타]\n\n오늘 고생한 나를 위한 작은 사치! 꾸덕한 소스나 부드러운 고기로 입안 가득 행복한 풍미를 선물해 보세요.'
};

// 추천 실행 버튼 클릭 시
$recommendBtn.addEventListener('click', async () => {
  const { time, type, flavor } = currentSelection;

  // 최소한 언제, 종류는 골라야 추천 가능하게 방어벽 세우기
  if (!time || !type) {
    alert('⏱️ [언제] 와 [종류] 조건은 꼭 선택해 주세요!');
    return;
  }

  // 웰컴 화면 없애기
  document.getElementById('welcomeScreen')?.remove();

  // 사용자가 고른 조건 텍스트로 정리
  const userChoiceText = `👉 내가 고른 조건:\n[${time}] 에 먹을 [${type}] 중 [${flavor || '아무 대나 다 좋은'}] 스타일!`;
  
  // 1. 유저 선택지 메시지 추가
  appendMsg('user', userChoiceText);
  $title.textContent = `${time} ${type} 추천`;

  // 2. AI 생각하는 애니메이션 작동
  const typingIndicator = showTyping();
  await new Promise((r) => setTimeout(r, 800)); // 0.8초 대기
  typingIndicator.remove();

  // 3. 데이터베이스 매칭 검사
  const keyWithFlavor = `${time}_${type}_${flavor}`;
  const keyWithoutFlavor = `${time}_${type}`;
  
  let finalAnswer = menuDatabase[keyWithFlavor] || menuDatabase[keyWithoutFlavor];
  
  if (!finalAnswer) {
    finalAnswer = `✨ [추천 메뉴: 🍕 반반 피자와 치즈 오븐 스파게티]\n\n이 조합은 어떠신가요? 딱 맞는 정밀 매칭 데이터가 없지만, 현재 시간대와 종류에 맞춰 가장 인기 있는 대중적인 메뉴로 골라봤어요!`;
  }

  // 4. AI 답변 출력 (타이핑 효과)
  appendMsg('bot', finalAnswer, true);
});

// 메시지 박스 생성 함수
function appendMsg(role, text, animated = false) {
  const msg = document.createElement('div');
  msg.className = `msg msg--${role}`;
  msg.innerHTML = `
    <div class="msg__avatar">${role === 'user' ? 'JL' : '✦'}</div>
    <div class="msg__bubble"></div>
  `;
  $chat.appendChild(msg);
  const bubble = msg.querySelector('.msg__bubble');
  if (animated) typeOut(bubble, text);
  else bubble.textContent = text;
  $chat.scrollTop = $chat.scrollHeight;
}

// 글자 하나씩 치는 타이핑 효과
function typeOut(el, text, speed = 12) {
  let i = 0;
  const tick = () => {
    el.textContent = text.slice(0, i++);
    $chat.scrollTop = $chat.scrollHeight;
    if (i <= text.length) setTimeout(tick, speed);
  };
  tick();
}

// 생각 중... 점 3개 표시
function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg msg--bot typing-row';
  wrap.innerHTML = `<div class="msg__avatar">✦</div><div class="msg__bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
  $chat.appendChild(wrap);
  $chat.scrollTop = $chat.scrollHeight;
  return wrap;
}

// 새 추천 버튼 누르면 챗 화면 리셋
document.getElementById('newChat').addEventListener('click', () => {
  $chat.innerHTML = `<div class="welcome" id="welcomeScreen">
    <div class="welcome__logo">🍳</div>
    <h2>오늘 어떤 음식을 드시고 싶으신가요?</h2>
    <p style="color: var(--text-dim); font-size: 0.9rem; margin-bottom: 20px;">아래의 조건들을 터치하여 고른 뒤 추천받기 버튼을 눌러보세요!</p>
  </div>`;
  $title.textContent = '메뉴 큐레이팅';
  // 선택 칩들 초기화
  document.querySelectorAll('.option-chip').forEach(c => c.classList.remove('is-selected'));
  currentSelection = { time: '', type: '', flavor: '' };
});
