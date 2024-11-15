using Domain.Common;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddAntiforgery(o => o.HeaderName = "XSRF-TOKEN");
builder.Services.Configure<ConfigSettingsDTO>(builder.Configuration.GetSection("ConfigSettings"));

DependencyInjection();

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

void DependencyInjection()
{
    string[] ecAssemblies = { "Web.dll", "Domain.dll" };
    foreach (string ecAssembly in ecAssemblies)
    {
        string assemblyPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ecAssembly);
        var assembly = System.Runtime.Loader.AssemblyLoadContext.Default.LoadFromAssemblyPath(assemblyPath);
        var types = assembly.GetTypes();

        // add scoped types
        var scopedTypes = types.Where(t => t.GetInterfaces().Contains(typeof(IGpScoped))).ToList();
        foreach (var item in scopedTypes)
        {
            var interfaceType = item.GetInterface($"I{item.Name}")!;
            builder!.Services.AddScoped(interfaceType, item);
        }

        // add transient types
        var transientTypes = types.Where(t => t.GetInterfaces().Contains(typeof(IGpTransient))).ToList();
        foreach (var item in transientTypes)
        {
            var interfaceType = item.GetInterface($"I{item.Name}")!;
            builder!.Services.AddTransient(interfaceType, item);
        }
    }
}

#endregion