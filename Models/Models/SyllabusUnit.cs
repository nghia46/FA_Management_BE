using System.ComponentModel.DataAnnotations;

namespace Models.Models
{
    public class SyllabusUnit
    {
        public required int UnitNumber { get; set; }
        public required string UnitTitle { get; set;}
        public required List<SyllabusContent> Contents { get; set; }
        public int TrainingTime { get => Contents?.Select(x => x.TrainingTime).Sum() ?? 0; }
        public IEnumerable<string> OutputStandard { get => Contents?.Select(x => x.OutputStandard).Distinct() ?? new List<string>(); }

        public SyllabusUnit()
        {
            Contents = new();
        }
    }
}
