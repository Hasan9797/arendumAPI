export const uploadFile = async (req, res) => {
  try {
    const img = req.file
      ? req.protocol + '://' + req.get('host') + '/' + req.file.filename
      : null;
    res
      .status(200)
      .send({ message: 'File uploaded successfully', imgUrl: img });
  } catch (error) {
    throw new Error(error);
  }
};
