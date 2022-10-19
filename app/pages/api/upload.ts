import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File as FormFile } from 'formidable';
import fs from 'fs';
import mime from 'mime';
import { Blob, NFTStorage } from 'nft.storage';

const NFT_STORAGE_KEY = process.env.NEXT_NFT_STORAGE_API_KEY || "";

export const config = {
    api: {
        bodyParser: false,
    }
};

type ProcessedFiles = Array<[string, FormFile]>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    let status = 200,
        response = { status: 'ok', message: 'Image uploaded', cid: "" };

    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        const files: ProcessedFiles = [];
        form.on('file', function (field, file) {
            files.push([field, file]);
        })
        form.on('end', () => resolve(files));
        form.on('error', err => reject(err));
        form.parse(req, () => { });
    }).catch(e => {
        console.log(e);
        status = 500;
        response = {
            status: 'fail', message: 'Upload error', cid: ""
        }
    });

    if (files?.length) {
        const [, file] = files[0];
        const filePath = file.filepath;

        const content = await fs.promises.readFile(filePath);

        const image = new Blob([content]);
        const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
        const result = await nftstorage.storeBlob(image);
        response.cid = result;
    }

    res.status(status).json(response);
}

export default handler;
