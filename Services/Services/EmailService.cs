using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Models.Models;
using Services.Interfaces;

namespace Services.Services;

public class EmailService : IEmailService
{
        private readonly EmailSetting _emailSetting;

        public EmailService(IOptions<EmailSetting> option)
        {
            _emailSetting = option.Value;
        }

        public async Task SendEmail(EmailDTO request)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(_emailSetting.Email);
            email.From.Add(MailboxAddress.Parse(_emailSetting.Email));
            email.To.Add(MailboxAddress.Parse(request.To));
            email.Subject = request.Subject;
            var builder = new BodyBuilder();
            builder.HtmlBody = request.Body;
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            smtp.Connect(_emailSetting.Host, _emailSetting.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_emailSetting.Email, _emailSetting.Password);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }
}