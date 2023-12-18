using Services.Interfaces;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using AutoMapper;
using Repository.Interface;
using Tools.Tools;
using Twilio.Types;
using Twilio.TwiML.Messaging;
using Models.Models;
// Add additional using statements as needed

namespace Services.Services
{
    public class OtpPhoneService : IOtpPhoneService
    {
        private readonly OtpPhoneSettings _otpPhoneSettings;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IRepository<OtpPhone> _otpPhoneRepos;

        public OtpPhoneService(IMapper mapper, IOptions<OtpPhoneSettings> OtpPhoneSettings, IRepository<OtpPhone> otpPhoneRepos, IUserRepository userRepos)
        {
            _otpPhoneSettings = OtpPhoneSettings.Value;
            TwilioClient.Init(_otpPhoneSettings.AccountSid, _otpPhoneSettings.AuthToken);
            _otpPhoneRepos = otpPhoneRepos;
            _mapper = mapper;
            _userRepository = userRepos;
        }

        public Task SendSms(OtpPhoneDTO request)
        {
            var message = MessageResource.Create(
                body: request.Message,
                from: new PhoneNumber(_otpPhoneSettings.PhoneNumber),
                to: new PhoneNumber(request.PhoneNumber)
            );
            return Task.CompletedTask;
        }

        public async Task OtpCall(OtpPhoneDTO request)
        {
            var otp = GenerateOtp(); // Generate the OTP

            // Your TwiML Bin URL with a placeholder for OTP
            var twimlBinUrl = "https://handler.twilio.com/twiml/EH1dda8fd02cf588b646f38aa33750d782?otp=" + otp;

            // Place a voice call using Twilio
            var call = await CallResource.CreateAsync(
                to: new PhoneNumber(request.PhoneNumber),
                from: new PhoneNumber(_otpPhoneSettings.PhoneNumber),
                url: new Uri(twimlBinUrl)
            );
        }

        public async Task SendOtpCall(string phoneNumber)
        {
            var otp = GenerateOtp();
            var message = $"Your verification code is {otp}. I repeat, your code is {otp}.";
            await OtpCall(new OtpPhoneDTO { PhoneNumber = phoneNumber, Message = message });
            await _otpPhoneRepos.AddOneItem(new OtpPhone { Id = IdGenerator.GenerateId(), Otp = otp, PhoneNumber = phoneNumber});
        }


        public async Task SendOtpSms(string phoneNumber)
        {
            var otp = GenerateOtp();
            var expiryTime = DateTime.UtcNow.AddSeconds(300);
            var existingOtp = await _otpPhoneRepos.GetByFilterAsync(s => s.PhoneNumber.Equals(phoneNumber));
            if (existingOtp.Any())
            {
                await _otpPhoneRepos.RemoveItemByValue(existingOtp.First().Id);
            }
            var message = $"Your OTP is: {otp}";
            await SendSms(new OtpPhoneDTO { PhoneNumber = phoneNumber, Message = message });
            await _otpPhoneRepos.AddOneItem(new OtpPhone{ Id = IdGenerator.GenerateId(), Otp = otp, PhoneNumber = phoneNumber, ExpiryTime = expiryTime });           
        }

        private string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString(); // 6-digit OTP
        }

        public async Task<bool> VerifyOtp(string phoneNumber, string otp)
        {
            IEnumerable<OtpPhone> otpRecords = await _otpPhoneRepos.GetByFilterAsync(s => s.PhoneNumber.Equals(phoneNumber));
            if (!otpRecords.Any())
            {
                return false; // No OTP record found for the phone number
            }

            var otpRecord = otpRecords.First();

            if (DateTime.UtcNow >= otpRecord.ExpiryTime)
            {
                // OTP expired
                await _otpPhoneRepos.RemoveItemByValue(otpRecord.Id);
                return false;
            }


            otpRecord.PhoneNumber = phoneNumber;
            otpRecord.Otp = otp;
            await _otpPhoneRepos.RemoveItemByValue(otpRecord.Id);

            return true;
        }
    }
}
