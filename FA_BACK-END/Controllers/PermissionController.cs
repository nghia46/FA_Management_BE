using Microsoft.AspNetCore.Mvc;
using ModelViews.ViewModels;
using Services.Interfaces;
using Tools.EventBus;

namespace FA_BACK_END.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionService _permissionService;
        private readonly IFeatureService _featureService;
        private readonly IUserRoleService _userRoleService;
        private readonly IEventBus _eventBus;

        public PermissionController(IPermissionService permissionService, IFeatureService featureService, IUserRoleService userRoleService, IEventBus eventBus)
        {
            _permissionService = permissionService;
            _featureService = featureService;
            _userRoleService = userRoleService;
            _eventBus = eventBus;
        }

        [HttpGet("Reset")]
        public async Task<IActionResult> Reset()
        {
            await _permissionService.ResetAllPermission();
            _eventBus.Publish(new()
            {
                EventType = EventType.PermissionChanged
            });
            return Ok();
        }
        [HttpGet("Get-All")]
        public async Task<IActionResult> GetAll()
        {
            var feature = await _featureService.GetAllFeatures();
            var permission = await _permissionService.GetAllFeaturePermissions();
            var userRole = await _userRoleService.GetAllRoles();
            var result = new Dictionary<string, object>()
            {
                { "Feature",feature },
                { "Permission",permission },
                { "UserRole",userRole }
            };
            return Ok(result);
        }
        [HttpPut("Update")]
        public async Task<IActionResult> Update(List<UserRolePermissionView> rolePermissionViews)
        {
            var result = await _permissionService.UpdateRolePermissions(rolePermissionViews);
            _eventBus.Publish(new()
            {
                EventType = EventType.PermissionChanged
            });
            return Ok(result);
        }
    }
}
