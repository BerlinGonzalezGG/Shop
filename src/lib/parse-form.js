// lib/parse-form.js
import formidable from "formidable";

export const parseForm = req => {
  const form = new formidable.IncomingForm({
    uploadDir: "./public/images",
    keepExtensions: true
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};
