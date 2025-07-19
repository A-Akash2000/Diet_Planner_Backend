import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt.
 * @param password - The plain text password.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

/**
 * Verifies a plain text password against a hashed password.
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password.
 * @returns A promise that resolves to true if the password matches, false otherwise.
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}


// import { hashPassword, verifyPassword } from './passwordUtils';

// async function run() {
//   const password = 'my_secure_password';
//   const hashed = await hashPassword(password);
//   console.log('Hashed:', hashed);

//   const isMatch = await verifyPassword(password, hashed);
//   console.log('Password valid?', isMatch);
// }

// run();

