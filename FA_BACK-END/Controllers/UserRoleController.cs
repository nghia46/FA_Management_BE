using FA_BACK_END.Interface;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Tools.EventBus;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase, IUserRoleController
    {
        private readonly IUserRoleService _userTypeService;
        private readonly IEventBus _eventBus;
        public UserRoleController(IUserRoleService userTypeService, IEventBus eventBus)
        {
            _userTypeService = userTypeService;
            _eventBus = eventBus;
        }

        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAllRole()
        {
            var list = await _userTypeService.GetAllRoles();
            return Ok(list);
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddOneRole(string userRoleName)
        {
            var add = await _userTypeService.AddUserRole(userRoleName);
            _eventBus.Publish(new()
            {
                EventType = EventType.UserRoleChanged
            });
            return Ok(add);
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteRole(string typeId)
        {
            var isDelete = await _userTypeService.DeleteUserRole(typeId);
            if (isDelete)
            {
                _eventBus.Publish(new()
                {
                    EventType = EventType.UserRoleChanged
                });
                return Ok();
            }
            return BadRequest();
        }
    }
}
