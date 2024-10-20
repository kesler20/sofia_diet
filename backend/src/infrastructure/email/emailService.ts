import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string) {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: "gmail", // use 'gmail' as the service
    auth: {
      user: "wiz-app4.0@gmail.com", // your email
      pass: "wizapp2023", // your email password
    },
  });

  // Set up email data with unicode symbols
  let mailOptions = {
    from: '"Wiz-App ✨" <wiz-app4.0@gmail.com>', // sender address
    to,
    subject,
    text,
    html: `<b>${text}</b>`, // html body
  };

  // Send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
}
