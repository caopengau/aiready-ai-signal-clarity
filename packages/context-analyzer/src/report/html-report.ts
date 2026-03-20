import { analyzeContext } from '../analyzer';
import { generateSummary } from '../summary';

/**
 * Generate HTML report
 */
export function generateHTMLReport(
  summary: ReturnType<typeof generateSummary>,
  results: Awaited<ReturnType<typeof analyzeContext>>
): string {
  const totalIssues =
    summary.criticalIssues + summary.majorIssues + summary.minorIssues;

  // 'results' may be used in templates later; reference to avoid lint warnings
  void results;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>aiready Context Analysis Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    h1, h2, h3 { color: #2c3e50; }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .metric {
      font-size: 2em;
      font-weight: bold;
      color: #667eea;
    }
    .label {
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }
    .issue-critical { color: #e74c3c; }
    .issue-major { color: #f39c12; }
    .issue-minor { color: #3498db; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background-color: #667eea;
      color: white;
      font-weight: 600;
    }
    tr:hover { background-color: #f8f9fa; }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      color: #666;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 AIReady Context Analysis Report</h1>
    <p>Generated on ${new Date().toLocaleString()}</p>
  </div>

  <div class="summary">
    <div class="card">
      <div class="metric">${summary.totalFiles}</div>
      <div class="label">Files Analyzed</div>
    </div>
    <div class="card">
      <div class="metric">${summary.totalTokens.toLocaleString()}</div>
      <div class="label">Total Tokens</div>
    </div>
    <div class="card">
      <div class="metric">${summary.avgContextBudget.toFixed(0)}</div>
      <div class="label">Avg Context Budget</div>
    </div>
    <div class="card">
      <div class="metric ${totalIssues > 0 ? 'issue-major' : ''}">${totalIssues}</div>
      <div class="label">Total Issues</div>
    </div>
  </div>

  ${
    totalIssues > 0
      ? `
  <div class="card" style="margin-bottom: 30px;">
    <h2>⚠️ Issues Summary</h2>
    <p>
      <span class="issue-critical">🔴 Critical: ${summary.criticalIssues}</span> &nbsp;
      <span class="issue-major">🟡 Major: ${summary.majorIssues}</span> &nbsp;
      <span class="issue-minor">🔵 Minor: ${summary.minorIssues}</span>
    </p>
    <p><strong>Potential Savings:</strong> ${summary.totalPotentialSavings.toLocaleString()} tokens</p>
  </div>
  `
      : ''
  }

  ${
    summary.fragmentedModules.length > 0
      ? `
  <div class="card" style="margin-bottom: 30px;">
    <h2>🧩 Fragmented Modules</h2>
    <table>
      <thead>
        <tr>
          <th>Domain</th>
          <th>Files</th>
          <th>Fragmentation</th>
          <th>Token Cost</th>
        </tr>
      </thead>
      <tbody>
        ${summary.fragmentedModules
          .map(
            (m) => `
          <tr>
            <td>${m.domain}</td>
            <td>${m.files.length}</td>
            <td>${(m.fragmentationScore * 100).toFixed(0)}%</td>
            <td>${m.totalTokens.toLocaleString()}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>
  `
      : ''
  }

  ${
    summary.topExpensiveFiles.length > 0
      ? `
  <div class="card" style="margin-bottom: 30px;">
    <h2>💸 Most Expensive Files</h2>
    <table>
      <thead>
        <tr>
          <th>File</th>
          <th>Context Budget</th>
          <th>Severity</th>
        </tr>
      </thead>
      <tbody>
        ${summary.topExpensiveFiles
          .map(
            (f) => `
          <tr>
            <td>${f.file}</td>
            <td>${f.contextBudget.toLocaleString()} tokens</td>
            <td class="issue-${f.severity}">${f.severity.toUpperCase()}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>
  `
      : ''
  }

  <div class="footer">
    <p>Generated by <strong>@aiready/context-analyzer</strong></p>
    <p>Like AIReady? <a href="https://github.com/caopengau/aiready-context-analyzer">Star us on GitHub</a></p>
    <p>Found a bug? <a href="https://github.com/caopengau/aiready-context-analyzer/issues">Report it here</a></p>
  </div>
</body>
</html>`;
}
