const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message'
      });
    }

    // Create contact
    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message
    });

    // Send notification email to admin
    const adminEmail = process.env.EMAIL_USER; // Use same email as sender
    const emailHtml = `
      <h1>New Contact Form Submission</h1>
      <p><strong>From:</strong> ${name} (${email})</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <hr>
      <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
    `;

    try {
      await sendEmail(adminEmail, `New Contact: ${subject}`, emailHtml);
    } catch (emailError) {
      console.log('Admin notification email failed:', emailError.message);
      // Continue even if email fails
    }

    // Send confirmation email to user
    const userEmailHtml = `
      <h1>Thank You for Contacting Us!</h1>
      <p>Hi ${name},</p>
      <p>We have received your message and will get back to you soon.</p>
      <p><strong>Your Message:</strong></p>
      <p>${message}</p>
      <br>
      <p>Best regards,<br>Eternal Bond Team</p>
    `;

    try {
      await sendEmail(email, 'We Received Your Message - Eternal Bond', userEmailHtml);
    } catch (emailError) {
      console.log('User confirmation email failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you soon.',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  submitContact
};
