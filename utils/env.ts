import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://www.automationexercise.com',
  email: required('USER_EMAIL'),
  password: required('USER_PASSWORD'),
  name: required('USER_NAME'),
};
