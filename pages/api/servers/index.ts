// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { authMiddleware } from '../../../lib/authTokenMiddleware';
import clientPromise from "../../../lib/mongo";
import { ServerProperties } from '../../../types'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ServerProperties[] | any>
) {
  authMiddleware(req,res).then(async (payload)=>{
    if(req.method === "GET"){
      const client = await clientPromise;
      const db = client.db("vpn_panel");
      const servers = db.collection("servers");
      servers.find({}).toArray(function(err:any, result:any) {
        if (err) res.status(400).json(err);
        
        res.status(200).json(result.map((server:ServerProperties)=>{
          return {
            _id : server._id,
            name: server.name,
            ip:server.ip
          };
        }));
      });
    }
  }).catch(err=>res.status(401).json("Unauthorized"))
}
