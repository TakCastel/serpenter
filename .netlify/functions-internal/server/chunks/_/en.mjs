var welcome = "Welcome";
var app = {
	store: {
		metadata: {
			title: "App Store Metadata",
			description: "Complete and optimized metadata",
			explication: "Your app's metadata in the App Store is crucial for visibility and downloads. It must be complete and optimized.",
			commentFaire: {
				item1: "Fill in all required fields",
				item2: "Add relevant keywords",
				item3: "Write engaging description",
				item4: "Optimize app title"
			},
			bonnesPratiques: {
				item1: "Short and memorable title",
				item2: "Keywords in title",
				item3: "Clear and concise description",
				item4: "Regular updates",
				item5: "A/B testing of elements"
			}
		},
		screenshots: {
			title: "Optimized Screenshots",
			description: "Quality screenshots for App Store",
			explication: "Screenshots are often the first element users see. They must present your app in an attractive and professional manner.",
			commentFaire: {
				item1: "Create quality screenshots",
				item2: "Add explanatory text",
				item3: "Optimize for different sizes",
				item4: "Test on different devices"
			},
			bonnesPratiques: {
				item1: "Sharp and colorful screenshots",
				item2: "Short and readable text",
				item3: "Visual consistency",
				item4: "Respect Apple guidelines",
				item5: "Update with new features"
			}
		},
		appIcon: {
			title: "App Icon",
			description: "Distinctive and memorable icon",
			explication: "Your app's icon is the main visual element that represents your brand in the App Store and on users' home screens.",
			commentFaire: {
				item1: "Create distinctive icon",
				item2: "Respect Apple guidelines",
				item3: "Test on different backgrounds",
				item4: "Optimize for readability"
			},
			bonnesPratiques: {
				item1: "Simple and memorable design",
				item2: "Contrasting colors",
				item3: "No text in icon",
				item4: "Consistency with identity",
				item5: "Test on different devices"
			}
		},
		privacy: {
			title: "Privacy Policy",
			description: "Compliant privacy policy",
			explication: "Apple requires a clear privacy policy for all App Store apps. It must explain data collection and usage.",
			commentFaire: {
				item1: "Write clear policy",
				item2: "Include all data types",
				item3: "Explain usage",
				item4: "Make it accessible"
			},
			bonnesPratiques: {
				item1: "Simple and understandable language",
				item2: "Regular updates",
				item3: "Accessible from app",
				item4: "Compliance with local laws",
				item5: "Contact for questions"
			}
		},
		contentRating: {
			title: "Content Rating",
			description: "Appropriate content classification",
			explication: "Content classification in the App Store determines appropriate age and helps parents make informed choices.",
			commentFaire: {
				item1: "Answer questions honestly",
				item2: "Test with different ages",
				item3: "Update if necessary",
				item4: "Respect Apple guidelines"
			},
			bonnesPratiques: {
				item1: "Honest content evaluation",
				item2: "Update with changes",
				item3: "Respect Apple guidelines",
				item4: "Test with target audience",
				item5: "Document choices"
			}
		},
		testflight: {
			title: "TestFlight Configured",
			description: "TestFlight configuration for testing",
			explication: "TestFlight allows you to test your app with real users before publication. Proper configuration is essential for effective testing.",
			commentFaire: {
				item1: "Configure TestFlight",
				item2: "Invite testers",
				item3: "Manage test builds",
				item4: "Collect feedback"
			},
			bonnesPratiques: {
				item1: "Test on different devices",
				item2: "Structured tester feedback",
				item3: "Quick bug fixes",
				item4: "Regression testing",
				item5: "Document changes"
			}
		}
	},
	technical: {
		performance: {
			title: "App Performance",
			description: "Performance optimization",
			explication: "Your mobile app's performance is crucial for user experience and retention. A slow app can discourage users.",
			commentFaire: {
				item1: "Optimize launch time",
				item2: "Implement caching",
				item3: "Optimize images",
				item4: "Manage memory efficiently"
			},
			bonnesPratiques: {
				item1: "Launch time < 3 seconds",
				item2: "Smart caching",
				item3: "Image optimization",
				item4: "Memory management",
				item5: "Performance monitoring"
			}
		},
		security: {
			title: "App Security",
			description: "Data protection and code security",
			explication: "Your mobile app's security is essential to protect user data and maintain trust. Vulnerabilities can have serious consequences.",
			commentFaire: {
				item1: "Implement data encryption",
				item2: "Secure network communications",
				item3: "Validate all user inputs",
				item4: "Perform security testing"
			},
			bonnesPratiques: {
				item1: "AES encryption for sensitive data",
				item2: "HTTPS mandatory for APIs",
				item3: "Client and server validation",
				item4: "Regular penetration testing",
				item5: "Security updates"
			}
		},
		accessibility: {
			title: "App Accessibility",
			description: "Compliance with accessibility standards",
			explication: "Your mobile app's accessibility allows all users, including those with disabilities, to use your app effectively.",
			commentFaire: {
				item1: "Implement VoiceOver/TalkBack support",
				item2: "Ensure sufficient contrast",
				item3: "Use appropriate font sizes",
				item4: "Test with accessibility tools"
			},
			bonnesPratiques: {
				item1: "Screen reader support",
				item2: "Minimum 4.5:1 contrast",
				item3: "Configurable font sizes",
				item4: "Keyboard navigation possible",
				item5: "Accessibility user testing"
			}
		},
		localization: {
			title: "App Localization",
			description: "Multi-language support and cultural adaptation",
			explication: "Your mobile app's localization allows you to reach an international audience and improve user experience in different regions.",
			commentFaire: {
				item1: "Identify target languages",
				item2: "Translate all texts",
				item3: "Adapt date/number formats",
				item4: "Test in each language"
			},
			bonnesPratiques: {
				item1: "Support for main languages",
				item2: "Professional translations",
				item3: "Cultural adaptation",
				item4: "Linguistic testing",
				item5: "Translation updates"
			}
		},
		offline: {
			title: "Offline Functionality",
			description: "Offline mode support and synchronization",
			explication: "Offline functionality improves user experience by allowing app use even without internet connection. This is particularly important for retention.",
			commentFaire: {
				item1: "Implement local caching",
				item2: "Manage data synchronization",
				item3: "Indicate connection status",
				item4: "Test in airplane mode"
			},
			bonnesPratiques: {
				item1: "Smart data caching",
				item2: "Automatic synchronization",
				item3: "Network status indicator",
				item4: "Conflict management",
				item5: "Complete offline testing"
			}
		}
	},
	legal: {
		gdpr: {
			title: "GDPR Compliance",
			description: "General Data Protection Regulation compliance",
			explication: "GDPR applies to all apps that collect data from European users. Compliance is mandatory and can have important legal consequences.",
			commentFaire: {
				item1: "Audit data collection",
				item2: "Implement explicit consent",
				item3: "Create deletion process",
				item4: "Document processing"
			},
			bonnesPratiques: {
				item1: "Explicit and revocable consent",
				item2: "Minimize collected data",
				item3: "Right to be forgotten implemented",
				item4: "Breach notification",
				item5: "DPO designated if necessary"
			}
		},
		cookies: {
			title: "Cookie Management",
			description: "Compliant cookie and tracker management",
			explication: "Cookie management in your mobile app must comply with current regulations and clearly inform users of their use.",
			commentFaire: {
				item1: "Implement cookie consent",
				item2: "Inform about usage",
				item3: "Allow deactivation",
				item4: "Document policy"
			},
			bonnesPratiques: {
				item1: "Clear consent banner",
				item2: "Deactivation options",
				item3: "Transparent information",
				item4: "Regular updates",
				item5: "Compliance with local laws"
			}
		},
		terms: {
			title: "Terms of Use",
			description: "Clear and compliant terms of use",
			explication: "Your mobile app's terms of use must be clear, accessible and compliant with current regulations.",
			commentFaire: {
				item1: "Write clear terms",
				item2: "Include essential clauses",
				item3: "Make them accessible",
				item4: "Update if necessary"
			},
			bonnesPratiques: {
				item1: "Simple and understandable language",
				item2: "Essential clauses included",
				item3: "Accessible from app",
				item4: "Update when changes occur",
				item5: "Legal validation"
			}
		}
	}
};
var home = {
	hero: {
		subtitleMain: "The complete checklist to verify your site before deployment",
		subtitleAccent: "Check, validate, deploy with peace of mind!",
		cta: "Start now"
	},
	features: {
		header: "Over 200 organized checks",
		subtitle1: {
			before: "A complete checklist to verify your site",
			em: "before",
			after: "deployment."
		},
		subtitle2: "Because prevention is better than cure!",
		title: "More than 200 checkpoints organized by categories."
	},
	cards: {
		checklist: {
			title: "Guided checklist system",
			desc: "Category-based flow with clear items and saved checks.",
			items: [
				"SEO, Performance, Accessibility, Security categories",
				"Built-in explanations and best practices",
				"Tracked and saved progression"
			]
		},
		lighthouse: {
			title: "Built-in Lighthouse audit",
			desc: "Analyze a URL on mobile/desktop directly in the app.",
			items: [
				"Performance, SEO, Best Practices, Accessibility scores",
				"Key metrics: LCP, INP, CLS, TTFB",
				"Advanced options (HTTP Basic)"
			]
		},
		projects: {
			title: "Multi-projects",
			desc: "Manage multiple projects and switch in one click.",
			items: [
				"Isolated progress per project",
				"Database/Cloud backup",
				"Quick project switching"
			]
		}
	},
	story: {
		whyChip: "Why Serpenter?",
		title: "A complete solution for all web professionals",
		subtitle: "Avoid forgetfulness before deployment with a clear checklist, built-in audit and multi-project management.",
		problemTitle: "The problem",
		p1: {
			before: "How many times have you deployed a site wondering if you forgot anything?",
			listEm: "SEO, performance, accessibility, security",
			afterBefore: "... The list is long and the",
			stakesEm: "stakes are high"
		},
		p2: {
			before: "A mistake can be costly:",
			item1: "Google rankings",
			item2: "degraded user experience",
			item3: "security issues",
			connector: "or even",
			item4: "fines for non-compliance"
		},
		p3: {
			before: "And whether working",
			em1: "alone or in a team",
			middle: ", it's easy to miss",
			em2: "critical points",
			after: "that can make the difference between a site that performs and one that disappoints."
		},
		solutionTitle: "The solution",
		s1: {
			before: "Serpenter is an",
			em1: "exhaustive and intelligent checklist",
			middle: "that guides you step by step in verifying your site",
			em2: "before deployment"
		},
		s2: {
			before: "For all web professionals: Whether you're a",
			em1: "freelancer, team developer, or QA tester",
			middle: ", Serpenter ensures you deliver impeccable work,",
			em2: "standardizes your validation processes",
			afterBefore: "and gives you a",
			em3: "solid foundation",
			after: "for your tests. Leave nothing to chance in your verifications."
		}
	},
	cta: {
		title: "Ready to check your site?",
		subtitle: "Join thousands of developers who never deploy without verifying!",
		button: "Start now"
	}
};
var projects = {
	selectProject: "Select a project",
	name: "Project name",
	namePlaceholder: "Enter your project name",
	description: "Description",
	descriptionPlaceholder: "Optional project description",
	createNew: "Create a new project",
	create: "Create",
	createTitle: "Create a new project",
	deleteCurrent: "Delete current project",
	"delete": "Delete",
	deleteTitle: "Delete project",
	deleteConfirm: "Are you sure you want to delete the project \"{name}\"? This action cannot be undone.",
	projectList: "Project list"
};
var emptyState = {
	title: "No projects found",
	description: "Create your first project to start using the checklist",
	createButton: "Create a project"
};
var sidebar = {
	welcome: "Welcome",
	createProjectMessage: "Create your first project to get started"
};
var common = {
	goToCategory: "Go to category {name}",
	openCategory: "Open category {name}",
	closeCategory: "Close category {name}",
	item: "Item {label}",
	cancel: "Cancel",
	reset: "Reset",
	resetConfirm: "Are you sure you want to reset all progress? This action cannot be undone.",
	resetTitle: "Reset all progress",
	resetDescription: "Reset all checklist progress",
	completed: "completed",
	language: {
		select: "Select language",
		french: "French",
		english: "English"
	}
};
var modal = {
	close: "Close"
};
var categories = {
	seo: {
		name: "SEO",
		description: "Search engine optimization"
	},
	accessibilite: {
		name: "Accessibility",
		description: "Make the site accessible to everyone"
	},
	performance: {
		name: "Performance",
		description: "Speed and optimization"
	},
	"eco-conception": {
		name: "Eco-design",
		description: "Reduce environmental impact"
	},
	"responsive-ux": {
		name: "Responsive & UX",
		description: "Multi-device user experience"
	},
	securite: {
		name: "Security",
		description: "Protection and best practices"
	},
	analytics: {
		name: "Analytics",
		description: "Performance tracking and analysis"
	},
	"reseau-chiffrement": {
		name: "Network Security & Encryption",
		description: "Communication protection and data encryption"
	},
	"authentification-acces": {
		name: "Authentication & Access Control",
		description: "Secure credential management and permissions"
	},
	"protection-attaques": {
		name: "Attack Protection",
		description: "Defense against common threats and vulnerabilities"
	},
	"fichiers-donnees": {
		name: "File & Data Security",
		description: "Sensitive data protection and upload validation"
	},
	"maintenance-surveillance": {
		name: "Maintenance & Monitoring",
		description: "Continuous monitoring and preventive maintenance"
	},
	"app-store": {
		name: "App Store",
		description: "Checklist for App Store submission"
	},
	"play-store": {
		name: "Play Store",
		description: "Checklist for Play Store submission"
	},
	technical: {
		name: "Technical Aspects",
		description: "Technical checklist for mobile applications"
	},
	legal: {
		name: "Legal Aspects",
		description: "Legal and regulatory checklist"
	}
};
var items = {
	details: {
		noDetails: "No details available for this item",
		explication: "Explanation",
		exemple: "Example",
		bonnesPratiques: "Best practices",
		ressources: "Resources",
		conseils: "Tips"
	},
	accordion: {
		open: "Open",
		close: "Close",
		openDetails: "Open details",
		closeDetails: "Close details",
		check: "Check",
		uncheck: "Uncheck"
	},
	seo: {
		titleTag: {
			label: "&lt;title&gt; tag present and optimized",
			description: "Unique and relevant title with keywords",
			explication: "The title tag is one of the most important elements for SEO. It appears in the browser tab and in search results. It must be unique for each page and contain the main keywords naturally.",
			commentFaire: {
				item1: "Right-click on your page -> 'View page source' -> Look for the &lt;title&gt; tag",
				item2: "Use Chrome extension 'SEO Meta in 1 Click' to analyze your titles",
				item3: "Test with Google Search Console tool to see appearance in SERPs",
				item4: "Check length with online tool 'Title Tag Length Checker'"
			},
			bonnesPratiques: {
				item1: "Length between 50 and 60 characters (visible in SERPs)",
				item2: "Include main keyword at the beginning of the title",
				item3: "Unique for each page of the site",
				item4: "Descriptive and attractive to encourage clicks",
				item5: "Include brand name at the end"
			}
		},
		metaDescription: {
			label: "&lt;meta name=\"description\"&gt; tag filled",
			description: "Attractive summary related to content",
			explication: "The meta description appears in search results under the title. It must be descriptive, attractive and contain the main keywords to encourage clicks.",
			commentFaire: {
				item1: "Inspect your page (F12) -> Look for &lt;meta name=\"description\"&gt; tag",
				item2: "Use Google Search Console tool to see appearance in SERPs",
				item3: "Test with 'SEO Meta in 1 Click' extension",
				item4: "Check length with 'Meta Description Length Checker'"
			},
			bonnesPratiques: {
				item1: "Length between 150 and 160 characters (visible in SERPs)",
				item2: "Include main keyword naturally",
				item3: "Unique for each page of the site",
				item4: "Descriptive and attractive to encourage clicks",
				item5: "Avoid special characters that can be truncated"
			}
		},
		singleH1: {
			label: "Single &lt;h1&gt; tag per page",
			description: "Clear structure of main content",
			explication: "Each page should have a single H1 tag that represents the main title of the page. This helps search engines understand the content hierarchy.",
			commentFaire: {
				item1: "Inspect your page with F12",
				item2: "Search for all &lt;h1&gt; tags",
				item3: "Check that there is only one",
				item4: "Use 'axe DevTools' extension to verify"
			},
			bonnesPratiques: {
				item1: "Single H1 tag per page",
				item2: "Descriptive and relevant H1",
				item3: "Include main keywords",
				item4: "Consistent with title tag",
				item5: "Represent main content"
			}
		},
		headingsStructure: {
			label: "Logical heading structure (H1 > H2 > H3)",
			description: "No level skipping",
			explication: "A clear heading structure helps search engines understand content and improves accessibility.",
			commentFaire: {
				item1: "Check that there is only one H1 per page",
				item2: "Use headings in logical order (H1 > H2 > H3)",
				item3: "Include keywords in headings",
				item4: "Test with 'HeadingMap' tool"
			},
			bonnesPratiques: {
				item1: "Single H1 per page",
				item2: "Logical hierarchical structure",
				item3: "Keywords in headings",
				item4: "Descriptive and informative",
				item5: "No level skipping (H1 > H3)"
			}
		},
		cleanUrls: {
			label: "Readable and short URL",
			description: "Ex: /services/seo instead of ?id=24",
			explication: "Clean and descriptive URLs improve SEO and user experience. They should be short, readable and contain relevant keywords.",
			commentFaire: {
				item1: "Check your URL structure",
				item2: "Use keywords in URLs",
				item3: "Avoid unnecessary parameters",
				item4: "Test with SEO tools"
			},
			bonnesPratiques: {
				item1: "Short and descriptive URLs",
				item2: "Include relevant keywords",
				item3: "Avoid special characters",
				item4: "Logical and consistent structure",
				item5: "Easy to remember"
			}
		},
		altText: {
			label: "Alt text on all images",
			description: "For image SEO and accessibility",
			explication: "Alt text allows screen readers to describe images to visually impaired users and improves image SEO.",
			commentFaire: {
				item1: "Inspect your images with F12",
				item2: "Check that each image has an alt attribute",
				item3: "Use 'Web Developer' extension",
				item4: "Test with a screen reader"
			},
			bonnesPratiques: {
				item1: "Descriptive and informative",
				item2: "Avoid 'image of', 'photo of'",
				item3: "For decorative images, use alt=\"\"",
				item4: "Include context if necessary",
				item5: "Appropriate length"
			}
		},
		internalLinks: {
			label: "Internal links present",
			description: "Contextual navigation",
			explication: "Internal links help distribute PageRank and improve navigation. They should be relevant and use descriptive anchors.",
			commentFaire: {
				item1: "Create links to important pages",
				item2: "Use descriptive anchors",
				item3: "Avoid broken links",
				item4: "Test links regularly"
			},
			bonnesPratiques: {
				item1: "Descriptive and natural anchors",
				item2: "Link to relevant pages",
				item3: "Avoid broken links",
				item4: "Distribute evenly",
				item5: "Use keywords in anchors"
			}
		},
		canonical: {
			label: "Canonical tag present",
			description: "To avoid duplicate content",
			explication: "The canonical tag tells search engines which is the main version of a page. It avoids duplicate content issues and improves SEO.",
			commentFaire: {
				item1: "Inspect your page (F12) -> Look for &lt;link rel=\"canonical\"&gt;",
				item2: "Check that canonical URL points to correct page",
				item3: "Use Google Search Console tool to detect errors",
				item4: "Test with 'SEO Meta in 1 Click' extension"
			},
			bonnesPratiques: {
				item1: "Absolute canonical URL (with https://)",
				item2: "Single canonical tag per page",
				item3: "Canonical URL different from current URL if needed",
				item4: "Consistent with site structure",
				item5: "No redirect in canonical URL"
			}
		},
		sitemapXml: {
			label: "XML sitemap present and valid",
			description: "Helps search engines discover your pages",
			explication: "The XML sitemap lists all URLs of your site to facilitate indexing by search engines.",
			commentFaire: {
				item1: "Generate sitemap with online tools",
				item2: "Submit to Google Search Console",
				item3: "Add link in robots.txt",
				item4: "Update regularly"
			},
			bonnesPratiques: {
				item1: "Include all important pages",
				item2: "Update after each modification",
				item3: "Submit to Google and Bing",
				item4: "Check errors in Search Console",
				item5: "Limit to 50,000 URLs per sitemap"
			}
		},
		robotsTxt: {
			label: "robots.txt file configured",
			description: "Guide indexing robots",
			explication: "The robots.txt file tells search engines which pages can be indexed.",
			commentFaire: {
				item1: "Create robots.txt file at root",
				item2: "Add User-agent and Disallow directives",
				item3: "Include link to your sitemap",
				item4: "Test with Google Search Console"
			},
			bonnesPratiques: {
				item1: "Place at site root",
				item2: "Include link to sitemap",
				item3: "Protect sensitive pages",
				item4: "Test syntax",
				item5: "Check errors in Search Console"
			}
		},
		schemaOrg: {
			label: "Structured data (Schema.org)",
			description: "Improves visibility in SERPs",
			explication: "Structured data helps search engines understand your site content and can improve display in search results.",
			commentFaire: {
				item1: "Identify main content type",
				item2: "Use Schema.org generator",
				item3: "Test with Google Rich Results Test",
				item4: "Implement progressively"
			},
			bonnesPratiques: {
				item1: "Choose appropriate schema type",
				item2: "Accurate and up-to-date data",
				item3: "Test with Google tools",
				item4: "Implement progressively",
				item5: "Monitor errors"
			}
		},
		breadcrumbs: {
			label: "Breadcrumbs present",
			description: "Navigation and local SEO",
			explication: "Breadcrumbs improve user navigation and can improve local SEO by showing site structure.",
			commentFaire: {
				item1: "Add breadcrumbs to your template",
				item2: "Use structured data",
				item3: "Test navigation",
				item4: "Check mobile display"
			},
			bonnesPratiques: {
				item1: "Clear and logical navigation",
				item2: "Functional links",
				item3: "Responsive display",
				item4: "Consistent with structure",
				item5: "Keyboard accessible"
			}
		}
	},
	accessibilite: {
		altText: {
			label: "Alt text present on images",
			description: "Text descriptions for screen readers",
			explication: "Alt text allows screen readers to describe images to visually impaired users. It must be descriptive and relevant to understand the image content.",
			commentFaire: {
				item1: "Inspect your images with F12 -> Look for alt attribute",
				item2: "Use Chrome extension 'Web Developer' to check alt texts",
				item3: "Test with a screen reader like NVDA or JAWS",
				item4: "Check with online tool 'WAVE Web Accessibility Evaluator'"
			},
			bonnesPratiques: {
				item1: "Descriptive and informative to understand the image",
				item2: "Avoid 'image of', 'photo of' - be direct",
				item3: "For decorative images, use alt=\"\"",
				item4: "Include context if image is part of a link",
				item5: "Appropriate length (not too short, not too long)"
			}
		},
		contrastRatio: {
			label: "Sufficient contrast ratios (WCAG AA minimum)",
			description: "Readable text on dark or light background",
			explication: "Contrast ratio measures the brightness difference between text and background. A 4.5:1 minimum ratio ensures readability for visually impaired users.",
			commentFaire: {
				item1: "Use online tool 'WebAIM Contrast Checker'",
				item2: "Test with Chrome extension 'Color Contrast Analyzer'",
				item3: "Check with 'WAVE Web Accessibility Evaluator' tool",
				item4: "Use 'axe DevTools' extension for automatic analysis"
			},
			bonnesPratiques: {
				item1: "4.5:1 minimum ratio for normal text",
				item2: "3:1 minimum ratio for large text (18px+)",
				item3: "Avoid red/green combinations for colorblind users",
				item4: "Test with different types of colorblindness",
				item5: "Consider variable lighting conditions"
			}
		},
		semanticHtml: {
			label: "Semantic HTML used",
			description: "Logical structure with proper tags",
			explication: "Semantic HTML uses the right tags to describe content (header, nav, main, article, section, footer). This improves accessibility and SEO.",
			commentFaire: {
				item1: "Inspect your source code with F12",
				item2: "Check for presence of header, nav, main, footer",
				item3: "Use 'axe DevTools' extension for analysis",
				item4: "Test with 'WAVE Web Accessibility Evaluator' tool"
			},
			bonnesPratiques: {
				item1: "Use header for site header",
				item2: "Use nav for main navigation",
				item3: "Use main for main content",
				item4: "Use article for standalone content",
				item5: "Use footer for footer"
			}
		},
		keyboardNavigation: {
			label: "Functional keyboard navigation",
			description: "Visible focus, consistent tabindex",
			explication: "Keyboard navigation is essential for users who cannot use a mouse. All interactive elements must be accessible via Tab, Enter and Space.",
			commentFaire: {
				item1: "Test with Tab to navigate between elements",
				item2: "Check that all links and buttons are focusable",
				item3: "Test with Enter and Space to activate",
				item4: "Use 'axe DevTools' extension to verify"
			},
			bonnesPratiques: {
				item1: "Logical tab order",
				item2: "All interactive elements focusable",
				item3: "No trapped focus elements",
				item4: "Consistent keyboard shortcuts",
				item5: "Test without mouse"
			}
		},
		focusIndicators: {
			label: "Visible focus indicators",
			description: "Clear visual feedback for keyboard navigation",
			explication: "Focus indicators allow users to know which element is currently selected during keyboard navigation.",
			commentFaire: {
				item1: "Test with Tab to see indicators",
				item2: "Check that focus is visible on all elements",
				item3: "Use outline or border for focus",
				item4: "Test with different browsers"
			},
			bonnesPratiques: {
				item1: "Visible and contrasted focus indicator",
				item2: "Consistency across the site",
				item3: "Don't remove default outline",
				item4: "Test with different themes",
				item5: "Respect user preferences"
			}
		},
		formLabels: {
			label: "Explicit labels for form fields",
			description: "Ex: &lt;label for=\"email\"&gt;Email&lt;/label&gt;",
			explication: "Form labels help users understand what is expected in each field. They are essential for accessibility and user experience.",
			commentFaire: {
				item1: "Check that each field has a label",
				item2: "Use for attribute to associate label and input",
				item3: "Test with a screen reader",
				item4: "Check with 'WAVE' tool"
			},
			bonnesPratiques: {
				item1: "Descriptive and clear labels",
				item2: "Correct association with for attribute",
				item3: "Logical label placement",
				item4: "Indication of required fields",
				item5: "Associated error messages"
			}
		},
		ariaAttributes: {
			label: "Appropriate ARIA attributes",
			description: "Roles, labels and states for complex elements",
			explication: "ARIA (Accessible Rich Internet Applications) attributes help make complex elements accessible to assistive technologies.",
			commentFaire: {
				item1: "Identify complex elements",
				item2: "Use appropriate ARIA roles",
				item3: "Add necessary labels and states",
				item4: "Test with a screen reader"
			},
			bonnesPratiques: {
				item1: "Use appropriate ARIA roles",
				item2: "Descriptive and clear labels",
				item3: "Up-to-date and consistent states",
				item4: "Avoid redundancy",
				item5: "Test with assistive technologies"
			}
		},
		skipLinks: {
			label: "Skip links present",
			description: "Links to skip navigation and go to content",
			explication: "Skip links allow keyboard users to jump directly to main content, improving navigation experience.",
			commentFaire: {
				item1: "Add skip links at the beginning of the page",
				item2: "Place them first in tab order",
				item3: "Make them visible on focus",
				item4: "Test with keyboard navigation"
			},
			bonnesPratiques: {
				item1: "Visible links on focus",
				item2: "Placement at page beginning",
				item3: "Descriptive and clear text",
				item4: "Target main content",
				item5: "Test with different browsers"
			}
		},
		errorMessages: {
			label: "Accessible error messages",
			description: "Clear and accessible error feedback",
			explication: "Error messages must be clear, informative and accessible to assistive technologies to help all users correct their errors.",
			commentFaire: {
				item1: "Test messages with a screen reader",
				item2: "Check that errors are announced",
				item3: "Use aria-describedby to associate messages",
				item4: "Test with different browsers"
			},
			bonnesPratiques: {
				item1: "Clear and constructive messages",
				item2: "Association with concerned fields",
				item3: "Automatic announcement by screen readers",
				item4: "Color AND text for errors",
				item5: "Correction suggestions"
			}
		},
		colorBlindness: {
			label: "Test with different types of colorblindness",
			description: "Check readability for colorblind users",
			explication: "Colorblind users have difficulty distinguishing certain colors. It is important not to use color alone to convey information.",
			commentFaire: {
				item1: "Use colorblindness simulation tools",
				item2: "Test with color filters",
				item3: "Check that information doesn't depend only on color",
				item4: "Use icons AND colors"
			},
			bonnesPratiques: {
				item1: "Don't use color alone",
				item2: "Sufficient contrast for all types",
				item3: "Use icons and text",
				item4: "Avoid red/green for errors/success",
				item5: "Test with different types of colorblindness"
			}
		},
		reducedMotion: {
			label: "Respect reduced motion preferences",
			description: "media query prefers-reduced-motion",
			explication: "Some users are sensitive to animations and movements. It is important to respect their preferences to avoid health issues.",
			commentFaire: {
				item1: "Use prefers-reduced-motion media query",
				item2: "Disable non-essential animations",
				item3: "Test with preferences enabled",
				item4: "Check in system settings"
			},
			bonnesPratiques: {
				item1: "Respect user preferences",
				item2: "Disable non-essential animations",
				item3: "Maintain functionality",
				item4: "Test with different browsers",
				item5: "Document changes"
			}
		},
		screenReader: {
			label: "Test with a screen reader",
			description: "Check experience with NVDA, JAWS, VoiceOver",
			explication: "Screen readers are assistive technologies used by visually impaired people. Testing with these tools ensures accessibility.",
			commentFaire: {
				item1: "Install a screen reader (NVDA free)",
				item2: "Test complete navigation",
				item3: "Check element announcements",
				item4: "Test with different readers"
			},
			bonnesPratiques: {
				item1: "Logical and consistent navigation",
				item2: "Clear element announcements",
				item3: "Avoid decorative elements",
				item4: "Test regularly",
				item5: "Train team on accessibility"
			}
		},
		fontSize: {
			label: "Sufficient font size",
			description: "Readable text without zoom (16px minimum)",
			explication: "A sufficient font size improves readability for all users, especially for visually impaired people.",
			commentFaire: {
				item1: "Check font size in developer tools",
				item2: "Test with different screen sizes",
				item3: "Use relative units (rem, em)",
				item4: "Test browser zoom"
			},
			bonnesPratiques: {
				item1: "16px minimum base size",
				item2: "Use relative units",
				item3: "Respect user preferences",
				item4: "Clear size hierarchy",
				item5: "Test with 200% zoom"
			}
		}
	},
	performance: {
		lazyLoading: {
			label: "Lazy loading images",
			description: "loading=\"lazy\" attribute on images",
			explication: "Lazy loading allows images to load only when needed, improving page loading performance.",
			commentFaire: {
				item1: "Add loading=\"lazy\" to images",
				item2: "Use explicit dimensions",
				item3: "Test with developer tools",
				item4: "Check mobile behavior"
			},
			bonnesPratiques: {
				item1: "Use loading=\"lazy\" for images",
				item2: "Define image dimensions",
				item3: "Avoid lazy loading for above the fold images",
				item4: "Test on different browsers",
				item5: "Monitor performance"
			}
		},
		imageOptimization: {
			label: "Optimized image size",
			description: "No 4K for an icon",
			explication: "Image optimization reduces loading time and improves performance. Use modern formats like WebP and appropriate compression.",
			commentFaire: {
				item1: "Use online tools like TinyPNG or Squoosh",
				item2: "Convert to WebP format for better compression",
				item3: "Implement lazy loading with loading=\"lazy\"",
				item4: "Use responsive images with srcset"
			},
			bonnesPratiques: {
				item1: "Compress images before upload",
				item2: "Use WebP format when possible",
				item3: "Implement lazy loading",
				item4: "Provide responsive images",
				item5: "Optimize images for web"
			}
		},
		modernFormats: {
			label: "Use of modern formats (WebP, AVIF)",
			description: "Lighter than JPEG/PNG",
			explication: "Modern formats like WebP and AVIF offer better compression than JPEG and PNG, reducing file size and improving performance.",
			commentFaire: {
				item1: "Convert your images to WebP",
				item2: "Use tools like Squoosh or ImageOptim",
				item3: "Implement fallback for older browsers",
				item4: "Test compatibility"
			},
			bonnesPratiques: {
				item1: "Use WebP as primary format",
				item2: "Provide fallbacks for compatibility",
				item3: "Test on different browsers",
				item4: "Monitor performance",
				item5: "Maintain quality"
			}
		},
		minification: {
			label: "CSS and JS minified",
			description: "Compressed files",
			explication: "Minification removes spaces, comments and unnecessary characters from CSS and JavaScript files to reduce their size.",
			commentFaire: {
				item1: "Use tools like UglifyJS for JavaScript",
				item2: "Use tools like CSSNano for CSS",
				item3: "Configure your build process to minify automatically",
				item4: "Check file size before/after"
			},
			bonnesPratiques: {
				item1: "Minify all CSS and JS files",
				item2: "Keep source files unminified",
				item3: "Use automated tools",
				item4: "Test after minification",
				item5: "Monitor file sizes"
			}
		},
		gzipCompression: {
			label: "GZIP compression enabled",
			description: "70% reduction in file size",
			explication: "GZIP compression significantly reduces the size of transmitted files, improving loading times and reducing bandwidth usage.",
			commentFaire: {
				item1: "Configure GZIP on your server",
				item2: "Check with developer tools",
				item3: "Test with online tools",
				item4: "Monitor performance"
			},
			bonnesPratiques: {
				item1: "Enable GZIP for all text files",
				item2: "Configure appropriate MIME types",
				item3: "Test regularly",
				item4: "Monitor compression",
				item5: "Maintain configuration"
			}
		},
		browserCache: {
			label: "Browser cache configured",
			description: "Reduced repeated requests",
			explication: "Browser cache allows browsers to store static resources locally, reducing server requests and improving performance.",
			commentFaire: {
				item1: "Configure Expires or Cache-Control headers",
				item2: "Use hashed filenames for invalidation",
				item3: "Test with browser developer tools",
				item4: "Check response headers"
			},
			bonnesPratiques: {
				item1: "Long cache for static resources",
				item2: "Short cache for dynamic content",
				item3: "Use hashed filenames",
				item4: "Configure cache invalidation",
				item5: "Test cache regularly"
			}
		},
		criticalCss: {
			label: "Critical CSS inlined",
			description: "Faster initial rendering",
			explication: "Critical CSS is the CSS needed for initial page rendering. Inlining this CSS improves performance by avoiding blocking requests.",
			commentFaire: {
				item1: "Identify critical CSS",
				item2: "Use tools like Critical",
				item3: "Inline critical CSS in head",
				item4: "Load non-critical CSS asynchronously"
			},
			bonnesPratiques: {
				item1: "Inline only critical CSS",
				item2: "Load non-critical CSS asynchronously",
				item3: "Maintain separation of concerns",
				item4: "Test regularly",
				item5: "Monitor performance"
			}
		}
	},
	ecoConception: {
		reducedRequests: {
			label: "Reduced number of requests",
			description: "Less unnecessary external JS/CSS",
			explication: "Reducing the number of HTTP requests improves performance and reduces environmental impact by decreasing energy consumption.",
			commentFaire: {
				item1: "Combine CSS and JS files",
				item2: "Use sprites for images",
				item3: "Avoid unnecessary third-party scripts",
				item4: "Optimize resource loading"
			},
			bonnesPratiques: {
				item1: "Combine files when possible",
				item2: "Avoid unnecessary third-party scripts",
				item3: "Use sprites for icons",
				item4: "Optimize loading",
				item5: "Monitor number of requests"
			}
		},
		pageWeight: {
			label: "Page weight under 1 MB",
			description: "Good environmental practice",
			explication: "A reduced page weight improves performance and reduces environmental impact by decreasing energy and bandwidth consumption.",
			commentFaire: {
				item1: "Optimize images",
				item2: "Minify CSS and JS files",
				item3: "Use GZIP compression",
				item4: "Monitor total size"
			},
			bonnesPratiques: {
				item1: "Maintain weight under 1 MB",
				item2: "Optimize regularly",
				item3: "Monitor trends",
				item4: "Test on different devices",
				item5: "Document optimizations"
			}
		},
		noUnnecessaryTracking: {
			label: "No unnecessary tracking",
			description: "Avoid non-essential third-party scripts",
			explication: "Third-party tracking scripts can slow down the site and consume unnecessary resources. It's important to only use those that are really necessary.",
			commentFaire: {
				item1: "Audit all third-party scripts",
				item2: "Remove unnecessary scripts",
				item3: "Load scripts asynchronously",
				item4: "Test impact on performance"
			},
			bonnesPratiques: {
				item1: "Use only necessary scripts",
				item2: "Load asynchronously",
				item3: "Audit regularly",
				item4: "Test impact",
				item5: "Document choices"
			}
		},
		systemFonts: {
			label: "Use of system fonts or local hosting",
			description: "Fewer external requests",
			explication: "Using system fonts or hosting fonts locally reduces external requests and improves performance.",
			commentFaire: {
				item1: "Use system fonts",
				item2: "Host fonts locally",
				item3: "Avoid Google Fonts when possible",
				item4: "Optimize font loading"
			},
			bonnesPratiques: {
				item1: "Prioritize system fonts",
				item2: "Host locally if necessary",
				item3: "Optimize loading",
				item4: "Test compatibility",
				item5: "Monitor performance"
			}
		}
	},
	responsiveUx: {
		responsiveDesign: {
			label: "Responsive design (mobile → desktop)",
			description: "Optimized display for all screen sizes",
			explication: "Responsive design allows your site to automatically adapt to all screen sizes, providing an optimal user experience on all devices.",
			commentFaire: {
				item1: "Use media queries",
				item2: "Test on different devices",
				item3: "Check breakpoints",
				item4: "Optimize for mobile-first"
			},
			bonnesPratiques: {
				item1: "Mobile-first approach",
				item2: "Logical breakpoints",
				item3: "Test on real devices",
				item4: "Optimized performance",
				item5: "Consistent experience"
			}
		},
		touchTargets: {
			label: "Appropriate button size (min. 44 px)",
			description: "Easy to click on mobile",
			explication: "Touch targets must be large enough to be easily usable on touch devices.",
			commentFaire: {
				item1: "Measure your buttons and links",
				item2: "Use min-width and min-height in CSS",
				item3: "Test on touch devices",
				item4: "Check spacing between elements"
			},
			bonnesPratiques: {
				item1: "Minimum 44x44px for buttons",
				item2: "Sufficient spacing between elements",
				item3: "Test on different devices",
				item4: "Consider fingers",
				item5: "Avoid elements too small"
			}
		},
		noHorizontalScroll: {
			label: "No overflowing elements / horizontal scroll",
			description: "Especially on mobile",
			explication: "Horizontal scrolling on mobile is a poor user experience. All elements must adapt to screen width.",
			commentFaire: {
				item1: "Use relative units (%, vw, rem)",
				item2: "Avoid fixed widths",
				item3: "Test on different screens",
				item4: "Check images and tables"
			},
			bonnesPratiques: {
				item1: "Use relative units",
				item2: "Avoid fixed widths",
				item3: "Test on different screens",
				item4: "Optimize images",
				item5: "Check tables"
			}
		},
		perceivedSpeed: {
			label: "Fast perceived loading speed",
			description: "Skeletons, smooth transitions",
			explication: "Perceived speed is more important than actual speed. Use techniques like skeletons and smooth transitions to improve experience.",
			commentFaire: {
				item1: "Add skeletons for loading",
				item2: "Use smooth transitions",
				item3: "Optimize images",
				item4: "Test user experience"
			},
			bonnesPratiques: {
				item1: "Use skeletons",
				item2: "Smooth transitions",
				item3: "Immediate feedback",
				item4: "Optimize images",
				item5: "Test experience"
			}
		}
	},
	securite: {
		https: {
			label: "Site in HTTPS",
			description: "Active SSL certificate",
			explication: "HTTPS encrypts data exchanged between browser and server, protecting user privacy.",
			commentFaire: {
				item1: "Get SSL certificate (Let's Encrypt free)",
				item2: "Configure HTTP to HTTPS redirect",
				item3: "Check with SSL Labs",
				item4: "Test all internal links"
			},
			bonnesPratiques: {
				item1: "Valid SSL certificate",
				item2: "Automatic HTTP to HTTPS redirect",
				item3: "HSTS enabled",
				item4: "Automatically renewed certificate",
				item5: "Test regularly"
			}
		},
		contentSecurityPolicy: {
			label: "Content Security Policy (CSP) configured",
			description: "Protection against XSS attacks",
			explication: "CSP defines authorized sources for resources, protecting against XSS attacks and content injection.",
			commentFaire: {
				item1: "Define authorized sources",
				item2: "Test in report-only mode first",
				item3: "Implement progressively",
				item4: "Monitor violations"
			},
			bonnesPratiques: {
				item1: "Strict default policy",
				item2: "Minimal authorized sources",
				item3: "Report-only mode at first",
				item4: "Violation monitoring",
				item5: "Regular updates"
			}
		},
		rateLimiting: {
			label: "Rate limiting configured",
			description: "Protection against brute force attacks",
			explication: "Rate limiting limits the number of requests a user can make in a certain time period, protecting against brute force attacks.",
			commentFaire: {
				item1: "Configure rate limiting on your server",
				item2: "Define appropriate limits",
				item3: "Test limits",
				item4: "Monitor violations"
			},
			bonnesPratiques: {
				item1: "Appropriate limits per IP",
				item2: "Clear error messages",
				item3: "Monitor violations",
				item4: "Adjust as needed",
				item5: "Document limits"
			}
		},
		fileUploadSecurity: {
			label: "File upload security",
			description: "Validation and restriction of file types",
			explication: "File uploads can be a source of vulnerabilities. It's important to validate and restrict allowed file types.",
			commentFaire: {
				item1: "Validate file types",
				item2: "Limit file size",
				item3: "Scan files for viruses",
				item4: "Store files securely"
			},
			bonnesPratiques: {
				item1: "Strict file type validation",
				item2: "File size limitation",
				item3: "Antivirus scanning",
				item4: "Secure storage",
				item5: "Upload monitoring"
			}
		},
		securityHeaders: {
			label: "Security headers configured",
			description: "CSP, HSTS, X-Frame-Options, etc.",
			explication: "Security headers protect against XSS, clickjacking and other common vulnerabilities.",
			commentFaire: {
				item1: "Configure X-Content-Type-Options",
				item2: "Add X-Frame-Options",
				item3: "Implement X-XSS-Protection",
				item4: "Test with Security Headers"
			},
			bonnesPratiques: {
				item1: "X-Content-Type-Options: nosniff",
				item2: "X-Frame-Options: DENY",
				item3: "X-XSS-Protection: 1; mode=block",
				item4: "Strict-Transport-Security",
				item5: "Test regularly"
			}
		},
		injectionProtection: {
			label: "Basic protection against injection",
			description: "Avoid unfiltered input",
			explication: "Injections (SQL, XSS, etc.) are common vulnerabilities. It's important to validate and filter all user input.",
			commentFaire: {
				item1: "Validate all user input",
				item2: "Use prepared statements",
				item3: "Escape outputs",
				item4: "Test with security tools"
			},
			bonnesPratiques: {
				item1: "Strict input validation",
				item2: "Prepared statements",
				item3: "Output escaping",
				item4: "Regular security testing",
				item5: "Team training"
			}
		}
	},
	analytics: {
		googleAnalytics: {
			label: "Google Analytics configured",
			description: "Performance and behavior tracking",
			explication: "Google Analytics allows tracking traffic, user behaviors and site performance.",
			commentFaire: {
				item1: "Create Google Analytics account",
				item2: "Add tracking code",
				item3: "Configure goals",
				item4: "Test tracking"
			},
			bonnesPratiques: {
				item1: "Code placed in head",
				item2: "Goals configured",
				item3: "Appropriate filters",
				item4: "GDPR compliance",
				item5: "Regular monitoring"
			}
		},
		gdprCompliance: {
			label: "Respect GDPR",
			description: "Consent and privacy policy",
			explication: "GDPR imposes strict obligations regarding personal data protection. It's essential to respect these rules.",
			commentFaire: {
				item1: "Implement consent system",
				item2: "Write privacy policy",
				item3: "Configure cookies",
				item4: "Test compliance"
			},
			bonnesPratiques: {
				item1: "Explicit consent",
				item2: "Clear privacy policy",
				item3: "Cookie management",
				item4: "Right to be forgotten",
				item5: "Team training"
			}
		},
		customEvents: {
			label: "Custom events",
			description: "Tracking important actions",
			explication: "Custom events allow tracking specific actions on your site, such as button clicks or form submissions.",
			commentFaire: {
				item1: "Identify important actions",
				item2: "Configure events",
				item3: "Test tracking",
				item4: "Analyze data"
			},
			bonnesPratiques: {
				item1: "Relevant events",
				item2: "Consistent naming",
				item3: "Regular testing",
				item4: "Data analysis",
				item5: "Continuous optimization"
			}
		}
	}
};
var ios = {
	preparation: {
		bundleId: {
			label: "Bundle ID configured",
			description: "Unique application identifier",
			explication: "The Bundle ID is the unique identifier of your iOS application. It must be consistent between Xcode, App Store Connect and your provisioning profile.",
			commentFaire: {
				item1: "Check Bundle ID in Xcode",
				item2: "Ensure it matches App Store Connect",
				item3: "Verify provisioning profile",
				item4: "Test compilation"
			},
			bonnesPratiques: {
				item1: "Unique and descriptive Bundle ID",
				item2: "Format com.company.app",
				item3: "Consistency between environments",
				item4: "Bundle ID documentation",
				item5: "Version management"
			}
		},
		appIcons: {
			label: "App icons configured",
			description: "All required icon sizes",
			explication: "iOS requires several icon sizes for different contexts (App Store, Spotlight, Settings, etc.). Make sure all required sizes are present.",
			commentFaire: {
				item1: "Generate all icon sizes",
				item2: "Add them to Assets.xcassets",
				item3: "Check icon quality",
				item4: "Test on different devices"
			},
			bonnesPratiques: {
				item1: "High quality vector icons",
				item2: "All required sizes",
				item3: "Visual consistency",
				item4: "Test on real devices",
				item5: "App Store validation"
			}
		},
		testflightBuild: {
			label: "TestFlight build ready",
			description: "Validated test version",
			explication: "Before submitting to the App Store, test your app via TestFlight. This allows you to identify and fix issues before publication.",
			commentFaire: {
				item1: "Create archive in Xcode",
				item2: "Upload to App Store Connect",
				item3: "Configure TestFlight",
				item4: "Invite testers"
			},
			bonnesPratiques: {
				item1: "Complete internal testing",
				item2: "External testing with feedback",
				item3: "Fix critical bugs",
				item4: "Feature validation",
				item5: "App Store preparation"
			}
		}
	},
	conformite: {
		confidentialite: {
			label: "Privacy policy",
			description: "iOS privacy rules compliance",
			explication: "Apple requires a clear and comprehensive privacy policy for all iOS applications. It must explain how you collect, use and protect user data.",
			commentFaire: {
				item1: "Write privacy policy",
				item2: "Add it to App Store Connect",
				item3: "Check compliance",
				item4: "Update regularly"
			},
			bonnesPratiques: {
				item1: "Clear and accessible policy",
				item2: "GDPR and CCPA compliance",
				item3: "Regular updates",
				item4: "Translation in multiple languages",
				item5: "Contact for questions"
			}
		},
		permissions: {
			label: "App permissions",
			description: "Required permissions management",
			explication: "iOS explicitly asks for permission to access sensitive features (camera, location, contacts, etc.). Clearly explain why you need these permissions.",
			commentFaire: {
				item1: "Identify necessary permissions",
				item2: "Add usage descriptions",
				item3: "Test authorization flow",
				item4: "Handle permission denial"
			},
			bonnesPratiques: {
				item1: "Minimal necessary permissions",
				item2: "Clear usage descriptions",
				item3: "Graceful denial handling",
				item4: "Test on real devices",
				item5: "Permissions documentation"
			}
		}
	}
};
var security = {
	ssl: {
		label: "Valid SSL Certificate",
		description: "Valid SSL certificate and forced HTTPS redirect",
		explication: "A valid SSL certificate ensures data encryption between browser and server, protecting the confidentiality of exchanged information.",
		commentFaire: {
			item1: "Verify SSL certificate validity",
			item2: "Configure HTTP to HTTPS redirect",
			item3: "Test secure connection",
			item4: "Monitor certificate expiration"
		},
		bonnesPratiques: {
			item1: "Use certificates from trusted sources",
			item2: "Configure automatic renewal",
			item3: "Test configuration regularly",
			item4: "Monitor security indicators",
			item5: "Document SSL configuration"
		}
	},
	https: {
		label: "Forced HTTPS Redirect",
		description: "Force redirect from HTTP to HTTPS",
		explication: "Forced HTTPS redirect ensures all users access the site via a secure connection, even if they type HTTP in the URL.",
		commentFaire: {
			item1: "Configure redirect at server level",
			item2: "Test HTTP to HTTPS redirect",
			item3: "Verify all links are HTTPS",
			item4: "Monitor redirect errors"
		},
		bonnesPratiques: {
			item1: "301 redirect for SEO",
			item2: "Test on different browsers",
			item3: "Monitor error logs",
			item4: "Configure security headers",
			item5: "Document configuration"
		}
	},
	hsts: {
		label: "HSTS Enabled",
		description: "HSTS enabled to prevent HTTP downgrade",
		explication: "The HSTS (HTTP Strict Transport Security) header forces browsers to use HTTPS, preventing downgrade attacks and man-in-the-middle attacks.",
		commentFaire: {
			item1: "Configure HSTS header on server",
			item2: "Set appropriate validity duration",
			item3: "Test HSTS header",
			item4: "Monitor compliance"
		},
		bonnesPratiques: {
			item1: "Start with short duration",
			item2: "Gradually increase duration",
			item3: "Include subdomains if needed",
			item4: "Test on different browsers",
			item5: "Document HSTS configuration"
		}
	},
	tls: {
		label: "Up-to-date TLS Version",
		description: "Encryption of sensitive data in transit (TLS 1.2/1.3)",
		explication: "Recent TLS versions (1.2 and 1.3) offer enhanced security and better performance compared to older SSL/TLS versions.",
		commentFaire: {
			item1: "Check supported TLS version",
			item2: "Disable older versions (TLS 1.0/1.1)",
			item3: "Test client compatibility",
			item4: "Monitor TLS configuration"
		},
		bonnesPratiques: {
			item1: "Prioritize TLS 1.3",
			item2: "Maintain TLS 1.2 for compatibility",
			item3: "Use strong cipher suites",
			item4: "Test configuration regularly",
			item5: "Document TLS configuration"
		}
	},
	auth: {
		password: {
			label: "Hashed Passwords",
			description: "Passwords stored hashed (bcrypt, argon2)",
			explication: "Password hashing is essential to protect user credentials in case of database compromise.",
			commentFaire: {
				item1: "Use secure hashing algorithms",
				item2: "Add salt to passwords",
				item3: "Configure appropriate cost factor",
				item4: "Test hashing security"
			},
			bonnesPratiques: {
				item1: "Prefer bcrypt or argon2",
				item2: "Use unique salt per user",
				item3: "Configure high cost factor",
				item4: "Monitor performance",
				item5: "Plan migration of old hashes"
			}
		},
		"2fa": {
			label: "2FA Enabled",
			description: "2FA enabled on sensitive accounts",
			explication: "Two-factor authentication adds an extra security layer by requiring a second authentication factor in addition to the password.",
			commentFaire: {
				item1: "Implement 2FA for admin accounts",
				item2: "Offer multiple methods (SMS, app, email)",
				item3: "Configure recovery codes",
				item4: "Test 2FA process"
			},
			bonnesPratiques: {
				item1: "Mandatory for sensitive accounts",
				item2: "Secure recovery methods",
				item3: "Clear user interface",
				item4: "Monitor access attempts",
				item5: "User training"
			}
		},
		policy: {
			label: "Password Policy",
			description: "Password complexity and rotation policies",
			explication: "A strong password policy requires complex passwords and regular rotation to reduce compromise risks.",
			commentFaire: {
				item1: "Define complexity rules",
				item2: "Configure automatic rotation",
				item3: "Implement server-side validation",
				item4: "Test password policy"
			},
			bonnesPratiques: {
				item1: "Minimum 12 characters",
				item2: "Mix of character types",
				item3: "Rotation every 90 days",
				item4: "Password history",
				item5: "User training"
			}
		},
		roles: {
			label: "Roles and Permissions",
			description: "Roles and permissions correctly applied",
			explication: "A well-designed role and permission system limits access to features and data according to each user's responsibilities.",
			commentFaire: {
				item1: "Define clear roles",
				item2: "Assign minimal necessary permissions",
				item3: "Test permission application",
				item4: "Monitor privileged access"
			},
			bonnesPratiques: {
				item1: "Principle of least privilege",
				item2: "Regular permission review",
				item3: "Audit privileged access",
				item4: "Role documentation",
				item5: "Security training"
			}
		}
	},
	protection: {
		rate: {
			label: "Rate Limiting",
			description: "Rate limiting for APIs and login forms",
			explication: "Rate limiting restricts the number of requests a user can make in a given time, protecting against brute force attacks and spam.",
			commentFaire: {
				item1: "Configure rate limiting on APIs",
				item2: "Apply limits on connections",
				item3: "Configure appropriate delays",
				item4: "Test rate limiting protection"
			},
			bonnesPratiques: {
				item1: "Context-appropriate limits",
				item2: "Informative error messages",
				item3: "Monitor blocked attempts",
				item4: "Differentiated configuration per endpoint",
				item5: "Limit documentation"
			}
		},
		sql: {
			label: "SQL Injection Protection",
			description: "Protection against SQL injections (validation + escaping)",
			explication: "SQL injection protection prevents attackers from executing malicious SQL code by manipulating user inputs.",
			commentFaire: {
				item1: "Use prepared statements",
				item2: "Validate and escape all inputs",
				item3: "Test injection protection",
				item4: "Monitor injection attempts"
			},
			bonnesPratiques: {
				item1: "ORM with built-in protection",
				item2: "Strict input validation",
				item3: "Automated security testing",
				item4: "Monitor error logs",
				item5: "Developer training"
			}
		},
		xss: {
			label: "XSS Protection",
			description: "Protection against XSS injections (validation + escaping)",
			explication: "XSS protection prevents execution of malicious scripts injected into web pages, protecting users against session theft and other attacks.",
			commentFaire: {
				item1: "Escape all user outputs",
				item2: "Use security headers",
				item3: "Validate server-side inputs",
				item4: "Test XSS protection"
			},
			bonnesPratiques: {
				item1: "Content Security Policy (CSP)",
				item2: "Automatic output escaping",
				item3: "Strict input validation",
				item4: "Automated security testing",
				item5: "Monitor XSS attempts"
			}
		},
		directory: {
			label: "Directory Indexing",
			description: "Disable directory indexing",
			explication: "Disabling directory indexing prevents accidental exposure of sensitive files and server structure.",
			commentFaire: {
				item1: "Configure .htaccess for Apache",
				item2: "Configure nginx to disable indexing",
				item3: "Test directory access",
				item4: "Monitor access attempts"
			},
			bonnesPratiques: {
				item1: "Global indexing disable",
				item2: ".htaccess files in each directory",
				item3: "Monitor access attempts",
				item4: "Regular security testing",
				item5: "Configuration documentation"
			}
		},
		waf: {
			label: "Application Firewall",
			description: "IP filtering or application firewall (WAF)",
			explication: "A WAF (Web Application Firewall) protects against common attacks by analyzing and filtering HTTP traffic before it reaches the application.",
			commentFaire: {
				item1: "Configure WAF (Cloudflare, AWS WAF)",
				item2: "Define filtering rules",
				item3: "Test WAF protection",
				item4: "Monitor security alerts"
			},
			bonnesPratiques: {
				item1: "Rules adapted to your application",
				item2: "Monitor false positives",
				item3: "Regular rule updates",
				item4: "Regular penetration testing",
				item5: "WAF rule documentation"
			}
		}
	},
	files: {
		upload: {
			label: "Upload Validation",
			description: "Strict upload validation (extension, MIME type)",
			explication: "Strict file upload validation prevents uploading malicious files and protects against file upload attacks.",
			commentFaire: {
				item1: "Validate file extensions",
				item2: "Check MIME types",
				item3: "Limit file sizes",
				item4: "Test upload validation"
			},
			bonnesPratiques: {
				item1: "Whitelist of allowed types",
				item2: "Mandatory server-side validation",
				item3: "Appropriate size limits",
				item4: "Antivirus file scanning",
				item5: "Monitor suspicious uploads"
			}
		},
		antivirus: {
			label: "Antivirus Scan",
			description: "Antivirus scan on uploaded files",
			explication: "Antivirus scanning of uploaded files detects and blocks malicious files before they are processed by the application.",
			commentFaire: {
				item1: "Integrate antivirus engine",
				item2: "Scan all uploaded files",
				item3: "Block suspicious files",
				item4: "Monitor scan results"
			},
			bonnesPratiques: {
				item1: "Up-to-date antivirus engine",
				item2: "Real-time scanning",
				item3: "Quarantine suspicious files",
				item4: "Detailed scan reports",
				item5: "Performance monitoring"
			}
		},
		backup: {
			label: "Automatic Backups",
			description: "Regular automatic backups (off main server)",
			explication: "Regular automatic backups ensure data recovery in case of loss, corruption or attack on the main server.",
			commentFaire: {
				item1: "Configure automatic backups",
				item2: "Store backups off-site",
				item3: "Test backup restoration",
				item4: "Monitor backup success"
			},
			bonnesPratiques: {
				item1: "Daily backups",
				item2: "Storage in multiple locations",
				item3: "Backup encryption",
				item4: "Regular restoration tests",
				item5: "Procedure documentation"
			}
		},
		restore: {
			label: "Restore Test",
			description: "Backup restoration test",
			explication: "Regular testing of backup restoration ensures that recovery procedures work correctly when needed.",
			commentFaire: {
				item1: "Plan restoration tests",
				item2: "Test in isolated environment",
				item3: "Verify data integrity",
				item4: "Document test procedures"
			},
			bonnesPratiques: {
				item1: "Monthly tests minimum",
				item2: "Isolated test environment",
				item3: "Data integrity validation",
				item4: "Procedure documentation",
				item5: "Team training"
			}
		}
	},
	maintenance: {
		dependencies: {
			label: "Dependency Updates",
			description: "Regular updates of dependencies and CMS",
			explication: "Regular updates of dependencies and CMS fix security vulnerabilities and improve application stability.",
			commentFaire: {
				item1: "Monitor security updates",
				item2: "Test updates in dev environment",
				item3: "Plan production updates",
				item4: "Monitor stability after update"
			},
			bonnesPratiques: {
				item1: "Automatic updates if possible",
				item2: "Testing in development environment",
				item3: "Update planning",
				item4: "Rollback in case of problems",
				item5: "Change documentation"
			}
		},
		accounts: {
			label: "Unused Accounts",
			description: "Remove unused accounts",
			explication: "Removing unused accounts reduces attack surface and improves overall application security by limiting potential entry points.",
			commentFaire: {
				item1: "Identify inactive accounts",
				item2: "Notify users before deletion",
				item3: "Remove unused accounts",
				item4: "Monitor access attempts"
			},
			bonnesPratiques: {
				item1: "Clear inactivity definition",
				item2: "Automated notification process",
				item3: "Archive before deletion",
				item4: "Monitor access attempts",
				item5: "Procedure documentation"
			}
		},
		logs: {
			label: "Log Monitoring",
			description: "Monitor access and error logs",
			explication: "Monitoring access and error logs allows detection of suspicious activities and rapid response to security incidents.",
			commentFaire: {
				item1: "Configure centralized log collection",
				item2: "Implement automated alerts",
				item3: "Regularly analyze logs",
				item4: "Archive logs according to policy"
			},
			bonnesPratiques: {
				item1: "Centralized log collection",
				item2: "Real-time alerts",
				item3: "Automated pattern analysis",
				item4: "Appropriate log retention",
				item5: "Log analysis training"
			}
		},
		alerts: {
			label: "Suspicious Activity Alerts",
			description: "Alerts for suspicious activity",
			explication: "Suspicious activity alerts allow rapid detection and response to intrusion attempts and abnormal behaviors.",
			commentFaire: {
				item1: "Configure alert rules",
				item2: "Implement real-time notifications",
				item3: "Define alert thresholds",
				item4: "Test alert system"
			},
			bonnesPratiques: {
				item1: "Real-time alerts",
				item2: "Context-appropriate thresholds",
				item3: "Multi-channel notifications",
				item4: "Reduce false positives",
				item5: "Defined response procedures"
			}
		}
	}
};
const en = {
	welcome: welcome,
	app: app,
	home: home,
	projects: projects,
	emptyState: emptyState,
	sidebar: sidebar,
	common: common,
	modal: modal,
	categories: categories,
	items: items,
	ios: ios,
	security: security
};

export { app, categories, common, en as default, emptyState, home, ios, items, modal, projects, security, sidebar, welcome };
//# sourceMappingURL=en.mjs.map
