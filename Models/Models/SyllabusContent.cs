namespace Models.Models
{
    public class SyllabusContent
    {
        public required string Name { get; set; }
        public required string OutputStandard { get; set; }
        public int TrainingTime { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public DeliveryType DeliveryType { get; set; }
        public required List<SyllabusMaterial> Materials { get; set; }

        public SyllabusContent()
        {
            Materials = new();
        }
    }
    public enum DeliveryType
    {
        AssightmentLab, 
        ConceptLecture, 
        GuideReview, 
        TestQuiz, 
        Exam, 
        SeminarWorkshop
    }
    public enum DeliveryMethod
    {
        Offline,
        Online
    }
}
