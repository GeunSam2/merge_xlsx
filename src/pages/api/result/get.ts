import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

const filePath = '/tmp/result/result.csv';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
            return res.status(200).json({ content: '' });
            }
            res.status(500).json({ error: 'Unable to read file' });
        }
        res.status(200).json({ content: data });
        })
  } else {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
