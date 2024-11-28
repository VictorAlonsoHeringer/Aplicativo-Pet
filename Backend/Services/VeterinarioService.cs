using Backend.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;

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
            if (string.IsNullOrEmpty(veterinario.Nome) ||
                string.IsNullOrEmpty(veterinario.Email) ||
                string.IsNullOrEmpty(veterinario.Senha) ||
                string.IsNullOrEmpty(veterinario.Telefone) ||
                string.IsNullOrEmpty(veterinario.Endereco))
            {
                throw new InvalidOperationException("Todos os campos obrigatórios devem ser preenchidos.");
            }

            try
            {
                await _veterinarios.InsertOneAsync(veterinario);
                Console.WriteLine("Veterinário criado com sucesso.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao criar veterinário: {ex.Message}");
                throw new InvalidOperationException("Erro ao criar veterinário no servidor.", ex);
            }
        }

        public async Task<Veterinario?> GetAsync(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new ArgumentException("ID não pode ser vazio.");
            }

            try
            {
                return await _veterinarios.Find(vet => vet.Id == id).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar veterinário por ID: {ex.Message}");
                throw new InvalidOperationException("Erro ao buscar veterinário no servidor.", ex);
            }
        }

        public async Task<Veterinario?> ValidateLoginAsync(string email, string senha)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(senha))
            {
                throw new ArgumentException("Email e senha são obrigatórios.");
            }

            try
            {
                return await _veterinarios.Find(vet => vet.Email == email && vet.Senha == senha).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao validar login: {ex.Message}");
                throw new InvalidOperationException("Erro ao validar login no servidor.", ex);
            }
        }
    }
}
