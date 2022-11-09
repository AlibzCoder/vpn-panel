// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware } from '../../../lib/authTokenMiddleware';
import clientPromise from "../../../lib/mongo";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | Error>
) {
  authMiddleware(req,res).then(async (payload : any)=>{
    const client = await clientPromise;
    const db = client.db("vpn_panel");
    if(req.method === "POST"){
      if(!req.body.name || typeof req.body.name !== "string" || req.body.name.trim().length < 1) res.status(400).json({error:"invalid argument"})
      if(!req.body.ip || typeof req.body.ip !== "string" || req.body.ip.trim().length < 1) res.status(400).json({error:"invalid argument"})
  
      db.collection("servers").insertOne({
        name : req.body.name,
        ip : req.body.ip
      }, function(err:any, r:any) {
        if (err) res.status(400).json(err);
        res.status(200).json({})
      });
    }
  }).catch((err:any)=>res.status(401).json("Unauthorized"))
}
