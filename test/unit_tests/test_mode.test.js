import TestMode from '../../middleware/test_mode.js';
import { jest } from '@jest/globals'
//const { describe, it, expect } = require('@jest/globals');

describe('TestMode', () => {
  describe('checkTestMode', () => {
    it('should call next if isTestMode is false', () => {
      // Arrange
      const req = { app: { get: jest.fn().mockReturnValue(false) } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      // Act
      TestMode.checkTestMode(req, res, next);

      // Assert
      expect(req.app.get).toHaveBeenCalledWith('isTestMode');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if isTestMode is true', () => {
      // Arrange
      const req = { app: { get: jest.fn().mockReturnValue(true) } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      // Act
      TestMode.checkTestMode(req, res, next);

      // Assert
      expect(req.app.get).toHaveBeenCalledWith('isTestMode');
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "The server is in test mode. Access denied." });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
