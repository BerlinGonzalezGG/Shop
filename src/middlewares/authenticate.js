import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export const authenticate = async (request) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user || user.role !== 'admin') {
      return { error: "Unauthorized", status: 401 };
    }
    return { session };
  } catch (error) {
    return { error: "Unauthorized", status: 401 };
  }
};



