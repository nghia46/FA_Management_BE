using Amazon.Runtime.Internal.Transform;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using ModelViews.ViewModels;
using Repository.Interface;
using Services.Interfaces;
using Tools.Tools;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ForgotPasswordController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IForgotPasswordService _forgotPasswordService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        public ForgotPasswordController(IUserService userService, IForgotPasswordService forgotPasswordService, IEmailService emailService, IConfiguration configuration)
        {
            _userService = userService;
            _forgotPasswordService = forgotPasswordService;
            _emailService = emailService;
            _configuration = configuration;

        }
        [HttpGet("Verify-Code")]
        public async Task<IActionResult> VerifyCode([FromQuery] string code, [FromQuery] string email)
        {
            try
            {
                User user = await _forgotPasswordService.VerifyCode(code, email);
                Authentication authentication = new(_configuration);
                string token = authentication.GenerateJwtToken(user.Id, 0.16f);
                return Ok(token);
            }
            catch (CustomException.InvalidDataException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Send-Code")]
        public async Task<IActionResult> CheckEmailAndSendCode([FromBody] string email)
        {
            var user = await _userService.FindUserByEmail(email);
            if (user != null)
            {
                if (await _forgotPasswordService.IsCodeExist(email))
                {
                    await _forgotPasswordService.Delete(email);
                }
                string code = IdGenerator.GenerateRandomVerifyCode();
                await _forgotPasswordService.AddCode(code, email);
                EmailDTO emailDto = new EmailDTO();
                emailDto.To = email;
                emailDto.Subject = "Verification Code";
                emailDto.Body = GetHtmlcontent(code);
                await _emailService.SendEmail(emailDto);
                var result = new Dictionary<string, string>() {
                    {"email",email }
                };
                return Ok(result);
            }
            else
            {
                return BadRequest("User not found!");
            }

        }

        

        [HttpPost("Reset-Password")]
        public async Task<IActionResult> ResetPassword(string email, string password)
        {
            string userID = Tools.Tools.Authentication.GetUserIdFromHttpContext(HttpContext);
            var user = await _userService.UpdatePassword(email, password, userID);
            if (user != null)
            {
                return Ok(user);
            }
            else
            {
                return BadRequest("Cannot reset password!");
            }
        }




        private string GetHtmlcontent(string code)
        {
            string Response = " <div class=\"container\" style=\"text-align: center\">\r\n "
                + "<img\r\n src=\"https://cdn-icons-png.flaticon.com/512/3617/3617039.png\"\r\n alt=\"image\"\r\n class=\"image\"\r\n style=\"width: 160px; height: 160px;\"\r\n/>"
                + "\r\n<div class=\"h4\" style=\"padding-top: 16px; font-size: 18px;\">Hi</div>\r\n"
                + "<div style=\"padding-top: 16px; font-size: 20px;\">Here is the confirmation code for your online form:</div>\r\n"
                + " <div class=\"code\" style=\"padding-top: 16px; font-size: 50px; font-weight: bold; color: #f57f0e;\"> " + code + " </div>\r\n"
                + "<div style=\"padding-top: 16px; font-size: 18px;\">\r\nAll you have to do is copy the confirmation code and paste it to your\r\n form to complete the email verification process.\r\n</div>\r\n</div>";
            return Response;
        }
    }
}




