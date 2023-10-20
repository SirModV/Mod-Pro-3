const nodeMailer = require("nodemailer");
const path = require('path')
const hbs = require('nodemailer-express-handlebars');

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    auth: {
      user: process.env.Email,
      pass: process.env.Password,
    },
    from: process.env.Email, 
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./backend/emailTemplates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./backend/emailTemplates'),
    extName: ".handlebars",
  }

  transporter.use('compile', hbs(handlebarOptions));

  let context; 

  if (options.template === "passwordRecover") {
    context = {
      name: options.name,
      link: options.link,
    }
  }

  const mailOptions = {
    from: process.env.Email,
    to: options.email,
    subject: options.subject,
    template: options.template,
    context,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;