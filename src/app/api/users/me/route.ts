import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDataFromToken } from "@/helper/getDataFromToken";
connect()

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const user = User.findOne({ _id: userId }).select("-password")

        return NextResponse.json({
            message: "user found",
            data: user
        })
    } catch (error) { }
}