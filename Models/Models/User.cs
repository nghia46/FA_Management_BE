using MongoDB.Bson.Serialization.Attributes;
namespace Models.Models
{
    public class User
    {
        [BsonId]
        public required string Id { get; set; }
        [BsonElement]
        public required string RoleId { get; set; }
        [BsonElement]
        public required string Name { get; set; }
        [BsonElement]
        public required string Email { get; set; }
        [BsonElement]
        public required string Password { get; set; }
        [BsonElement]
        public required string Phone { get; set; }
        [BsonElement]
        public DateOnly Dob { get; set; }
        [BsonElement]
        public bool Gender { get; set; }
        [BsonElement]
        public string? ImageUrl { get; set; }
        [BsonElement]
        public string? Class { get; set; }
        [BsonElement]
        public bool Status { get; set; }
        [BsonElement]
        public DateTime CreateAt { get; set; }
    }
}
