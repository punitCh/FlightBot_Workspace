using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace _2_DotNet_API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Flights",
                columns: table => new
                {
                    TicketId = table.Column<string>(type: "TEXT", nullable: false),
                    PassengerName = table.Column<string>(type: "TEXT", nullable: false),
                    Origin = table.Column<string>(type: "TEXT", nullable: false),
                    Destination = table.Column<string>(type: "TEXT", nullable: false),
                    DepartureTime = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flights", x => x.TicketId);
                });

            migrationBuilder.InsertData(
                table: "Flights",
                columns: new[] { "TicketId", "DepartureTime", "Destination", "Origin", "PassengerName", "Status" },
                values: new object[,]
                {
                    { "TX-101", "2026-03-01T08:00:00", "JFK", "DEL", "Ankit", "On Time" },
                    { "TX-202", "2026-03-05T14:30:00", "DXB", "LHR", "Sarah", "Delayed" },
                    { "TX-404", "2026-03-01T10:30:00", "LHR", "BOM", "Priya", "On Time" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Flights");
        }
    }
}
