using Models.Models;

namespace Services.Interfaces;

public interface IEmailService
{
    Task SendEmail(EmailDTO request);
}