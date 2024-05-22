import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), '/result/result.csv');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.setHeader('Content-Disposition', `attachment; filename="result.csv"`);
  res.setHeader('Content-Type', 'text/csv');

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}
