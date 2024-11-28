using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class Vacina
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Nome { get; set; } = null!; // Nome da vacina
        public string Tipo { get; set; } = null!; // Tipo da vacina
        public DateTime Validade { get; set; } // Validade da vacina
        public string VeterinarioId { get; set; } = null!; // Id do veterinário que cadastrou

        // Propriedades adicionais
        public string? Clinica { get; set; } // Nome da clínica associada à vacina
        public string? NomeVeterinario { get; set; } // Nome do veterinário associado à vacina
    }
}
