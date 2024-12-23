import { Schema, model } from "mongoose";
import { IToken } from "../interfaces/auth.js"

const BlacklistTokenSchema = new Schema<IToken>(
    {
        token: {
            type: Schema.Types.String,
            unique: true,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model<IToken>("BlacklistToken", BlacklistTokenSchema);