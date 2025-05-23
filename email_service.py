import os
import sys
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def send_advertiser_contact_email(name, email, company, message, ad_location):
    """Send email notification when someone submits the advertiser contact form"""
    
    sendgrid_key = os.environ.get('SENDGRID_API_KEY')
    if not sendgrid_key:
        logger.error('SENDGRID_API_KEY environment variable is not set')
        return False, 'Email service not configured'
    
    try:
        sg = SendGridAPIClient(sendgrid_key)
        
        # Email content
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                New Advertising Inquiry - MarkdownConverter
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #495057; margin-top: 0;">Contact Details</h3>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Company:</strong> {company}</p>
                <p><strong>Ad Location Interest:</strong> {ad_location}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
                <h3 style="color: #495057; margin-top: 0;">Message</h3>
                <p style="line-height: 1.6;">{message}</p>
            </div>
            
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #6c757d;">
                    This email was sent from the MarkdownConverter website contact form.
                    <br>Submitted from IP: (logged for security)
                </p>
            </div>
        </div>
        """
        
        text_content = f"""
        New Advertising Inquiry - MarkdownConverter
        
        Contact Details:
        Name: {name}
        Email: {email}
        Company: {company}
        Ad Location Interest: {ad_location}
        
        Message:
        {message}
        
        This email was sent from the MarkdownConverter website contact form.
        """
        
        message = Mail(
            from_email=Email("noreply@markdownconverter.com", "MarkdownConverter"),
            to_emails=To("simon@alpharock.net"),
            subject=f"New Advertising Inquiry from {name} - {company}",
            html_content=html_content,
            plain_text_content=text_content
        )
        
        # Send the email
        response = sg.send(message)
        logger.info(f"Email sent successfully. Status code: {response.status_code}")
        return True, 'Email sent successfully'
        
    except Exception as e:
        logger.error(f"SendGrid error: {str(e)}")
        return False, f'Failed to send email: {str(e)}'


def send_confirmation_email(user_email, name):
    """Send confirmation email to the user who submitted the form"""
    
    sendgrid_key = os.environ.get('SENDGRID_API_KEY')
    if not sendgrid_key:
        return False, 'Email service not configured'
    
    try:
        sg = SendGridAPIClient(sendgrid_key)
        
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">Thank you for your interest in advertising!</h2>
            
            <p>Hi {name},</p>
            
            <p>Thank you for reaching out about advertising opportunities on MarkdownConverter. 
            We've received your inquiry and will get back to you within 24 hours.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #495057; margin-top: 0;">What's Next?</h3>
                <ul style="line-height: 1.6;">
                    <li>We'll review your advertising requirements</li>
                    <li>Prepare a customized proposal for your needs</li>
                    <li>Contact you with pricing and placement options</li>
                </ul>
            </div>
            
            <p>Best regards,<br>
            The MarkdownConverter Team</p>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 15px; margin-top: 30px; font-size: 12px; color: #6c757d;">
                This is an automated confirmation email from MarkdownConverter.
            </div>
        </div>
        """
        
        message = Mail(
            from_email=Email("noreply@markdownconverter.com", "MarkdownConverter"),
            to_emails=To(user_email),
            subject="Thank you for your advertising inquiry - MarkdownConverter",
            html_content=html_content
        )
        
        response = sg.send(message)
        logger.info(f"Confirmation email sent to {user_email}")
        return True, 'Confirmation sent'
        
    except Exception as e:
        logger.error(f"Failed to send confirmation email: {str(e)}")
        return False, 'Failed to send confirmation'