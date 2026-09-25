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
  // 말 잇기 표현 — 모든 유형 공통 (common: true)
  'c-stall': {
    name: '막힐 때', about: '"음…" 대신 시간 벌기', common: true,
    items: [
      { id: 'c-think', phrase: 'Well, let me think.', ko: '음, 생각해 볼게요.', slot: '첫 마디가 안 떠오를 때',
        say: 'Well, let me think about that.', key: 'let me think',
        ask: 'What do you usually do on weekends?', example: 'Well, let me think. I usually meet my friends on weekends.' },
      { id: 'c-goodq', phrase: "That's a good question.", ko: '좋은 질문이네요.', slot: '질문을 듣고 답이 바로 안 나올 때',
        say: "That's a good question. I've never really thought about it.", key: 'good question',
        ask: 'What is the best gift you have ever received?', example: "That's a good question. I think the best gift was a watch from my parents." },
      { id: 'c-letmesee', phrase: 'Let me see.', ko: '어디 보자.', slot: '기억이나 날짜·숫자를 떠올릴 때',
        say: 'Let me see. I think it was last summer.', key: 'let me see',
        ask: 'When was the last time you went on a trip?', example: 'Let me see. I think it was last summer. I went to Busan with my friends.' },
    ],
  },
  'c-add': {
    name: '이유 더하기', about: '이유를 하나 더 붙이기', common: true,
    items: [
      { id: 'c-ontop', phrase: 'On top of that, …', ko: '게다가, …', slot: '이유를 하나 더 붙일 때',
        say: "On top of that, it's much cheaper.", key: 'on top of that',
        ask: 'Why do you like shopping online?', example: "It saves a lot of time. On top of that, it's often cheaper." },
      { id: 'c-another', phrase: 'Another reason is that …', ko: '또 다른 이유는 …', slot: '두 번째 이유를 꺼낼 때',
        say: "Another reason is that it's good for my health.", key: 'another reason is',
        ask: 'Why do you like walking?', example: "It helps me relax. Another reason is that it's good for my health." },
      { id: 'c-also', phrase: 'Also, …', ko: '그리고, …', slot: '짧게 하나 덧붙일 때',
        say: 'Also, the staff there are really friendly.', key: 'also',
        ask: 'Why do you like your favorite restaurant?', example: 'The food is great. Also, the staff there are really friendly.' },
    ],
  },
  'c-ex': {
    name: '예시 들기', about: '이유를 예로 받쳐주기', common: true,
    items: [
      { id: 'c-giveex', phrase: 'Let me give you an example.', ko: '예를 하나 들어볼게요.', slot: '이유 뒤, 예시로 넘어가는 신호',
        say: 'Let me give you an example.', key: 'give you an example',
        ask: 'Is it important to learn how to cook?', example: 'Yes, I think so. Let me give you an example. When I lived alone, cooking saved me a lot of money.' },
      { id: 'c-instance', phrase: 'For instance, …', ko: '예를 들어, …', slot: '예시를 바로 들 때',
        say: 'For instance, I often cook pasta at home.', key: 'for instance',
        ask: 'Do you like cooking at home?', example: 'Yes, I do. For instance, I often cook pasta at home on weekends.' },
      { id: 'c-goodex', phrase: 'A good example is …', ko: '좋은 예가 …예요.', slot: '구체적인 대상 하나를 가리킬 때',
        say: 'A good example is my neighborhood library.', key: 'a good example is',
        ask: 'Are there good public places in your area?', example: "Yes, there are. A good example is my neighborhood library. It's quiet and free." },
    ],
  },
  'c-clarify': {
    name: '풀어 말하기', about: '방금 한 말을 쉽게, 구체적으로', common: true,
    items: [
      { id: 'c-mean', phrase: 'What I mean is …', ko: '제 말은 …', slot: '방금 한 말을 쉽게 다시 말할 때',
        say: 'What I mean is, it saves a lot of time.', key: 'what i mean is',
        ask: 'Why do you like online banking?', example: "It's really convenient. What I mean is, it saves a lot of time." },
      { id: 'c-otherwords', phrase: 'In other words, …', ko: '다시 말해, …', slot: '앞 내용을 한 줄로 정리할 때',
        say: "In other words, it's worth the money.", key: 'in other words',
        ask: 'Is a gym membership worth the money?', example: "I go to the gym almost every day. In other words, it's worth the money." },
      { id: 'c-specific', phrase: 'To be more specific, …', ko: '구체적으로 말하면, …', slot: '막연한 답에 시간·장소·횟수를 붙일 때',
        say: 'To be more specific, I go there every Friday night.', key: 'to be more specific',
        ask: 'How often do you eat out?', example: 'I eat out quite often. To be more specific, I go to a restaurant every Friday night.' },
    ],
  },
  'c-contrast': {
    name: '반대·양보', about: '단점이나 다른 쪽 말하기', common: true,
    items: [
      { id: 'c-however', phrase: 'However, …', ko: '하지만, …', slot: '단점이나 반대 사실을 말할 때',
        say: 'However, it can be a little expensive.', key: 'however',
        ask: 'What do you think about taking taxis?', example: 'Taxis are fast and comfortable. However, they can be a little expensive.' },
      { id: 'c-otherhand', phrase: 'On the other hand, …', ko: '반면에, …', slot: '두 가지를 비교할 때',
        say: 'On the other hand, working alone is less stressful.', key: 'on the other hand',
        ask: 'Do you prefer working alone or in a team?', example: 'Working in a team is fun. On the other hand, working alone is less stressful.' },
      { id: 'c-eventhough', phrase: 'Even though …, …', ko: '…이긴 하지만, …', slot: '단점을 인정하고 내 선택을 말할 때',
        say: "Even though it's far, I still go there often.", key: 'even though',
        ask: 'Do you have a favorite place that is far from your home?', example: "Yes. There's a park by the river. Even though it's far, I still go there often." },
    ],
  },
  'c-result': {
    name: '원인·결과', about: '그래서 어떻게 됐는지', common: true,
    items: [
      { id: 'c-thatswhy', phrase: "That's why I …", ko: '그래서 저는 …', slot: '이유를 말한 뒤 답을 다시 묶을 때',
        say: "That's why I prefer to take the subway.", key: "that's why",
        ask: 'Do you prefer taking the bus or the subway?', example: "The subway is never stuck in traffic. That's why I prefer to take the subway." },
      { id: 'c-becauseofthat', phrase: 'Because of that, …', ko: '그 때문에, …', slot: '원인을 말한 뒤 결과를 이을 때',
        say: 'Because of that, I always leave home early.', key: 'because of that',
        ask: 'How is the traffic in your city?', example: 'The traffic is really bad in the morning. Because of that, I always leave home early.' },
      { id: 'c-asresult', phrase: 'As a result, …', ko: '그 결과, …', slot: '경험을 말한 뒤 얻은 것을 말할 때',
        say: 'As a result, I saved a lot of money.', key: 'as a result',
        ask: 'Have you ever changed a habit?', example: 'I stopped buying coffee every day. As a result, I saved a lot of money.' },
    ],
  },
  'c-exp': {
    name: '내 경험 꺼내기', about: '시간 채우기, 특히 11번', common: true,
    items: [
      { id: 'c-mycase', phrase: 'In my case, …', ko: '제 경우에는, …', slot: '일반론 대신 내 이야기로 시작할 때',
        say: 'In my case, I usually study at a cafe.', key: 'in my case',
        ask: 'Where do people usually study?', example: 'Many people study at home. In my case, I usually study at a cafe.' },
      { id: 'c-college', phrase: 'When I was in college, …', ko: '대학생 때, …', slot: '예시로 과거 경험을 꺼낼 때',
        tip: '대학 경험이 없으면 When I was in high school 처럼 바꿔 쓰세요.',
        say: 'When I was in college, I worked part-time at a bookstore.', key: 'when i was',
        ask: 'Have you ever had a part-time job?', example: 'Yes. When I was in college, I worked part-time at a bookstore.' },
      { id: 'c-remember', phrase: 'I remember when …', ko: '…했던 때가 기억나요.', slot: '짧은 이야기로 시간을 채울 때',
        say: 'I remember when I first moved to Seoul.', key: 'i remember when',
        ask: 'Have you ever felt lost in a new place?', example: 'Yes. I remember when I first moved to Seoul. Everything felt so big.' },
    ],
  },
  'c-close': {
    name: '마무리', about: '답을 한 문장으로 묶기', common: true,
    items: [
      { id: 'c-overall', phrase: 'So overall, …', ko: '그래서 전체적으로, …', slot: '답변을 한 문장으로 정리할 때',
        say: "So overall, I think it's a great idea.", key: 'overall',
        ask: 'Is it a good idea to learn a new language?', example: "It can give you more job chances. So overall, I think it's a great idea." },
      { id: 'c-mainreason', phrase: "That's the main reason why …", ko: '그게 …하는 가장 큰 이유예요.', slot: '이유를 말한 뒤 답으로 돌아갈 때',
        say: "That's the main reason why I like it.", key: 'the main reason why',
        ask: 'Why do you like your hometown?', example: "My family and friends live there. That's the main reason why I like it." },
      { id: 'c-thesereasons', phrase: 'For these reasons, …', ko: '이런 이유로, …', slot: '이유 두 개 뒤 의견을 다시 말할 때 (11번)',
        say: 'For these reasons, I prefer living in the city.', key: 'for these reasons',
        ask: 'Do you prefer living in the city or the countryside?', example: 'There are more jobs and better transportation. For these reasons, I prefer living in the city.' },
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
