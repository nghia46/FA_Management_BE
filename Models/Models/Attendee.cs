using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class Attendee
    {
        [BsonId] 
        public required string Id { get; set; }
        [BsonElement] 
        public required string Name { get; set; }
    }
}