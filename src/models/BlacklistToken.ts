import { Schema, model } from "mongoose";
import { IToken } from "../interfaces/auth"

const BlacklistTokenSchema = new Schema<IToken>(
    {
        token: {
            type: Schema.Types.String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
)

export default model<IToken>("BlacklistToken", BlacklistTokenSchema);