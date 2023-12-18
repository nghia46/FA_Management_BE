using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Tools.Tools
{
    public class CustomDataValidation
    {
        [AttributeUsage(AttributeTargets.Property)]
        public class AgeValidation : ValidationAttribute
        {
            private readonly int _minAge;
            private readonly int _maxAge;
            public AgeValidation(int minAge, int maxAge)
            {
                _minAge = minAge;
                _maxAge = maxAge;
            }
            protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
            {
                if (value is DateOnly dob)
                {
                    int age = DateTime.Now.Year - dob.Year;
                    if (dob.AddYears(age) > DateOnly.FromDateTime(DateTime.Now))
                    {
                        age--;
                    }
                    if (age >= _minAge && age <= _maxAge)
                    {
                        return ValidationResult.Success;
                    }
                }
                return new ValidationResult($"Age must be between {_minAge} and {_maxAge}");
            }
        }

        [AttributeUsage(AttributeTargets.Property)]
        public class EmailValidation : ValidationAttribute
        {
            public EmailValidation() { }
            public override bool IsValid(object? value)
            {
                if (value is string email)
                {
                    string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
                    return Regex.IsMatch(email, pattern);
                }
                return false;
            }
        }
        [AttributeUsage(AttributeTargets.Property)]
        public class PhoneNumberValidation : ValidationAttribute
        {
            public PhoneNumberValidation() { }
            public override bool IsValid(object? value)
            {
                if (value is string phoneNumber)
                {
                    string pattern = @"^[0-9]{10}$";
                    return Regex.IsMatch(phoneNumber, pattern);
                }
                return false;
            }
        }
        [AttributeUsage(AttributeTargets.Property)]
        public class EnumValidation : ValidationAttribute
        {
            private readonly Type _enumType;
            public EnumValidation(Type enumType)
            {
                _enumType = enumType;
            }
            protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
            {
                if (value != null && Enum.IsDefined(_enumType, value))
                {
                    return ValidationResult.Success;
                }
                return new ValidationResult($"Invalid value for {validationContext.DisplayName}");
            }
        }
    }
}
