using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class Animal
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } // Permitir nulo para que o MongoDB o gere automaticamente

        public string Nome { get; set; } = null!;
        public int Idade { get; set; }
        public string Raca { get; set; } = null!;
        public string TutorId { get; set; } = null!; // Relacionamento com o tutor
    }
}
