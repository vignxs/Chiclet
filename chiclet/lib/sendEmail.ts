import emailjs from '@emailjs/browser';

type EmailType = 'welcome' | 'order';

interface SendEmailParams {
  to_email: string;
  pass_name: string;
  order_id?: string;
  type: EmailType;
}

export async function sendEmail({ to_email, pass_name, order_id, type }: SendEmailParams) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  const templateId =
    type === 'welcome'
      ? process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_WELCOME_ID!
      : process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ORDER_ID!;

  const templateParams =
    type === 'welcome'
      ? { to_email, pass_name }
      : { to_email, pass_name, order_id };

  try {
    const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('Email sent:', result.text);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}


// await sendEmail({
//       to_email: 'vigneshdhoni121@gmail.com',
//       pass_name: 'Vignesh',
//       type: 'welcome',
//     });

// await sendEmail({
//   to_email: 'vignxs@gmail.com',
//   pass_name: 'Vignesh',
//   order_id: 'ORD123456',
//   type: 'order',
// });