using FA_BACK_END.Interface;
using Microsoft.AspNetCore.Http;
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
    public class UserManagementController : ControllerBase,IUserManagermentController
    {
        private readonly IUserService _userService;

        public UserManagementController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet("Get-All")]
        public async Task<IActionResult> GetUsers(
           [FromQuery] int page = 1,
           [FromQuery] int pageSize = 10,
           [FromQuery] string sortField = "RoleId",
           [FromQuery] int sortOrder = 1,
           [FromQuery] DateOnly? startDate = null,
           [FromQuery] DateOnly? endDate = null,
           [FromQuery] List<bool>? genderList = null,
           [FromQuery] List<string>? userTypeList = null,
           [FromQuery] string? searchValue = null)
        {
            var response = await _userService.GetUsers(page, pageSize, sortOrder, sortField, startDate, endDate, genderList, userTypeList, searchValue);
            return Ok(response);
        }
        [HttpGet("Get")]
        public async Task<IActionResult> GetUser([FromQuery][Required] string id)
        {
            User user = await _userService.GetUser(id);
            return Ok(user);
        }
        [HttpPost("Add")]
        public async Task<IActionResult> AddUser(UserView userView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            User user = await _userService.AddUser(userView);
            return Ok(user);
        }
        [HttpPost("Add-Users")]
        public async Task<IActionResult> AddUsers(List<UserView> userViews)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IEnumerable<User> users = await _userService.AddUsers(userViews);
            return Ok(users);
        }
        [HttpPut("Update")]
        public async Task<IActionResult> UpdateUser([FromQuery][Required] string id, UserView userView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userService.UpdateUser(id, userView);
            return Ok(user);
        }
        [HttpPut("Update-Role")]
        public async Task<IActionResult> UpdateRole([FromQuery][Required] string id, [FromBody] string roleId)
        {
            var user = await _userService.UpdateUserRole(id, roleId);
            return Ok(user);
        }

        [HttpPut("Toggle-Status")]
        public async Task<IActionResult> ToggleUser([FromQuery][Required] string id)
        {
            var user = await _userService.ToggleUserStatus(id);
            return Ok(user);
        }
        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteUser([FromQuery][Required] string id)
        {
            var isDeleted = await _userService.DeleteUser(id);
            if (isDeleted)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
