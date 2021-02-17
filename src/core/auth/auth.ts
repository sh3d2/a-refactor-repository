import Koa from "koa";
import jwt from 'jsonwebtoken'
import {ZoneContext} from "../context/zone";
import {AuthBindings} from "./bindings";
import {Payload} from "./types";
import {GlobalContext} from "../context/global";


export function authenticate(ctx: Koa.Context) {
    const token = ctx.req.headers["authorization"]?.substr(7);
    if (!token) return;
    try {
        const payload: Payload = jwt.verify(token, GlobalContext.get().getValue(AuthBindings.Secret) as string) as Payload;
        ZoneContext.get()?.bind(AuthBindings.User, {
            userId: payload.userId,
            name: payload.name,
            role: payload.role
        })

    } catch {
    }
}