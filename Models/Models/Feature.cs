using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class Feature
    {
        [BsonId]
        public required string FeatureId { get; set; }
        [BsonElement]
        public required string FeatureName { get; set; }
        [BsonElement]
        public required List<string> FeatureUrls { get; set;}
        [BsonElement]
        public required bool CanChangePermission { get; set; }
    }
}
