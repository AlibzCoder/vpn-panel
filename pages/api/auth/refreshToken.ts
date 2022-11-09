// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import consts from '../../../lib/const'
import * as jwt from 'jsonwebtoken'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === "POST"){
    
    if(req.headers['refreshtoken'] && typeof req.headers['refreshtoken'] === 'string'){
      var refreshToken : string = req.headers['refreshtoken'];
      jwt.verify(refreshToken, consts.refreshSecret, (err, payload) => {
          if (err) {
              return res.status(401);
          }
          if(payload){
            const p : any = Object.assign({},payload);
            p["exp"] = Math.floor(Date.now() / 1000) + consts.expiresIn
            const token = jwt.sign(payload, consts.secret);
            return res.status(200).json({ Authorization: token });
          }else{
            return res.status(401).json({ error:'invalid refresh token' });
          }
      });
    }else{
      return res.status(401).json({ error:'invalid refresh token' });
    }
  }
  
}











