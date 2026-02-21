var builder = WebApplication.CreateBuilder(args);

// 1. Tell the app to use Controllers (The magic line!)
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. Map the routes to the Controllers we created
app.MapControllers();

app.Run();