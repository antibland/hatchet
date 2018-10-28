const env = process.env.NODE_ENV || "development";
const nodemailer = require("nodemailer");

const sendEmail = (req, res, opponentEmail, fightId) => {
  // Generate SMTP service account from ethereal.email
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.error("Failed to create a testing account. " + err.message);
      return process.exit(1);
    }

    let transporterOptions =
      env === "development"
        ? {
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
              user: account.user,
              pass: account.pass
            }
          }
        : {
            service: process.env.EMAIL_SERVICE,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          };

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(transporterOptions);

    // Message object
    let host =
      env === "development"
        ? req.headers["x-forwarded-host"]
        : req.headers.host;
    let url = `${req.headers["x-forwarded-proto"]}://${host}/fight/${fightId}`;
    let message = {
      from: process.env.EMAIL_USER || "",
      to: opponentEmail,
      subject: "You're invited!",
      text: `Hello,

        We have a ${req.body.type} on our hands. One of our site members, ${
        req.body.username
      }, has told us their side of things. Now it's your turn.

      Check out the hatchet to be right here: ${url}.

      `
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log("Error occurred. " + err.message);
        return process.exit(1);
      }

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.json({
        type: "success",
        message: "We've just emailed you a verification link. Make things real!"
      });
    });
  });
};

module.exports = sendEmail;
