/// Constant / Idempotent / Static Values
/// =====================================
const ProjectListErrorHTML = // This is shown if the projects couldn't be loaded
	`<li class="project">
		<img src="/placeholder.jpg" class="projectimg"></img>
		<p class="projectname">An Error Message</p>
		<p class="projectdesc">Um... uh... this is where I list my projects... but there was a problem fetching them!</p>
		<ul class="projecttaglist">
			<li class="projecttag">Error message</li>
			<li class="projecttag">You're not supposed to see this!</li>
		</ul>
	</li>`;

import { FilterTagStateName } from "./filters.js";


/// Global Session State Storage
/// ============================
export const AllProjects = []; // List of all projects fetched from file.
export const Whitelist = []; // The list of all whitelisted tags to filter AllProjects[].
export const Blacklist = []; // The list of all whitelisted tags to filter AllProjects[].
export const DisplayedProjectsIndexes = []; // The filtered version of AllProjects[] to be displayed to screen.


/// Page and HTML construction
/// ==========================
import { GenerateFilterList } from "./filters.js";
import { GenerateProjectList } from "./projectlist.js";
import { GenerateProjectViewer } from "./projectviewer.js";


/// Runtime Functions
/// =================
import { FilterProjects } from "./filters.js";


/// Initialisation Functions
/// ========================
window.onload = () => // event handler
{
	// Generate the HTML list of project tags
	GenerateFilterList();
	
	// Get and generate the list of projects
	// Will eventually call FilterProjects() and GenerateProjectList()
	FetchAllProjects();

	// Generate the project viewer
	GenerateProjectViewer();
}

function FetchAllProjects()
{
	FetchJSON("/projectlist.json", FetchAllProjectsCallback, FetchAllProjectsErrorCallback);
}
function FetchAllProjectsCallback(/*Function Callback*/ fetchedprojectsJSON)
{
	// effectively clears the array
	AllProjects.splice(0);

	let index = 0;
	fetchedprojectsJSON.projects.forEach((proj) =>
	{
		// Checking if we have doubled up
		/*if(AllProjects[proj.name])
		{
			console.error(`Error: Project of name \"${proj.name}\" already exists!`);
		}
		else
		{*/
			AllProjects[index] = new Project(proj.name, new Date(proj.date), proj.folderpath, proj.tags, proj.blurb);
			index++;
		//}
	});

	FilterProjects();
	GenerateProjectList();
}
function FetchAllProjectsErrorCallback()
{
	const ProjectList = document.getElementById("projectlist");
	ProjectList.innerHTML = ProjectListErrorHTML;
}


/// Helper Functions
/// ================
function FetchJSON(/*String*/ directory, /*Function*/ callbackFunction, /*Function*/ callbackError)
{
	// fetch is asynchronous, and returns a "promise", that sometime in the future, there will be some data.
	// as it takes time to fetch from the server .then() is used to handle it.
	fetch(directory)
	.then((response) =>
	{
		//console.log(response); // logs the PROMISE
		return response.json(); // tells the code to parse the response as a JSON payload
	})
	.catch((error) =>
	{
		console.error(`Error in fetching JSON \"${directory}\", ${error}`);

		callbackError();
	})
	.then((FetchedParsedJSONdata) => // THIS is the data that was promised
	{
		//console.log(FetchedParsedJSONdata); // logs the data
		callbackFunction(FetchedParsedJSONdata);
	});
}


/// Classes and Objects
/// ===================
export class Project
{
	name = "";
	date = new Date();
	folderpath = "";
	tags = [];
	blurb = "";

	constructor(name, date, folderpath, tags, blurb)
	{
		this.name = name;
		this.date = date;
		this.folderpath = folderpath;
		this.tags = tags;
		this.blurb = blurb
	}

	describe()
	{
		return this.name + " (" + this.date.toString() + "), " + this.folderpath + "," + this.tags + ", " + this.blurb;
	}
}

export class FilterTag
{
	// Enum states
	static IGNORE = "ig";
	static WHITELISTED = "wh";
	static BLACKLISTED = "bl";

	static DefaultTagState = FilterTag.IGNORE;

	// Cycles state
	static nextStateOf(state)
	{
		switch(state)
		{
			case FilterTag.IGNORE:
				return FilterTag.WHITELISTED;
			case FilterTag.WHITELISTED:
				return FilterTag.BLACKLISTED;
			case FilterTag.BLACKLISTED:
				return FilterTag.IGNORE;
		}
	}

	static AddToWhitelist(/*String*/ tag) { Whitelist.push(tag); }
	static RemoveFromWhitelist(/*String*/ tag) { Whitelist.splice(Whitelist.indexOf(tag), 1); }
	static AddToBlacklist(/*String*/ tag) { Blacklist.push(tag); }
	static RemoveFromBlacklist(/*String*/ tag) { Blacklist.splice(Blacklist.indexOf(tag), 1); }

	static SetTagFilterState(/*HTML tag*/ tagHTML)
	{
		// Cycle state
		let oldState = tagHTML.getAttribute(FilterTagStateName);
		let newState = FilterTag.nextStateOf(oldState);
		tagHTML.setAttribute(FilterTagStateName, newState);

		// Remove tag from either whitelist or blacklist
		if(oldState == FilterTag.WHITELISTED) { FilterTag.RemoveFromWhitelist(tagHTML.value); }
		if(oldState == FilterTag.BLACKLISTED) { FilterTag.RemoveFromBlacklist(tagHTML.value); }
		
		// Add tag to either whitelist or blacklist
		if(newState == FilterTag.WHITELISTED) { FilterTag.AddToWhitelist(tagHTML.value); }
		if(newState == FilterTag.BLACKLISTED) { FilterTag.AddToBlacklist(tagHTML.value); }

		// Apply new filter(s) and reconstruct HTML
		FilterProjects();
		GenerateProjectList();
	}

	static SetAllTagFilterStates(/*String*/ state)
	{
		// Clear all filters
		Whitelist.splice(0);
		Blacklist.splice(0);

		let tagList = document.getElementsByClassName("tagfilterbutton");
		for(let t of tagList)
		{
			t.setAttribute(FilterTagStateName, state);
			if(state == FilterTag.WHITELISTED)
			{
				FilterTag.AddToWhitelist(t.value);
			}
			if(state == FilterTag.BLACKLISTED)
			{
				FilterTag.AddToBlacklist(t.value);
			}
		};
		
		// Apply new filter(s) and reconstruct HTML
		FilterProjects();
		GenerateProjectList();
	}
}