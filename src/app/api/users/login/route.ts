import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
connect()


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()

        const { email, password } = reqBody
        // validation
        console.log(reqBody)


        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json(
                {
                    error: "user does not exist",
                },
                {
                    status: 400
                }
            )
        }

        console.log('user  exists')

        const validPassword = await bcryptjs.compare(password, user.password)

        if (!validPassword) {
            return NextResponse.json({
                error: "Check your password"
            }, { status: 401 }
            )
        }


        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: 2 })


        const response = NextResponse.json({ message: "Loged in successfully", success: true }, { status: 200 })
        response.cookies.set("token", token, { httpOnly: true })

        return response;

    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message
            },
            {
                status: 500
            }
        )
    }
}