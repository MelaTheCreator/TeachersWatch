import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const filePath = path.join(process.cwd(), "data", "users.json");

async function readUsers(): Promise<User[]> {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data || "[]");
}

async function writeUsers(users: User[]) {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  const users = await readUsers();

  const exists = users.find((u) => u.email === email);
  if (exists) {
    throw new Error("User existiert bereits");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  await writeUsers(users);

  return newUser;
}

export async function verifyUser(email: string, password: string) {
  const users = await readUsers();

  const user = users.find((u) => u.email === email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  return user;
}
