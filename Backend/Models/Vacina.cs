using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class Vacina
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Nome { get; set; } = null!;
        public string Tipo { get; set; } = null!;
        public DateTime Validade { get; set; }
        public string VeterinarioId { get; set; } = null!;
    }
}
