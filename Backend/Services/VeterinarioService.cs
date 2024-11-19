using Backend.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using BCrypt.Net;

namespace Backend.Services
{
    public class VeterinarioService
    {
        private readonly IMongoCollection<Veterinario> _veterinarios;

        public VeterinarioService(IMongoClient mongoClient, IOptions<MongoDBSettings> settings)
        {
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _veterinarios = database.GetCollection<Veterinario>("Veterinarios");
        }

        public async Task CreateVeterinarioAsync(Veterinario veterinario)
        {
            var existingVet = await _veterinarios.Find(v => v.Email == veterinario.Email).FirstOrDefaultAsync();
            if (existingVet != null)
            {
                throw new InvalidOperationException("Este email já está registrado.");
            }

            veterinario.Senha = BCrypt.Net.BCrypt.HashPassword(veterinario.Senha);
            await _veterinarios.InsertOneAsync(veterinario);
        }

        public async Task<Veterinario?> ValidateLoginAsync(string email, string password)
        {
            var veterinario = await _veterinarios.Find(v => v.Email == email).FirstOrDefaultAsync();
            if (veterinario == null)
            {
                return null;
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, veterinario.Senha);
            return isPasswordValid ? veterinario : null;
        }

        public async Task<Veterinario?> GetAsync(string id) =>
            await _veterinarios.Find(v => v.Id == id).FirstOrDefaultAsync();

        public async Task<List<Veterinario>> GetAllAsync() =>
            await _veterinarios.Find(v => true).ToListAsync();

        public async Task UpdateAsync(string id, Veterinario updatedVeterinario)
        {
            var existingVeterinario = await _veterinarios.Find(v => v.Id == id).FirstOrDefaultAsync();
            if (existingVeterinario != null)
            {
                updatedVeterinario.Senha = existingVeterinario.Senha;
            }

            await _veterinarios.ReplaceOneAsync(v => v.Id == id, updatedVeterinario);
        }

        public async Task RemoveAsync(string id) =>
            await _veterinarios.DeleteOneAsync(v => v.Id == id);
    }
}
