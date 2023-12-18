using System.ComponentModel.DataAnnotations;
using Tools.Tools;
namespace ModelViews.ViewModels
{
    public class UserRegisterView
    {
        [StringLength(maximumLength: 40,MinimumLength =8)]
        public required string Name { get; set; }
        [CustomDataValidation.EmailValidation]
        public required string Email { get; set; }
        [CustomDataValidation.PhoneNumberValidation]
        public required string Phone { get; set; }
        [StringLength(maximumLength:int.MaxValue,MinimumLength =8)]
        public required string Password { get; set; }
        [CustomDataValidation.AgeValidation(18,65)]
        public DateOnly Dob { get; set; }
        public bool Gender { get; set; }
    }
}