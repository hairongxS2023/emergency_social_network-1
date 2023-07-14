import stopwords from '../../utils/stopwords.js';

describe('stopwords', () => {
  test('contains at least one stopword', () => {
    expect(stopwords.length).toBeGreaterThan(0);
  });

});