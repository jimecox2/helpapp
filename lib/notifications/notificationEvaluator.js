import { FRONTEND_URL } from '@/config/site';

// app/admin/utils/notificationEvaluator.js

// Determine product family from the notification config's order product_code.
// Product codes start with CB (Costbars), AB (Agilebars), or TB (Timebars).
// Defaults to 'costbars' to preserve backward compatibility.
const getProductType = (notificationConfig) => {
  const code = (notificationConfig.order?.product_code || '').toUpperCase();
  if (code.startsWith('CB')) return 'costbars';
  if (code.startsWith('AB')) return 'agilebars';
  if (code.startsWith('TB')) return 'timebars';
  return 'costbars';
};

// ─── Chain-climbing helpers ────────────────────────────────────────────────────

// Health chain (ascending severity): Green → Yellow → Red
// Threshold=Yellow fires for Yellow and Red (at threshold or worse).
// An empty project health value is treated as Red.
const HEALTH_CHAIN = ['Green', 'Yellow', 'Red'];

const meetsHealthThreshold = (projectHealth, configuredThreshold) => {
  const effective = (projectHealth === null || projectHealth === undefined || projectHealth === '')
    ? 'Red'
    : projectHealth;
  const projectIdx = HEALTH_CHAIN.indexOf(effective);
  const thresholdIdx = HEALTH_CHAIN.indexOf(configuredThreshold);
  if (thresholdIdx === -1 || projectIdx === -1) return false;
  return projectIdx >= thresholdIdx;
};

// Commitment chain (ascending level): Not Assessed → Not Clear → Limited → Moderate → Strong → Full
// Threshold=Moderate fires for Moderate, Strong, and Full (at threshold or higher toward Full).
// An empty project commitment value is treated as Moderate.
const COMMITMENT_CHAIN = ['Not Assessed', 'Not Clear', 'Limited', 'Moderate', 'Strong', 'Full'];

const meetsCommitmentThreshold = (projectCommitment, configuredThreshold) => {
  const effective = (projectCommitment === null || projectCommitment === undefined || projectCommitment === '')
    ? 'Moderate'
    : projectCommitment;
  const projectIdx = COMMITMENT_CHAIN.indexOf(effective);
  const thresholdIdx = COMMITMENT_CHAIN.indexOf(configuredThreshold);
  if (thresholdIdx === -1 || projectIdx === -1) return false;
  return projectIdx >= thresholdIdx;
};

// Risk chain: numeric. Fires for project risk value >= threshold value.
// An empty project risk value is treated as 51 (above "41-50 Complex but Manageable"),
// making it triggering for any threshold at or below that value.
const meetsRiskThreshold = (projectRiskLabel, configuredThreshold, riskComplexityValues) => {
  const thresholdValue = riskComplexityValues[configuredThreshold] ?? 0;
  if (projectRiskLabel === null || projectRiskLabel === undefined || projectRiskLabel === '') {
    return 51 >= thresholdValue;
  }
  const projectValue = riskComplexityValues[projectRiskLabel] ?? 0;
  return projectValue >= thresholdValue;
};

