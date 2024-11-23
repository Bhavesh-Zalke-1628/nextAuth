import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'

import { sendEmail } from "@/helper/mailer";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()

        const { username, password, email } = reqBody
        // validation


        console.log(reqBody)


        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json(
                {
                    error: "User already exists"
                },
                {
                    status: 400
                }
            )
        }


        var salt = bcryptjs.genSalt(10)

        const hashPassword = await bcryptjs.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: hashPassword
        })


        const savedUser = await newUser.save()

        console.log(savedUser)

        // send email

        await sendEmail({ email, emailType: 'VERIFY', userId: savedUser._id })


        return NextResponse.json({
            message: "User created successfully. Please check your email for verification.",
            success: true,
            savedUser
        },)

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