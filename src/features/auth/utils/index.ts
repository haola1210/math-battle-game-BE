import { sign, SignOptions } from 'jsonwebtoken';

export default function generateToken(
  payload: string | object | Buffer,
  secret: string,
  options: SignOptions,
) {
  return new Promise<string>((res, rej) => {
    sign(payload, secret, options, (err, token) => {
      if (err) {
        return rej(err);
      }
      if (token) {
        return res(token);
      }
    });
  });
}