export const evaluateInProgressProjects = (projects, notificationSettings) => {
  const debugLogs = [];
  const summary = {
    totalProjects: 0,
    flaggedProjects: 0,
    managers: [],
    totalIssues: 0,
    totalDataQualityIssues: 0
  };

  const inProgressProjects = Array.isArray(projects)
    ? projects.filter(p => p.tbMDStatus === 'In progress' || p.tbMDStatus === 'In Progress')
    : [];

  summary.totalProjects = inProgressProjects.length;
  debugLogs.push(`📊 Total in-progress projects: ${inProgressProjects.length}`);

  if (inProgressProjects.length === 0) {
    debugLogs.push('❌ No in-progress projects found');
    return {
      shouldNotify: false,
      summary,
      message: '',
      flaggedProjects: [],
      allDebugLogs: debugLogs,
      notifications: []
    };
  }

  // Risk/Complexity label → numeric mapping.
  // Both full-label forms ("51-60 Significant Complexity") and short aliases
  // ("Significant Complexity") are supported for backward compatibility.
  const riskComplexityValues = {
    'Not Assessed': 0,
    '0-10 Very Small and Simple': 10,
    '11-20 Small and Straightforward': 20,
    '21-30 Medium with Some Complexity': 30,
    '31-40 Large with Moderate Complexity': 40,
    '41-50 Complex but Manageable': 50,
    '51-60 Significant Complexity': 60,
    '61-70 Large and Complex': 70,
    '71-80 Very Large and Complex': 80,
    '81-90 Highly Complex and Risky': 90,
    '91-100 Extremely Complex and Risky': 100,
    // Short-form aliases
    'Very Small and Simple': 10,
    'Small and Straightforward': 20,
    'Medium with Some Complexity': 30,
    'Large with Moderate Complexity': 40,
    'Complex but Manageable': 50,
    'Significant Complexity': 60,
    'Large and Complex': 70,
    'Very Large and Complex': 80,
    'Highly Complex and Risky': 90,
    'Extremely Complex and Risky': 100,
  };

  // ─── Shared helpers ────────────────────────────────────────────────────────────

  const getFieldValue = (project, field, defaultValue) => {
    const value = project[field];
    if (value === null || value === undefined || value === '') {
      debugLogs.push(`🔧 Using default value for ${field}: ${defaultValue}`);
      return defaultValue;
    }
    return value;
  };

  const calculateBudgetOverrun = (project) => {
    const cost = parseFloat(project.tbCost) || 0;
    const budget = parseFloat(project.tbBudgetCost) || 0;
    if (budget === 0) return 0;
    return ((cost - budget) / budget) * 100;
  };

  const calculateWorkOverrun = (project) => {
    const work = parseFloat(project.tbWork) || 0;
    const baselineWork = parseFloat(project.blWork) || 0;
    if (baselineWork === 0) return 0;
    return ((work - baselineWork) / baselineWork) * 100;
  };

  const isBusinessHours = (notificationConfig) => {
    const now = new Date();
    const day = now.getDay();
    if (!notificationConfig.weekend_notifications && (day === 0 || day === 6)) return false;
    if (notificationConfig.business_hours_only) {
      const hour = now.getHours();
      return hour >= 9 && hour <= 17;
    }
    return true;
  };

  // ─── Per-project evaluation: Costbars (5 scenarios) ───────────────────────────
  // All categorical checks use chain-climbing helpers so user-configured thresholds
  // are respected rather than hardcoded values.

  const evaluateCostbarsProject = (project, notificationConfig) => {
    const projectIssues = [];
    const triggeredScenarios = [];
    let hasDataQualityIssues = false;

    const healthThreshold    = notificationConfig.overall_health_threshold     || 'Red';
    const commitmentThreshold = notificationConfig.executive_commitment_threshold || 'Moderate';
    const riskThreshold      = notificationConfig.risk_size_complexity_threshold  || 'Significant Complexity';
    const riskThresholdValue = riskComplexityValues[riskThreshold] ?? 60;

    const healthStatus    = getFieldValue(project, 'tbMDHealthOverall', 'Red');
    const commitment      = getFieldValue(project, 'tbMDSeniorLevelCommitment', 'Moderate');
    const strategicValue  = parseFloat(project.tbMDPriorityStrategic);
    const riskLabel       = project.tbMDRiskVsSizeAndComplexity;
    const riskComplexityValue = riskComplexityValues[riskLabel || 'Significant Complexity'] ?? 60;
    const budgetOverrun   = calculateBudgetOverrun(project);
    const workOverrun     = calculateWorkOverrun(project);

    debugLogs.push(
      `📋 [CB] ${project.tbName} | ` +
      `Health: ${healthStatus} (threshold: ${healthThreshold}) | ` +
      `Strategic: ${isNaN(strategicValue) ? 'MISSING' : strategicValue} (threshold: ${notificationConfig.strategic_value_threshold}) | ` +
      `Risk: ${riskLabel || 'Empty'} (${riskComplexityValue}, threshold: ${riskThreshold}=${riskThresholdValue}) | ` +
      `Commitment: ${commitment} (threshold: ${commitmentThreshold})`
    );

    if (['Not Assessed', 'Not Clear', '', null, undefined].includes(project.tbMDSeniorLevelCommitment)) {
      hasDataQualityIssues = true;
      projectIssues.push(`DATA QUALITY: Senior Level Commitment needs to be updated (currently: "${project.tbMDSeniorLevelCommitment || 'Missing'}")`);
    }

    const healthMeets     = meetsHealthThreshold(project.tbMDHealthOverall, healthThreshold);
    const commitmentMeets = meetsCommitmentThreshold(project.tbMDSeniorLevelCommitment, commitmentThreshold);
    const riskMeets       = meetsRiskThreshold(riskLabel, riskThreshold, riskComplexityValues);

    debugLogs.push(`   [CB] Chain results — Health: ${healthMeets}, Commitment: ${commitmentMeets}, Risk: ${riskMeets}`);

    // SCENARIO 1: Health at/above threshold + high strategic value
    if (healthMeets && !isNaN(strategicValue) && strategicValue > notificationConfig.strategic_value_threshold) {
      triggeredScenarios.push('CRITICAL_HIGH_VALUE');
      projectIssues.push(`SCENARIO 1: Critical high-value project — Health: ${healthStatus} meets threshold ${healthThreshold}, Strategic Value: ${strategicValue} > ${notificationConfig.strategic_value_threshold}`);
      debugLogs.push(`🚨 SCENARIO 1 triggered for ${project.tbName}`);
    }

    // SCENARIO 2: Health at/above threshold + missing strategic data + risk at/above threshold
    if (healthMeets && isNaN(strategicValue) && riskMeets) {
      triggeredScenarios.push('MISSING_STRATEGIC_DATA');
      projectIssues.push(`SCENARIO 2: Critical project missing strategic data — Health: ${healthStatus} meets threshold ${healthThreshold}, Risk/Complexity: ${riskLabel || 'Empty'} (${riskComplexityValue}) ≥ threshold ${riskThreshold} (${riskThresholdValue})`);
      debugLogs.push(`🚨 SCENARIO 2 triggered for ${project.tbName}`);
    }

    // SCENARIO 3: Health field empty + commitment at/above threshold + risk at/above threshold
    if ((!project.tbMDHealthOverall || project.tbMDHealthOverall === '') && commitmentMeets && riskMeets) {
      triggeredScenarios.push('MISSING_HEALTH_STATUS');
      projectIssues.push(`SCENARIO 3: Missing health status — Commitment: ${commitment} meets threshold ${commitmentThreshold}, Risk/Complexity: ${riskLabel || 'Empty'} (${riskComplexityValue}) ≥ threshold ${riskThreshold} (${riskThresholdValue})`);
      debugLogs.push(`🚨 SCENARIO 3 triggered for ${project.tbName}`);
    }

    // SCENARIO 4: Budget overrun on high-value project
    if (budgetOverrun > notificationConfig.budget_overrun_percent &&
        ((!isNaN(strategicValue) && strategicValue > notificationConfig.strategic_value_threshold) ||
         (isNaN(strategicValue) && riskComplexityValue > notificationConfig.strategic_value_threshold))) {
      triggeredScenarios.push('BUDGET_OVERRUN_HIGH_VALUE');
      projectIssues.push(`SCENARIO 4: Budget overrun on high-value project (${budgetOverrun.toFixed(1)}% > ${notificationConfig.budget_overrun_percent}%)`);
      debugLogs.push(`🚨 SCENARIO 4 triggered for ${project.tbName}`);
    }

    // SCENARIO 5: Work hours overrun on high-value project
    if (workOverrun > (notificationConfig.work_overrun_percent || 20) &&
        ((!isNaN(strategicValue) && strategicValue > notificationConfig.strategic_value_threshold) ||
         (isNaN(strategicValue) && riskComplexityValue > notificationConfig.strategic_value_threshold))) {
      triggeredScenarios.push('WORK_OVERRUN_HIGH_VALUE');
      projectIssues.push(`SCENARIO 5: Work hours overrun on high-value project (${workOverrun.toFixed(1)}% > ${notificationConfig.work_overrun_percent || 20}%)`);
      debugLogs.push(`🚨 SCENARIO 5 triggered for ${project.tbName}`);
    }

    return { projectIssues, triggeredScenarios, hasDataQualityIssues };
  };

  // ─── Per-project evaluation: Timebars (3-field check) ─────────────────────────
  // Fires when ALL three conditions are true on the same in-progress project.

  const evaluateTimebarsProject = (project, notificationConfig) => {
    const projectIssues = [];
    const triggeredScenarios = [];

    const health     = project.tbMDHealthOverall;
    const commitment = project.tbMDSeniorLevelCommitment;
    const riskLabel  = project.tbMDRiskVsSizeAndComplexity;
    const riskDisplayValue = riskLabel
      ? (riskComplexityValues[riskLabel] ?? 0)
      : 51; // empty treated as 51

    const healthThreshold     = notificationConfig.overall_health_threshold      || 'Red';
    const commitmentThreshold = notificationConfig.executive_commitment_threshold || 'Moderate';
    const riskThreshold       = notificationConfig.risk_size_complexity_threshold || 'Significant Complexity';
    const riskThresholdValue  = riskComplexityValues[riskThreshold] ?? 60;

    debugLogs.push(
      `📋 [TB] ${project.tbName} | ` +
      `Health: ${health || 'Empty'} (threshold: ${healthThreshold}) | ` +
      `Commitment: ${commitment || 'Empty'} (threshold: ${commitmentThreshold}) | ` +
      `Risk: ${riskLabel || 'Empty'} (value: ${riskDisplayValue}, threshold: ${riskThreshold}=${riskThresholdValue})`
    );

    const healthMeets     = meetsHealthThreshold(health, healthThreshold);
    const commitmentMeets = meetsCommitmentThreshold(commitment, commitmentThreshold);
    const riskMeets       = meetsRiskThreshold(riskLabel, riskThreshold, riskComplexityValues);

    debugLogs.push(`   [TB] Conditions — Health: ${healthMeets}, Commitment: ${commitmentMeets}, Risk: ${riskMeets}`);

    if (healthMeets && commitmentMeets && riskMeets) {
      triggeredScenarios.push('TB_ALERT');
      projectIssues.push(
        `ALERT: Project requires attention — ` +
        `Health: ${health || 'Not Set'} meets threshold ${healthThreshold}, ` +
        `Commitment: ${commitment || 'Not Set'} meets threshold ${commitmentThreshold}, ` +
        `Risk/Complexity: ${riskLabel || 'Not Assessed'} (${riskDisplayValue}) ≥ threshold ${riskThreshold} (${riskThresholdValue})`
      );
      debugLogs.push(`🚨 TB ALERT triggered for ${project.tbName}`);
    }

    return { projectIssues, triggeredScenarios, hasDataQualityIssues: false };
  };

  // ─── Per-project evaluation: Agilebars (2-field check) ────────────────────────
  // Fires when BOTH conditions are true on the same in-progress project.

  const evaluateAgilebarsProject = (project, notificationConfig) => {
    const projectIssues = [];
    const triggeredScenarios = [];

    const health     = project.tbMDHealthOverall;
    const commitment = project.tbMDSeniorLevelCommitment;

    const healthThreshold     = notificationConfig.overall_health_threshold      || 'Red';
    const commitmentThreshold = notificationConfig.executive_commitment_threshold || 'Moderate';

    debugLogs.push(
      `📋 [AB] ${project.tbName} | ` +
      `Health: ${health || 'Empty'} (threshold: ${healthThreshold}) | ` +
      `Commitment: ${commitment || 'Empty'} (threshold: ${commitmentThreshold})`
    );

    const healthMeets     = meetsHealthThreshold(health, healthThreshold);
    const commitmentMeets = meetsCommitmentThreshold(commitment, commitmentThreshold);

    debugLogs.push(`   [AB] Conditions — Health: ${healthMeets}, Commitment: ${commitmentMeets}`);

    if (healthMeets && commitmentMeets) {
      triggeredScenarios.push('AB_ALERT');
      projectIssues.push(
        `ALERT: Project requires attention — ` +
        `Health: ${health || 'Not Set'} meets threshold ${healthThreshold}, ` +
        `Commitment: ${commitment || 'Not Set'} meets threshold ${commitmentThreshold}`
      );
      debugLogs.push(`🚨 AB ALERT triggered for ${project.tbName}`);
    }

    return { projectIssues, triggeredScenarios, hasDataQualityIssues: false };
  };

  // ─── Main evaluation loop ──────────────────────────────────────────────────────

  const notifications = [];
  const allFlaggedProjects = [];

  Array.isArray(notificationSettings) && notificationSettings.forEach(notificationConfig => {
    if (!notificationConfig.is_active) {
      debugLogs.push(`⏸️ Skipping inactive config for ${notificationConfig.manager_name}`);
      return;
    }

    const productType = getProductType(notificationConfig);
    debugLogs.push(`🔍 Evaluating for ${notificationConfig.manager_name} (product: ${notificationConfig.order?.product_code || 'unknown'} → ${productType})`);

    if (!isBusinessHours(notificationConfig)) {
      debugLogs.push(`⏰ Skipping ${notificationConfig.manager_name}: Outside business hours`);
      return;
    }

    const flaggedProjects = [];
    const managerIssues = [];
    let dataQualityIssues = 0;

    inProgressProjects.forEach(project => {
      const { projectIssues, triggeredScenarios, hasDataQualityIssues } =
        productType === 'costbars'
          ? evaluateCostbarsProject(project, notificationConfig)
          : productType === 'timebars'
            ? evaluateTimebarsProject(project, notificationConfig)
            : evaluateAgilebarsProject(project, notificationConfig);

      if (projectIssues.length > 0) {
        const flaggedProject = {
          project,
          managerName: notificationConfig.manager_name,
          evaluation: {
            scenarios: triggeredScenarios,
            issues: projectIssues,
            dataQualityIssueCount: hasDataQualityIssues ? 1 : 0,
            priority: triggeredScenarios.includes('CRITICAL_HIGH_VALUE') ? 'CRITICAL' : 'HIGH'
          }
        };

        flaggedProjects.push(flaggedProject);
        allFlaggedProjects.push(flaggedProject);
        managerIssues.push(...projectIssues);

        if (hasDataQualityIssues) dataQualityIssues++;
        debugLogs.push(`⚠️ ${project.tbName} flagged with ${projectIssues.length} issue(s)`);
      }
    });

    if (flaggedProjects.length > 0) {
      const message =
        productType === 'costbars'  ? generateCostbarsMessage(notificationConfig, flaggedProjects) :
        productType === 'timebars'  ? generateTimebarsMessage(notificationConfig, flaggedProjects) :
                                      generateAgilebarsMessage(notificationConfig, flaggedProjects);

      notifications.push({
        managerName: notificationConfig.manager_name,
        managerEmail: notificationConfig.manager_email,
        managerPhone: notificationConfig.manager_phone,
        primaryChannel: notificationConfig.primary_channel,
        message,
        flaggedProjects,
        projectCount: flaggedProjects.length,
        issueCount: managerIssues.length,
        dataQualityIssueCount: dataQualityIssues,
        notificationConfig,
        productType,
      });

      if (!summary.managers.includes(notificationConfig.manager_name)) {
        summary.managers.push(notificationConfig.manager_name);
      }
      debugLogs.push(`📨 Notification queued for ${notificationConfig.manager_name}: ${flaggedProjects.length} project(s)`);
    }
  });

  summary.flaggedProjects = allFlaggedProjects.length;
  summary.totalIssues = allFlaggedProjects.reduce((sum, fp) => sum + fp.evaluation.issues.length, 0);
  summary.totalDataQualityIssues = allFlaggedProjects.reduce((sum, fp) => sum + fp.evaluation.dataQualityIssueCount, 0);

  const shouldNotify = notifications.length > 0;

  debugLogs.push(`📊 FINAL: ${shouldNotify ? 'NOTIFICATIONS REQUIRED' : 'NO NOTIFICATIONS NEEDED'}`);
  debugLogs.push(`📊 Managers to notify: ${summary.managers.length}`);
  debugLogs.push(`📊 Flagged projects: ${summary.flaggedProjects}`);
  debugLogs.push(`📊 Total issues: ${summary.totalIssues}`);

  return {
    shouldNotify,
    summary,
    message: notifications.map(n => n.message).join('\n\n---\n\n'),
    flaggedProjects: allFlaggedProjects,
    allDebugLogs: debugLogs,
    notifications
  };
};

