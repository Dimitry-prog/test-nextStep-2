import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse('Missing credentials', { status: 400 });
    }

    const isUserExists = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (isUserExists) {
      return NextResponse.json({
        error: 'User already exists',
        status: 409
      }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword
      }
    });

    return NextResponse.json(user);
  } catch (e) {
    console.log(e, 'REGISTER_ERROR');
    return NextResponse.json({
      error: 'Internal Server Error',
      status: 500
    }, { status: 500 })
  }
}