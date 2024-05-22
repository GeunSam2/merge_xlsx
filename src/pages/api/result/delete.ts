import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs-extra';

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const filePath = `./result/result.csv`;

    await fs.remove(filePath);
    res.status(200).json({ message: 'File deleted successfully' });
}

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'DELETE') {
      deleteHandler(req, res);
    } else {
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
};

export default apiHandler;