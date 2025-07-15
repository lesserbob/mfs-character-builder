import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

export const registerUser = async (username: string, password: string) => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  return user;
};

/**
 * Get a user by their username
 */
export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
};

/**
 * Create a new user
 * @param username Username of the new user
 * @param password Password of the new user (domain entity)
 * @returns The new user
 */
export const createUser = async (username: string, password: string) => {
  // Hash password
  // No matter what: NEVER STORE UNHASHED PASSWORDS IN THE DATABASE
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  });
  return user;
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      username: true,
      type: true,
    },
  });
  return user;
};

export const changePassword = async (id: number, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: id },
    data: {
      password: hashedPassword,
    },
  });

  return getUserById(id);
};
