'use client';

import { useState, useEffect } from 'react';
import { MovingBorderCard } from './ui/moving-border';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Initialize EmailJS
  useEffect(() => {
    // Initialize with public key from environment variables
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setEmailError('');
    
    try {
      // Get environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const toEmail = process.env.NEXT_PUBLIC_TO_EMAIL;
      
      // Check if we have all required environment variables
      if (!serviceId || !templateId || !publicKey || !toEmail) {
        throw new Error('Missing EmailJS configuration in environment variables');
      }
      
      // Create the email content with subject included
      const emailContent = `
Subject: ${formData.subject}

${formData.message}
      `;
      
      // Prepare email parameters
      const templateParams = {
        // Using every possible subject parameter name
        subject: formData.subject,
        Subject: formData.subject,
        emailSubject: formData.subject,
        title: formData.subject,
        email_title: formData.subject,
        email_subject: formData.subject,
        message_subject: formData.subject,
        
        // Set the message with subject included
        message: emailContent,
        
        // Set all other parameters
        to_name: 'Portfolio Owner',
        to_email: toEmail,
        from_name: formData.name,
        from_email: formData.email,
        name: formData.name,
        email: formData.email,
        reply_to: formData.email
      };
      
      // Log for debugging
      console.log('Sending email with params:', templateParams);
      
      // Send with EmailJS
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );
      
      console.log('Email sent successfully:', response);
      setEmailSent(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setEmailSent(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
      <MovingBorderCard
        borderRadius="1rem"
        borderColor="linear-gradient(to right, #ffd700, #ff8c00, #ffff00)"
        autoAnimate={true}
        duration={1500}
        className="bg-black text-white"
        containerClassName="flex-1"
      >
        <div style={{ 
          padding: '20px 10px',
        }}>
          <h2 
            className="text-xl sm:text-2xl md:text-3xl mb-8 md:mb-12 text-white text-center"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            Contact Me
          </h2>
          
          {emailSent ? (
            <div className="bg-green-900 bg-opacity-50 text-green-200 p-4 rounded-md text-center my-8">
              Thank you for your message! I&apos;ll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                <div className="flex flex-col">
                  <label className="block text-white mb-3 md:mb-4 text-base md:text-lg">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="h-10 md:h-12 w-full bg-[#0f1628] text-white rounded px-3 py-2 border-none shadow-inner"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="block text-white mb-3 md:mb-4 text-base md:text-lg">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your email"
                    className="h-10 md:h-12 w-full bg-[#0f1628] text-white rounded px-3 py-2 border-none shadow-inner"
                  />
                </div>
              </div>
              
              <div className="mb-8 md:mb-12">
                <label className="block text-white mb-3 md:mb-4 text-base md:text-lg">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Message subject"
                  className="h-10 md:h-12 w-full bg-[#0f1628] text-white rounded px-3 py-2 border-none shadow-inner"
                />
              </div>
              
              <div className="mb-8 md:mb-12">
                <label className="block text-white mb-3 md:mb-4 text-base md:text-lg">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message"
                  rows={4}
                  className="w-full bg-[#0f1628] text-white rounded px-3 py-2 border-none shadow-inner resize-none"
                />
              </div>
              
              {emailError && (
                <div className="mb-6 bg-red-900 bg-opacity-50 text-red-200 p-3 rounded-md text-sm md:text-base">
                  {emailError}
                </div>
              )}
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-[#0f1628] hover:bg-[#1a2742] text-white font-medium px-4 py-2 md:px-6 md:py-3 rounded transition-colors duration-300 flex items-center justify-center disabled:opacity-70"
                  style={{ fontFamily: 'var(--font-orbitron)' }}
                >
                  {sending ? (
                    <>
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </MovingBorderCard>
    </div>
  );
}
