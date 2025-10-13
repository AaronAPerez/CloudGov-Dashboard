using CloudGovDashboard.Models;

namespace CloudGovDashboard.Services;

public class IAMService : IIAMService
{
    private readonly List<IAMRole> _mockRoles;
    private readonly List<IAMUser> _mockUsers;

    public IAMService()
    {
        _mockRoles = InitializeMockRoles();
        _mockUsers = InitializeMockUsers();
    }

    public Task<List<IAMRole>> GetRolesAsync(string? riskLevel = null)
    {
        var roles = _mockRoles;

        if (!string.IsNullOrEmpty(riskLevel))
        {
            roles = riskLevel.ToLower() switch
            {
                "high" => roles.Where(r => r.RiskScore >= 60).ToList(),
                "medium" => roles.Where(r => r.RiskScore >= 30 && r.RiskScore < 60).ToList(),
                "low" => roles.Where(r => r.RiskScore < 30).ToList(),
                _ => roles
            };
        }

        return Task.FromResult(roles);
    }

    public Task<IAMRole?> GetRoleByArnAsync(string arn)
    {
        var role = _mockRoles.FirstOrDefault(r => r.Arn == arn);
        return Task.FromResult(role);
    }

    public Task<List<IAMUser>> GetUsersAsync(string? accessLevel = null)
    {
        var users = _mockUsers;

        if (!string.IsNullOrEmpty(accessLevel))
        {
            users = users.Where(u => u.AccessLevel.Equals(accessLevel, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return Task.FromResult(users);
    }

    public Task<IAMUser?> GetUserByIdAsync(string userId)
    {
        var user = _mockUsers.FirstOrDefault(u => u.UserId == userId);
        return Task.FromResult(user);
    }

    public Task<IAMRoleSummary> GetRolesSummaryAsync()
    {
        var summary = new IAMRoleSummary
        {
            TotalRoles = _mockRoles.Count,
            HighRiskRoles = _mockRoles.Count(r => r.RiskScore >= 60),
            MediumRiskRoles = _mockRoles.Count(r => r.RiskScore >= 30 && r.RiskScore < 60),
            LowRiskRoles = _mockRoles.Count(r => r.RiskScore < 30),
            AverageRiskScore = _mockRoles.Average(r => r.RiskScore),
            OverlyPermissiveRoles = _mockRoles.Count(r => r.IsOverlyPermissive)
        };

        return Task.FromResult(summary);
    }

    public Task<IAMUserSummary> GetUsersSummaryAsync()
    {
        var summary = new IAMUserSummary
        {
            TotalUsers = _mockUsers.Count,
            AdminUsers = _mockUsers.Count(u => u.AccessLevel == "admin"),
            PowerUsers = _mockUsers.Count(u => u.AccessLevel == "power-user"),
            ReadOnlyUsers = _mockUsers.Count(u => u.AccessLevel == "read-only"),
            UsersWithoutMFA = _mockUsers.Count(u => !u.MfaEnabled),
            InactiveUsers = _mockUsers.Count(u => (DateTime.UtcNow - u.LastActivity).TotalDays > 30),
            AverageRiskScore = _mockUsers.Average(u => u.RiskScore)
        };

        return Task.FromResult(summary);
    }

    public Task<List<SecurityRecommendation>> GetSecurityRecommendationsAsync()
    {
        var recommendations = new List<SecurityRecommendation>();

        // Check for users without MFA
        var noMfaUsers = _mockUsers.Where(u => !u.MfaEnabled).ToList();
        if (noMfaUsers.Any())
        {
            recommendations.Add(new SecurityRecommendation
            {
                Id = "rec-mfa-001",
                Title = "Enable MFA for all users",
                Description = $"{noMfaUsers.Count} users do not have MFA enabled",
                Severity = "high",
                Category = "authentication",
                AffectedResources = noMfaUsers.Select(u => u.UserId).ToList(),
                RecommendedAction = "Enable Multi-Factor Authentication for all users to enhance security"
            });
        }

        // Check for inactive users
        var inactiveUsers = _mockUsers.Where(u => (DateTime.UtcNow - u.LastActivity).TotalDays > 30).ToList();
        if (inactiveUsers.Any())
        {
            recommendations.Add(new SecurityRecommendation
            {
                Id = "rec-inactive-001",
                Title = "Review inactive users",
                Description = $"{inactiveUsers.Count} users have been inactive for over 30 days",
                Severity = "medium",
                Category = "access-management",
                AffectedResources = inactiveUsers.Select(u => u.UserId).ToList(),
                RecommendedAction = "Review and disable or remove inactive user accounts"
            });
        }

        // Check for overly permissive roles
        var permissiveRoles = _mockRoles.Where(r => r.IsOverlyPermissive).ToList();
        if (permissiveRoles.Any())
        {
            recommendations.Add(new SecurityRecommendation
            {
                Id = "rec-permissions-001",
                Title = "Review overly permissive roles",
                Description = $"{permissiveRoles.Count} roles have overly permissive policies",
                Severity = "high",
                Category = "least-privilege",
                AffectedResources = permissiveRoles.Select(r => r.Arn).ToList(),
                RecommendedAction = "Apply least-privilege principles and restrict permissions"
            });
        }

        // Check for high-risk roles
        var highRiskRoles = _mockRoles.Where(r => r.RiskScore >= 60).ToList();
        if (highRiskRoles.Any())
        {
            recommendations.Add(new SecurityRecommendation
            {
                Id = "rec-risk-001",
                Title = "Mitigate high-risk roles",
                Description = $"{highRiskRoles.Count} roles have high risk scores (60+)",
                Severity = "high",
                Category = "risk-management",
                AffectedResources = highRiskRoles.Select(r => r.Arn).ToList(),
                RecommendedAction = "Review and implement controls to reduce risk exposure"
            });
        }

        return Task.FromResult(recommendations);
    }

    private List<IAMRole> InitializeMockRoles()
    {
        return new List<IAMRole>
        {
            new IAMRole
            {
                Arn = "arn:aws:iam::123456789012:role/AdminRole",
                Name = "AdminRole",
                Description = "Full administrative access to all AWS services",
                Policies = new List<IAMPolicy>
                {
                    new IAMPolicy
                    {
                        PolicyName = "AdministratorAccess",
                        PolicyArn = "arn:aws:iam::aws:policy/AdministratorAccess",
                        IsManaged = true,
                        PolicyDocument = new PolicyDocument
                        {
                            Version = "2012-10-17",
                            Statements = new List<PolicyStatement>
                            {
                                new PolicyStatement
                                {
                                    Effect = "Allow",
                                    Actions = new List<string> { "*" },
                                    Resources = new List<string> { "*" }
                                }
                            }
                        }
                    }
                },
                RiskScore = 85,
                IsOverlyPermissive = true,
                HasPermissionsBoundary = false,
                TrustedEntities = new List<string> { "ec2.amazonaws.com" },
                LastUsed = DateTime.UtcNow.AddDays(-2),
                CreatedDate = DateTime.UtcNow.AddMonths(-6)
            },
            new IAMRole
            {
                Arn = "arn:aws:iam::123456789012:role/DeveloperRole",
                Name = "DeveloperRole",
                Description = "Developer access with limited permissions",
                Policies = new List<IAMPolicy>
                {
                    new IAMPolicy
                    {
                        PolicyName = "DeveloperPolicy",
                        PolicyArn = "arn:aws:iam::123456789012:policy/DeveloperPolicy",
                        IsManaged = false,
                        PolicyDocument = new PolicyDocument
                        {
                            Version = "2012-10-17",
                            Statements = new List<PolicyStatement>
                            {
                                new PolicyStatement
                                {
                                    Effect = "Allow",
                                    Actions = new List<string> { "s3:GetObject", "s3:PutObject", "lambda:InvokeFunction" },
                                    Resources = new List<string> { "arn:aws:s3:::dev-bucket/*", "arn:aws:lambda:*:*:function:dev-*" }
                                }
                            }
                        }
                    }
                },
                RiskScore = 35,
                IsOverlyPermissive = false,
                HasPermissionsBoundary = true,
                TrustedEntities = new List<string> { "lambda.amazonaws.com" },
                LastUsed = DateTime.UtcNow.AddHours(-5),
                CreatedDate = DateTime.UtcNow.AddMonths(-3)
            },
            new IAMRole
            {
                Arn = "arn:aws:iam::123456789012:role/ReadOnlyRole",
                Name = "ReadOnlyRole",
                Description = "Read-only access for auditing",
                Policies = new List<IAMPolicy>
                {
                    new IAMPolicy
                    {
                        PolicyName = "ReadOnlyAccess",
                        PolicyArn = "arn:aws:iam::aws:policy/ReadOnlyAccess",
                        IsManaged = true,
                        PolicyDocument = new PolicyDocument
                        {
                            Version = "2012-10-17",
                            Statements = new List<PolicyStatement>
                            {
                                new PolicyStatement
                                {
                                    Effect = "Allow",
                                    Actions = new List<string> { "s3:GetObject", "ec2:Describe*", "cloudwatch:Get*" },
                                    Resources = new List<string> { "*" }
                                }
                            }
                        }
                    }
                },
                RiskScore = 15,
                IsOverlyPermissive = false,
                HasPermissionsBoundary = true,
                TrustedEntities = new List<string> { "sts.amazonaws.com" },
                LastUsed = DateTime.UtcNow.AddDays(-1),
                CreatedDate = DateTime.UtcNow.AddMonths(-12)
            }
        };
    }

    private List<IAMUser> InitializeMockUsers()
    {
        return new List<IAMUser>
        {
            new IAMUser
            {
                UserId = "AIDACKCEVSQ6C2EXAMPLE",
                UserName = "john.admin",
                Email = "john.admin@example.com",
                AccessLevel = "admin",
                MfaEnabled = true,
                LastActivity = DateTime.UtcNow.AddHours(-3),
                CreatedDate = DateTime.UtcNow.AddYears(-1),
                RiskScore = 45,
                AttachedPolicies = new List<string> { "AdministratorAccess" },
                Groups = new List<string> { "Administrators" }
            },
            new IAMUser
            {
                UserId = "AIDAI23HXX2LQ4EXAMPLE",
                UserName = "sarah.developer",
                Email = "sarah.dev@example.com",
                AccessLevel = "power-user",
                MfaEnabled = true,
                LastActivity = DateTime.UtcNow.AddHours(-1),
                CreatedDate = DateTime.UtcNow.AddMonths(-6),
                RiskScore = 25,
                AttachedPolicies = new List<string> { "PowerUserAccess" },
                Groups = new List<string> { "Developers" }
            },
            new IAMUser
            {
                UserId = "AIDAJDPLNKZ4MCSEXAMPLE",
                UserName = "mike.viewer",
                Email = "mike.viewer@example.com",
                AccessLevel = "read-only",
                MfaEnabled = false,
                LastActivity = DateTime.UtcNow.AddDays(-45),
                CreatedDate = DateTime.UtcNow.AddMonths(-8),
                RiskScore = 65,
                AttachedPolicies = new List<string> { "ReadOnlyAccess" },
                Groups = new List<string> { "Auditors" }
            }
        };
    }
}
