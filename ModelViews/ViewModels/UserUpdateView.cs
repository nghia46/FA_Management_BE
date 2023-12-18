using Tools.Tools;

namespace ModelViews.ViewModels
{
    public class UserUpdateView
    {
        public required string Name { get; set; }
        [CustomDataValidation.PhoneNumberValidation]
        public required string Phone { get; set; }
        [CustomDataValidation.AgeValidation(18, 65)]
        public DateOnly Dob { get; set; }
        public bool Gender { get; set; }
        public string? ImageUrl { get; set; }
    }
}
