import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Admin() {
  const user = await currentUser();
  if (!user) redirect("/");

  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!adminEmail || userEmail !== adminEmail) redirect("/dashboard");
  return (
    <div>
      <p>You are the Admin</p>
    </div>
  );
}

export default Admin;
