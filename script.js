const $chat = document.getElementById('chat');
const $recommendBtn = document.getElementById('recommendBtn');
const $threads = document.getElementById('threads');
const $title = document.getElementById('threadTitle');

// 사용자가 선택한 조건을 저장할 객체
let currentSelection = {
  time: '',
  type: '',
  flavor: ''
};

// 칩 버튼 클릭 이벤트 설정
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

// ⭐ 촘촘하게 채워 넣은 메뉴 데이터베이스 (모든 조합 다 다르게 나오도록 수정)
const menuDatabase = {
  // --- 아침 조합 ---
  '아침_한식_매콤/자극적': '🥘 [얼큰 소고기 국밥]\n\n아침부터 칼칼한 게 당기시는군요! 속이 확 풀리는 얼큰한 국밥으로 든든하게 시작하세요.',
  '아침_한식_담백/든든': '🍲 [맑은 콩나물국밥 또는 사골곰탕]\n\n부담 없이 속을 따뜻하고 부드럽게 달래줄 수 있는 맑은 국물 요리가 제격입니다.',
  '아침_한식_상큼/달달': '🥗 [도토리묵 사발 또는 겉절이를 곁들인 누룽지]\n\n새콤달콤한 맛으로 입맛을 돋워줄 가벼운 한식 차림입니다.',
  
  '아침_일식_담백/든든': '🍚 [일본식 계란말이 정식과 미소된장국]\n\n달착지근하고 부드러운 계란말이에 따뜻한 장국으로 정갈한 아침을 맞이해보세요.',
  '아침_일식_매콤/자극적': '🍜 [카라쿠치 라멘 (매운 라멘)]\n\n잠을 확 깨우는 알싸한 매운맛의 국물 면 요리입니다.',
  
  '아침_양식_담백/든든': '🍞 [프렌치 토스트와 스크램블 에그]\n\n부드러운 달걀 요리와 따뜻한 빵, 그리고 우유나 아메리카노 한 잔의 완벽한 앙상블입니다.',
  '아침_양식_상큼/달달': '팬케이크와 신선한 믹스 베리]\n\n달콤한 시럽을 듬뿍 얹은 팬케이크로 아침을 상큼하게 깨워보세요.',
  
  '아침_디저트_담백/든든': '🥣 [따뜻한 오트밀 보울]\n\n바나나와 견과류를 올려 고소하고 하루 종일 속이 편안한 아침 식사입니다.',
  '아침_디저트_상큼/달달': '🍎 [그릭 요거트와 사과 샐러드]\n\n꾸덕한 요거트에 상큼한 과일과 꿀을 곁들여 가볍고 비타민 가득하게 시작하세요.',

  // --- 점심 조합 ---
  '점심_한식_매콤/자극적': '🔥 [제육볶음 또는 낙지볶음 정식]\n\n오후 일과를 버티게 해 줄 화끈한 불맛 양념 요리! 쌈 채소와 함께 비벼 드세요.',
  '점심_한식_담백/든든': '🍛 [갈비탕 또는 돌솥비빔밥]\n\n자극적이지 않으면서도 영양소를 골고루 채울 수 있는 든든한 정식입니다.',
  '점심_한식_상큼/달달': '🍜 [매콤새콤한 비빔국수와 만두]\n\n입맛 없는 점심에 딱인 새콤달콤 청량한 면 요리 조합입니다.',
  
  '점심_일식_매콤/자극적': '🍛 [매운 카라아케 카레]\n\n알싸하게 매운 일본식 카레 위에 바삭한 닭튀김을 올려 먹는 별미입니다.',
  '점심_일식_담백/든든': '🍣 [모듬 초밥 또는 돈카츠 정식]\n\n바삭 고소한 식감 혹은 깔끔하고 정갈한 바다의 맛을 즐길 수 있는 직장인 소울 푸드입니다.',
  '점심_일식_상큼/달달': '🍜 [시원한 냉모밀과 새우튀김]\n\n쯔유 소스의 감칠맛과 상큼함이 입안 가득 퍼지는 시원한 조합입니다.',
  
  '점심_양식_매콤/자극적': '🍔 [할라피뇨 스파이시 치킨버거 세트]\n\n매콤한 소스가 느끼함을 싹 잡아주는 육즙 가득한 패스트푸드입니다.',
  '점심_양식_담백/든든': '🍝 [까르보나라 파스타 또는 버섯 리조또]\n\n부드럽고 꾸덕한 크림 소스로 기분 좋은 포만감을 채워보세요.',
  '점심_양식_상큼/달달': '🍕 [하와이안 피자 또는 리코타 치즈 샐러드 랩]\n\n달콤한 파인애플 토핑이나 상큼한 치즈 풍미를 가볍게 즐기는 양식입니다.',
  
  '점심_디저트_상큼/달달': '🥪 [클럽 샌드위치와 생과일 에이드]\n\n아삭한 채소가 씹히는 샌드위치에 상큼함을 더해줄 시원한 에이드 조합입니다.',

  // --- 저녁 조합 ---
  '저녁_한식_매콤/자극적': '🥘 [닭볶음탕 또는 삼겹 주꾸미 볶음]\n\n하루의 피로를 날려버릴 화끈한 저녁! 밥을 볶아 먹어도 좋고 가벼운 반주에도 딱입니다.',
  '저녁_한식_담백/든든': '🥩 [한우 업진살 구이 또는 보쌈 정식]\n\n오늘 하루 고생한 나를 위해 기름기 쏙 뺀 담백하고 부드러운 고기 수육이나 구이를 선물하세요.',
  '저녁_일식_매콤/자극적': '🍲 [얼큰한 차돌 짬뽕탕 또는 규동]\n\n진한 고기 육수에 칼칼함을 더해 저녁 식사 겸 스트레스 해소용으로 아주 좋습니다.',
  '저녁_일식_담백/든든': '🐟 [연어 덮밥(사케동) 또는 스키야키]\n\n부드러운 타레 소스와 함께 즐기는 정성 가득한 일식 요리입니다.',
  '저녁_양식_매콤/자극적': '🍕 [페페로니 폭탄 피자와 핫윙]\n\n짭조름하고 매콤한 소스가 어우러져 시원한 음료나 맥주와 최고의 궁합을 자랑합니다.',
  '저녁_양식_담백/든든': '🥩 [티본 스테이크와 매시드 포테이토]\n\n근사하고 풍요로운 저녁을 완성해 줄 육즙 가득한 정통 스테이크입니다.'
};

