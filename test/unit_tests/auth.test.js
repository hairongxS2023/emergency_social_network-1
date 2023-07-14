import auth from "../../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import { createRequest, createResponse } from "node-mocks-http";
import Auth from "../../middleware/auth.js";

describe('Auth', () => {
  const originalSecret = process.env.JWTSECRET;
  beforeAll(() => {
    process.env.JWTSECRET = 'FSES2023SB3HAKANYYDS';
  });

  afterAll(() => {
    process.env.JWTSECRET = originalSecret;
  });

  test('1. genToken should generate a valid token', async () => {
    const payload = { username: 'testUser', authority: 'citizen' };
    const token = await Auth.genToken(payload);

    expect(token).toBeTruthy();

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    expect(decoded.username).toBe(payload.username);
    expect(decoded.authority).toBe(payload.authority);
  });

  test('2. verifyToken should allow access for valid tokens', () => {
    const payload = { username: 'testUser', authority: 'citizen' };
    const token = jwt.sign(payload, process.env.JWTSECRET);
    const req = { headers: { cookie: `access_token=${token}` } };
    const res = { redirect: jest.fn() };
    const next = jest.fn();

    Auth.verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
    expect(req.username).toBe(payload.username);
    expect(req.authority).toBe(payload.authority);
  });

  test('3. verifyToken should redirect for invalid tokens', () => {
    const token = 'invalid.token.string';
    const req = { headers: { cookie: `access_token=${token}` } };
    const res = { redirect: jest.fn() };
    const next = jest.fn();

    Auth.verifyToken(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  test('4. getUserFromToken should return a user object for valid tokens', () => {
    const payload = { username: 'testUser', authority: 'citizen' };
    const token = jwt.sign(payload, process.env.JWTSECRET);
    const req = { headers: { cookie: `access_token=${token}` } };

    const user = Auth.getUserFromToken(req);

    expect(user.username).toBe(payload.username);
    expect(user.authority).toBe(payload.authority);
  });

  test('5. getUserFromToken should throw an error for invalid tokens', () => {
    const token = 'invalid.token.string';
    const req = { headers: { cookie: `access_token=${token}` } };

    expect(() => Auth.getUserFromToken(req)).toThrowError('Invalid or expired token');
  });

  test('6. genToken should handle error when jwt.sign fails', async () => {
    // Mock jwt.sign to force an error
    const originalSign = jwt.sign;
    jwt.sign = jest.fn((payload, secret, options, callback) => {
      callback(new Error('jwt.sign error'), null);
    });
  
    const payload = { username: 'testUser', authority: 'citizen' };
  
    try {
      await Auth.genToken(payload);
    } catch (error) {
      expect(error).toBe(false);
    }
  
    // Restore original jwt.sign function
    jwt.sign = originalSign;
  });
  
});

