/// Constant / Idempotent / Static Values
/// =====================================


/// Global Session State Storage
/// ============================
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


/// Initialisation Functions
/// ========================
window.onload = () => // event handler
{
	// Get and generate the list of projects
	// Will eventually call FilterProjects(), RefreshFilterList(), RefreshProjectList(), and RefreshProjectViewer().
	FetchAllProjects();
}

import { RefreshFilterList } from "./filters.js";
import { RefreshProjectList } from "./projectlist.js";
import { RefreshProjectViewer } from "./projectviewer.js";

function FetchAllProjects()
{
	FetchJSONToObject("/projectlist.json", FetchAllProjectsCallback);
}
function FetchAllProjectsCallback(/*Function Callback*/ fetchedprojectsJSON)
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
		else
		{
			AllProjects[index] = new Project(proj.name, proj.date, proj.blurb, proj.tags, proj.projectviewerdatapath, proj.projectviewerdatafiles);
			index++;
		}
	});

	FilterProjects();
	RefreshFilterList();
	RefreshProjectList();
	RefreshProjectViewer();
}


/// Helper Functions
/// ================
// Autodetect which file-specific fetch function to call based on file
//   extension, for if the file extension is not known beforehand.
export function FetchFile(/*String*/ filepath, /*Function*/ callbackFunction)
{
	let extension = filepath.split('.').pop(); // get substring from last '.' to end of superstring.
	switch(extension)
	{
		default: console.warn(`Warning: attempted to fetch unknown file extension \"${extension}\", skipping file...`); return;
		
		case "json": FetchJSONToObject(filepath, callbackFunction); return;
		case  "txt": FetchTextToString(filepath, callbackFunction); return;
		case   "md": FetchMarkdownToHTML(filepath, callbackFunction); return;

		case  "png": // v (Fall through)
		case  "jpg": // v (Fall through)
		case "jpeg": FetchImageToHTML(filepath, callbackFunction); return;
	}
}
export function FetchJSONToObject(/*String*/ filepath, /*Function(Object)*/ callbackFunction)
{
	// fetch is asynchronous, and returns a "promise", that sometime in the future, there will be some data.
	// as it takes time to fetch from the server .then() is used to handle it.
	fetch(filepath)
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
export function FetchTextToString(/*String*/ filepath, /*Function(String)*/ callbackFunction)
{
	// fetch is asynchronous, and returns a "promise", that sometime in the future, there will be some data.
	// as it takes time to fetch from the server .then() is used to handle it.
	fetch(filepath)
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
export function FetchMarkdownToHTML(/*String*/ filepath, /*Function(String)*/ callbackFunction)
{
	// Markdown is plain text, and we already have a fetch function for that.
	FetchTextToString(filepath, (markdown) =>
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
