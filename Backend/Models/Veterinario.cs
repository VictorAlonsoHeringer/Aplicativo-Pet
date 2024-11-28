using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class Veterinario
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Nome { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Senha { get; set; } = null!;
        public List<string> Clinicas { get; set; } = new List<string>();
        public string Endereco { get; set; } = ""; // Novo campo para endereço
        public string Telefone { get; set; } = ""; // Novo campo para telefone
        public string Role { get; set; } = "veterinario";
    }
}