// ─── Message generators ────────────────────────────────────────────────────────

const generateCostbarsMessage = (notificationConfig, flaggedProjects) => {
  const timestamp = new Date().toLocaleString();
  const projectCount = flaggedProjects.length;

  let message = `🚨 PPM NOTIFICATION ALERT 🚨\n\n`;
  message += `Manager: ${notificationConfig.manager_name}\n`;
  message += `Generated: ${timestamp}\n`;
  message += `Projects Requiring Attention: ${projectCount}\n\n`;

  message += `📊 YOUR CONFIGURED THRESHOLDS:\n`;
  message += `• Overall Health: ${notificationConfig.overall_health_threshold} and above\n`;
  message += `• Executive Commitment: ${notificationConfig.executive_commitment_threshold} and above\n`;
  message += `• Risk/Complexity: ${notificationConfig.risk_size_complexity_threshold} and above\n`;
  message += `• Strategic Value: > ${notificationConfig.strategic_value_threshold}\n`;
  message += `• Budget Overrun: > ${notificationConfig.budget_overrun_percent}%\n\n`;

  message += `🚨 FLAGGED PROJECTS:\n\n`;

  flaggedProjects.forEach((fp, index) => {
    const p = fp.project;
    message += `${index + 1}. PROJECT: ${p.tbName || 'Unknown'} (ID: ${p.tbID || 'N/A'})\n`;
    message += `   Cost: $${p.tbCost ? parseInt(p.tbCost).toLocaleString() : 'Unknown'}\n`;
    message += `   Status: ${p.tbMDStatus || 'Unknown'}\n`;
    message += `   Health: ${p.tbMDHealthOverall || 'Missing'}\n`;
    message += `   Strategic Value: ${p.tbMDPriorityStrategic || 'Missing'}\n`;
    message += `   Senior Commitment: ${p.tbMDSeniorLevelCommitment || 'Missing'}\n`;
    message += `   Risk/Complexity: ${p.tbMDRiskVsSizeAndComplexity || 'Missing'}\n\n`;
    message += `   ⚠️ VIOLATIONS:\n`;
    fp.evaluation.issues.forEach(issue => { message += `   • ${issue}\n`; });
    message += `\n`;
  });

  message += `📞 CONTACT INFORMATION:\n`;
  message += `Email: ${notificationConfig.manager_email}\n`;
  message += `Phone: ${notificationConfig.manager_phone}\n`;
  message += `Primary Channel: ${notificationConfig.primary_channel}\n\n`;

  message += `🎯 ACTION REQUIRED:\n`;
  message += `1. Review the flagged projects immediately\n`;
  message += `2. Update any missing data fields identified\n`;
  message += `3. Address critical health status issues\n`;
  message += `4. Review budget and work hour overruns\n\n`;

  message += `Generated by PPM Notification System\n`;
  message += `View Dashboard: ${FRONTEND_URL || 'https://www.timebars.com'}/admin/notifications`;

  return message;
};

