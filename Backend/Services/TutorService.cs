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
            await _tutors.Find(tutor => tutor.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Tutor tutor)
        {
            // Verificar se já existe um tutor com o mesmo email
            var existingTutor = await _tutors.Find(t => t.Email == tutor.Email).FirstOrDefaultAsync();
            if (existingTutor != null)
            {
                throw new InvalidOperationException("Este email já está registrado.");
            }

            // Gerar o hash da senha antes de salvar
            tutor.Senha = BCrypt.Net.BCrypt.HashPassword(tutor.Senha);

            // Inserir o tutor no banco de dados
            await _tutors.InsertOneAsync(tutor);
        }

        public async Task UpdateAsync(string id, Tutor updatedTutor)
        {
            // Garantir que o hash da senha seja mantido ao atualizar
            var existingTutor = await _tutors.Find(t => t.Id == id).FirstOrDefaultAsync();
            if (existingTutor != null)
            {
                updatedTutor.Senha = existingTutor.Senha;
            }

            await _tutors.ReplaceOneAsync(tutor => tutor.Id == id, updatedTutor);
        }

        public async Task RemoveAsync(string id) =>
            await _tutors.DeleteOneAsync(tutor => tutor.Id == id);

        public async Task<Tutor?> ValidateLoginAsync(string email, string password)
        {
            // Buscar tutor pelo email
            var tutor = await _tutors.Find(t => t.Email == email).FirstOrDefaultAsync();
            if (tutor != null && BCrypt.Net.BCrypt.Verify(password, tutor.Senha))
            {
                return tutor; // Retorna o tutor se a senha for válida
            }
            return null; // Retorna nulo se o login falhar
        }
    }
}
