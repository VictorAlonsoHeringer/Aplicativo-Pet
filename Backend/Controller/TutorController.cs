using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TutorController : ControllerBase
    {
        private readonly TutorService _tutorService;

        public TutorController(TutorService tutorService)
        {
            _tutorService = tutorService;
        }

        // Obter todos os tutores
        [HttpGet]
        public async Task<List<Tutor>> Get() =>
            await _tutorService.GetAsync();

        // Obter um tutor por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Tutor>> Get(string id)
        {
            var tutor = await _tutorService.GetAsync(id);

            if (tutor is null)
            {
                return NotFound();
            }

            return tutor;
        }

        // Criar um novo tutor
        [HttpPost]
        public async Task<IActionResult> Create(Tutor newTutor)
        {
            await _tutorService.CreateAsync(newTutor);
            return CreatedAtAction(nameof(Get), new { id = newTutor.Id }, newTutor);
        }

        // Rota de login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] TutorLoginRequest request)
        {
            var tutor = await _tutorService.ValidateLoginAsync(request.Username, request.Password);

            if (tutor == null)
            {
                return Unauthorized(new { message = "Usuário ou senha inválidos" });
            }

            // Aqui você pode gerar um token JWT ou simplesmente retornar o tutor
            return Ok(new { message = "Login realizado com sucesso", tutor });
        }

        // Atualizar um tutor
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Tutor updatedTutor)
        {
            var tutor = await _tutorService.GetAsync(id);

            if (tutor is null)
            {
                return NotFound();
            }

            updatedTutor.Id = tutor.Id;

            await _tutorService.UpdateAsync(id, updatedTutor);

            return NoContent();
        }

        // Deletar um tutor
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var tutor = await _tutorService.GetAsync(id);

            if (tutor is null)
            {
                return NotFound();
            }

            await _tutorService.RemoveAsync(id);

            return NoContent();
        }
    }

    // Classe auxiliar para requisição de login
    public class TutorLoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
