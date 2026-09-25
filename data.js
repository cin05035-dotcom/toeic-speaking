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
    }, {
      items: [
        { text: "Good morning, and thank you for tuning in to City Radio. Traffic is moving slowly on Main Street this morning because of road repairs. Drivers heading downtown should use Park Avenue, Oak Street, or the Riverside Highway instead. We'll have another traffic update at eight thirty." },
        { text: 'Are you looking for a comfortable place to work out? Green Fitness Center is now open on Elm Street. We offer yoga classes, swimming lessons, and personal training. Sign up before the end of the month, and your first week is free. Visit our website for more details.' },
      ],
    }, {
      items: [
        { text: 'Welcome to the Maple Hill Museum tour. Today, we will visit three galleries, a sculpture garden, and our new science room. Please do not take photos inside the galleries. The tour will last about one hour, and it will end at the gift shop on the first floor.' },
        { text: "Hello, this is Karen from Bright Dental Clinic. I'm calling to remind you of your appointment on Thursday, June fourth, at two fifteen. If you need to change the time, please call us at 555-0198. Also, remember to bring your insurance card. Thank you, and have a nice day." },
      ],
    }, {
      items: [
        { text: "In local news, the city library will open a new branch next Monday. The building has a reading room, a children's area, and a small café. Library officials say the new branch will be open seven days a week. Residents can apply for a library card online or in person." },
        { text: "Good evening, everyone, and welcome to our annual awards dinner. Tonight, we will celebrate the hard work of our sales, marketing, and design teams. Before we begin, I'd like to thank our sponsors for their support. Now, please give a warm welcome to our president, Mr. David Chen." },
      ],
    }, {
      items: [
        { text: 'Attention, passengers on Flight 305 to Vancouver. Your departure gate has been changed from Gate 12 to Gate 18. Boarding will begin in fifteen minutes. Please have your boarding pass and passport ready. We apologize for any inconvenience, and thank you for flying with Sky Air.' },
        { text: 'Thank you for calling Sunrise Hotel. Our front desk is open twenty-four hours a day. If you would like to make a reservation, please press one. For questions about our restaurant, spa, or parking, please press two. To speak with a staff member, please stay on the line.' },
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
    }, {
      intro: 'Imagine that a marketing company is doing research in your country. You have agreed to participate in a telephone interview about exercise.',
      items: [
        { ask: 'How often do you exercise, and where do you usually do it?' },
        { ask: 'Do you prefer to exercise alone or with other people? Why?' },
        { ask: 'If a new gym opened in your neighborhood, what would make you want to join it?' },
      ],
    }, {
      intro: 'Imagine that a friend is visiting your city next month. You are talking on the telephone about restaurants in your area.',
      items: [
        { ask: 'What kind of restaurants are popular in your area?' },
        { ask: 'When was the last time you went to a restaurant, and what did you eat?' },
        { ask: 'What would you recommend for someone who wants to try local food? Why?' },
      ],
    }, {
      intro: 'Imagine that a publishing company is doing research in your country. You have agreed to participate in a telephone interview about reading.',
      items: [
        { ask: 'How often do you read books, and what kind of books do you read?' },
        { ask: 'Do you prefer reading paper books or e-books? Why?' },
        { ask: 'Would you be interested in joining a book club? Why or why not?' },
      ],
    }, {
      intro: 'Imagine that a marketing company is doing research in your area. You have agreed to participate in a telephone interview about online shopping.',
      items: [
        { ask: 'When was the last time you bought something online, and what did you buy?' },
        { ask: 'What is the most important thing to you when you shop online?' },
        { ask: 'Do you think online shopping will replace shopping in stores in the future? Why or why not?' },
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
    }, {
      intro: "Hi, this is Emily Carter. I'm going on a business trip to Tokyo next week, but I don't have my itinerary with me. I'd like to ask you some questions.",
      table: {
        title: 'Travel Itinerary — Emily Carter',
        sub: 'Sales Manager · Tokyo Trip, October 5–7',
        rows: [
          ['Mon 9:30 a.m.', 'Depart Seoul (Flight KA 702) — arrive Tokyo 11:50 a.m.'],
          ['Mon 3:00 p.m.', 'Meeting with Tanaka Electronics'],
          ['Tue 10:00 a.m.', 'Factory Tour — CANCELED'],
          ['Tue 1:00 p.m.', 'Lunch with sales team — Sakura Restaurant'],
          ['Wed 4:00 p.m.', 'Return flight (KA 705)'],
        ],
      },
      items: [
        { ask: 'What time does my flight leave on Monday, and when do I arrive in Tokyo?' },
        { ask: "I think I'm going on a factory tour on Tuesday morning. Is that right?" },
        { ask: 'Could you give me all the details about my meetings and meals during the trip?', repeat: true },
      ],
    }, {
      intro: "Hello, I'm interested in taking some classes at your community center this spring. I have a few questions.",
      table: {
        title: 'Oakwood Community Center — Spring Classes',
        sub: 'March 2 – April 27 · $40 per class',
        rows: [
          ['Mon 6:00 p.m.', 'Beginner Photography — Room 101 (Instructor: Mark Lee)'],
          ['Tue 7:00 p.m.', 'Korean Cooking — Kitchen Studio'],
          ['Wed 6:30 p.m.', 'Yoga for Beginners — Gym'],
          ['Thu 7:00 p.m.', 'Advanced Photography — Room 101 (Instructor: Mark Lee)'],
          ['Sat 10:00 a.m.', 'Watercolor Painting — Room 203'],
        ],
      },
      items: [
        { ask: 'When do the spring classes start, and how much does each class cost?' },
        { ask: 'I heard the yoga class is on Thursday evening. Is that correct?' },
        { ask: "I'm interested in photography. Could you tell me about the photography classes you offer?", repeat: true },
      ],
    }, {
      intro: "Hi, this is Susan from the HR department. I'm supposed to join the interviews on Friday, but I can't find the schedule. Can you help me?",
      table: {
        title: 'Interview Schedule — Marketing Assistant',
        sub: 'Friday, June 12 · Conference Room B',
        rows: [
          ['9:00 a.m.', 'Jason Miller — Current job: Sales, ABC Corp.'],
          ['10:00 a.m.', 'Rachel Kim — Recent graduate, Hanil University'],
          ['11:00 a.m.', 'Tom Parker — CANCELED'],
          ['1:30 p.m.', 'Olivia Brown — Current job: Marketing, Star Media'],
          ['2:30 p.m.', 'Daniel Park — Current job: Marketing, Bright Ads'],
        ],
      },
      items: [
        { ask: 'Where will the interviews take place, and who is the first interviewee?' },
        { ask: "I heard that Tom Parker's interview is at 11. Is that right?" },
        { ask: 'Could you tell me about the candidates who have marketing experience?', repeat: true },
      ],
    }, {
      intro: "Hi, I'm planning to attend the Green Business Conference next week. I'd like to check some details.",
      table: {
        title: 'Green Business Conference',
        sub: 'Thursday, September 17 · City Convention Center · Fee: $50 (lunch included)',
        rows: [
          ['9:00 a.m.', 'Welcome Speech — Karen White, CEO'],
          ['9:30 a.m.', 'Talk: Saving Energy at the Office — Hall A'],
          ['11:00 a.m.', 'Workshop: Eco-Friendly Packaging — Room 3'],
          ['12:30 p.m.', 'Lunch (included)'],
          ['2:00 p.m.', 'Talk: Recycling for Small Businesses — Hall A → MOVED to 3:00 p.m.'],
          ['4:00 p.m.', 'Closing Remarks'],
        ],
      },
      items: [
        { ask: 'Where is the conference held, and how much is the registration fee?' },
        { ask: "I'd like to attend the talk on recycling. It starts at 2 p.m., right?" },
        { ask: 'What sessions are there in the morning after the welcome speech?', repeat: true },
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
    }, {
      items: [{ ask: 'Which do you think is better for a company: hiring experienced workers or hiring new graduates? Give specific reasons and examples to support your opinion.' }],
    }, {
      items: [{ ask: 'Do you agree or disagree with the following statement? It is better to live in a big city than in a small town. Give specific reasons and examples to support your opinion.' }],
    }, {
      items: [{ ask: 'What is the most important quality for a good team leader: good communication skills, creativity, or experience? Give specific reasons and examples to support your opinion.' }],
    }, {
      items: [{ ask: 'Some people think that companies should allow employees to work from home a few days a week. Do you agree or disagree? Give specific reasons and examples to support your opinion.' }],
    }],
  },
};

if (typeof module !== 'undefined') module.exports = { TYPES };
