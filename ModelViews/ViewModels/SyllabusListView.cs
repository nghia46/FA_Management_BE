using Models.Models;
using System.ComponentModel.DataAnnotations;
using Tools.Tools;

namespace ModelViews.ViewModels
{
    public class SyllabusListView
    {
        public required string Id { get; set; }
        [StringLength(maximumLength: 255)]
        public required string Name { get; set; }
        [StringLength(maximumLength: 3)]
        public required string Code { get; set; }
        public required string ModifiedBy { get; set; }
        public DateOnly ModifiedOn { get; set; }
        [CustomDataValidation.EnumValidation(typeof(SyllabusStatus))]
        public required string Status { get; set; }
        public int Duration { get; set; }
        public required IEnumerable<string> OutputStandard { get; set; }
    }
}
