using Domain.Common;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.Configure<ConfigSettingsDTO>(builder.Configuration.GetSection("ConfigSettings"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
SetupStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();



#region Helpers

void SetupStaticFiles()
{
    var staticFileMappings = new Dictionary<string, string> {
        { @"Pages", "/Pages" },
        { @"node_modules", "/node_modules" }
    };

    foreach (var staticFile in staticFileMappings)
    {
        app.UseStaticFiles(new StaticFileOptions()
        {
            FileProvider = new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath, staticFile.Key)),
            RequestPath = new PathString(staticFile.Value)
        });
    }
}

#endregion