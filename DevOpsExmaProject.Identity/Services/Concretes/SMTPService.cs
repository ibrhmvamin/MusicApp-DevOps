using DevOpsExmaProject.Identity.Services.Abstracts;
using System.Net.Mail;
using System.Net;

namespace DevOpsExmaProject.Identity.Services.Concretes
{
    public class SMTPService : ISMTPService
    {
        private readonly IConfiguration _configuration;

        public SMTPService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void SendSMTP(string recipientEmail, int randomCheckCode)
        {
            string senderEmail = "mehemmed05.aliyev@gmail.com";
            string senderPassword = "pmkt bkfz ntog qxrh";


            string emailBody = $@"
            <div style='font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 10px;'>
                <div style='text-align: center; margin-bottom: 20px;'>
                    <h1 style='color: #4CAF50;'>Welcome to Music Application</h1>
                    <p style='font-size: 16px;'>Thank you for joining our platform! We're excited to have you onboard.</p>
                </div>
                <div style='text-align: center; margin-bottom: 20px;'>
                    <h2 style='color: #333;'>Your Email Verification Code:</h2>
                    <h2 style='color: #4CAF50; font-size: 24px;'>{randomCheckCode}</h2>
                </div>
                <div style='text-align: center; margin-bottom: 20px;'>
                    <p style='font-size: 14px; color: #777;'>Please use this code to verify your email address. The code is valid for 15 minutes.</p>
                </div>
                <hr style='border: none; height: 1px; background-color: #ddd; margin: 20px 0;'/>
                <div style='text-align: center;'>
                    <p style='font-size: 14px; color: #777;'>Need help? Contact our support team at <a href='mailto:support@musicapp.com' style='color: #4CAF50;'>support@musicapp.com</a>.</p>
                    <p style='font-size: 12px; color: #aaa;'>© 2025 Music Application. All rights reserved.</p>
                </div>
            </div>";


            MailMessage mailMessage = new MailMessage(senderEmail, recipientEmail)
            {
                Subject = "Email Verification Code",
                Body = emailBody,
                IsBodyHtml = true
            };

            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(senderEmail, senderPassword),
                EnableSsl = true
            };

            smtpClient.Send(mailMessage);
        }
    }
}
