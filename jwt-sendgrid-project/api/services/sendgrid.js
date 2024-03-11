import sgMail from '@sendgrid/mail';

class SendGridService {
  defaults = {
    from: 'itscarlosisaac@gmail.com',
    subject: 'JWT - Email Verification',
    text: 'This is a test email from sendgrid.',
  };

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.sender = sgMail;
  }

  async send_email(to, link ) {
    const message  = {
      ...this.defaults,
      to,
      html: `
        <div>
          <h3>Verify your email</h3>
          <p>
            Hello ${to} Please click the link below to verify your email.
          </p>
          <a href="${link}">Verify Email</a>
        </div>
      `,
    };
    // send email using sendgrid
    return await this.sender.send(message);
  }
}

export default new SendGridService();
