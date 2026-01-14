"use client";

// localStorage 기반 사용자 인증 저장소
// Phase 3에서 DB로 마이그레이션 예정

export interface StoredUser {
  id: string;
  email: string;
  nickname: string;
  passwordHash: string;
  level: number;
  levelName: string;
  xp: number;
  profileImage: string | null;
  createdAt: string;
}

const USERS_STORAGE_KEY = "kimchupa-users";

// SHA-256 해싱 (클라이언트 사이드용)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// 저장된 모든 사용자 가져오기
function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// 사용자 목록 저장
function saveUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// 이메일로 사용자 조회
export function getUserByEmail(email: string): StoredUser | null {
  const users = getStoredUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// 이메일 중복 체크
export function isEmailTaken(email: string): boolean {
  return getUserByEmail(email) !== null;
}

// 비밀번호 유효성 검사
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "비밀번호는 8자 이상이어야 합니다." };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: "비밀번호에 영문자가 포함되어야 합니다." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "비밀번호에 숫자가 포함되어야 합니다." };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: "비밀번호에 특수문자가 포함되어야 합니다." };
  }
  return { valid: true, message: "" };
}

// 이메일 유효성 검사
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 신규 사용자 등록
export async function registerUser(
  email: string,
  password: string,
  nickname: string
): Promise<{ success: boolean; user?: StoredUser; error?: string }> {
  // 이메일 형식 검사
  if (!validateEmail(email)) {
    return { success: false, error: "올바른 이메일 형식이 아닙니다." };
  }

  // 이메일 중복 검사
  if (isEmailTaken(email)) {
    return { success: false, error: "이미 사용 중인 이메일입니다." };
  }

  // 비밀번호 유효성 검사
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.message };
  }

  // 닉네임 검사
  if (!nickname || nickname.trim().length < 2) {
    return { success: false, error: "닉네임은 2자 이상이어야 합니다." };
  }

  // 비밀번호 해싱
  const passwordHash = await hashPassword(password);

  // 신규 사용자 생성
  const newUser: StoredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: email.toLowerCase(),
    nickname: nickname.trim(),
    passwordHash,
    level: 1,
    levelName: "김치 새싹",
    xp: 0,
    profileImage: null,
    createdAt: new Date().toISOString(),
  };

  // 저장
  const users = getStoredUsers();
  users.push(newUser);
  saveUsers(users);

  return { success: true, user: newUser };
}

// 사용자 인증 (로그인)
export async function authenticateUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: StoredUser; error?: string }> {
  // 데모 계정 처리
  if (email.toLowerCase() === "demo@kimchupa.com" && password === "demo1234") {
    return {
      success: true,
      user: {
        id: "demo",
        email: "demo@kimchupa.com",
        nickname: "김치새싹",
        passwordHash: "",
        level: 1,
        levelName: "김치 새싹",
        xp: 0,
        profileImage: null,
        createdAt: new Date().toISOString(),
      },
    };
  }

  const user = getUserByEmail(email);
  if (!user) {
    return { success: false, error: "등록되지 않은 이메일입니다." };
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return { success: false, error: "비밀번호가 일치하지 않습니다." };
  }

  return { success: true, user };
}

// 사용자 정보 업데이트 (레벨, XP 등)
export function updateUser(email: string, updates: Partial<StoredUser>): boolean {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  if (index === -1) return false;

  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return true;
}

// XP 추가 및 레벨 계산
export function addUserXp(email: string, amount: number): StoredUser | null {
  const user = getUserByEmail(email);
  if (!user) return null;

  const newXp = user.xp + amount;
  let newLevel = user.level;
  let newLevelName = user.levelName;

  // 레벨 계산
  if (newXp >= 50000) {
    newLevel = 7;
    newLevelName = "김치 명인";
  } else if (newXp >= 15000) {
    newLevel = 6;
    newLevelName = "김치 달인";
  } else if (newXp >= 5000) {
    newLevel = 5;
    newLevelName = "김치 장인";
  } else if (newXp >= 2000) {
    newLevel = 4;
    newLevelName = "김치 요리사";
  } else if (newXp >= 500) {
    newLevel = 3;
    newLevelName = "김치 수습생";
  } else if (newXp >= 100) {
    newLevel = 2;
    newLevelName = "김치 입문자";
  } else {
    newLevel = 1;
    newLevelName = "김치 새싹";
  }

  updateUser(email, { xp: newXp, level: newLevel, levelName: newLevelName });

  return { ...user, xp: newXp, level: newLevel, levelName: newLevelName };
}
