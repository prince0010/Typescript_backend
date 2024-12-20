"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("graphql-http/lib/use/express");
const dotenv_1 = __importDefault(require("dotenv"));
const userSchema_1 = require("./graphql/schema/userSchema");
const userResolvers_1 = require("./graphql/resolvers/userResolvers");
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const app = (0, express_1.default)();
app.use('/graphql', (0, express_2.createHandler)({ schema: userSchema_1.userSchema, rootValue: userResolvers_1.userResolvers }));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
