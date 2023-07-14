import pkg from 'multer';

const multer = pkg;

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
      fieldNameSize: 100, // Adjust this value based on your needs
      fieldSize: 25 * 1024 * 1024, // 16MB, adjust this value based on your needs
    },
  });

export default upload;