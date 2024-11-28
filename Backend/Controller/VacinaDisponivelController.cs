using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VacinaDisponivelController : ControllerBase
    {
        private readonly VacinaDisponivelService _vacinaDisponivelService;

        public VacinaDisponivelController(VacinaDisponivelService vacinaDisponivelService)
        {
            _vacinaDisponivelService = vacinaDisponivelService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var vacinas = await _vacinaDisponivelService.GetAllAsync();
                if (vacinas == null || vacinas.Count == 0)
                {
                    return NotFound(new { message = "Nenhuma vacina disponível encontrada." });
                }

                return Ok(vacinas);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar todas as vacinas disponíveis: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao buscar vacinas disponíveis." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var vacina = await _vacinaDisponivelService.GetByIdAsync(id);
                if (vacina == null)
                {
                    return NotFound(new { message = "Vacina não encontrada." });
                }

                return Ok(vacina);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar vacina: {ex.Message}");
                return StatusCode(500, new { message = "Erro ao buscar vacina." });
            }
        }
    }
}
