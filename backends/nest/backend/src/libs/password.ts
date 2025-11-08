import * as argon2 from 'argon2';

const hashPassword  = async (password: string): Promise<string> => {
  return await argon2.hash(password,{
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
  });
}

const verifyPassword = async (hashedPassword: string, plainPassword: string): Promise<boolean> => {
  return await argon2.verify(hashedPassword, plainPassword);
}

export {hashPassword,verifyPassword};