// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../lib/mongo";
import { authMiddleware } from '../../../lib/authTokenMiddleware';
const { ObjectId } = require("mongodb");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | Error>
) {
  authMiddleware(req,res).then(async (payload)=>{
    const client = await clientPromise;
    const db = client.db("vpn_panel");
  
    if(req.method === "POST"){
      if(!req.body._id || typeof req.body._id !== "string" || req.body._id.trim().length < 1) res.status(400).json({error:"invalid argument"})
      db.collection("servers").deleteOne({
        _id : ObjectId(req.body._id)
      }, function(err:any, r:any) {
        if (err) res.status(400).json(err);
        res.status(200).json({})
      });
    }
  }).catch(err=>res.status(401).json("Unauthorized"))
}