const generateTimebarsMessage = (notificationConfig, flaggedProjects) => {
  const timestamp = new Date().toLocaleString();
  const productName = notificationConfig.order?.product_name || 'Timebars';
  const projectCount = flaggedProjects.length;

  let message = `🚨 PPM NOTIFICATION ALERT 🚨\n\n`;
  message += `Manager: ${notificationConfig.manager_name}\n`;
  message += `Product: ${productName}\n`;
  message += `Generated: ${timestamp}\n`;
  message += `Projects Requiring Attention: ${projectCount}\n\n`;

  message += `📊 YOUR CONFIGURED THRESHOLDS:\n`;
  message += `• Overall Health: ${notificationConfig.overall_health_threshold} and above (empty treated as Red)\n`;
  message += `• Senior Commitment: ${notificationConfig.executive_commitment_threshold} and above (empty treated as Moderate)\n`;
  message += `• Risk/Complexity: ${notificationConfig.risk_size_complexity_threshold} and above (empty treated as triggering)\n\n`;

  message += `🚨 FLAGGED PROJECTS:\n\n`;

  flaggedProjects.forEach((fp, index) => {
    const p = fp.project;
    message += `${index + 1}. PROJECT: ${p.tbName || 'Unknown'} (ID: ${p.tbID || 'N/A'})\n`;
    message += `   Status: ${p.tbMDStatus || 'Unknown'}\n`;
    message += `   Health: ${p.tbMDHealthOverall || 'Not Set'}\n`;
    message += `   Senior Commitment: ${p.tbMDSeniorLevelCommitment || 'Not Set'}\n`;
    message += `   Risk/Complexity: ${p.tbMDRiskVsSizeAndComplexity || 'Not Assessed'}\n\n`;
    message += `   ⚠️ REASON:\n`;
    fp.evaluation.issues.forEach(issue => { message += `   • ${issue}\n`; });
    message += `\n`;
  });

  message += `📞 CONTACT INFORMATION:\n`;
  message += `Email: ${notificationConfig.manager_email}\n`;
  message += `Phone: ${notificationConfig.manager_phone}\n`;
  message += `Primary Channel: ${notificationConfig.primary_channel}\n\n`;

  message += `🎯 ACTION REQUIRED:\n`;
  message += `1. Review the flagged projects immediately\n`;
  message += `2. Update health status, commitment, and risk/complexity fields\n`;
  message += `3. Address any overdue or at-risk deliverables\n\n`;

  message += `Generated by PPM Notification System\n`;
  message += `View Dashboard: ${FRONTEND_URL || 'https://www.timebars.com'}/admin/notifications`;

  return message;
};

