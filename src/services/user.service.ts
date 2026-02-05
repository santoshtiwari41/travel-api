import { db } from "@/db/drizzle.js";
import { friends } from "@/db/schema/social.js";
import { users } from "@/db/schema/user.js";
import { and, eq, ilike, sql } from "drizzle-orm";
import { comparePassword, hashPassword } from "src/lib/password-hash.js";
import { AppError } from "src/utils/appError.js";

export const getUserProfile = async () => {
  const user = await db.select({
    id: users.id,
    fullName: users.fullName,
    email: users.email
  })
    .from(users)
  return user
};
export type userProps = {
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
  currentUserId?:string;
};


export const getUsers = async ({ search, currentUserId }: userProps) => {
  const authId = currentUserId ?? null;

  let query = db
    .select({
      id: users.id,
      fullName: users.fullName,

      isSelf: sql<boolean>`(${users.id} = ${authId}::uuid)`.as('isSelf'),

      isFriend: sql<boolean>`
        CASE 
          WHEN ${users.id} = ${authId}::uuid THEN false
          WHEN ${friends.id} IS NOT NULL THEN true
          ELSE false
        END
      `.as('isFriend'),
    })
    .from(users)
    .leftJoin(
      friends,
      and(
        eq(friends.userId, authId as string),
        eq(friends.friendId, users.id)
      )
    )
    .$dynamic();

  if (search) {
    query = query.where(ilike(users.fullName, `%${search}%`));
  }

  return await query;
};
export const getUsersByAdmin = async ({
  search,
  page = 1,
  limit = 50,
}: userProps) => {
  const user = await db.select({
    id: users.id,
    fullName: users.fullName

  }).from(users)
  return user
};


export  async function  updateProfile(userId: string, fullName: string) {
    const updated = await db
      .update(users)
      .set({
        fullName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      });

    return updated[0];
  }



   export  async function  updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      throw new AppError("User not found", 404);  
    }

    const isValid = await comparePassword(oldPassword, user[0].password);
    if (!isValid) {
      throw new AppError("Old password is incorrect", 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return true;
  }
