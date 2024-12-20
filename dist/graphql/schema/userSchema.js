"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const graphql_1 = require("graphql");
exports.userSchema = (0, graphql_1.buildSchema)(`
  type Query {
    hello: String
  }
`);
