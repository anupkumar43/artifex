import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export async function GET() {
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
