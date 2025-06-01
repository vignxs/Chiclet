import emailjs from '@emailjs/browser';



interface SendWelcomeEmailParams {
  to_email: string;
  pass_name: string;
}

export async function sendWelcomeEmail({ to_email, pass_name }: SendWelcomeEmailParams) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_WELCOME_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Missing required EmailJS environment variables");
  }

  const templateParams = {
    to_email,
    pass_name,
  };

  try {
    const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('Welcome email sent:', result.text || result.status);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

export async function handleContactSubmit({
  formData,
  setIsLoading,
  setSuccessMessage,
  setErrorMessage,
  resetForm,
}: {
  formData: { name: string; email: string; subject: string; message: string },
  setIsLoading: (val: boolean) => void,
  setSuccessMessage: (msg: string) => void,
  setErrorMessage: (msg: string) => void,
  resetForm: () => void,
}) {
  setIsLoading(true)
  setSuccessMessage("")
  setErrorMessage("")

  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT_ID!
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      time: new Date().toLocaleString(),
    }

    await emailjs.send(serviceId, templateId, templateParams, publicKey)

    setSuccessMessage("Message sent successfully! We'll get back to you soon.")
    resetForm()
  } catch (error) {
    console.error('Failed to send message:', error)
    setErrorMessage("Failed to send message. Please try again later.")
  } finally {
    setIsLoading(false)
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