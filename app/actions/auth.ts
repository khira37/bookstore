'use server';

import bcrypt from 'bcryptjs';
import { writeClient } from '@/sanity/lib/client';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function signUpAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // 1. Check if user already exists
  const existingUser = await writeClient.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email }
  );

  if (existingUser) {
    return { error: 'An account with this email already exists.' };
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create document in Sanity DB
  const newUser = await writeClient.create({
    _type: 'user',
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    });

  // 4. Create Session Cookie & Redirect
  await createSession(newUser._id, newUser.email);
  redirect('/');
}

export async function signInAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please fill in all fields.' };
  }

  // 1. Find user in DB
  const user = await writeClient.fetch(
    `*[_type == "user" && email == $email][0]`,
    { email }
  );

  if (!user || !user.password) {
    return { error: 'Invalid email or password.' };
  }

  // 2. Compare hashed password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: 'Invalid email or password.' };
  }

  // 3. Create Session Cookie & Redirect
  await createSession(user._id, user.email);
  redirect('/');
}

export async function signOutAction() {
  await deleteSession();
  redirect('/sign-in');
}