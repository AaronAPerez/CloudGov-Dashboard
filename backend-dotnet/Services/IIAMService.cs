using CloudGovDashboard.Models;

namespace CloudGovDashboard.Services;

public interface IIAMService
{
    Task<List<IAMRole>> GetRolesAsync(string? riskLevel = null);
    Task<IAMRole?> GetRoleByArnAsync(string arn);
    Task<List<IAMUser>> GetUsersAsync(string? accessLevel = null);
    Task<IAMUser?> GetUserByIdAsync(string userId);
    Task<IAMRoleSummary> GetRolesSummaryAsync();
    Task<IAMUserSummary> GetUsersSummaryAsync();
    Task<List<SecurityRecommendation>> GetSecurityRecommendationsAsync();
}

public class IAMRoleSummary
{
    public int TotalRoles { get; set; }
    public int HighRiskRoles { get; set; }
    public int MediumRiskRoles { get; set; }
    public int LowRiskRoles { get; set; }
    public double AverageRiskScore { get; set; }
    public int OverlyPermissiveRoles { get; set; }
}

public class IAMUserSummary
{
    public int TotalUsers { get; set; }
    public int AdminUsers { get; set; }
    public int PowerUsers { get; set; }
    public int ReadOnlyUsers { get; set; }
    public int UsersWithoutMFA { get; set; }
    public int InactiveUsers { get; set; }
    public double AverageRiskScore { get; set; }
}

public class SecurityRecommendation
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Severity { get; set; } = "medium";
    public string Category { get; set; } = string.Empty;
    public List<string> AffectedResources { get; set; } = new();
    public string RecommendedAction { get; set; } = string.Empty;
}
