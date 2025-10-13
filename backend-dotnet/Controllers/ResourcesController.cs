using Microsoft.AspNetCore.Mvc;
using CloudGovDashboard.Services;

namespace CloudGovDashboard.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResourcesController : ControllerBase
{
    private readonly IAWSService _awsService;
    private readonly ILogger<ResourcesController> _logger;

    public ResourcesController(IAWSService awsService, ILogger<ResourcesController> logger)
    {
        _awsService = awsService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetResources(
        [FromQuery] string? type = null,
        [FromQuery] string? status = null,
        [FromQuery] string? region = null)
    {
        try
        {
            _logger.LogInformation("Fetching resources with filters - Type: {Type}, Status: {Status}, Region: {Region}",
                type ?? "all", status ?? "all", region ?? "all");

            var resources = await _awsService.GetResourcesAsync(type, status, region);
            var summary = await _awsService.GetResourcesSummaryAsync();

            return Ok(new
            {
                resources,
                summary
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching resources");
            return StatusCode(500, new { error = "Failed to fetch resources" });
        }
    }

    [HttpGet("workspaces")]
    public async Task<IActionResult> GetWorkSpaces([FromQuery] string? status = null)
    {
        try
        {
            _logger.LogInformation("Fetching WorkSpaces with status filter: {Status}", status ?? "all");

            var workspaces = await _awsService.GetWorkSpacesAsync(status);
            var summary = await _awsService.GetWorkSpacesSummaryAsync();
            var recommendations = await _awsService.GetWorkSpaceRecommendationsAsync();

            return Ok(new
            {
                workspaces,
                summary,
                recommendations
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching WorkSpaces");
            return StatusCode(500, new { error = "Failed to fetch WorkSpaces" });
        }
    }

    [HttpGet("workspaces/{workspaceId}")]
    public async Task<IActionResult> GetWorkSpaceById(string workspaceId)
    {
        try
        {
            var workspace = await _awsService.GetWorkSpaceByIdAsync(workspaceId);

            if (workspace == null)
            {
                return NotFound(new { error = "WorkSpace not found" });
            }

            return Ok(workspace);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching WorkSpace: {WorkspaceId}", workspaceId);
            return StatusCode(500, new { error = "Failed to fetch WorkSpace" });
        }
    }
}
