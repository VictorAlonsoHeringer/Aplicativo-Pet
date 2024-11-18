// AnimalController.cs
using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnimalController : ControllerBase
    {
        private readonly AnimalService _animalService;

        public AnimalController(AnimalService animalService)
        {
            _animalService = animalService;
        }

        // Método para obter um animal por ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Animal>> GetById(string id)
        {
            var animal = await _animalService.GetByIdAsync(id);

            if (animal == null)
            {
                return NotFound();
            }

            return animal;
        }

        // Método para obter todos os animais de um tutor por TutorId
        [HttpGet("tutor/{tutorId}")]
        public async Task<ActionResult<List<Animal>>> GetByTutorId(string tutorId)
        {
            var animals = await _animalService.GetByTutorIdAsync(tutorId);

            if (animals == null || animals.Count == 0)
            {
                return NotFound(new { message = "Nenhum animal encontrado para esse tutor." });
            }

            return animals;
        }

        // Método para criar um novo animal
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Animal animal)
        {
            if (string.IsNullOrEmpty(animal.TutorId))
            {
                return BadRequest(new { message = "TutorId é obrigatório" });
            }

            await _animalService.CreateAsync(animal);
            return CreatedAtAction(nameof(GetById), new { id = animal.Id }, animal);
        }
    }
}
