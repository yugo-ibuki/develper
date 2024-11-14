import { supabase } from '@/configs/supabase';

// 基本的な型定義
export type User = {
  id: string;
  email: string;
  authId: string;
  createdAt: string;
  updatedAt: string;
  profiles?: Profile;
};

export type Profile = {
  id: string;
  userId: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

// ユーザー作成
export async function createUser({ email, authId }: { email: string; authId: string }) {
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({ email, authId })
    .select()
    .single();

  if (userError) throw userError;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert({
      userId: user.id,
      displayName: email.split('@')[0], // メールアドレスのローカル部分をデフォルト名として使用
    })
    .select()
    .single();

  if (profileError) throw profileError;

  return { user: { ...user, profiles: profile } };
}

// Auth IDによるユーザー取得
export async function getUserByAuthId(authId: string) {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      *,
      profiles (*)
    `
    )
    .eq('authId', authId)
    .single();

  if (error) throw error;
  return data as User;
}

// IDによるユーザー取得
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      *,
      profiles (*)
    `
    )
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as User;
}

// プロフィール取得
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('*').eq('userId', userId).single();

  if (error) throw error;
  return data as Profile;
}

// プロフィール更新
export async function updateUserProfile(
  userId: string,
  data: Partial<{
    displayName: string;
    avatar: string;
    bio: string;
  }>
) {
  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('userId', userId)
    .select()
    .single();

  if (error) throw error;
  return updatedProfile as Profile;
}

// ユーザー削除（必要な場合）
export async function deleteUser(userId: string) {
  const { error } = await supabase.from('users').delete().eq('id', userId);

  if (error) throw error;
  return true;
}
