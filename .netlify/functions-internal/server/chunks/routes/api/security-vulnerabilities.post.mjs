import { d as defineEventHandler, r as readBody, c as createError } from '../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import '@intlify/utils';
import 'vue-router';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'node:crypto';
import 'consola';

const securityVulnerabilities_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { url } = body;
    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: "URL requise"
      });
    }
    let targetUrl;
    try {
      const urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new Error("Protocole non support\xE9");
      }
      targetUrl = urlObj.toString();
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: "URL invalide"
      });
    }
    const vulnerabilityResults = await scanVulnerabilities(targetUrl);
    return {
      success: true,
      data: vulnerabilityResults
    };
  } catch (error) {
    console.error("Erreur lors du scan des vuln\xE9rabilit\xE9s:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Erreur interne du serveur"
    });
  }
});
async function scanVulnerabilities(url) {
  try {
    let vulnerabilities = [];
    try {
      vulnerabilities = await scanWithOWASPZAP(url);
    } catch (zapError) {
      vulnerabilities = await detectBasicVulnerabilities(url);
    }
    const analysis = analyzeVulnerabilities(vulnerabilities);
    const score = calculateVulnerabilityScore(vulnerabilities, analysis);
    return {
      score,
      vulnerabilities,
      analysis,
      recommendations: generateVulnerabilityRecommendations(vulnerabilities, analysis),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  } catch (error) {
    console.error("Erreur lors du scan des vuln\xE9rabilit\xE9s:", error);
    return {
      score: 0,
      vulnerabilities: [],
      analysis: {},
      recommendations: ["Impossible de scanner les vuln\xE9rabilit\xE9s"],
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      error: "Erreur lors du scan des vuln\xE9rabilit\xE9s"
    };
  }
}
async function scanWithOWASPZAP(url) {
  var _a;
  try {
    const zapApiUrl = process.env.ZAP_API_URL || "http://localhost:8080";
    const zapApiKey = process.env.ZAP_API_KEY || "";
    const startResponse = await $fetch(`${zapApiUrl}/JSON/ascan/action/scan/?url=${encodeURIComponent(url)}&recurse=true&inScopeOnly=false&scanPolicyName=Default Policy&method=&postData=&contextId=`, {
      headers: { "X-ZAP-API-Key": zapApiKey }
    });
    if (startResponse.Result === "OK") {
      await new Promise((resolve) => setTimeout(resolve, 5e3));
      const alertsResponse = await $fetch(`${zapApiUrl}/JSON/core/view/alerts/?baseurl=${encodeURIComponent(url)}&start=1&count=100`, {
        headers: { "X-ZAP-API-Key": zapApiKey }
      });
      return ((_a = alertsResponse.alerts) == null ? void 0 : _a.map((alert) => ({
        id: alert.id,
        title: alert.name,
        severity: alert.risk,
        description: alert.description,
        recommendation: alert.solution,
        url: alert.url,
        evidence: alert.evidence
      }))) || [];
    }
    throw new Error("Impossible de lancer le scan OWASP ZAP");
  } catch (error) {
    console.error("Erreur OWASP ZAP:", error);
    throw error;
  }
}
async function detectBasicVulnerabilities(url) {
  const vulnerabilities = [];
  try {
    const errorResponse = await testErrorHandling(url);
    if (errorResponse.hasVulnerabilities) {
      vulnerabilities.push(...errorResponse.vulnerabilities);
    }
    const inputValidation = await testInputValidation(url);
    if (inputValidation.hasVulnerabilities) {
      vulnerabilities.push(...inputValidation.vulnerabilities);
    }
    const securityHeaders = await testSecurityHeaders(url);
    if (securityHeaders.hasVulnerabilities) {
      vulnerabilities.push(...securityHeaders.vulnerabilities);
    }
    const serverConfig = await testServerConfiguration(url);
    if (serverConfig.hasVulnerabilities) {
      vulnerabilities.push(...serverConfig.vulnerabilities);
    }
    const infoDisclosure = await testInformationDisclosure(url);
    if (infoDisclosure.hasVulnerabilities) {
      vulnerabilities.push(...infoDisclosure.vulnerabilities);
    }
    const publicFiles = await testPublicFiles(url);
    if (publicFiles.hasVulnerabilities) {
      vulnerabilities.push(...publicFiles.vulnerabilities);
    }
  } catch (error) {
    console.error("Erreur lors des tests de vuln\xE9rabilit\xE9s:", error);
  }
  return vulnerabilities;
}
async function testErrorHandling(url) {
  const vulnerabilities = [];
  try {
    const errorUrl = `${url}/nonexistent-page-${Date.now()}`;
    const response = await $fetch(errorUrl, {
      method: "GET",
      headers: { "User-Agent": "Serpenter Security Scanner/1.0" }
    }).catch(() => null);
    if (response) {
      const responseText = JSON.stringify(response);
      if (responseText.includes("stack trace") || responseText.includes("error details")) {
        vulnerabilities.push({
          id: "error-info-disclosure",
          title: "Divulgation d'informations d'erreur",
          severity: "Medium",
          description: "La page d'erreur r\xE9v\xE8le des informations sensibles sur l'application",
          recommendation: "Configurer des pages d'erreur personnalis\xE9es sans informations techniques",
          url: errorUrl
        });
      }
    }
  } catch (error) {
  }
  return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities };
}
async function testInputValidation(url) {
  const vulnerabilities = [];
  try {
    const xssPayloads = [
      '<script>alert("XSS")<\/script>',
      '"><script>alert("XSS")<\/script>',
      'javascript:alert("XSS")',
      '"><img src=x onerror=alert("XSS")>'
    ];
    for (const payload of xssPayloads) {
      try {
        const testUrl = `${url}?q=${encodeURIComponent(payload)}`;
        const response = await $fetch(testUrl, {
          method: "GET",
          headers: { "User-Agent": "Serpenter Security Scanner/1.0" }
        });
        if (response && typeof response === "string" && response.includes(payload)) {
          vulnerabilities.push({
            id: "xss-reflected",
            title: "Cross-Site Scripting (XSS) R\xE9fl\xE9chi",
            severity: "High",
            description: `L'entr\xE9e utilisateur "${payload}" est r\xE9fl\xE9chie dans la r\xE9ponse sans \xE9chappement`,
            recommendation: "Valider et \xE9chapper toutes les entr\xE9es utilisateur",
            url: testUrl,
            evidence: payload
          });
          break;
        }
      } catch (error) {
      }
    }
  } catch (error) {
    console.error("Erreur lors du test de validation des entr\xE9es:", error);
  }
  return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities };
}
async function testSecurityHeaders(url) {
  const vulnerabilities = [];
  try {
    const response = await $fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": "Serpenter Security Scanner/1.0" }
    });
    if (!response) {
      return { hasVulnerabilities: false, vulnerabilities: [] };
    }
    let headers = {};
    if (response.headers && typeof response.headers === "object") {
      headers = response.headers;
    } else if (response.headers && typeof response.headers.get === "function") {
      headers = {
        "content-security-policy": response.headers.get("content-security-policy"),
        "x-frame-options": response.headers.get("x-frame-options"),
        "strict-transport-security": response.headers.get("strict-transport-security"),
        "x-content-type-options": response.headers.get("x-content-type-options"),
        "x-xss-protection": response.headers.get("x-xss-protection")
      };
    } else {
      return { hasVulnerabilities: false, vulnerabilities: [] };
    }
    if (!headers["content-security-policy"]) {
      vulnerabilities.push({
        id: "missing-csp",
        title: "Content Security Policy manquante",
        severity: "Medium",
        description: "Aucune Content Security Policy n'est d\xE9finie",
        recommendation: "Impl\xE9menter une CSP stricte pour pr\xE9venir les attaques XSS",
        url
      });
    }
    if (!headers["x-frame-options"]) {
      vulnerabilities.push({
        id: "missing-xfo",
        title: "X-Frame-Options manquant",
        severity: "Medium",
        description: "Aucune protection contre le clickjacking",
        recommendation: "Configurer X-Frame-Options: DENY ou SAMEORIGIN",
        url
      });
    }
    if (!headers["strict-transport-security"]) {
      vulnerabilities.push({
        id: "missing-hsts",
        title: "HSTS manquant",
        severity: "Low",
        description: "Aucune protection HSTS pour forcer HTTPS",
        recommendation: "Activer HSTS avec max-age appropri\xE9",
        url
      });
    }
  } catch (error) {
    console.error("Erreur lors du test des headers de s\xE9curit\xE9:", error);
  }
  return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities };
}
async function testServerConfiguration(url) {
  var _a;
  const vulnerabilities = [];
  try {
    const optionsResponse = await $fetch(url, {
      method: "OPTIONS",
      headers: { "User-Agent": "Serpenter Security Scanner/1.0" }
    }).catch(() => null);
    if (optionsResponse) {
      const allowHeader = ((_a = optionsResponse.headers) == null ? void 0 : _a["allow"]) || "";
      if (allowHeader.includes("PUT") || allowHeader.includes("DELETE")) {
        vulnerabilities.push({
          id: "dangerous-methods",
          title: "M\xE9thodes HTTP dangereuses activ\xE9es",
          severity: "Medium",
          description: "Les m\xE9thodes PUT/DELETE sont activ\xE9es sur le serveur",
          recommendation: "D\xE9sactiver les m\xE9thodes HTTP non n\xE9cessaires",
          url,
          evidence: allowHeader
        });
      }
    }
    const sensitiveFiles = [
      "/.env",
      "/config.php",
      "/wp-config.php",
      "/.git/config",
      "/.htaccess",
      "/web.config",
      "/wp-config.php.bak",
      "/config.php.bak"
    ];
    for (const file of sensitiveFiles) {
      try {
        const testUrl = `${url}${file}`;
        const response = await $fetch(testUrl, {
          method: "GET",
          headers: { "User-Agent": "Serpenter Security Scanner/1.0" }
        }).catch(() => null);
        if (response) {
          const isSensitive = await analyzeFileContent(file, response);
          if (isSensitive) {
            vulnerabilities.push({
              id: "sensitive-file-exposure",
              title: "Fichier sensible accessible",
              severity: "High",
              description: `Le fichier ${file} est accessible publiquement et contient des informations sensibles`,
              recommendation: "Restreindre l'acc\xE8s aux fichiers sensibles ou masquer les informations critiques",
              url: testUrl
            });
          }
        }
      } catch (error) {
      }
    }
  } catch (error) {
    console.error("Erreur lors du test de configuration serveur:", error);
  }
  return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities };
}
async function testPublicFiles(url) {
  const vulnerabilities = [];
  try {
    const publicFiles = [
      "/robots.txt",
      "/sitemap.xml",
      "/sitemap_index.xml"
    ];
    for (const file of publicFiles) {
      try {
        const testUrl = `${url}${file}`;
        const response = await $fetch(testUrl, {
          method: "GET",
          headers: { "User-Agent": "Serpenter Security Scanner/1.0" }
        }).catch(() => null);
        if (response) {
          const hasSensitiveContent = await analyzePublicFileContent(file, response);
          if (hasSensitiveContent) {
            vulnerabilities.push({
              id: "public-file-sensitive-content",
              title: "Fichier public avec contenu sensible",
              severity: "Medium",
              description: `Le fichier ${file} est public mais contient des informations sensibles`,
              recommendation: "Nettoyer le contenu des fichiers publics ou restreindre l'acc\xE8s",
              url: testUrl
            });
          }
        }
      } catch (error) {
      }
    }
  } catch (error) {
    console.error("Erreur lors du test des fichiers publics:", error);
  }
  return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities };
}
async function testInformationDisclosure(url) {
  const vulnerabilities = [];
  try {
    const response = await $fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Serpenter Security Scanner/1.0" }
    });
    const responseText = JSON.stringify(response);
    if (responseText.includes("Server:") && responseText.includes("Apache") || responseText.includes("nginx")) {
      vulnerabilities.push({
        id: "server-info-disclosure",
        title: "Divulgation d'informations serveur",
        severity: "Low",
        description: "Le type et la version du serveur sont visibles",
        recommendation: "Masquer les informations du serveur dans les headers",
        url
      });
    }
    if (responseText.includes("PHP/") || responseText.includes("ASP.NET")) {
      vulnerabilities.push({
        id: "technology-disclosure",
        title: "Divulgation de la technologie",
        severity: "Low",
        description: "La technologie utilis\xE9e est visible",
        recommendation: "Masquer les informations de version des technologies",
        url
      });
    }
  } catch (error) {
    console.error("Erreur lors du test de divulgation d'informations:", error);
  }
  return { hasVulnerabilities: vulnerabilities.length > 0, vulnerabilities };
}
async function analyzeFileContent(filePath, content) {
  try {
    const contentStr = typeof content === "string" ? content : JSON.stringify(content);
    if (filePath.includes(".env")) {
      const sensitivePatterns = [
        /DB_PASSWORD/i,
        /API_KEY/i,
        /SECRET_KEY/i,
        /PASSWORD/i,
        /TOKEN/i,
        /PRIVATE_KEY/i
      ];
      return sensitivePatterns.some((pattern) => pattern.test(contentStr));
    }
    if (filePath.includes("config.php") || filePath.includes("wp-config.php")) {
      const sensitivePatterns = [
        /DB_PASSWORD/i,
        /DB_PASS/i,
        /SECRET_KEY/i,
        /AUTH_KEY/i,
        /NONCE_KEY/i
      ];
      return sensitivePatterns.some((pattern) => pattern.test(contentStr));
    }
    if (filePath.includes(".git/config")) {
      return contentStr.includes('[remote "origin"]') && contentStr.includes("url");
    }
    if (filePath.includes(".htaccess") || filePath.includes("web.config")) {
      const sensitivePatterns = [
        /#.*password/i,
        /#.*secret/i,
        /#.*key/i
      ];
      return sensitivePatterns.some((pattern) => pattern.test(contentStr));
    }
    return false;
  } catch (error) {
    console.error("Erreur lors de l'analyse du contenu du fichier:", error);
    return false;
  }
}
async function analyzePublicFileContent(filePath, content) {
  try {
    const contentStr = typeof content === "string" ? content : JSON.stringify(content);
    const sensitivePatterns = [
      // Chemins d'administration ou de développement
      /\/admin\//i,
      /\/wp-admin\//i,
      /\/phpmyadmin\//i,
      /\/cpanel\//i,
      /\/webmail\//i,
      // Fichiers de configuration ou de base de données
      /\.env/i,
      /\.sql/i,
      /\.db/i,
      /config\.php/i,
      /wp-config\.php/i,
      // Chemins de développement
      /\/\.git\//i,
      /\/\.svn\//i,
      /\/node_modules\//i,
      /\/vendor\//i,
      // Informations de serveur
      /server-info/i,
      /phpinfo/i,
      /test\.php/i,
      /debug\.php/i
    ];
    return sensitivePatterns.some((pattern) => pattern.test(contentStr));
  } catch (error) {
    console.error("Erreur lors de l'analyse du contenu du fichier public:", error);
    return false;
  }
}
function analyzeVulnerabilities(vulnerabilities) {
  const analysis = {
    total: vulnerabilities.length,
    bySeverity: {
      High: vulnerabilities.filter((v) => v.severity === "High").length,
      Medium: vulnerabilities.filter((v) => v.severity === "Medium").length,
      Low: vulnerabilities.filter((v) => v.severity === "Low").length,
      Info: vulnerabilities.filter((v) => v.severity === "Info").length
    },
    byType: {}
  };
  vulnerabilities.forEach((vuln) => {
    const type = vuln.id.split("-")[0];
    analysis.byType[type] = (analysis.byType[type] || 0) + 1;
  });
  return analysis;
}
function calculateVulnerabilityScore(vulnerabilities, analysis) {
  let score = 100;
  score -= analysis.bySeverity.High * 25;
  score -= analysis.bySeverity.Medium * 15;
  score -= analysis.bySeverity.Low * 5;
  if (analysis.bySeverity.High === 0) score += 10;
  return Math.max(0, Math.min(100, score));
}
function generateVulnerabilityRecommendations(vulnerabilities, analysis) {
  const recommendations = [];
  if (analysis.bySeverity.High > 0) {
    recommendations.push("Corriger imm\xE9diatement les vuln\xE9rabilit\xE9s critiques (High)");
  }
  if (analysis.bySeverity.Medium > 0) {
    recommendations.push("Traiter les vuln\xE9rabilit\xE9s moyennes (Medium) dans les plus brefs d\xE9lais");
  }
  if (analysis.byType.xss > 0) {
    recommendations.push("Impl\xE9menter une validation et un \xE9chappement strict des entr\xE9es utilisateur");
  }
  if (analysis.byType["error-info-disclosure"] > 0) {
    recommendations.push("Configurer des pages d'erreur personnalis\xE9es sans informations techniques");
  }
  if (analysis.byType["missing-csp"] > 0) {
    recommendations.push("Impl\xE9menter une Content Security Policy stricte");
  }
  if (analysis.byType["sensitive-file-exposure"] > 0) {
    recommendations.push("Restreindre l'acc\xE8s aux fichiers sensibles et de configuration");
  }
  if (vulnerabilities.length === 0) {
    recommendations.push("Aucune vuln\xE9rabilit\xE9 d\xE9tect\xE9e - maintenir ce niveau de s\xE9curit\xE9");
  }
  return recommendations;
}

export { securityVulnerabilities_post as default };
//# sourceMappingURL=security-vulnerabilities.post.mjs.map
