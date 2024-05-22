import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files, Fields } from 'formidable';
import fs from 'fs-extra';
import path from 'path';

// 파일 업로드 함수
const handleFileUpload = (req: NextApiRequest, res: NextApiResponse) => {
  const uploadDir = path.join(process.cwd(), '/uploads');
  fs.ensureDirSync(uploadDir);

  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024, // 예: 최대 파일 크기 100MB
    multiples: true, // 여러 파일 업로드를 허용
    filename: function (name, ext, part, form) {
      const { originalFilename, mimetype } = part;
      return originalFilename as string;
    },
    // filter: ({ name, originalFilename, mimetype }) => {
    //   const validMimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    //   return validMimeTypes.includes(mimetype || '');
    // },
  });

  form.parse(req, (err: any, _: Fields, files: Files) => {
    if (err) {
      if (err.message.includes('maxFileSize')) {
        return res.status(400).json({ error: 'File size exceeds the limit of 2MB' });
      }
      return res.status(500).json({ error: `File upload error: ${err.message}` });
    }
    res.status(200).json({ files });
  });
};

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('req.method:', req.method)
  if (req.method === 'POST') {
    handleFileUpload(req, res);
  } else {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
};

export default apiHandler;

export const config = {
  api: {
    bodyParser: false,
  },
};
