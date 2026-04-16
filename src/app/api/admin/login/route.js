import { connectDB } from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("admin-auth", admin._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return Response.json({
      success: true,
      redirect: "/dashboard",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}