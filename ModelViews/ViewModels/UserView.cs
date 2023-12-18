using Tools.Tools;

namespace ModelViews.ViewModels
{
    public class UserView
    {
        public required string RoleId { get; set; }
        public required string Name { get; set; }
        [CustomDataValidation.EmailValidation]
        public required string Email { get; set; }
        [CustomDataValidation.PhoneNumberValidation]
        public required string Phone { get; set; }
        [CustomDataValidation.AgeValidation(18, 65)]
        public DateOnly Dob { get; set; }
        public bool Gender { get; set; }
        public string? ImageUrl { get; set; }
        public string? Class { get; set; }
        public bool? Status { get; set; }
    }
}
