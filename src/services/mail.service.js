import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = new Resend(env.resendApiKey);

export const sendEmail = async ({ to, subject, html, text }) => {
  await resend.emails.send({
    from: env.mailFrom,
    to,
    subject,
    html,
    text,
  });
};

export const sendResetPasswordEmail = async ({ to, resetUrl }) => {
  await sendEmail({
    to,
    subject: 'Reset your BajoVigilancia password',
    text: `
You requested to reset your password.

Open this link:

${resetUrl}

If you didn't request this, you can ignore this email.
`,
    html: `
<h2>Reset your password</h2>

<p>You requested to reset your password.</p>

<p>
<a href="${resetUrl}">
Reset password
</a>
</p>

<p>If you didn't request this, you can ignore this email.</p>
`,
  });
};

export const sendWelcomeEmail = async ({ to, resetUrl }) => {
  await sendEmail({
    to,
    subject: 'Welcome to BajoVigilancia',
    text: `
Welcome to BajoVigilancia.

An account has been created for you.

To access it for the first time, create your password here:

${resetUrl}
`,
    html: `
<h2>Welcome to BajoVigilancia</h2>

<p>An account has been created for you.</p>

<p>
<a href="${resetUrl}">
Create password
</a>
</p>
`,
  });
};
