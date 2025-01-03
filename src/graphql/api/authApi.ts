import { RESTDataSource } from "@apollo/datasource-rest"
import fs from "fs"
import dotenv from "dotenv"
import jose from "node-jose"
import { IAuthInput, IUpdatePasswordInput } from "../../interfaces/auth.js"
import User from "../../models/user.js"
import bcrypt from "bcryptjs"
import { GraphQLError, Token } from "graphql"
import { IUser } from "../../interfaces/user.js"
import BlacklistToken from "../../models/BlacklistToken.js"

dotenv.config()

export class authApi extends RESTDataSource {

    login = async ({
        employeeNumber,
        password,
    }: IAuthInput): Promise<jose.JWS.CreateSignResult> => {

        console.log("Attempting Login For:", employeeNumber)

        const user = await User.findOne({ employeeNumber })
        if (!user) {
            console.error("Employee Not Found:", employeeNumber)
            throw new GraphQLError("Employee Does not exist.", {
                extensions: {
                    field: "employeeNumber",
                    http: { status: 400 },
                },
            })
        }
        console.log("User Found:", user)
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            console.error("Password mismatch for:", employeeNumber)
            throw new GraphQLError("Wrong Password, it didn't Match", {
                extensions: {
                    field: "password",
                    http: { status: 400 },
                },
            })
        }
        console.log("Password Match:", passwordMatch)
        try {
            const path = process.env.PRIVATE_KEY_PATH
            if (!path)
                throw new GraphQLError("Invalid Authentication", {
                    extensions: {
                        http: { status: 401 },
                    },
                })
            const keyId = process.env.KEY_ID
            const PRIVATE_KEY = fs.readFileSync(path, 'utf-8')
            console.log("Private Key Loaded")
            const store = jose.JWK.createKeyStore()
            const key = await store.add(PRIVATE_KEY, "pem")
            console.log("Key Created")

            // Return Token
            const token = await jose.JWS.createSign(
                {
                    format: "compact",
                    fields: {
                        alg: "RS256",
                        typ: "JWT",
                        kid: keyId,
                    },
                },
                key
            ).update(
                JSON.stringify({
                    sub: user?._id.toString(),
                    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
                })
            )
                .final()

            if (!token)
                throw new GraphQLError("Invalid Authentication", {
                    extensions: {
                        http: {
                            status: 401,
                        },
                    },
                })
            console.log("Token Created:", token)
            return token
        } catch (error) {
            console.error("Error Creating Token:", error)
            throw error
        }
    }

    logout = async (token: Token): Promise<IUser> => {
        try {
            const isBlackListed = await BlacklistToken.findOne({ token })
            if (isBlackListed)
                throw new GraphQLError("Invalid Authentication", {
                    extensions: {
                        status: {
                            http: 401,
                        }
                    },
                })

            BlacklistToken.create({ token })

            const path = process.env.PUBLIC_KEY_PATH
            if (!path)
                throw new GraphQLError("Invalid Authentication", {
                    extensions: {
                        http: {
                            status: 401,
                        },
                    },
                })
            const PUBLIC_KEY = fs.readFileSync(path, "utf-8")
            const store = jose.JWK.createKeyStore()
            const key = await store.add(PUBLIC_KEY, "pem")

            const result = await jose.JWS.createVerify(key).verify(token.toString())
            const decode = JSON.parse(result.payload.toString())

            const user = await User.findById(decode.sub)
            if (!user)
                throw new GraphQLError("User does not exists", {
                    extensions: {
                        http: {
                            status: 400,
                        },
                    },
                })
            return user
        } catch (error) {
            throw error
        }
    }
    verifyPassword = async ({
        _id,
        password
    }: IUpdatePasswordInput): Promise<boolean> => {
        try {
            const user = await User.findById(_id)
            if (!user)
                throw new GraphQLError("User Does not Exist", {
                    extensions: {
                        http: {
                            status: 401,
                        },
                    },
                })
            return await bcrypt.compare(password, user.password)
        } catch (error) {
            throw error
        }
    }
    // Update Password
    updatePassword = async ({
        _id,
        password,
    }: IUpdatePasswordInput):
        Promise<IUser> => {
        try {
            const user = await User.findByIdAndUpdate(_id, {
                password: await bcrypt.hash(password, 12)
            }, { new: true })

            if (!user) {
                console.log("User not found.", _id, user)
                throw new GraphQLError("User not found.", {
                    extensions: {
                        http: {
                            status: 404,
                        }
                    }
                })
            }

            return user
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const validationErrors = Object.values(error.errors).map(
                    (err: any) => ({
                        path: err.error,
                        message: err.message,
                    })
                )
                throw new GraphQLError("The Password is a Bad Input", {
                    extensions: {
                        http: {
                            status: 400,
                        },
                        errors: validationErrors
                    },
                })
            }
            throw error
        }
    }

    // Reset Password
    resetPassword = async (_id: string): Promise<IUser> =>{
        try{
            const user = await User.findById(_id)
            if(!user){
                throw new GraphQLError("User not found.", {
                    extensions: {
                        http: {
                            status: 404,
                        }
                    },
                })
            }
        const birthMonth = user.dateBirth.getMonth() + 1  
        const birthYear = user.dateBirth.getFullYear()
        const employeeNumber = user.employeeNumber

        const formattedBirthMonth = String(birthMonth).padStart(2, "0").slice(-2)
        const formattedBirthYear = String(birthYear).slice(-2)
        const formattedEmployeeNumber = employeeNumber.slice(-2)

        const newPassword = `${formattedBirthMonth}${formattedBirthYear}${formattedEmployeeNumber}`

        const hashedPassword = await bcrypt.hash(newPassword, 12)
        const updatedUser = await User.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true })

        if (!updatedUser) {
            throw new GraphQLError("Failed to update password", {
                extensions: {
                    http: {
                        status: 500,
                    },
                },
            })
        }
        return updatedUser
        }catch(error){
            throw error
        }
    }

}