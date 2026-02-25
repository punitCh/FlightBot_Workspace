using Microsoft.EntityFrameworkCore;
using FlightAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://0.0.0.0:5048");

// 🌟 NEW: Tell the app to build a SQLite database named "flights.db"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=flights.db"));

// 1. ADD CORS POLICY (The Permission Slip)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact",
        builder => builder.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

var app = builder.Build();

app.UseCors("AllowReact");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

// 2. TELL THE APP TO USE THE CORS POLICY
app.UseCors("AllowAll");

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    if (!context.Users.Any(u => u.Username == "olahuuber"))
    {
        context.Users.Add(new FlightAPI.Models.User 
        { 
            Username = "olahuuber", 
            PasswordHash = "123456", // In production, we would hash this!
            Role = "Admin" 
        });
        context.SaveChanges();
    }
}

app.Run();