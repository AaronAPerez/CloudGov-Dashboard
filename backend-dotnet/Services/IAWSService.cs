using CloudGovDashboard.Models;

namespace CloudGovDashboard.Services;

public interface IAWSService
{
    Task<List<WorkSpace>> GetWorkSpacesAsync(string? status = null);
    Task<WorkSpace?> GetWorkSpaceByIdAsync(string workspaceId);
    Task<WorkSpaceSummary> GetWorkSpacesSummaryAsync();
    Task<List<WorkSpaceRecommendation>> GetWorkSpaceRecommendationsAsync();
    Task<List<AWSResource>> GetResourcesAsync(string? type = null, string? status = null, string? region = null);
    Task<ResourceSummary> GetResourcesSummaryAsync();
}

public class WorkSpace
{
    public string WorkspaceId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string DirectoryId { get; set; } = string.Empty;
    public string State { get; set; } = "AVAILABLE";
    public string BundleId { get; set; } = string.Empty;
    public string ComputeType { get; set; } = "VALUE";
    public string RunningMode { get; set; } = "AUTO_STOP";
    public int RunningModeAutoStopTimeoutInMinutes { get; set; } = 60;
    public decimal MonthlyCost { get; set; }
    public DateTime LastKnownUserConnectionTimestamp { get; set; }
    public DateTime CreatedDate { get; set; }
    public string IpAddress { get; set; } = string.Empty;
}

public class WorkSpaceSummary
{
    public int TotalWorkSpaces { get; set; }
    public int AvailableWorkSpaces { get; set; }
    public int StoppedWorkSpaces { get; set; }
    public int ErrorWorkSpaces { get; set; }
    public decimal TotalMonthlyCost { get; set; }
    public int AlwaysOnWorkSpaces { get; set; }
    public int AutoStopWorkSpaces { get; set; }
}

public class WorkSpaceRecommendation
{
    public string Id { get; set; } = string.Empty;
    public string WorkspaceId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = "cost-optimization";
    public decimal PotentialSavings { get; set; }
    public string Action { get; set; } = string.Empty;
}

public class AWSResource
{
    public string ResourceId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = "running";
    public string Region { get; set; } = "us-east-1";
    public string Owner { get; set; } = string.Empty;
    public decimal Cost { get; set; }
    public Dictionary<string, string> Tags { get; set; } = new();
    public DateTime CreatedDate { get; set; }
    public DateTime LastModified { get; set; }
}

public class ResourceSummary
{
    public int TotalResources { get; set; }
    public int RunningResources { get; set; }
    public int StoppedResources { get; set; }
    public decimal TotalMonthlyCost { get; set; }
    public int TotalRegions { get; set; }
    public Dictionary<string, int> ResourcesByType { get; set; } = new();
}

public class AWSService : IAWSService
{
    private readonly List<WorkSpace> _mockWorkSpaces;
    private readonly List<AWSResource> _mockResources;
    private readonly ILogger<AWSService> _logger;

    public AWSService(ILogger<AWSService> logger)
    {
        _logger = logger;
        _mockWorkSpaces = InitializeMockWorkSpaces();
        _mockResources = InitializeMockResources();
    }

