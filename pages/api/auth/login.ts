// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import consts from '../../../lib/const'
import clientPromise from "../../../lib/mongo";
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === "POST"){
    const client = await clientPromise;
    const db = client.db("vpn_panel");
    const auth = db.collection("auth");

    const userName = req.body.userName;
    const password = req.body.password;
    
    auth.findOne({userName:userName}).then((user : any)=>{
        if (!user) {
            return res.status(404).json({ errorCode: 'USER_NOT_FOUND', errorMessage: "No Account Found" });
        }
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    const payload = {
                        id: user._id,
                        userName: user.userName
                    };
    
                    var token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + consts.expiresIn, data: payload }, consts.secret);
                    var refreshToken = jwt.sign({ exp: Math.floor(Date.now() / 1000) + consts.refreshExpiresIn, data: payload }, consts.refreshSecret);
    
                    res.json({
                        Authorization: token,
                        RefreshToken: refreshToken
                    });
                } else {
                    res.status(400).json({ errorCode: 'INCORRECT_PASSWORD', errorMessage: "Password is incorrect" });
                }
            });
    }).catch((err : any)=>{
        if (err){
            res.status(400).json(err);
            throw err;
        }
    });


  }
  
}











