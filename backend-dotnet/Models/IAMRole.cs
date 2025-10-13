namespace CloudGovDashboard.Models;

/// <summary>
/// Represents an AWS IAM Role with security analysis
/// </summary>
public class IAMRole
{
    public string Arn { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastUsed { get; set; }
    public List<IAMPolicy> Policies { get; set; } = new();
    public List<IAMPolicy> InlinePolicies { get; set; } = new();
    public bool IsOverlyPermissive { get; set; }
    public List<string> TrustedEntities { get; set; } = new();
    public string? PermissionsBoundary { get; set; }
    public Dictionary<string, string> Tags { get; set; } = new();
    public int RiskScore { get; set; }
}

/// <summary>
/// Represents an IAM Policy
/// </summary>
public class IAMPolicy
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public PolicyDocument Document { get; set; } = new();
    public int AttachedRolesCount { get; set; }
    public bool IsHighRisk { get; set; }
}

/// <summary>
/// Represents an IAM Policy Document
/// </summary>
public class PolicyDocument
{
    public string Version { get; set; } = "2012-10-17";
    public List<PolicyStatement> Statement { get; set; } = new();
}

/// <summary>
/// Represents a Policy Statement
/// </summary>
public class PolicyStatement
{
    public string Effect { get; set; } = string.Empty;
    public object Action { get; set; } = new object();
    public object Resource { get; set; } = new object();
    public Dictionary<string, object>? Condition { get; set; }
}

/// <summary>
/// Represents an IAM User with access analysis
/// </summary>
public class IAMUser
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Arn { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public List<string> Permissions { get; set; } = new();
    public bool MfaEnabled { get; set; }
    public DateTime LastActivity { get; set; }
    public string AccessLevel { get; set; } = string.Empty;
    public int RiskScore { get; set; }
}
