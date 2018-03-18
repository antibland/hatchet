module.exports = (app) => {
  const multer = require('multer');
  const aws = require('aws-sdk');
  const multerS3 = require('multer-s3');
  const s3 = new aws.S3({});
  const env = process.env.NODE_ENV || 'development';
  let module = {};

  if (env === 'development') {
    module.multer = {
      upload: multer({
        storage: multer.diskStorage({
          destination: function(req, file, cb) {
            cb(null, 'client/public/avatars/')
          },
          filename: function(req, file, cb) {
            let extension = file.originalname.split('.')[1];
            let fname = `${req.params.userId}.${extension}`;
            cb(null, fname);
          }
        })
      })
    };
  } else if (env === 'production')  {
    module.multer = {
      upload: multer({
        storage: multerS3({
          s3: s3,
          bucket: process.env.S3_BUCKET_NAME,
          metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            var newFileName = Date.now() + "-" + file.originalname;
            var path = `${req.params.userId}/${newFileName}`;
            cb(null, path);
          }
        })
      })
    };
  }

  return module.multer.upload;
}
