using Models.Models;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using Tools.Tools;

namespace ModelViews.ViewModels
{
    public class SyllabusCreateView
    {
        [StringLength(maximumLength: 255)]
        public required string Name { get; set; }
        [StringLength(maximumLength: 3)]
        public required string Code { get; set; }
        public required string Version { get; set; }
        public required string TechnicalRequirement { get; set; }
        public required string Objective { get; set; }
        public required string DeliveryPrinciple { get; set; }
        [Range(minimum: 1, maximum: int.MaxValue)]
        public required int AttendeeQuantity { get; set; }
        [Range(minimum: 1, maximum: 100)]
        public required int PassingCriteria { get; set; }
        [CustomDataValidation.EnumValidation(typeof(SyllabusStatus))]
        public required SyllabusStatus Status { get; set; }
        [CustomDataValidation.EnumValidation(typeof(SyllabusLevel))]
        public required SyllabusLevel Level { get; set; }
        [AssessmentSchemesValidation]
        public required List<AssessmentScheme> AssessmentSchemes { get; set; }
        public required List<SyllabusDay> Days { get; set; }
        //Data Validation
        [AttributeUsage(AttributeTargets.Property)]
        private class AssessmentSchemesValidation : ValidationAttribute
        {
            internal AssessmentSchemesValidation() { }
            protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
            {
                if (value != null
                    && value is List<AssessmentScheme> schemes
                    && schemes.Count > 0
                    && schemes.Select(s => s.Percentage).Sum().Equals(100))
                {
                    return ValidationResult.Success;
                }
                return new ValidationResult($"Total percentage of {validationContext.DisplayName} must be equal to 100");
            }
        }
    }
}
