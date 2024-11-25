import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/user-model";
import { NextRequest, NextResponse } from "next/server";


connect()


export async function POST(requset: NextRequest) {
    try {
        const reqBody = await requset.json()
        const { token } = reqBody;
        console.log(token)


        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return NextResponse.json(
                {
                    mes: "Invalid token"

                },
                {
                    status: 400
                }
            )
        }

        console.log(user)
        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()

        return NextResponse.json(
            {
                message: "Email verified successfully",
                success: true,
            },
            {
                status: 200
            }
        )

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