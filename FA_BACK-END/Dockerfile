#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["FA_BACK-END/FA_BACK-END.csproj", "FA_BACK-END/"]
COPY ["Middleware/Middleware.csproj", "Middleware/"]
COPY ["Services/Services.csproj", "Services/"]
COPY ["AzureBlobStorageRepository/AzureBlobStorageRepository.csproj", "AzureBlobStorageRepository/"]
COPY ["Tools/Tools.csproj", "Tools/"]
COPY ["Models/Models.csproj", "Models/"]
COPY ["ModelViews/ModelViews.csproj", "ModelViews/"]
COPY ["Repository/Repository.csproj", "Repository/"]
RUN dotnet restore "./FA_BACK-END/./FA_BACK-END.csproj"
COPY . .
WORKDIR "/src/FA_BACK-END"
RUN dotnet build "./FA_BACK-END.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./FA_BACK-END.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FA_BACK-END.dll"]