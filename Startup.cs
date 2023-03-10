using Microsoft.Identity.Web;
using PowerBiEmbed.Services;

namespace SalesReporting
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string[] scopes = new string[] { PowerBiApiService.PowerBiDefaultScope };
            services.AddMicrosoftIdentityWebAppAuthentication(Configuration) 
                // Enable token acquisition from ITokenAcquisition
                .EnableTokenAcquisitionToCallDownstreamApi(scopes)
                // Enable token caching
                .AddInMemoryTokenCaches();
                
                // Allow injecting the custom class in controllers
                services.AddScoped(typeof(PowerBiApiService));
        }
    }
}