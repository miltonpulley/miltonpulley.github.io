/// Constant / Idempotent / Static Values
/// =====================================
import { ProjectCategoriesAndTags } from "./filters.js";


/// Global Session State Storage
/// ============================
export const URLParams = {}; // The list of all URL parameters read.

const ViewIndexURLParam = "view";
const BlacklistURLParam = "blacklist";
const WhitelistURLParam = "whitelist";

export const URL_DISALLOWED_CHARS = /([^A-Za-z0-9_,-])/gi;
var stillInit = true;

export function ToURLAllowedFilterTag(str)
{
	return str.trim().toLowerCase().replaceAll(URL_DISALLOWED_CHARS, '_');
}

export const AllProjects = []; // List of all projects fetched from file.
export const Whitelist = []; // The list of all whitelisted tags to filter AllProjects[].
export const Blacklist = []; // The list of all whitelisted tags to filter AllProjects[].
export const DisplayedProjectsIndexes = []; // The filtered version of AllProjects[] to be displayed to screen.


/// Runtime Functions
/// =================
import { FilterProjects } from "./filters.js";


/// Classes and Objects
/// ===================
import { Project } from "./projectlist.js";
import { RefreshFilterList, GetDisplayIndexFromAllProjectsIndex, ClearAllFilters, SetFilters } from "./filters.js";
import { RefreshProjectList, FindAndExpandProject } from "./projectlist.js";
import { RefreshProjectViewer, ProjectViewerElement } from "./projectviewer.js";


/// Initialisation Functions
/// ========================
window.onload = () => // event handler
{
	InitWebsite();
}
async function InitWebsite()
{
	stillInit = true;

	// Get URL parameters, if any
	GetURLParams();

	// Get and generate the list of projects
	// Will eventually call FilterProjects(), RefreshFilterList(), RefreshProjectList(), and RefreshProjectViewer().
	await FetchJSONToObject("/projectlist.json", FetchAllProjectsCallback);
	

	FilterProjects();
	await RefreshFilterList();
	await RefreshProjectList();
	await RefreshProjectViewer();
	
	//await new Promise((resolve) => setTimeout(() => resolve(0), 2000));

	InterpretURLParams();

	stillInit = false;
	UpdateURL();

	FilterProjects();
	await RefreshFilterList();
	await RefreshProjectList();
	await RefreshProjectViewer();
}

export function UpdateURL()
{
	if(stillInit)
	{
		return;
	}

	let params = [];

	if(ProjectViewerElement.Displaying)
	{
		params.push(ViewIndexURLParam+"="+ProjectViewerElement.ProjIndex);
	}
	if(Blacklist?.flat().length > 0)
	{
		params.push(BlacklistURLParam+"="+ToURLAllowedFilterTag(Blacklist.flat().join(',')));
	}
	if(Whitelist?.flat().length > 0)
	{
		params.push(WhitelistURLParam+"="+ToURLAllowedFilterTag(Whitelist.flat().join(',')));
	}

	let url = window.location.origin;
	if(params.length > 0)
	{
		url += "?"+params.join('&');
	}

	if(URL.canParse(url))
	{
		history.replaceState(null, "", url);
	}
}


function InterpretURLParams()
{
	// Perhaps show one of the projects
	if(URLParams[ViewIndexURLParam] != undefined)
	{
		ClearAllFilters();
		FindAndExpandProject(URLParams[ViewIndexURLParam]);
	}
	// Perhaps set filters
	else
	{
		SetFilters(URLParams[BlacklistURLParam], URLParams[WhitelistURLParam]);
	}
}

function GetURLParams()
{
	//console.debug(window.location.search.trim());
	if(window.location.search.trim() == "")
	{
		return;
	}

	//let s = window.location.toString().split('?');
	let s = window.location.search.trim().substring(1).split('&');

	let u, key, val;

	for(let i = 0; i < s.length; i++)
	{
		u = s[i].split('=');

		key = u[0];
		val = u[1];

		if(key == undefined || key == "") { continue; }
		if(val == undefined || val == "") { continue; }
		if(URLParams[key] != undefined) { continue; }

		URLParams[key] = val;
	}
	
	// If filter parameters exists, convert the value to a list
	if(URLParams[BlacklistURLParam] != undefined)
	{
		URLParams[BlacklistURLParam] = URLParams[BlacklistURLParam].split(',');
	}
	if(URLParams[WhitelistURLParam] != undefined)
	{
		URLParams[WhitelistURLParam] = URLParams[WhitelistURLParam].split(',');
	}
}

