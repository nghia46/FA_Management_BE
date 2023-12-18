using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Repository.Interface;
using Repository.Repositories;
using Repository.Service;
using Services.Interfaces;
using Services.Services;
using System.Reflection;
using System.Text;
using Tools.EventBus;
using Models.Models;
using AzureBlobStorageRepository;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllers();
//AutoMapper
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddControllersWithViews();
//Service Injection
builder.Services.AddScoped<IOtpPhoneService, OtpPhoneService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<IClassService, ClassService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<ITraineeService, TraineeService>();
builder.Services.AddScoped<ISyllabusService, SyllabusService>();
builder.Services.AddScoped<ITrainingProgramService, TrainingProgramService>();
builder.Services.AddScoped<IAttendeeService, AttendeeService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPermissionService, PermissionService>();
builder.Services.AddScoped<IFeatureService, FeatureService>();
builder.Services.AddScoped<IAzureBlobInformationService, AzureBlobInformationService>();
builder.Services.AddScoped<IForgotPasswordService, ForgotPasswordService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ISyllabusRepository, SyllabusRepository>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
//Dependency injection mongo Connection String to MongoClient
builder.Services.AddSingleton<IAzureBlobRepository, AzureBlobRepository>();
builder.Services.AddSingleton<IMongoClient, MongoClient>(s =>
{
    var uri = s.GetRequiredService<IConfiguration>()["MongoUri"];
    return new MongoClient(uri);
});
builder.Services.AddSingleton<IEventBus, EventBus>();
builder.Services.AddTransient<IEmailService, EmailService>();
//Add OtpPhoneSetting
builder.Services.Configure<OtpPhoneSettings>(builder.Configuration.GetSection("TwilioSettings"));
//Add EmailSetting
builder.Services.Configure<EmailSetting>(builder.Configuration.GetSection("EmailSetting"));
//Add Cors Policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
//Add Logging Service
builder.Services.AddLogging(loggingBuilder =>
{
    loggingBuilder.AddConsole(); // Use the Console logger
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//Tunning SwagegrGen more verstion Flexible
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1",
        new OpenApiInfo
        {
            Title = "FA Intership Manager",
            Description = "FA Intership Manager",
            Version = "v1",
        });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
//Config JWTBearer Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(option =>
    {
        option.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issure"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new ArgumentNullException("builder.Configuration[\"Jwt:Key\"]", "Jwt:Key is null")))
        };
    });
var app = builder.Build();
app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseSwagger(options =>
{
    options.RouteTemplate = "swagger/{documentName}/swagger.json";
});
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FA Intership Management API");
    c.InjectStylesheet("/swagger-ui/SwaggerDark.css");
    c.RoutePrefix = "";
    c.EnableTryItOutByDefault();
});
app.UseCors();

app.UseAuthentication();


app.UseAuthorization();

app.UseMiddleware<Middleware.PermissionHandlingMiddleware>();

app.UseMiddleware<Middleware.ErrorHandlingMiddleware>();

app.MapControllers();

app.Run();
