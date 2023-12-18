namespace ModelViews.ViewModels
{
    public class UserRolePermissionView
    {   
        public required string Id { get; set; }
        public required Dictionary<string, string> FeatureAccessPermission { get; set; }
    }
}
