using Microsoft.AspNetCore.Mvc;
using CloudGovDashboard.Services;

namespace CloudGovDashboard.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IAMController : ControllerBase
{
    private readonly IIAMService _iamService;
    private readonly ILogger<IAMController> _logger;

    public IAMController(IIAMService iamService, ILogger<IAMController> logger)
    {
        _iamService = iamService;
        _logger = logger;
    }

    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles([FromQuery] string? riskLevel = null)
    {
        try
        {
            _logger.LogInformation("Fetching IAM roles with risk level filter: {RiskLevel}", riskLevel ?? "all");

            var roles = await _iamService.GetRolesAsync(riskLevel);
            var summary = await _iamService.GetRolesSummaryAsync();

            return Ok(new
            {
                roles,
                summary
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching IAM roles");
            return StatusCode(500, new { error = "Failed to fetch IAM roles" });
        }
    }

    [HttpGet("roles/{arn}")]
    public async Task<IActionResult> GetRoleByArn(string arn)
    {
        try
        {
            var role = await _iamService.GetRoleByArnAsync(arn);

            if (role == null)
            {
                return NotFound(new { error = "Role not found" });
            }

            return Ok(role);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching IAM role: {Arn}", arn);
            return StatusCode(500, new { error = "Failed to fetch IAM role" });
        }
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] string? accessLevel = null)
    {
        try
        {
            _logger.LogInformation("Fetching IAM users with access level filter: {AccessLevel}", accessLevel ?? "all");

            var users = await _iamService.GetUsersAsync(accessLevel);
            var summary = await _iamService.GetUsersSummaryAsync();

            return Ok(new
            {
                users,
                summary
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching IAM users");
            return StatusCode(500, new { error = "Failed to fetch IAM users" });
        }
    }

    [HttpGet("users/{userId}")]
    public async Task<IActionResult> GetUserById(string userId)
    {
        try
        {
            var user = await _iamService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching IAM user: {UserId}", userId);
            return StatusCode(500, new { error = "Failed to fetch IAM user" });
        }
    }

    [HttpGet("recommendations")]
    public async Task<IActionResult> GetRecommendations()
    {
        try
        {
            _logger.LogInformation("Fetching security recommendations");

            var recommendations = await _iamService.GetSecurityRecommendationsAsync();

            return Ok(new
            {
                recommendations,
                summary = new
                {
                    total = recommendations.Count,
                    high = recommendations.Count(r => r.Severity == "high"),
                    medium = recommendations.Count(r => r.Severity == "medium"),
                    low = recommendations.Count(r => r.Severity == "low")
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching security recommendations");
            return StatusCode(500, new { error = "Failed to fetch recommendations" });
        }
    }
}
