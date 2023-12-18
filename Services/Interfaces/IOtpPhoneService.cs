using Models.Models;
using Services.Services;

namespace Services.Interfaces
{
    public interface IOtpPhoneService
    {
        Task SendOtpSms(string phoneNumber);
        Task SendSms(OtpPhoneDTO request);
        Task<bool> VerifyOtp(string phoneNumber, string otp);
        Task OtpCall(OtpPhoneDTO request);
        Task SendOtpCall(string phoneNumber);
    }
}