using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class VerifyCode
    {
        [BsonId]
        public required string Id { get; set; }
        [BsonElement]
        public required string Email { get; set; }
        [BsonElement]
        public required string Code { get; set; }
        [BsonElement]
        public required DateTime CreateAt { get; set; }
    }
}