async function FetchAllProjectsCallback(/*Function Callback*/ fetchedprojectsJSON)
{
	// effectively clears the array
	AllProjects.splice(0);
	
	// When error getting JSON, no projects are loaded, meaning the Error HTML will.
	if(fetchedprojectsJSON == undefined)
	{
		return;
	}

	let index = 0;
	fetchedprojectsJSON.projects.forEach((proj) =>
	{
		// Checking if we have doubled up by checking if any project
		//   already parsed has the same name of the current project.
		if(AllProjects.find((p) => p.name == proj.name))
		{
			console.warn(`Warning: Project of name "${proj.name}" already exists! Skipping...`);
		}
		else if(proj.name.trim().length == 0) // First trim the leading and trailing whitespace
		{
			console.warn(`Warning: Project has no name! Skipping...`);
		}
		else
		{
			AllProjects[index] = new Project(proj.name.trim(), proj.date, proj.blurb, proj.tags, proj.datapath, proj.desc, proj.thumbnail, proj.projectviewerdatafiles);
			index++;
		}

		// Check if this project has a tag that doesn't appear in any tag category
		// For all tags in this project...
		proj.tags.forEach((tag) =>
		{
			let tagExists = false; // ...does the tag appear in a category? ...
			Object.values(ProjectCategoriesAndTags).forEach((tagsInCategory) =>
			{
				tagExists |= tagsInCategory.includes(tag);
				// console.log(proj.name + ", " + tag + ", [" + tagsInCategory + "], " + tagExists);
			});
			if(!tagExists) // ... if not, warn.
			{
				console.warn(`Warning: Project "${proj.name}" has unknown tag "${tag}", please add to ProjectCategoriesAndTags.`);
			}
		});
	});
}

/// Helper Functions
/// ================
// Autodetect which file-specific fetch function to call based on file
//   extension, for if the file extension is not known beforehand.
export async function FetchFile(/*String*/ filepath, /*Function*/ callbackFunction)
{
	let extension = filepath.split('.').pop(); // get substring from last '.' to end of superstring.
	switch(extension)
	{
		default: console.warn(`Warning: attempted to fetch unknown file extension \"${extension}\", skipping file...`); return;
		
		case "json": await FetchJSONToObject(filepath, callbackFunction); return;
		case  "txt": await FetchTextToString(filepath, callbackFunction); return;
		case   "md": await FetchMarkdownToHTML(filepath, callbackFunction); return;

		case  "png": // v (Fall through)
		case  "jpg": // v (Fall through)
		case "jpeg": FetchImageToHTML(filepath, callbackFunction); return;
	}
}
export async function FetchJSONToObject(/*String*/ filepath, /*Function(Object)*/ callbackFunction)
{
	// fetch is asynchronous, and returns a "promise", that sometime in the future, there will be some data.
	// as it takes time to fetch from the server .then() is used to handle it.
	await fetch(filepath)
	.then((response) =>
	{
		//console.log(response); // logs the PROMISE
		return response.json(); // tells the code to parse the response as a JSON payload
	})
	.catch((error) =>
	{
		console.error(`Error in fetching JSON "${filepath}", ${error}`);
	})
	.then((FetchedParsedJSONdata) => // THIS is the data that was promised
	{
		//console.log(FetchedParsedJSONdata); // logs the data
		callbackFunction(FetchedParsedJSONdata);
	});
}
export async function FetchTextToString(/*String*/ filepath, /*Function(String)*/ callbackFunction)
{
	// fetch is asynchronous, and returns a "promise", that sometime in the future, there will be some data.
	// as it takes time to fetch from the server .then() is used to handle it.
	await fetch(filepath)
	.then((response) =>
	{
		//console.log(response); // logs the PROMISE
		return response.text(); // tells the code to parse the response as a Text payload
	})
	.catch((error) =>
	{
		console.error(`Error in fetching Text "${filepath}", ${error}`);
	})
	.then((FetchedParsedTextdata) => // THIS is the data that was promised
	{
		//console.log(FetchedParsedTextdata); // logs the data
		callbackFunction(FetchedParsedTextdata);
	});
}
import { marked } from "https://cdn.jsdelivr.net/npm/marked@15.0.7/+esm"; // for converting Markdown to UNSANITIZED HTML.
import dompurify from "https://cdn.jsdelivr.net/npm/dompurify@3.2.4/+esm"; // For sanitizing HTML
export async function FetchMarkdownToHTML(/*String*/ filepath, /*Function(String)*/ callbackFunction)
{
	// Markdown is plain text, and we already have a fetch function for that.
	await FetchTextToString(filepath, (markdown) =>
	{
		// Parse the Markdown to HTML before returning...
		let mdHTML = marked.parse(markdown);
		// ...and sanitize because why not (sanitization only happens at insertion into the DOM
		//   in case it changes between here and then, but it can't hurt to do it now as well).
		callbackFunction(dompurify.sanitize(mdHTML));
	});
}
export function FetchImageToHTML(/*String*/ filepath, /*Function(String)*/ callbackFunction)
{
	// Don't actually need to fetch since the image can be loaded through the <img src=""></img> tag.
	callbackFunction(`<img src="${filepath}"></img>`);
}


/// Page and HTML construction
/// ==========================
