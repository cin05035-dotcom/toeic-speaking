const test = require('node:test');
const assert = require('node:assert');
const { usesPattern } = require('./judge.js');
const { TYPES, EXPR } = require('./data.js');

test('세트의 문항 수가 유형의 시간표와 맞는다', () => {
  for (const [id, t] of Object.entries(TYPES)) {
    for (const s of t.sets || []) assert.strictEqual(s.items.length, t.times.length, id);
  }
});

test('표현의 따라 말하기 문장과 예시 답이 확인할 표현을 실제로 담고 있다', () => {
  const ids = new Set();
  for (const g of Object.values(EXPR)) {
    for (const e of g.items) {
      assert.ok(!ids.has(e.id), '중복 id ' + e.id); ids.add(e.id);
      assert.ok(usesPattern(e.key, e.say), e.id + ' say');
      assert.ok(usesPattern(e.key, e.example), e.id + ' example');
    }
  }
});
