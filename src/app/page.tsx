import { connectMongoDB } from "<pages>/config/db";
import { GetCurrentUserFromMongoDB } from "<pages>/server-actions /users";
import { UserButton } from "@clerk/nextjs";
import { UserType } from "<pages>/interfaces";
connectMongoDB();

export default async function Home() {
  await GetCurrentUserFromMongoDB();

  const response: any = await GetCurrentUserFromMongoDB();
  let mongoUser: UserType | null = null;
  if (response.success) {
    mongoUser = response.data;
  }

  let clerkUserId = "";
  let name = "";
  let email = "";

  if (mongoUser) {
    clerkUserId = mongoUser.clerkUserId;
    name = mongoUser.name;
    email = mongoUser.email;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-4xl text-gray-500 font-bold uppercase ">HOME PAGE</h1>
      <h1>Clerk User Id : {clerkUserId}</h1>
      <h1>Name : {name}</h1>
      <h1>Email : {email}</h1>
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}
