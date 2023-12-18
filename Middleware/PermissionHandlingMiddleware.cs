using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;
using Services.Interfaces;
using MongoDB.Driver;
using Models.Models;
using Tools.Tools;
using Tools.EventBus;

namespace Middleware
{
    public class PermissionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IEnumerable<string> _excludedUris;
        private readonly IEventBus _eventBus;

        private IEnumerable<UserRole>? _cachedUserRoles;
        private IEnumerable<Feature>? _cachedFeatures;
        private IEnumerable<FeaturePermission>? _cachedPermissions;
        private bool _isCacheStale = true;
        public PermissionHandlingMiddleware(RequestDelegate next, IEventBus eventBus)
        {
            _next = next;
            _excludedUris = new List<string>()
            {
                "/api/User/Register",
                "/api/User/Login",
                "/api/User/Google-Login",
                "/api/User/Activate",
                "/api/User/Send-Otp-Sms",
                "/api/User/Verify-Otp",
                "/api/User/Send-Otp-Call",
                "/api/User/Update",
                "/api/User/Updated-User",
                "/api/User/Update-Password",
                "/api/User/Activate",
                "/api/ForgotPassword/Send-Code",
                "/api/ForgotPassword/Verify-Code",
                "/api/ForgotPassword/Reset-Password"
            };
            _eventBus = eventBus;
            _eventBus.EventPublished += HandleEvent;
        }
        public async Task Invoke(
            HttpContext context, 
            IUserRoleService userRoleService, 
            IFeatureService featureService, 
            IPermissionService permissionService,
            IUserService userService
            )
        {
            if ( _isCacheStale )
            {
                await UpdateCacheData(userRoleService, featureService, permissionService);
            }
            if (await HasPermission(context, userService))
            {
                await _next(context);
            }
            else
            {
                await HandleForbiddenRequest(context);
            }
        }
        private async Task<bool> HasPermission(HttpContext context, IUserService userService)
        {
            string requestUri = context.Request.Path;
            if (_excludedUris.Contains(requestUri) || !requestUri.StartsWith("/api/"))
                return true;

            string[] segments = requestUri.Split('/');
            string featureUri = string.Join("/", segments.Take(segments.Length - 1));
            string action = segments[^1];

            User user;
            try
            {
                string userId = Authentication.GetUserIdFromHttpContext(context);
                user = await userService.GetUser(userId);
            } catch (Exception)
            {
                return false;
            }
            UserRole? currentUserRole = _cachedUserRoles?.FirstOrDefault(r => r.Id == user.RoleId);
            if (currentUserRole == null)
                return false;

            Feature? requestedFeature = _cachedFeatures?.FirstOrDefault(f => f.FeatureUrls.Contains(featureUri));
            if (requestedFeature == null)
                return false;

            IEnumerable<FeaturePermission>? requestedPermissions = _cachedPermissions?.Where(p => p.Action.Contains(action));
            if (requestedPermissions == null || !requestedPermissions.Any())
                return false;

            Dictionary<string, string> currentUserPermissions = currentUserRole.FeatureAccessPermission;
            return currentUserPermissions.TryGetValue(requestedFeature.FeatureId, out string? userPermission)
                && requestedPermissions.Select(r=>r.PermissionId).Contains(userPermission);
        }
        private void HandleEvent(object? sender, Event @event)
        {
            if (@event.EventType == EventType.PermissionChanged
                || @event.EventType == EventType.UserRoleChanged)
            {
                _isCacheStale = true;
            }
        }
        private async Task UpdateCacheData(IUserRoleService userRoleService, IFeatureService featureService, IPermissionService permissionService)
        {
            _cachedUserRoles = await userRoleService.GetAllRoles();
            _cachedFeatures = await featureService.GetAllFeatures();
            _cachedPermissions = await permissionService.GetAllFeaturePermissions();
            _isCacheStale = false;
        }
        private static async Task HandleForbiddenRequest(HttpContext context)
        {
            var code = HttpStatusCode.Forbidden;
            var result = JsonSerializer.Serialize(new { error = "You don't have permission to access this feature" });

            context.Response.ContentType = "application/json";
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Response.StatusCode = (int)code;

            await context.Response.WriteAsync(result);
        }
    }
}
