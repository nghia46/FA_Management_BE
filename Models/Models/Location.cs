using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class Location
    {
        [BsonId]
        public required string Id { get; set; }
        [BsonElement]
        public required string Name { get; set; }
    }
}
