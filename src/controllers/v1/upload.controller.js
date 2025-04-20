import { unlinkFile } from '../../helpers/deleteFileHelper.js';

export const uploadFile = async (req, res) => {
  try {
    const img = req.file ? '/' + req.file.filename : null;
    res
      .status(200)
      .send({ message: 'File uploaded successfully', imgUrl: img });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteFile = async (req, res) => {
  try {
    let { filename } = req.body;

    if (!filename) {
      return res
        .status(400)
        .json({ ok: false, message: 'Filename is required' });
    }

    // // Har doim arrayga o‘rab yuboramiz
    // if (!Array.isArray(filename)) {
    //   filename = [filename];
    // }

    await unlinkFile(filename);

    return res.json({ ok: true, message: 'File(s) removed successfully' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ ok: false, message: 'File not found' });
    }
    return res.status(500).json({ ok: false, message: err.message });
  }
};
