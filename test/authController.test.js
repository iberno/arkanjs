import { expect } from 'chai';
import sinon from 'sinon';
import { authController } from '../src/controllers/auth/authController.js';
import { UserModel } from '../src/models/auth/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

console.log('Test file loaded');

describe('authController', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return a token when login is successful', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    const user = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      is_active: true,
    };

    sinon.stub(UserModel, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compare').resolves(true);
    sinon.stub(jwt, 'sign').returns('fakeToken');

    await authController.login(req, res);

    expect(res.json.calledOnce).to.be.true;
    expect(res.json.firstCall.args[0]).to.deep.equal({ token: 'fakeToken' });
  });

  it('should return 404 if user is not found or inactive', async () => {
    const req = {
      body: {
        email: 'nonexistent@example.com',
        password: 'password123',
      },
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    sinon.stub(UserModel, 'findOne').resolves(null);

    await authController.login(req, res);

    expect(res.status.calledOnceWith(404)).to.be.true;
    expect(res.json.calledOnceWith({ error: 'Usuário inválido ou inativo' })).to.be.true;
  });

  it('should return 401 if password is incorrect', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'wrongPassword',
      },
    };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    const user = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      is_active: true,
    };

    sinon.stub(UserModel, 'findOne').resolves(user);
    sinon.stub(bcrypt, 'compare').resolves(false);

    await authController.login(req, res);

    expect(res.status.calledOnceWith(401)).to.be.true;
    expect(res.json.calledOnceWith({ error: 'Senha incorreta' })).to.be.true;
  });
});
