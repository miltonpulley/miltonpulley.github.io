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
import { RefreshFilterList } from "./filters.js";
import { RefreshProjectList } from "./projectlist.js";
import { GenerateProjectViewer } from "./projectviewer.js";


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
	// Will eventually call FilterProjects(), RefreshFilterList(), and RefreshProjectList().
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
	RefreshFilterList();
	RefreshProjectList();
}
function FetchAllProjectsErrorCallback()
{
	const ProjectList = document.getElementById("projectlist");
	ProjectList.innerHTML = ProjectListErrorHTML;
}


/// Helper Functions
/// ================
function FetchJSON(/*String*/ filepath, /*Function*/ callbackFunction, /*Function*/ callbackError)
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
		console.error(`Error in fetching JSON \"${filepath}\", ${error}`);

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
