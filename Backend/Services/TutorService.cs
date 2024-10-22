using Backend.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using BCrypt.Net;

namespace Backend.Services
{
    public class TutorService
    {
        private readonly IMongoCollection<Tutor> _tutors;

        public TutorService(IMongoClient mongoClient, IOptions<MongoDBSettings> settings)
        {
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _tutors = database.GetCollection<Tutor>("Tutors");
        }

        public async Task<List<Tutor>> GetAsync() =>
            await _tutors.Find(tutor => true).ToListAsync();

        public async Task<Tutor?> GetAsync(string id) =>
            await _tutors.Find<Tutor>(tutor => tutor.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Tutor tutor)
        {
            // Gerar o hash da senha antes de salvar
            tutor.Senha = BCrypt.Net.BCrypt.HashPassword(tutor.Senha);
            
            // O MongoDB gera o ObjectId automaticamente
            await _tutors.InsertOneAsync(tutor);
        }

        public async Task UpdateAsync(string id, Tutor updatedTutor) =>
            await _tutors.ReplaceOneAsync(tutor => tutor.Id == id, updatedTutor);

        public async Task RemoveAsync(string id) =>
            await _tutors.DeleteOneAsync(tutor => tutor.Id == id);

        public async Task<Tutor?> ValidateLoginAsync(string username, string password)
        {
            // Buscar tutor pelo nome de usuário ou email
            var tutor = await _tutors.Find(t => t.Email == username).FirstOrDefaultAsync();
            if (tutor != null && BCrypt.Net.BCrypt.Verify(password, tutor.Senha))
            {
                return tutor; // Retorna o tutor se a senha for válida
            }
            return null; // Retorna nulo se o login falhar
        }
    }
}
