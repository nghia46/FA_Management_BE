namespace ModelViews.ViewModels
{
    public class TrainingProgramView
    {
        public required string Name { get; set; }
        public required string Information { get; set; }
        public required List<string> Syllabuses { get; set; }
        public bool Status { get; set; }
    }
}
