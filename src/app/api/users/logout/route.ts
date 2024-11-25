import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
connect()

export async function GET(request: NextRequest) {
    try {

        const response = NextResponse.json({ message: "Logout successfully", success: true })

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        return response;
    } catch (error) {
        return NextResponse.json(
            {
                error: error
            },
            {
                status: 500
            }
        )

    }
}
