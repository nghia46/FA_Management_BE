using Models.Models;
using ModelViews.ViewModels;
using MongoDB.Driver;
using Repository.Interface;
using Services.Interfaces;
using Tools.Tools;

namespace Services.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IRepository<Feature> _featureRepository;
        private readonly IRepository<FeaturePermission> _featurePermissionRepository;
        private readonly IRepository<UserRole> _userRoleRepository;
        public PermissionService(IRepository<Feature> featureRepo, IRepository<UserRole> userRepo, IRepository<FeaturePermission> permissionRepo)
        {
            _featureRepository = featureRepo;
            _featurePermissionRepository = permissionRepo;
            _userRoleRepository = userRepo;
        }
        public async Task ResetAllPermission()
        {
            IEnumerable<Feature> oldFeatures = await _featureRepository.GetAllAsync();
            foreach (var item in oldFeatures)
            {
                await _featureRepository.RemoveItemByValue(item.FeatureId);
            }
            List<Feature> features = new()
            {
                new Feature()
                {
                    FeatureId = "usermanagement",
                    FeatureName = "User Management",
                    FeatureUrls = new(){"/api/User","/api/Permission","/api/UserRole" },
                    CanChangePermission = false
                },
                new Feature()
                {
                    FeatureId = "material",
                    FeatureName = "Learning Material",
                    FeatureUrls = new() { "/api/LearningMaterial" },
                    CanChangePermission = true
                },
                new Feature()
                {
                    FeatureId = "class",
                    FeatureName = "Class",
                    FeatureUrls = new() { "/api/Class","/api/Location","/api/Attendee","/api/Trainee" },
                    CanChangePermission = true
                },
                new Feature()
                {
                    FeatureId = "program",
                    FeatureName = "Training Program",
                    FeatureUrls = new() { "/api/TrainingProgram" },
                    CanChangePermission = true
                },
                new Feature()
                {
                    FeatureId = "syllabus",
                    FeatureName = "Syllabus",
                    FeatureUrls = new() { "/api/Syllabus" },
                    CanChangePermission= true
                },
                new Feature()
                {
                    FeatureId = "logger",
                    FeatureName = "View Log",
                    FeatureUrls = new() { "/api/Logger" },
                    CanChangePermission= false
                }
            };
            await _featureRepository.AddManyItem(features);

            IEnumerable<FeaturePermission> oldPermissions = await _featurePermissionRepository.GetAllAsync();
            foreach (var item in oldPermissions)
            {
                await _featurePermissionRepository.RemoveItemByValue(item.PermissionId);
            }
            List<FeaturePermission> permissions = new()
                {
                    new()
                    {
                        PermissionId = "create",
                        PermissionName = "Create",
                        Action = new()
                        {
                            "Add",
                            "Get-All",
                            "Get"
                        }
                    },
                    new()
                    {
                        PermissionId = "view",
                        PermissionName = "View",
                        Action = new()
                        {
                            "Get-All",
                            "Get"
                        }
                    },
                    new()
                    {
                        PermissionId = "modify",
                        PermissionName = "Modify",
                        Action = new()
                        {
                            "Toggle-Status",
                            "Update",
                            "Get-All",
                            "Get"
                        }
                    },
                    new()
                    {
                        PermissionId = "none",
                        PermissionName = "Access Denied",
                        Action = new()
                    },
                    new()
                    {
                        PermissionId = "full",
                        PermissionName = "Full Access",
                        Action = new()
                        {
                            "Add",
                            "Get-All",
                            "Get",
                            "Update",
                            "Delete",
                            "Toggle-Status",
                            "Reset"
                        }
                    }
                };
            await _featurePermissionRepository.AddManyItem(permissions);

            IEnumerable<UserRole> oldRoles = await _userRoleRepository.GetAllAsync();
            foreach (var item in oldRoles)
            {
                await _userRoleRepository.RemoveItemByValue(item.Id);
            }
            List<UserRole> roles = new()
            {
                new()
                {
                    Id="user",
                    Name="User",
                    FeatureAccessPermission=features
                        .Select(f=>f.FeatureId)
                        .ToDictionary(key=>key,_=>permissions.First(p=>p.PermissionId.Equals("none")).PermissionId)
                },
                new()
                {
                    Id="trainer",
                    Name="Trainer",
                    FeatureAccessPermission=features
                        .Select(f=>f.FeatureId)
                        .ToDictionary(key=>key,_=>permissions.First(p=>p.PermissionId.Equals("none")).PermissionId)
                },
                new()
                {
                    Id="admin",
                    Name="Admin",
                    FeatureAccessPermission = features
                    .Select(f => f.FeatureId)
                    .ToDictionary(key => key, _ => permissions.First(p => p.PermissionId.Equals("none")).PermissionId)
                },
                new()
                {
                    Id= "superadmin",
                    Name="Super Admin",
                    FeatureAccessPermission = features
                    .Select(f => f.FeatureId)
                    .ToDictionary(key => key, _ => permissions.First(p => p.PermissionId.Equals("full")).PermissionId)
                }
            };
            await _userRoleRepository.AddManyItem(roles);

        }
        public async Task<IEnumerable<FeaturePermission>> GetAllFeaturePermissions()
        {
            IEnumerable<FeaturePermission> featurePermissions = await _featurePermissionRepository.GetAllAsync();
            return featurePermissions;
        }
        public async Task<IEnumerable<UserRole>> UpdateRolePermissions(IEnumerable<UserRolePermissionView> rolePermissionViews)
        {
            IEnumerable<UserRole> userRoles = await _userRoleRepository.GetAllAsync();
            IEnumerable<Feature> features = await _featureRepository.GetAllAsync();
            IEnumerable<FeaturePermission> featurePermissions = await _featurePermissionRepository.GetAllAsync();

            IEnumerable<string> roleIds = rolePermissionViews.Select(v => v.Id);
            IEnumerable<string> featureIds = rolePermissionViews
                .SelectMany(v => v.FeatureAccessPermission.Keys);
            IEnumerable<string> permissionIds = rolePermissionViews
                .SelectMany(v => v.FeatureAccessPermission.Values)
                .Distinct();

            IEnumerable<string> validRoleIds = userRoles.Select(r => r.Id);
            bool hasInvalidRoleIds = roleIds.Any(id => !validRoleIds.Contains(id));
            if (hasInvalidRoleIds)
            {
                throw new CustomException.InvalidDataException($"Some role ids are invalid");
            }

            IEnumerable<string> validFeatureIds = features
                .Where(f => f.CanChangePermission == true)
                .Select(f => f.FeatureId);
            bool hasInvalidFeatureIds = featureIds.Any(id => !validFeatureIds.Contains(id));
            if (hasInvalidFeatureIds)
            {
                throw new CustomException.InvalidDataException("$Some feature ids are invaid or read only");
            }

            IEnumerable<string> validPermissionIds = featurePermissions.Select(p => p.PermissionId);
            bool hasInvalidPermissionId = permissionIds.Any(id => !validPermissionIds.Contains(id));
            if (hasInvalidPermissionId)
            {
                throw new CustomException.InvalidDataException($"Some permission ids are invalid");
            }

            List<UserRole> updatedRoles = new();
            foreach (var item in rolePermissionViews)
            {
                UserRole updatingRole = userRoles.First(r => r.Id.Equals(item.Id));
                Dictionary<string, string> updatingPerm = updatingRole.FeatureAccessPermission;
                foreach (var perm in item.FeatureAccessPermission)
                {
                    updatingPerm[perm.Key] = perm.Value;
                }
                updatingRole.FeatureAccessPermission = updatingPerm;
                updatedRoles.Add(await _userRoleRepository.UpdateItemByValue(item.Id, updatingRole));
            }
            return updatedRoles;
        }
    }
}
