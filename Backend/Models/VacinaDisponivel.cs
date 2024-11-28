using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class VacinaDisponivel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Nome { get; set; } = null!;
        public string Tipo { get; set; } = null!;
        public string Clinica { get; set; } = null!;
        public string Endereco { get; set; } = null!;
        public string Veterinario { get; set; } = null!;
        public string VeterinarioId { get; set; } = null!; // Novo campo
        public DateTime DataDisponivel { get; set; }
    }
}
