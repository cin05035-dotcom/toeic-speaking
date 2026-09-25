// 시험 형식은 ETS 공식 안내 기준. 문제·표현은 기출이 아니라 형식만 따른 자체 제작.
// times: 문항마다 [준비 초, 답변 초]. read: 문항 전에 자료를 읽는 시간(초).
const TYPES = {
  q12: {
    no: '1–2', name: '문장 읽기', times: [[45, 45], [45, 45]],
    checks: '발음, 억양·강세',
    about: '화면의 짧은 안내문을 소리 내어 읽어요. 내용을 지어낼 필요는 없고, 알아듣기 쉽게 읽는 게 전부예요.',
    frame: [
      ['끊어 읽기', '쉼표·마침표 뒤, and·but·so 같은 접속사 앞에서 잠깐 쉰다'],
      ['나열 억양', 'painting↗, cooking↗, and yoga↘ — 마지막만 내린다'],
      ['의문문 억양', 'Yes/No 질문은 끝을 올리고, what·where 질문은 내린다'],
      ['숫자·이름', '전화번호·고유명사는 한 글자씩 또박또박'],
      ['준비 45초', '속으로 말고 입으로 작게 한 번 읽어본다'],
    ],
    sets: [{
      items: [
        { text: 'Welcome to Riverside Community Center. This weekend, we are offering free classes in painting, cooking, and yoga. To sign up, please visit the front desk or call us at 555-0142. Classes fill up quickly, so register early.' },
        { text: "Attention, shoppers. Our store will be closing in thirty minutes. Please bring your items to the checkout counters at the front of the store. If you have a membership card, don't forget to show it to the cashier. Thank you for shopping with us, and have a great evening." },
      ],
    }],
  },
  q34: {
    no: '3–4', name: '사진 묘사', times: [[45, 30], [45, 30]], later: true,
    checks: '발음, 억양·강세, 문법, 어휘, 일관성',
  },
  q57: {
    no: '5–7', name: '질문에 답하기', times: [[3, 15], [3, 15], [3, 30]],
    checks: '발음, 억양·강세, 문법, 어휘, 일관성, 내용의 관련성·완성도',
    about: '전화 설문처럼 일상 질문 3개가 이어져요. 준비 시간이 3초뿐이라 틀이 입에 붙어 있어야 해요.',
    frame: [
      ['답', '질문의 표현을 그대로 받아 첫 문장을 만든다 (How often…? → I … about once a week.)'],
      ['이유', 'The main reason is that …'],
      ['덧붙이기', '예시나 이유 하나 더. 7번(30초)은 이유를 두 개로'],
    ],
    sets: [{
      intro: 'Imagine that a marketing company is doing research in your area. You have agreed to participate in a telephone interview about coffee shops.',
      items: [
        { ask: 'How often do you go to a coffee shop, and who do you usually go with?' },
        { ask: 'What is the most important thing to you when choosing a coffee shop?' },
        { ask: 'Would you be interested in using a coffee shop that has a study room? Why or why not?' },
      ],
    }],
  },
  q810: {
    no: '8–10', name: '표 보고 답하기', times: [[3, 15], [3, 15], [3, 30]], read: 45,
    checks: '발음, 억양·강세, 문법, 어휘, 일관성, 내용의 관련성·완성도',
    about: '일정표 같은 자료를 45초 읽은 뒤, 전화로 묻는 사람에게 자료를 보고 답해요. 10번 질문은 두 번 들려줘요.',
    frame: [
      ['찾기', '읽는 45초 동안 날짜·시간·장소, 그리고 취소·변경 표시부터 본다'],
      ['완전한 문장', '"10 a.m." 대신 It starts at 10 a.m.'],
      ['정정', '틀린 정보를 물으면 I\'m afraid … 로 바로잡는다'],
      ['두 항목', '10번은 There are two … The first one is … The second one is …'],
    ],
    sets: [{
      intro: "Hi, this is Tom. I'm planning to attend the job fair, but I lost the schedule. Can I ask you a few questions?",
      table: {
        title: 'Bright Future Job Fair',
        sub: 'Saturday, May 16 · Grand Hall',
        rows: [
          ['9:00 a.m.', 'Registration'],
          ['9:30 a.m.', 'Opening Speech — Linda Park, HR Director'],
          ['10:30 a.m.', 'Workshop: Writing a Strong Resume'],
          ['12:00 p.m.', 'Lunch (provided)'],
          ['1:00 p.m.', 'Workshop: Interview Skills — CANCELED'],
          ['2:00 p.m.', 'Company Booths Open'],
        ],
      },
      items: [
        { ask: 'What date is the job fair, and what time does it start?' },
        { ask: "I heard that there's a workshop on interview skills at 1 p.m. Is that right?" },
        { ask: "Could you tell me about everything that's scheduled before lunch?", repeat: true },
      ],
    }],
  },
  q11: {
    no: '11', name: '의견 말하기', times: [[45, 60]],
    checks: '발음, 억양·강세, 문법, 어휘, 일관성, 내용의 관련성·완성도',
    about: '찬반이나 선택 질문에 60초 동안 의견을 말해요. 60초를 채우는 게 가장 어려워서, 틀대로 이유를 두 개 준비해요.',
    frame: [
      ['의견', 'I think it\'s better to … / I agree that …'],
      ['이유 1 + 예시', 'First, … For example, when I …'],
      ['이유 2', 'On top of that, …'],
      ['결론', 'In conclusion, … (시간이 남으면 의견을 한 번 더)'],
    ],
    sets: [{
      items: [
        { ask: 'Some people think that college students should have part-time jobs. Do you agree or disagree? Give specific reasons and examples to support your opinion.' },
      ],
    }],
  },
};

