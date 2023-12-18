using MongoDB.Bson.Serialization.Attributes;

namespace Models.Models
{
    public class FeaturePermission
    {
        [BsonId]
        public required string PermissionId { get; set; }
        [BsonElement]
        public required string PermissionName { get; set; }
        [BsonElement]
        public required List<string> Action { get; set; }
    }
}
