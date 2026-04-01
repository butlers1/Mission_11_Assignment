using Bookstore.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks(
            int pageNum = 1,
            int pageSize = 5,
            string sortOrder = "asc",
            string? category = null)
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

            query = sortOrder == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);

            var totalCount = await query.CountAsync();

            var books = await query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                books,
                totalCount
            });
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }
    }
}