export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

const USERS_STORAGE_KEY = "oracle.users";
const CURRENT_USER_STORAGE_KEY = "oracle.currentUser";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function listUsers(): User[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!rawUsers) {
    return [];
  }

  try {
    const parsedUsers: unknown = JSON.parse(rawUsers);
    return Array.isArray(parsedUsers) ? parsedUsers.filter(isUser) : [];
  } catch {
    return [];
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const currentUserId = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);

  if (!currentUserId) {
    return null;
  }

  return listUsers().find((user) => user.id === currentUserId) ?? null;
}

export function registerUser(input: RegisterInput): AuthResult {
  const username = input.username.trim();
  const email = normalizeEmail(input.email);
  const users = listUsers();

  if (!username) {
    return { ok: false, error: "Username is required." };
  }

  if (!email) {
    return { ok: false, error: "Email is required." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  if (!input.password) {
    return { ok: false, error: "Password is required." };
  }

  if (input.password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  if (input.confirmPassword !== input.password) {
    return { ok: false, error: "Passwords do not match." };
  }

  if (users.some((user) => user.email.toLowerCase() === email)) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const now = new Date().toISOString();
  const user: User = {
    id: createId(),
    username,
    email,
    // Local MVP only: this stores the demo password in localStorage.
    // Replace this with server-side auth and password hashing before production use.
    password: input.password,
    createdAt: now,
    updatedAt: now,
  };

  writeUsers([...users, user]);
  setCurrentUser(user);

  return { ok: true, user };
}

export function loginUser(input: LoginInput): AuthResult {
  const email = normalizeEmail(input.email);

  if (!email) {
    return { ok: false, error: "Email is required." };
  }

  if (!input.password) {
    return { ok: false, error: "Password is required." };
  }

  const user = listUsers().find((candidate) => candidate.email.toLowerCase() === email);

  if (!user) {
    return { ok: false, error: "No local account was found for that email." };
  }

  if (user.password !== input.password) {
    return { ok: false, error: "That password does not match this local account." };
  }

  setCurrentUser(user);

  return { ok: true, user };
}

export function logoutUser(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

function setCurrentUser(user: User) {
  window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, user.id);
}

function writeUsers(users: User[]) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `local-user-${Date.now()}`;
}

function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<User>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.username === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.password === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}
