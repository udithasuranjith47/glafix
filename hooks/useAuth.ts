"use client";

import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict${secure}`;
      } else {
        document.cookie = "__session=; path=/; max-age=0";
      }
    });

    return () => unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict${secure}`;
    return credential.user;
  }

  async function signOut() {
    await firebaseSignOut(auth);
    document.cookie = "__session=; path=/; max-age=0";
    router.push("/admin/login");
  }

  return { user, loading, signIn, signOut };
}
