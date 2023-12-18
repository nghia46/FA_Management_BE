using Models.Models;

namespace ModelViews.ViewModels
{
    public class ClassView
    {
        public required string Name { get; set; }
        public required string Code { get; set; }
        public required string LocationId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public required string FSU { get; set; }
        public required string AttendeeId { get; set; }
        public StatusClass Status { get; set; }
        public required int Planned { get; set; }
        public required int Accepted { get; set; }
        public required int Actual { get; set; }
        public required List<string> Trainer { get; set; }
        public required List<string> Admin { get; set; }
        public required TimeOnly ClassTime { get; set; }
    }
}