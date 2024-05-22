import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

const uploadDir = '/tmp/uploads';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(200).json({ files: [] });
        }
        res.status(500).json({ error: 'Unable to scan files' });
      }
      res.status(200).json({ files });
    });
  } else {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