// 표현: phrase는 화면에 보이는 틀, say는 따라 말할 문장, key는 "내 문장"에서 썼는지 확인할 부분.
// 시험에 "자주 나온다"는 근거는 없다 — 답변 틀의 각 자리를 채우는 데 쓰는 표현이다.
const EXPR = {
  common: {
    name: '공통', about: '어느 유형에서든 막혔을 때, 말을 이을 때, 끝낼 때',
    items: [
      { id: 'c-think', phrase: 'Well, let me think.', ko: '음, 생각해 볼게요.', slot: '첫 마디가 안 떠오를 때 — "음…" 대신',
        say: 'Well, let me think about that.', key: 'let me think',
        ask: 'What do you usually do on weekends?', example: 'Well, let me think. I usually meet my friends on weekends.' },
      { id: 'c-ontop', phrase: 'On top of that, …', ko: '게다가, …', slot: '이유를 하나 더 붙일 때',
        say: "On top of that, it's much cheaper.", key: 'on top of that',
        ask: 'Why do you like shopping online?', example: "It saves a lot of time. On top of that, it's often cheaper." },
      { id: 'c-thatswhy', phrase: "That's why I …", ko: '그래서 저는 …', slot: '이유를 말한 뒤 답을 다시 묶을 때',
        say: "That's why I prefer to take the subway.", key: "that's why",
        ask: 'Do you prefer taking the bus or the subway?', example: "The subway is never stuck in traffic. That's why I prefer to take the subway." },
    ],
  },
  q57: {
    name: '5–7 질문에 답하기', about: '답 → 이유 → 덧붙이기',
    items: [
      { id: 'q57-usually', phrase: 'I usually … about once a week.', ko: '저는 보통 일주일에 한 번쯤 …해요.', slot: '답 — How often 질문',
        say: 'I usually go to the gym about once a week.', key: 'i usually',
        ask: 'How often do you go to a movie theater, and who do you go with?', example: 'I usually go to the movies about once a month with my sister.' },
      { id: 'q57-reason', phrase: 'The main reason is that …', ko: '가장 큰 이유는 …', slot: '이유',
        say: "The main reason is that it's close to my home.", key: 'the main reason is',
        ask: 'Where do you usually buy groceries, and why?', example: "I usually buy groceries at a supermarket near my apartment. The main reason is that it's close to my home." },
      { id: 'q57-prefer', phrase: 'Personally, I prefer …', ko: '개인적으로 저는 …가 더 좋아요.', slot: '답 — A or B 질문',
        say: 'Personally, I prefer reading the news on my phone.', key: 'i prefer',
        ask: 'Do you prefer to read the news on paper or on your phone?', example: 'Personally, I prefer reading the news on my phone because I can do it anywhere.' },
    ],
  },
  q810: {
    name: '8–10 표 보고 답하기', about: '표의 정보를 완전한 문장으로',
    items: [
      { id: 'q810-sched', phrase: "It's scheduled for … at …", ko: '…일 …시로 잡혀 있어요.', slot: '날짜·시간 질문',
        say: "It's scheduled for Friday at 10 a.m.", key: 'scheduled for',
        given: 'Workshop — Tuesday, 2:00 p.m.',
        ask: 'When is the workshop?', example: "It's scheduled for Tuesday at 2 p.m." },
      { id: 'q810-afraid', phrase: "I'm afraid there's been a change.", ko: '죄송하지만 변경이 있었어요.', slot: '정정 — 틀린 정보를 물을 때',
        say: "I'm afraid there's been a change. The meeting was moved to Thursday.", key: "i'm afraid",
        given: 'Lunch — 12:30 p.m. → changed to 1:00 p.m.',
        ask: 'Lunch starts at 12:30, right?', example: "I'm afraid there's been a change. Lunch now starts at 1 p.m." },
      { id: 'q810-two', phrase: 'There are two … The first one is …', ko: '…가 두 개 있어요. 첫 번째는 …', slot: '두 항목 요약 — 10번',
        say: 'There are two sessions. The first one is at 9, and the second one is at 11.', key: 'there are two',
        given: '9:00 Social Media Basics / 11:00 Email Marketing',
        ask: 'Can you tell me about the sessions on marketing?', example: 'There are two sessions. The first one is Social Media Basics at 9 a.m., and the second one is Email Marketing at 11 a.m.' },
    ],
  },
  q11: {
    name: '11 의견 말하기', about: '의견 → 이유+예시 → 이유 → 결론',
    items: [
      { id: 'q11-better', phrase: "I think it's better to …", ko: '…하는 게 더 낫다고 생각해요.', slot: '의견 — 첫 문장',
        say: "I think it's better to work in a team.", key: "i think it's better to",
        ask: 'Is it better to work alone or in a team?', example: "I think it's better to work in a team, because we can share ideas." },
      { id: 'q11-example', phrase: 'For example, when I …', ko: '예를 들어, 제가 …했을 때', slot: '이유 뒤 예시 — 시간을 채우는 핵심',
        say: 'For example, when I worked at a cafe, I learned a lot from my coworkers.', key: 'for example',
        ask: 'Do you think part-time jobs are useful for students?', example: 'Yes, I think so. For example, when I worked at a cafe, I learned how to talk to customers.' },
      { id: 'q11-concl', phrase: 'In conclusion, …', ko: '결론적으로, …', slot: '결론 — 마지막 문장',
        say: 'In conclusion, I believe teamwork is more effective.', key: 'in conclusion',
        ask: 'Should companies let employees work from home?', example: 'In conclusion, I believe working from home is good for both companies and employees.' },
    ],
  },
};

if (typeof module !== 'undefined') module.exports = { TYPES, EXPR };
