// Configuration for external integration tools (Make.com, PayOS, etc.)

export const INTEGRATIONS = {
  // Make.com Webhook URL for creating a new booking
  // Step 1: Create a scenario in Make.com
  // Step 2: Add a "Custom Webhook" trigger
  // Step 3: Copy the address and paste it here
  MAKE_BOOKING_WEBHOOK_URL: 'https://hook.eu1.make.com/8eswuo93d3o8lja4inn5s7bx2et7ul2n',

  // Bank Account Details for QR Code
  BANK_DETAILS: {
    BANK_ID: 'MB', // MB Bank
    ACCOUNT_NO: '942543939',
    ACCOUNT_NAME: 'NGUYEN DO TUONG VY',
    TEMPLATE: 'compact2' // QR Template
  },

  // Contact Information
  CONTACT: {
    PHONE: '0899660847',
    ZALO: 'https://zalo.me/0899660847'
  }
};
