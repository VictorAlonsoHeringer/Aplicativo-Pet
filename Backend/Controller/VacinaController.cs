using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VacinaController : ControllerBase
    {
        private readonly VacinaService _vacinaService;

        public VacinaController(VacinaService vacinaService)
        {
            _vacinaService = vacinaService;
        }

        [HttpGet("veterinario/{veterinarioId}")]
        public async Task<IActionResult> GetAllByVeterinario(string veterinarioId)
        {
            try
            {
                var vacinas = await _vacinaService.GetAllByVeterinarioAsync(veterinarioId);
                if (vacinas == null || vacinas.Count == 0)
                {
                    return NotFound(new { message = "Nenhuma vacina encontrada para este veterinário." });
                }
                return Ok(vacinas);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar vacinas: {ex.Message}");
                return StatusCode(500, new { message = "Erro interno ao buscar vacinas." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Vacina vacina)
        {
            try
            {
                Console.WriteLine($"Recebendo dados para cadastro: Nome={vacina.Nome}, Tipo={vacina.Tipo}, Validade={vacina.Validade}, VeterinarioId={vacina.VeterinarioId}");
                await _vacinaService.CreateAsync(vacina);
                return CreatedAtAction(nameof(GetAllByVeterinario), new { veterinarioId = vacina.VeterinarioId }, vacina);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao criar vacina no controlador: {ex.Message}");
                return StatusCode(500, new { message = "Erro interno ao criar vacina." });
            }
        }
    }
}