    public Task<List<WorkSpace>> GetWorkSpacesAsync(string? status = null)
    {
        var workspaces = _mockWorkSpaces;

        if (!string.IsNullOrEmpty(status))
        {
            workspaces = workspaces.Where(w => w.State.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return Task.FromResult(workspaces);
    }

    public Task<WorkSpace?> GetWorkSpaceByIdAsync(string workspaceId)
    {
        var workspace = _mockWorkSpaces.FirstOrDefault(w => w.WorkspaceId == workspaceId);
        return Task.FromResult(workspace);
    }

    public Task<WorkSpaceSummary> GetWorkSpacesSummaryAsync()
    {
        var summary = new WorkSpaceSummary
        {
            TotalWorkSpaces = _mockWorkSpaces.Count,
            AvailableWorkSpaces = _mockWorkSpaces.Count(w => w.State == "AVAILABLE"),
            StoppedWorkSpaces = _mockWorkSpaces.Count(w => w.State == "STOPPED"),
            ErrorWorkSpaces = _mockWorkSpaces.Count(w => w.State == "ERROR"),
            TotalMonthlyCost = _mockWorkSpaces.Sum(w => w.MonthlyCost),
            AlwaysOnWorkSpaces = _mockWorkSpaces.Count(w => w.RunningMode == "ALWAYS_ON"),
            AutoStopWorkSpaces = _mockWorkSpaces.Count(w => w.RunningMode == "AUTO_STOP")
        };

        return Task.FromResult(summary);
    }

    public Task<List<WorkSpaceRecommendation>> GetWorkSpaceRecommendationsAsync()
    {
        var recommendations = new List<WorkSpaceRecommendation>();

        // Find WorkSpaces that should switch to AUTO_STOP
        var alwaysOnWorkSpaces = _mockWorkSpaces.Where(w => w.RunningMode == "ALWAYS_ON" &&
            (DateTime.UtcNow - w.LastKnownUserConnectionTimestamp).TotalDays > 7).ToList();

        foreach (var ws in alwaysOnWorkSpaces)
        {
            recommendations.Add(new WorkSpaceRecommendation
            {
                Id = $"rec-ws-{ws.WorkspaceId}",
                WorkspaceId = ws.WorkspaceId,
                Title = "Switch to AUTO_STOP mode",
                Description = $"WorkSpace {ws.WorkspaceId} has not been used in 7+ days",
                Type = "cost-optimization",
                PotentialSavings = ws.MonthlyCost * 0.4m,
                Action = "Change running mode to AUTO_STOP to reduce costs"
            });
        }

        // Find inactive WorkSpaces
        var inactiveWorkSpaces = _mockWorkSpaces.Where(w =>
            (DateTime.UtcNow - w.LastKnownUserConnectionTimestamp).TotalDays > 30).ToList();

        foreach (var ws in inactiveWorkSpaces)
        {
            recommendations.Add(new WorkSpaceRecommendation
            {
                Id = $"rec-ws-inactive-{ws.WorkspaceId}",
                WorkspaceId = ws.WorkspaceId,
                Title = "Terminate inactive WorkSpace",
                Description = $"WorkSpace {ws.WorkspaceId} has not been used in 30+ days",
                Type = "resource-cleanup",
                PotentialSavings = ws.MonthlyCost,
                Action = "Consider terminating this WorkSpace"
            });
        }

        // Find WorkSpaces in ERROR state
        var errorWorkSpaces = _mockWorkSpaces.Where(w => w.State == "ERROR").ToList();

        foreach (var ws in errorWorkSpaces)
        {
            recommendations.Add(new WorkSpaceRecommendation
            {
                Id = $"rec-ws-error-{ws.WorkspaceId}",
                WorkspaceId = ws.WorkspaceId,
                Title = "Fix WorkSpace in ERROR state",
                Description = $"WorkSpace {ws.WorkspaceId} is in ERROR state",
                Type = "maintenance",
                PotentialSavings = 0,
                Action = "Investigate and resolve the error or terminate the WorkSpace"
            });
        }

        return Task.FromResult(recommendations);
    }

    public Task<List<AWSResource>> GetResourcesAsync(string? type = null, string? status = null, string? region = null)
    {
        var resources = _mockResources.AsEnumerable();

        if (!string.IsNullOrEmpty(type))
        {
            resources = resources.Where(r => r.Type.Equals(type, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(status))
        {
            resources = resources.Where(r => r.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(region))
        {
            resources = resources.Where(r => r.Region.Equals(region, StringComparison.OrdinalIgnoreCase));
        }

        return Task.FromResult(resources.ToList());
    }

    public Task<ResourceSummary> GetResourcesSummaryAsync()
    {
        var summary = new ResourceSummary
        {
            TotalResources = _mockResources.Count,
            RunningResources = _mockResources.Count(r => r.Status == "running"),
            StoppedResources = _mockResources.Count(r => r.Status == "stopped"),
            TotalMonthlyCost = _mockResources.Sum(r => r.Cost),
            TotalRegions = _mockResources.Select(r => r.Region).Distinct().Count(),
            ResourcesByType = _mockResources.GroupBy(r => r.Type)
                .ToDictionary(g => g.Key, g => g.Count())
        };

        return Task.FromResult(summary);
    }

    private List<WorkSpace> InitializeMockWorkSpaces()
    {
        return new List<WorkSpace>
        {
            new WorkSpace
            {
                WorkspaceId = "ws-abc123def456",
                UserName = "john.doe",
                DirectoryId = "d-1234567890",
                State = "AVAILABLE",
                BundleId = "wsb-12345678",
                ComputeType = "VALUE",
                RunningMode = "AUTO_STOP",
                RunningModeAutoStopTimeoutInMinutes = 60,
                MonthlyCost = 25.00m,
                LastKnownUserConnectionTimestamp = DateTime.UtcNow.AddHours(-5),
                CreatedDate = DateTime.UtcNow.AddMonths(-3),
                IpAddress = "10.0.1.100"
            },
            new WorkSpace
            {
                WorkspaceId = "ws-xyz789ghi012",
                UserName = "sarah.smith",
                DirectoryId = "d-1234567890",
                State = "STOPPED",
                BundleId = "wsb-87654321",
                ComputeType = "PERFORMANCE",
                RunningMode = "ALWAYS_ON",
                RunningModeAutoStopTimeoutInMinutes = 0,
                MonthlyCost = 75.00m,
                LastKnownUserConnectionTimestamp = DateTime.UtcNow.AddDays(-10),
                CreatedDate = DateTime.UtcNow.AddMonths(-6),
                IpAddress = "10.0.1.101"
            },
            new WorkSpace
            {
                WorkspaceId = "ws-mno345pqr678",
                UserName = "mike.jones",
                DirectoryId = "d-1234567890",
                State = "ERROR",
                BundleId = "wsb-11223344",
                ComputeType = "POWER",
                RunningMode = "AUTO_STOP",
                RunningModeAutoStopTimeoutInMinutes = 120,
                MonthlyCost = 50.00m,
                LastKnownUserConnectionTimestamp = DateTime.UtcNow.AddDays(-45),
                CreatedDate = DateTime.UtcNow.AddMonths(-2),
                IpAddress = "10.0.1.102"
            }
        };
    }

    private List<AWSResource> InitializeMockResources()
    {
        return new List<AWSResource>
        {
            new AWSResource
            {
                ResourceId = "i-0a1b2c3d4e5f6g7h8",
                Name = "web-server-prod-01",
                Type = "EC2",
                Status = "running",
                Region = "us-east-1",
                Owner = "john.admin",
                Cost = 45.50m,
                Tags = new Dictionary<string, string>
                {
                    { "Environment", "production" },
                    { "Application", "web-app" }
                },
                CreatedDate = DateTime.UtcNow.AddMonths(-8),
                LastModified = DateTime.UtcNow.AddDays(-2)
            },
            new AWSResource
            {
                ResourceId = "my-bucket-prod",
                Name = "my-bucket-prod",
                Type = "S3",
                Status = "running",
                Region = "us-east-1",
                Owner = "sarah.developer",
                Cost = 12.30m,
                Tags = new Dictionary<string, string>
                {
                    { "Environment", "production" },
                    { "DataClassification", "confidential" }
                },
                CreatedDate = DateTime.UtcNow.AddYears(-1),
                LastModified = DateTime.UtcNow.AddHours(-6)
            },
            new AWSResource
            {
                ResourceId = "arn:aws:lambda:us-east-1:123456789012:function:process-orders",
                Name = "process-orders",
                Type = "Lambda",
                Status = "running",
                Region = "us-east-1",
                Owner = "sarah.developer",
                Cost = 8.75m,
                Tags = new Dictionary<string, string>
                {
                    { "Environment", "production" },
                    { "Function", "order-processing" }
                },
                CreatedDate = DateTime.UtcNow.AddMonths(-4),
                LastModified = DateTime.UtcNow.AddDays(-1)
            }
        };
    }
}
