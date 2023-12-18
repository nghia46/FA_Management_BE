namespace Models.Models
{
    public class SyllabusDay
    {
        public int DayNumber { get; set; }
        public required List<SyllabusUnit> Units { get; set; }
        public int TrainingTime { get => Units?.Select(x => x.TrainingTime).Sum() ?? 0; }
        public IEnumerable<string> OutputStandard { get => Units?.SelectMany(x => x.OutputStandard).Distinct() ?? new List<string>();}
        public SyllabusDay()
        {
            Units = new();
        }
    }
}
