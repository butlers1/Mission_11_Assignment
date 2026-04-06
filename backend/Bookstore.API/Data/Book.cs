using System.ComponentModel.DataAnnotations;

namespace Bookstore.API.Data
{
    public class Book
    {
        public int BookId { get; set; }

        [Required]
        public required string Title { get; set; }

        [Required]
        public required string Author { get; set; }

        [Required]
        public required string Publisher { get; set; }

        [Required]
        public required string ISBN { get; set; }

        [Required]
        public required string Classification { get; set; }

        [Required]
        public required string Category { get; set; }

        [Range(1, int.MaxValue)]
        public int PageCount { get; set; }

        [Range(0, double.MaxValue)]
        public double Price { get; set; }
    }
}