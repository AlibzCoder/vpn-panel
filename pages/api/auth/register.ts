// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
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

     const newUser = {
          userName: req.body.userName,
         password: req.body.password
     }
     bcrypt.genSalt(10, (err, salt) => {
         if (err) throw err;
         bcrypt.hash(newUser.password, salt,
             (err, hash) => {
                 if (err) throw err;
                 newUser.password = hash;
                 auth.insertOne(newUser, function(err : any, r : any) {
                     if (err) {
                         res.status(400).json(err)
                         throw err
                     }
                     res.status(200).json({});
                 });
             });
     });
   }
  
}


