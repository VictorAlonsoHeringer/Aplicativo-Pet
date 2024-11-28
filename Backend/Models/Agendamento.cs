using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace Backend.Models
{
    public class Agendamento
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("NomeTutor")]
        public string NomeTutor { get; set; } = string.Empty;

        [BsonElement("TutorId")] // Adicionando TutorId
        public string TutorId { get; set; } = string.Empty;

        [BsonElement("NomeAnimal")]
        public string NomeAnimal { get; set; } = string.Empty;

        [BsonElement("NomeVacina")]
        public string NomeVacina { get; set; } = string.Empty;

        [BsonElement("VacinaId")]
        public string VacinaId { get; set; } = string.Empty;

        [BsonElement("EnderecoClinica")]
        public string EnderecoClinica { get; set; } = string.Empty;

        [BsonElement("VeterinarioId")]
        public string VeterinarioId { get; set; } = string.Empty;

        [BsonElement("Data")]
        public DateTime Data { get; set; }

        [BsonElement("Horario")]
        public string Horario { get; set; } = string.Empty;

        [BsonElement("Status")]
        public string Status { get; set; } = "Pendente"; // Status inicial
    }
}
