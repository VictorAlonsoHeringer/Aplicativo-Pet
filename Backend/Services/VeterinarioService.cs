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
            _veterinarios = database.GetCollection<Veterinario>("veterinario"); // Certifique-se de que o nome está correto.
        }

        public async Task CreateVeterinarioAsync(Veterinario veterinario)
        {
            // Verificar se já existe um veterinário com o mesmo email
            var existingVet = await _veterinarios.Find(v => v.Email == veterinario.Email).FirstOrDefaultAsync();
            
            if (existingVet != null)
            {
                throw new InvalidOperationException("Este email já está registrado.");
            }

            // Gerar o hash da senha antes de salvar
            veterinario.Senha = BCrypt.Net.BCrypt.HashPassword(veterinario.Senha);

            // Inserir o veterinário no banco de dados
            await _veterinarios.InsertOneAsync(veterinario);
        }

        public async Task<bool> VerifyVeterinario(string email, string password)
        {
            var veterinario = await _veterinarios.Find(v => v.Email == email).FirstOrDefaultAsync();
            if (veterinario == null) return false;

            return BCrypt.Net.BCrypt.Verify(password, veterinario.Senha);
        }

        public async Task<Veterinario?> ValidateLoginAsync(string email, string password)
        {
            var veterinario = await _veterinarios.Find(v => v.Email == email).FirstOrDefaultAsync();
            if (veterinario == null)
            {
                Console.WriteLine("Email não encontrado.");
                return null;
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, veterinario.Senha);
            Console.WriteLine($"Senha válida: {isPasswordValid}");

            if (isPasswordValid)
            {
                return veterinario;
            }

            return null;
        }

        public async Task<Veterinario?> GetAsync(string id)
        {
            return await _veterinarios.Find(v => v.Id == id).FirstOrDefaultAsync();
        }

    }
}