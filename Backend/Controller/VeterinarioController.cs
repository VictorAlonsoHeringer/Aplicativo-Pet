using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VeterinarioController : ControllerBase
    {
        private readonly VeterinarioService _veterinarioService;

        public VeterinarioController(VeterinarioService veterinarioService)
        {
            _veterinarioService = veterinarioService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVeterinario([FromBody] Veterinario newVet)
        {
            try
            {
                await _veterinarioService.CreateVeterinarioAsync(newVet);
                return CreatedAtAction(nameof(GetVeterinario), new { id = newVet.Id }, newVet);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Veterinario>> GetVeterinario(string id)
        {
            var veterinario = await _veterinarioService.GetAsync(id);

            if (veterinario == null)
            {
                return NotFound();
            }

            return Ok(veterinario);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] VeterinarioLoginRequest request)
        {
            var veterinario = await _veterinarioService.ValidateLoginAsync(request.Email, request.Password);

            if (veterinario == null)
            {
                return Unauthorized(new { message = "Usuário ou senha inválidos." });
            }

            return Ok(new { message = "Login realizado com sucesso", veterinario });
        }

        public class VeterinarioLoginRequest
        {
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
        }
    }
}
