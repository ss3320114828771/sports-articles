// Simple email types
interface EmailData {
  to: string
  subject: string
  message: string
}

// Just log emails in development
export async function sendEmail(data: EmailData) {
  console.log('📧 Email would be sent:', {
    to: data.to,
    subject: data.subject,
    message: data.message
  })
  
  return { success: true }
}

// Simple order confirmation
export async function sendOrderConfirmation(email: string, orderNumber: string) {
  return sendEmail({
    to: email,
    subject: `Order Confirmation #${orderNumber}`,
    message: `Thank you for your order #${orderNumber}!`
  })
}

// Simple welcome email
export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Welcome to Sports Elite!',
    message: `Hi ${name}, welcome to Sports Elite!`
  })
}

// Simple password reset
export async function sendPasswordResetEmail(email: string, name: string, resetLink: string) {
  return sendEmail({
    to: email,
    subject: 'Reset Your Password',
    message: `Hi ${name}, reset your password here: ${resetLink}`
  })
}