// 기본 예외 처리용 (기존의 중복 배출 문제 해결)
const defaultMenu = '🍕 [반반 피자와 치즈 오븐 스파게티]\n\n선택하신 스타일에 딱 맞는 정밀 데이터가 데이터베이스에 없지만, 해당 시간대에 가장 인기 있는 메뉴로 골라드렸어요!';

// 추천 실행 버튼 클릭 시
$recommendBtn.addEventListener('click', async () => {
  const { time, type, flavor } = currentSelection;

  // 필수 조건 체크 (언제, 종류)
  if (!time || !type) {
    alert('⏱️ [언제 드시나요?] 와 [어떤 종류가 당기시나요?] 조건은 꼭 선택해 주세요!');
    return;
  }

  // 웰컴 초기 화면 제거
  document.getElementById('welcomeScreen')?.remove();

  // 기존에 나왔던 이전 추천 결과 대화창 싹 지우기 (화면 청소 효과)
  $chat.innerHTML = '';

  // 유저가 고른 조건 상단 띄우기
  const userChoiceText = `👉 내가 고른 조건:\n[${time}] 에 먹을 [${type}] 중 [${flavor || '아무 대나 다 좋은'}] 스타일!`;
  appendMsg('user', userChoiceText);

  // 로딩 점 세개 애니메이션 켜기
  const typingIndicator = showTyping();
  await new Promise((r) => setTimeout(r, 600)); // 0.6초 생각하는 척 대기
  typingIndicator.remove();

  // 데이터베이스 매칭 (1순위: 맛 스타일까지 포함, 2순위: 시간+종류만 포함)
  const keyWithFlavor = `${time}_${type}_${flavor}`;
  const keyWithoutFlavor = `${time}_${type}`;
  
  let finalAnswer = menuDatabase[keyWithFlavor] || menuDatabase[keyWithoutFlavor] || defaultMenu;

  // AI 답변 출력
  appendMsg('bot', finalAnswer, true);
});

// 메시지 박스 생성 함수
function appendMsg(role, text, animated = false) {
  const msg = document.createElement('div');
  msg.className = `msg msg--${role}`;
  msg.innerHTML = `<div class="msg__bubble"></div>`;
  $chat.appendChild(msg);
  
  const bubble = msg.querySelector('.msg__bubble');
  if (animated) typeOut(bubble, text);
  else bubble.textContent = text;
  
  $chat.scrollTop = $chat.scrollHeight;
}

// 글자 하나씩 치는 타이핑 효과
function typeOut(el, text, speed = 10) {
  let i = 0;
  const tick = () => {
    el.textContent = text.slice(0, i++);
    $chat.scrollTop = $chat.scrollHeight;
    if (i <= text.length) setTimeout(tick, speed);
  };
  tick();
}

// 로딩 애니메이션 디자인 생성
function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg msg--bot typing-row';
  wrap.innerHTML = `<div class="msg__bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
  $chat.appendChild(wrap);
  $chat.scrollTop = $chat.scrollHeight;
  return wrap;
}

// 새 추천 버튼 리셋 기능 추가
const $newChat = document.getElementById('newChat');
if ($newChat) {
  $newChat.addEventListener('click', () => {
    $chat.innerHTML = `<div class="welcome" id="welcomeScreen">
      <div class="status-badge">READY</div>
      <h2>아래에서 취향을 고르고 버튼을 눌러보세요!</h2>
      <p>오늘의 완벽한 한 끼를 찾아드릴게요.</p>
    </div>`;
    document.querySelectorAll('.option-chip').forEach(c => c.classList.remove('is-selected'));
    currentSelection = { time: '', type: '', flavor: '' };
  });
}
