using FA_BACK_END.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Models.Models;
using ModelViews.ViewModels;
using Services.Interfaces;
using Services.Services;
using System.ComponentModel.DataAnnotations;


namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase, IUserController
    {
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly IOtpPhoneService _phoneService;

        public UserController(IUserService userService, IOtpPhoneService phoneService, IConfiguration configuration, IOptions<EmailSetting> option)

        {
            _userService = userService;
            _emailService = new EmailService(option);
            _phoneService = phoneService;
        }

        [HttpGet("Updated-User")]
        public async Task<IActionResult> UpdatedUser(string id)
        {
            UserUpdateView userUpdated = await _userService.GetUpdatedUser(id);
            return Ok(userUpdated);
        }
        [HttpGet("Activate")]
        public async Task<IActionResult> ChangeStatus([FromQuery] [Required] string id)
        {
            string idWaiting = await _userService.SortIdRegister(id);
            if (idWaiting != id)
            {
                return BadRequest("Id is not exist!!!");
            }
            await _userService.ChangeStatus(id);
            string url = UrlRedirect();
            return Redirect(url);
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserRegisterView model)
        {
            User user = await _userService.Register(model);
            try
            {
                EmailDTO emailDto = new EmailDTO();
                emailDto.To = user.Email;
                emailDto.Subject = "Confirm Account";
                emailDto.Body = GetHtmlcontent(user.Name, user.Id);
                await _emailService.SendEmail(emailDto);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return Ok();
        }
       
        [HttpPost("Google-Login")]
        public async Task<IActionResult> GoogleLogin(GoogleUser googleUser)
        {
            (string, UserUpdateView) tuple = await _userService.GoogleAuthorizeUser(googleUser);
            Dictionary<string, object> result = new()
            {
                { "token", tuple.Item1 },
                { "user", tuple.Item2 ?? null }
            };
            return Ok(result);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> LoginUser(LoginUser loginUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            (string, UserUpdateView) tuple = await _userService.AuthorizeUser(loginUser);
            if (tuple.Item1 == null)
            {
                return Unauthorized();
            }

            Dictionary<string, object> result = new()
            {
                { "token", tuple.Item1 },
                { "user", tuple.Item2 ?? null }
            };
            return Ok(result);
        }


        
        

        private string UrlRedirect()
        {
            return "https://fams.gitlab.io/fafrontend/activeSuccess.html";
        }

        private string UrlActivate(string id)
        {
            return $"https://fabackend.azurewebsites.net/api/User/Activate?id={id}";
        }

        private string GetHtmlcontent(string name, string id)
        {
            string Response = "<div style=\"wid" +
                              "th:100%;text-align:center;margin:10px\">";
            Response += "<h1>Welcome to FAMS</h1>";
            Response +=
                "<img style=\"width:10rem\" src=\"https://cdn-icons-png.flaticon.com/128/1145/1145941.png\" />";
            Response += "<h1 style=\"color:#f57f0e\">Dear " + name + "</h1>";
            Response +=
                "<button style=\"background-color: #f57f0e; color: white; padding: 14px 20px; margin: 8px 0; border: none; cursor: pointer; border-radius: 4px;\">";
            Response += "<a href=\" " + UrlActivate(id) +
                        "\" style=\"text-decoration: none; color: white;\">Activate the account</a>";
            Response += "</button>";
            Response += "<div><h1>Contact us: lammjnhphong4560@gmail.com</h1></div>";
            Response += "</div>";
            return Response;
        }

        [HttpPost("Send-Otp-Sms")]
        public async Task<IActionResult> SendOtp(string phoneNumber)
        {
            try
            {
                await _phoneService.SendOtpSms(phoneNumber);
                return Ok("OTP sent successfully");
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., Twilio exceptions, network issues)
                return StatusCode(500, "Error sending OTP sms: " + ex.Message);
            }
        }

        [HttpPost("Send-Otp-Call")]
        public async Task<IActionResult> SendOtpCall(string phoneNumber)
        {
            try
            {
                await _phoneService.SendOtpCall(phoneNumber);
                return Ok("OTP call sent successfully.");
            }
            catch (Exception ex)
            {
                // Handle exceptions (e.g., Twilio exceptions, network issues)
                return StatusCode(500, "Error sending OTP call: " + ex.Message);
            }
        }

        [HttpPost("Verify-Otp")]
        public async Task<IActionResult> VerifyOtp(string phoneNumber, string otp)
        {
            var isValid = await _phoneService.VerifyOtp(phoneNumber, otp);
            if (isValid)
            {
                return Ok("OTP is valid");
            }
            else
            {
                return BadRequest("Invalid OTP");
            }
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateUser([FromQuery] [Required] string id, UserUpdateView userView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userService.UserUpdateUser(id, userView);
            return Ok(user);
        }
        [HttpPut("Update-Password")]
        public async Task<IActionResult> UpdatePassword(ChangePasswordView changePassword)
        {
            var userId = Tools.Tools.Authentication.GetUserIdFromHttpContext(HttpContext);
            var user = await _userService.ChangePasword(userId, changePassword);
            return Ok(user);
        }


    }
}