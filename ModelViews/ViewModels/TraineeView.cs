namespace ModelViews.ViewModels
{
    public class TraineeView
    {
        public required string FullName { get; set; }
        public required string Phone { get; set; }
        public required string Email { get; set; }
        public required string ImageUrl { get; set; }
        public required DateOnly Dob { get; set; }
        public required string Type { get; set; }
        public required string Class { get; set; }
        public bool Gender { get; set; }
        public bool Status { get; set; }
        public required string Role { get; set; }
    }
}
