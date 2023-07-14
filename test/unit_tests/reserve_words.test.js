import getReserved from '../../utils/reserve_words.js';

describe('reserve_words', () => {
  test('contains at least one reserve_words', () => {

    const reservedWords = getReserved();
    expect(reservedWords.length).toBeGreaterThan(0);
  });

});