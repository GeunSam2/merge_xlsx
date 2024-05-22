import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = '/tmp/result/result.csv';
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.setHeader('Content-Disposition', `attachment; filename="result.csv"`);
  res.setHeader('Content-Type', 'text/csv');

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}
