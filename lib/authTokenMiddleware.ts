import type { NextApiRequest, NextApiResponse } from 'next'
import consts from './const'
import * as jwt from 'jsonwebtoken'

export function authMiddleware(req : NextApiRequest,res : NextApiResponse) : Promise<unknown>{
    const token = req.headers["authorization"];
    if(!token || typeof token !== "string" || token.trim().length === 0) return Promise.reject(res.status(401).json("Unauthorized"));
    return verifyToken(token);
}

export function verifyToken(token : string){
    return new Promise((resolve,reject)=>{
        if (token == null) return ;
        jwt.verify(token, consts.secret, (err, payload) => {
            if (err) reject(err)
            resolve(payload);
        });
    });
}

