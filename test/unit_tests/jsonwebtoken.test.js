import jwt from  'jsonwebtoken';
 
test('JWT token is generated and verified', () => {
  const payload = { userId: 123 };
  const secret = 'userpasswordsecret';
  const options = { expiresIn: '1h' };
  const token = jwt.sign(payload, secret, options);

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      throw err;
    } else {
      expect(decoded.userId).toEqual(payload.userId);
    }
  });
});