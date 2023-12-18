using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class Trainee
    {
        [BsonId]
        public required string Id { get; set; }
        [BsonElement]
        public required string Class { get; set; }
        [BsonElement]
        public required string FullName { get; set; }
        [BsonElement]
        public DateOnly Dob { get; set; }
        [BsonElement]
        public required string Phone { get; set; }
        [BsonElement]
        public required string Email { get; set; }
        [BsonElement]
        public string? ImageUrl { get; set; }
        [BsonElement]
        public bool Gender { get; set; }
        [BsonElement]
        public string? Type {get;set;}
        [BsonElement]
        public required string Role { get; set; }
        [BsonElement]
        public bool Status { get; set; }
    }
}
