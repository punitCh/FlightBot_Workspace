using Microsoft.AspNetCore.Mvc;
using FlightAPI.Models;
using FlightAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace FlightAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginRequest)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginRequest.Username && u.PasswordHash == loginRequest.PasswordHash);

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            return Ok(new { message = "Login successful!", username = user.Username, role = user.Role });
        }
    }
}