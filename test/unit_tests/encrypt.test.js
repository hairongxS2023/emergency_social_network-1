import bcrypt from "bcryptjs";
import Encryption from '../../middleware/encrypt';
import {jest } from '@jest/globals';

test('1. encrypt should hash the password', async () => {
  const password = 'testPassword';
  const hash = await Encryption.encrypt(password);
  expect(hash).not.toBe(password);
  expect(hash.length).toBeGreaterThan(0);
});

test('2. checkPassword should return true for the correct password', async () => {
  const password = 'testPassword';
  const hash = await Encryption.encrypt(password);
  const isMatch = await Encryption.checkPassword(password, hash);
  expect(isMatch).toBe(true);
});

test('3. checkPassword should return false for an incorrect password', async () => {
  const password = 'testPassword';
  const wrongPassword = 'wrongPassword';
  const hash = await Encryption.encrypt(password);
  const isMatch = await Encryption.checkPassword(wrongPassword, hash);
  expect(isMatch).toBe(false);
});

test('4. encrypt should reject with an error when bcrypt.hash fails', async () => {
  const originalBcryptHash = bcrypt.hash;
  bcrypt.hash = jest.fn((password, saltRounds, callback) => {
    callback(new Error('Mocked bcrypt.hash error'), null);
  });

  const password = 'testPassword';
  expect.assertions(1);

  try {
    await Encryption.encrypt(password);
  } catch (err) {
    expect(err.message).toBe('Mocked bcrypt.hash error');
  }

  // Restore the original bcrypt.hash implementation
  bcrypt.hash = originalBcryptHash;
});
