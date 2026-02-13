using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Talent.Common.Auth;
using Talent.Common.Commands;
using Talent.Common.Contracts;
using Talent.Common.Mongo;
using Talent.Common.RabbitMq;
using Talent.Common.Security;
using Talent.Common.Services;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Domain.Services;
using Talent.Services.Profile.Handler;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using Talent.Common.Aws;
using Microsoft.AspNetCore.Http;

namespace Talent.Services.Profile
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // CORS: allow frontend access
            services.AddCors(options =>
            {
                options.AddPolicy("AllowWebAppAccess", builder =>
                {
                    builder
                        .WithOrigins("http://localhost:61771") // React frontend URL
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            // Form options for large file uploads
            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue;
                x.MultipartHeadersLengthLimit = int.MaxValue;
            });

            // Controllers + JSON
            services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ContractResolver
                        = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
                });

            // Add services
            services.AddJwt(Configuration);
            services.AddMongoDB(Configuration);
            services.AddRabbitMq(Configuration);
            services.AddAws(Configuration);

            services.AddScoped<ICommandHandler<AuthenticateUser>, AuthenticateUserHandler>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            Func<IServiceProvider, IPrincipal> getPrincipal =
                (sp) => sp.GetService<IHttpContextAccessor>().HttpContext.User;
            services.AddScoped(typeof(Func<IPrincipal>), sp =>
            {
                Func<IPrincipal> func = () => getPrincipal(sp);
                return func;
            });

            services.AddScoped<IUserAppContext, UserAppContext>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IFileService, FileService>();

            services.AddLogging(logging =>
            {
                logging.AddConsole();
                logging.AddDebug();
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();


            app.UseCors("AllowWebAppAccess");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}
