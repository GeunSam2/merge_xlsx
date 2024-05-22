import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';
import path from 'path';
// import { parse } from 'csv-parse';
import XLSX from 'xlsx';
import { stringify } from 'csv-stringify';

const uploadDir = path.join(process.cwd(), '/uploads');
const resultDir = path.join(process.cwd(), '/result');
const resultFile = path.join(resultDir, 'result.csv');
fs.ensureDirSync(resultDir);

// handler.post((req: MergeRequest, res: NextApiResponse) => {
//   const { filesToMerge } = req.body;

//   if (!filesToMerge || filesToMerge.length === 0) {
//     return res.status(400).json({ error: 'No files to merge' });
//   }

//   let firstFile = true;
//   filesToMerge.forEach((fileName) => {
//     const filePath = path.join(uploadDir, fileName);
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ error: `File ${fileName} not found` });
//     }

//     const data = fs.readFileSync(filePath);
//     parse(data, { columns: true, trim: true }, (err, records) => {
//       if (err) throw err;

//       records.pop(); // Remove last row

//       const writeStream = fs.createWriteStream(resultFile, { flags: firstFile ? 'w' : 'a' });
//       const stringifier = stringify({ header: firstFile });
//       stringifier.pipe(writeStream);
//       records.forEach(record => stringifier.write(record));
//       stringifier.end();
//       firstFile = false;
//     });
//   });

//   res.status(200).json({ message: 'Files merged successfully', downloadUrl: '/api/download' });
// });

const handleMerge = async (_: NextApiRequest, res: NextApiResponse) => {
  const filesToMerge = fs.readdirSync(uploadDir)

  if (!filesToMerge || filesToMerge.length === 0) {
    return res.status(400).json({ error: 'No files to merge' });
  }

  let firstFile = true;
  filesToMerge.forEach((fileName) => {
    const filePath = path.join(uploadDir, fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `File ${fileName} not found` });
    }

    const data = XLSX.readFile(filePath);
    const sheetName = data.SheetNames[0];
    const records = XLSX.utils.sheet_to_json(data.Sheets[sheetName]);

    records.pop(); // Remove last row

    const writeStream = fs.createWriteStream(resultFile, { flags: firstFile ? 'w' : 'a' });
    const stringifier = stringify({ header: firstFile });
    stringifier.pipe(writeStream);
    records.forEach(record => stringifier.write(record));
    stringifier.end();
    firstFile = false;
  });

  res.status(200).json({ message: 'Files merged successfully', downloadUrl: '/api/download' });
}


const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    handleMerge(req, res);
  } else {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

export default apiHandler;
