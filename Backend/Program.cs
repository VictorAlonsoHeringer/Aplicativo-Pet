using Backend.Models;
using Backend.Services;
using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Cors;

var builder = WebApplication.CreateBuilder(args);

// Configurações de MongoDB - Leitura de appsettings.json
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

// Adicionar o MongoClient como um serviço Singleton
builder.Services.AddSingleton<IMongoClient>(sp => 
{
    var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;

    // Configurar MongoClientSettings usando a string de conexão
    var mongoSettings = MongoClientSettings.FromConnectionString(settings.ConnectionString);

    // Definir a versão da API do servidor para a V1, como no exemplo da documentação
    mongoSettings.ServerApi = new ServerApi(ServerApiVersion.V1);

    return new MongoClient(mongoSettings); // Retornar o MongoClient configurado
});

// ** Registro dos Serviços **
builder.Services.AddSingleton<TutorService>();
builder.Services.AddSingleton<VeterinarioService>();
builder.Services.AddSingleton<AnimalService>();
builder.Services.AddSingleton<VacinaService>(); // Registro do VacinaService

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:8100")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Permitir credenciais
    });
});

// Configuração de controladores e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger para a documentação da API
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware de CORS antes de HTTPS e autorização
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
