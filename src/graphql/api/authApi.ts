import { RESTDataSource } from "@apollo/datasource-rest"
import fs from "fs"
import dotenv from "dotenv"
import jose from "node-jose"
import { IAuthInput, IPasswordInput} from "../../interfaces/auth.js"
import user from "../../models/user.js"
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

        const User = await user.findOne({ employeeNumber })
            if (!User){
                console.error("Employee Not Found:", employeeNumber)
                throw new GraphQLError("Employee Does not exist.", {
                    extensions: {
                        field: "employeeNumber",
                        http: { status: 400 },
                    },
                })
            }
            console.log("User Found:", User);
     const passwordMatch = await bcrypt.compare(password, User.password)
     if(!passwordMatch){
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
                  sub: User?._id.toString(),
                  exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
                })
            )
            .final()
           
            if(!token)
                throw new GraphQLError("Invalid Authentication",{
                    extensions: {
                        http:{
                            status: 401,
                        },
                    },
                })
            console.log("Token Created:", token)
            return token
     }catch(error){
        console.error("Error Creating Token:", error)
        throw error
     }
    }

  logout = async (token : Token): Promise<IUser> => {
        try{
            const isBlackListed = await BlacklistToken.findOne({ token })
            if(isBlackListed)
                throw new GraphQLError("Invalid Authentication", {
                    extensions:{
                        status: {
                            http: 401,
                        }
                    },
                })
                const path = process.env.PUBLIC_KEY_PATH
                if(!path)
                    throw new GraphQLError("Invalid Authentication", {
                extensions:{
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

                const User = await user.findById(decode.sub)
                if(!User)
                    throw new GraphQLError("User does not exists", {
                        extensions: {
                            http: {
                                status: 400,
                            },
                        },
                    })
                return User
        } catch (error){
            throw error
        }
    }
  verifyPassword = async ({
    _id,
    password
  }: IPasswordInput): Promise<boolean> => {
        try{
            const User = await user.findById(_id)
            if (!User)
                throw new GraphQLError("User Does not Exist", {
                    extensions: {
                        http:{
                            status: 401,
                        },
                    },
                })
                return await bcrypt.compare(password, User.password)
        }catch(error){
            throw error
        }
    }
  changePasword = async ({
    _id,
    password,
  }: IPasswordInput): Promise<IUser> => {
        try {
                const User = await user.findByIdAndUpdate(
                    _id,
                    {
                        password: await bcrypt.hash(password, 12)
                    },
                    {
                        new: true,
                    }
                )
                if(!User)
                    throw new GraphQLError("User Does Not Exist", {
                extensions:{
                    http:{
                        status: 404,
                    },
                },
            })
         return User
        }catch(error: any){
            if(error.name === "ValidationError"){
            const validationErrors = Object.values(error.errors).map(
                (err:any) => ({
                    path: err.error,
                    message: err.message,
                })
            )
            throw new GraphQLError("The Password is a Bad Input", {
                extensions: {
                    http:{
                        status: 400,
                    },
                    errors: validationErrors
                },
            })
        }
        throw error
    }
  } 

}