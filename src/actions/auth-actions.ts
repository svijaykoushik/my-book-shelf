"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export async function login(prevState: any, formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error: {
        code: error.code,
        message: error.message,
        name: error.name,
        status: error.status,
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data: SignUpWithPasswordCredentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        display_name:
          (formData.get("firstName") + " " + formData.get("lastName"))
            .trim(),
        first_name: formData.get("firstName"),
        last_name: formData.get("lastName"),
        name: (formData.get("firstName") + " " + formData.get("lastName"))
          .trim(),
      },
    },
  };
  console.log('Signin data',data)
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return {
      error: {
        code: error.code,
        message: error.message,
        name: error.name,
        status: error.status,
      },
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