const generateAgilebarsMessage = (notificationConfig, flaggedProjects) => {
  const timestamp = new Date().toLocaleString();
  const productName = notificationConfig.order?.product_name || 'Agilebars';
  const projectCount = flaggedProjects.length;

  let message = `🚨 PPM NOTIFICATION ALERT 🚨\n\n`;
  message += `Manager: ${notificationConfig.manager_name}\n`;
  message += `Product: ${productName}\n`;
  message += `Generated: ${timestamp}\n`;
  message += `Projects Requiring Attention: ${projectCount}\n\n`;

  message += `📊 YOUR CONFIGURED THRESHOLDS:\n`;
  message += `• Overall Health: ${notificationConfig.overall_health_threshold} and above (empty treated as Red)\n`;
  message += `• Senior Commitment: ${notificationConfig.executive_commitment_threshold} and above (empty treated as Moderate)\n\n`;

  message += `🚨 FLAGGED PROJECTS:\n\n`;

  flaggedProjects.forEach((fp, index) => {
    const p = fp.project;
    message += `${index + 1}. PROJECT: ${p.tbName || 'Unknown'} (ID: ${p.tbID || 'N/A'})\n`;
    message += `   Status: ${p.tbMDStatus || 'Unknown'}\n`;
    message += `   Health: ${p.tbMDHealthOverall || 'Not Set'}\n`;
    message += `   Senior Commitment: ${p.tbMDSeniorLevelCommitment || 'Not Set'}\n\n`;
    message += `   ⚠️ REASON:\n`;
    fp.evaluation.issues.forEach(issue => { message += `   • ${issue}\n`; });
    message += `\n`;
  });

  message += `📞 CONTACT INFORMATION:\n`;
  message += `Email: ${notificationConfig.manager_email}\n`;
  message += `Phone: ${notificationConfig.manager_phone}\n`;
  message += `Primary Channel: ${notificationConfig.primary_channel}\n\n`;

  message += `🎯 ACTION REQUIRED:\n`;
  message += `1. Review the flagged projects immediately\n`;
  message += `2. Update health status and commitment fields\n`;
  message += `3. Address any at-risk deliverables\n\n`;

  message += `Generated by PPM Notification System\n`;
  message += `View Dashboard: ${FRONTEND_URL || 'https://www.timebars.com'}/admin/notifications`;

  return message;
};
