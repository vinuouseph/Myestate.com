import { verifyToken } from '../utils/verifyUser.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('./error', () => ({
  errorHandler: jest.fn(),
}));

describe('verifyToken', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {
        access_token: 'valid_token',
      },
    };
    res = {};
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next with an error if token is not provided', () => {
    req.cookies.access_token = undefined;

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(errorHandler(401, 'Unauthorized'));
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('should call jwt.verify with the correct arguments', () => {
    const token = req.cookies.access_token;
    const secret = 'something1234';

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret, expect.any(Function));
  });

  it('should call next with an error if jwt.verify returns an error', () => {
    const error = new Error('Invalid token');
    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(error);
    });

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(errorHandler(403, 'Forbidden'));
    expect(req.user).toBeUndefined();
  });

  it('should set req.user and call next if jwt.verify succeeds', () => {
    const user = { id: 1, username: 'john' };
    jwt.verify.mockImplementationOnce((token, secret, callback) => {
      callback(null, user);
    });

    verifyToken(req, res, next);

    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalled();
  });
});