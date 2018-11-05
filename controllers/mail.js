const env = process.env.NODE_ENV || "development";
const nodemailer = require("nodemailer");

const TYPES = ["HATCHET_INVITE", "HATCHET_REMINDER"];

const sendEmail = opts => {
  if (!opts.type || !TYPES.includes(opts.type)) {
    return res.status(401).json({
      type: "unauthorized",
      message: "You're not supposed to even be at this endpoint, you turkey."
    });
  }

  const { req, res, type } = opts;

  const buildEmailMessage = () => {
    let host =
      env === "development"
        ? req.headers["x-forwarded-host"]
        : req.headers.host;

    let from = process.env.EMAIL_USER || "";

    if (type === "HATCHET_INVITE") {
      let { fightId, defenderEmail } = opts;

      let url = `${
        req.headers["x-forwarded-proto"]
      }://${host}/fight/${fightId}`;

      return {
        from,
        to: defenderEmail,
        subject: "You're invited!",
        text: `Hello,

  We have a ${req.body.type} on our hands. One of our site members, ${
          req.body.username
        }, has told us their side of things. Now it's your turn.

  Check out the hatchet-to-be right here: ${url}.

  `
      };
    } else if (type === "HATCHET_REMINDER") {
      let { _id } = opts.fight;
      let { email, username } = opts.fight.defender;

      let url = `${req.headers["x-forwarded-proto"]}://${host}/fight/${_id}`;

      return {
        from,
        to: email,
        subject: `A nudge from ${username}`,
        text: `Hi,
Remember that time ${username} had an axe to grind with you? Well, they just used their one chance to remind you to respond.

Have a look: ${url}.

  `
      };
    }
  };

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
    const message = buildEmailMessage();

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
