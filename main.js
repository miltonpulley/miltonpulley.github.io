/// Constant / Idempotent / Static Values
/// =====================================
// const FilterTagButtonID = "tagfilterbutton"
const ProjectCategoriesAndTags =
{
	"Group size": ["Solo", "Team member", "Team leader"],
	"Languages": ["C/C++", "C#", "C# (Unity)", "Java", "Python", "HTML/CSS/JS"],
	"Art": ["2D drawing", "2D digital", "3D model", "Blender Grease Pencil", "Animation", "Sketch"],
	"Music": ["Vocals", "Band", "Music sheet", "Live performance"],
};

const FilterTagStateName = "filter"; // HTML attribute name to store what kind of filter the tag is

// Print names for the project button as well as their corresponding animation name
const ProjectExpandName = "Expand"
const ProjectShrinkName = "Shrink"

// This is shown if the projects couldn't be loaded
const ProjectListErrorHTML = 
	`<li class="project">
		<img src="/placeholder.jpg" class="projectimg"></img>
		<p class="projectname">An Error Message</p>
		<p class="projectdesc">Um... uh... this is where I list my projects... but there was a problem fetching them!</p>
		<ul class="projecttaglist">
			<li class="projecttag">Error message</li>
			<li class="projecttag">You're not supposed to see this!</li>
		</ul>
	</li>`;

/// Session State Storage
/// =====================
const AllProjects = []; // List of all projects fetched from file.
const Whitelist = []; // The list of all whitelisted tags to filter AllProjects[].
const Blacklist = []; // The list of all whitelisted tags to filter AllProjects[].
const DisplayedProjectsIndexes = []; // The filtered version of AllProjects[] to be displayed to screen.
var TotalNumberOfFilterTags = 0; // Total number of tags that can be used to filter.
var CurrentlyExpandedProjectButton; // Keep track of the project we are viewing

/// Initialisation Functions
/// ========================
window.onload = () => // event handler
{
	// Generate the HTML list of project tags
	GenerateFilterList();
	
	// Get and generate the list of projects
	// Will eventually call FilterProjects() and GenerateProjectList()
	FetchAllProjects();
}

function FetchAllProjects()
{
	FetchJSON("/projectlist.json", FetchAllProjectsCallback);
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

/// Page and HTML construction
/// ==========================

/// Constructs the HTML filter list and adds functionality to their buttons.
function GenerateFilterList()
{
	GenerateFilterListHTML();
	AddFilterButtonFunctionality();
}

/// Generated HTML layout:
/*\
|*| <ul id="filterprojectcategories">
|*| |   ...
|*| |   <li>
|*| |   |   <h3>[Category Name]</h3>
|*| |   |   <ul class="projectcategory">
|*| |   |   |   ...
|*| |   |   |   <li>
|*| |   |   |   |   <button class="tagfilterbutton" value="[Tag Name]" [FilterTagStateName]="[State]">[Tag Name]</button>
|*| |   |   |   </li>
|*| |   |   |   ...
|*| |   |   </ul>
|*| |   </li>
|*| |   ...
|*| </ul>
\*/
function GenerateFilterListHTML() // Do not call, instead GenerateFilterList().
{
	let result = "";
	// A list of categories...
	for(const [category, tags] of Object.entries(ProjectCategoriesAndTags))
	{
		result += `<li><h3>${category}</h3>`
		result += "<ul class=\"projectcategory\">";
		// ...where each is a list of tags...
		tags.forEach((t) =>
		{
			result += `<li><button class=\"tagfilterbutton\" value=\"${t}\" ${FilterTagStateName}=\"${TagStatesEnum.DefaultTagState}\">${t}</button></li>`;
		});
		result += "</ul></li>";
	};

	// Add generated HTML to the doc
	const CategoryFilters = document.getElementById("filterprojectcategoriestags");
	CategoryFilters.innerHTML = result;
}

function AddFilterButtonFunctionality() // Do not call, instead GenerateFilterList().
{
	// Get all tags and hook up their buttons (would've just done the
	//   onclick directly into the html tags but nothing I tried worked)
	let tagList = document.getElementsByClassName("tagfilterbutton");
	for(let t of tagList)
	{
		t.onclick = () => SetTagFilterState(t);
		TotalNumberOfFilterTags++; // count the number of tags
	};
	let filterAllButtons = document.getElementsByClassName("tagfilterallbutton");
	for(let b of filterAllButtons)
	{
		b.onclick = () => SetAllTagFilterStates(b.getAttribute(FilterTagStateName));
	};
}

/// Constructs the HTML project list based on filters and adds functionality to its buttons.
/// Filtering must be called beforehand via FilterProjects().
function GenerateProjectList()
{
	GenerateProjectListHTML();
	AddExpandProjectButtonFunctionality();
}

/// Generated HTML layout:
/*\
|*| <ul id="projectlist">
|*| |   ...
|*| |   <li class="project">
|*| |   |   <button value="[Project Name]" class="projectexpand">Expand</button>
|*| |   |   <img src="[Project Image]" class="projectimg"></img>
|*| |   |   <p class="projectdate">[Date]</p>
|*| |   |   <p class="projectname">[Project Name]</p>
|*| |   |   <p class="projectdesc">[Project Description]</p>
|*| |   |   <ul class="projecttaglist">
|*| |   |   |   ...
|*| |   |   |   <li class="projecttag">[Project Tag]</li>
|*| |   |   |   ...
|*| |   |   </ul>
|*| |   |   <div class="expandedproject">
|*| |   |   |   
|*| |   |   </div>
|*| |   </li>
|*| |   ...
|*| </ul>
\*/
function GenerateProjectListHTML() // Do not call, instead call GenerateProjectList().
{
	let result = "";
	// For each project that we want to display
	DisplayedProjectsIndexes.forEach((index) =>
	{
		const project = AllProjects[index];
		// Add each html tag
		result += "<li class=\"project\">";
		
		result += `<button class="projectexpand" value=\"${project.name}\">Expand</button>`;
		result += `<img class=\"projectimg\" src=\"${project.folderpath}/thumbnail.png\"></img>`;
		result += `<p class=\"projectdate\">${project.date.toLocaleDateString()}</p>`;
		result += `<p class=\"projectname\">${project.name}</p>`;
		result += `<p class=\"projectdesc\">${project.blurb}</p>`;
		
		result += "<ul class=\"projecttaglist\">";
		project.tags.forEach((t) =>
		{
			result += `<li class=\"projecttag\">${t}</li>`;
		});
		result += "</ul>";

		result += "<div class=\"expandedproject\">";
		result += GenerateProjectExpandedWindowHTML(project);
		result += "</div></li>";
	});
	const ProjectList = document.getElementById("projectlist");
	ProjectList.innerHTML = result;
}

function GenerateProjectExpandedWindowHTML(/*Project*/ project) // Do not call, instead call GenerateProjectList().
{
	return "";
}

function AddExpandProjectButtonFunctionality() // Do not call, instead call GenerateProjectList().
{
	// Now that we have all projects in the HTML, we need to add each one's button's functionality.
	let allExpandProjectButtons = document.getElementsByClassName("projectexpand");
	for(let b of allExpandProjectButtons)
	{
		b.onclick = (b) => 
		{
			// if the button will make the project expand
			if(b.target.innerHTML == ProjectExpandName)
			{
				ExpandProject(b.target); // Pass the BUTTON as we need to modify its label
			}
			else // if the button will make the project shrink (or if it says anything else since the user could modify it)
			{
				ShrinkProject(b.target); // Pass the BUTTON as we need to modify its label
			}
		}
	};
}


/// Runtime Functions
/// =================
function SetTagFilterState(/*HTML tag*/ tagHTML)
{
	// Cycle state
	let oldState = tagHTML.getAttribute(FilterTagStateName);
	let newState = TagStatesEnum.nextStateOf(oldState);
	tagHTML.setAttribute(FilterTagStateName, newState);

	if(oldState == TagStatesEnum.WHITELISTED)
	{	
		// Remove tag from whitelist
		RemoveFromWhitelist(tagHTML.value);
	}

	if(oldState == TagStatesEnum.BLACKLISTED)
	{
		// Remove tag from blacklist
		RemoveFromBlacklist(tagHTML.value);
	}

	if(newState == TagStatesEnum.WHITELISTED)
	{
		// Add tag to whitelist
		AddToWhitelist(tagHTML.value);
	}
	
	if(newState == TagStatesEnum.BLACKLISTED)
	{
		// Add tag to blacklist
		AddToBlacklist(tagHTML.value)
	}

	// Apply new filter(s) and reconstruct HTML
	FilterProjects();
	GenerateProjectList();
}

function SetAllTagFilterStates(/*String*/ state)
{
	// Clear all filters
	Whitelist.splice(0);
	Blacklist.splice(0);

	let tagList = document.getElementsByClassName("tagfilterbutton");
	for(let t of tagList)
	{
		t.setAttribute(FilterTagStateName, state);
		if(state == TagStatesEnum.WHITELISTED)
		{
			AddToWhitelist(t.value);
		}
		if(state == TagStatesEnum.BLACKLISTED)
		{
			AddToBlacklist(t.value);
		}
	};
	
	// Apply new filter(s) and reconstruct HTML
	FilterProjects();
	GenerateProjectList();
}

function AddToWhitelist(/*String*/ tag)
{
	// Add tag to whitelist
	Whitelist.push(tag);
}

function RemoveFromWhitelist(/*String*/ tag)
{
	// Remove tag from whitelist
	let index = Whitelist.indexOf(tag);
	Whitelist.splice(index, 1);
}

function AddToBlacklist(/*String*/ tag)
{
	// Add tag to blacklist
	Blacklist.push(tag);
}

function RemoveFromBlacklist(/*String*/ tag)
{
	// Remove tag from blacklist
	let index = Blacklist.indexOf(tag);
	Blacklist.splice(index, 1);
}

function FetchJSON(/*String*/ directory, /*Function*/ callbackFunction)
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

		const ProjectList = document.getElementById("projectlist");
		ProjectList.innerHTML = ProjectListErrorHTML;
	})
	.then((FetchedParsedJSONdata) => // THIS is the data that was promised
	{
		//console.log(FetchedParsedJSONdata); // logs the data
		callbackFunction(FetchedParsedJSONdata);
	});
}

function FilterProjects()
{
	// effectively wipes the array to recalculate
	DisplayedProjectsIndexes.splice(0);

	// iterate over projects and keep track of each index
	let i = 0;
	for(const project of Object.values(AllProjects))
	{
		/// Check if any tag of this project matches any tag in the whitelist and/or blacklist
		/// -----------
		let whitelisted = true; // By default all tags are whitelisted
		let blacklisted = false; // By default all tags are not blacklisted

		// If EVERY tag in the whitelist also tags this project, it is whitelisted
		//   i.e., if at least one tag of this project isn't whitelisted, then the project won't be displayed
		for(let tag of Whitelist)
		{
			whitelisted &= project.tags.includes(tag);
		};

		// If AT LEAST one tag in the blacklist also tags this project, it is blacklisted
		//   i.e., if every tag of this project isn't blacklisted, then the project will be displayed
		for(let tag of Blacklist)
		{
			// once we know this project is blacklisted, there's no point checking the rest of the tags
			if(project.tags.includes(tag))
			{
				blacklisted = true;
				break;
			}
		};

		// if whitelisted and not blacklisted, it will be displayed
		if(whitelisted && !blacklisted)
		{
			DisplayedProjectsIndexes.push(i);
		}
		i++;
	}

	UpdateActiveTagsText();
}

// Mostly beautifying based on corner cases
function UpdateActiveTagsText()
{
	const ProjectListLength = document.getElementById("projectlistlength");
	ProjectListLength.innerHTML = `Showing (${DisplayedProjectsIndexes.length}/${AllProjects.length}) projects.`;
	
	const ActiveWhitelist = document.getElementById("activewhitelist");
	ActiveWhitelist.innerHTML = "No tags whitelisted."; // if Whitelist.length == 0
	if(Whitelist.length == 1)
	{
		ActiveWhitelist.innerHTML = `Only showing \"${Whitelist[0]}\" projects.`;
	}
	else if(Whitelist.length == TotalNumberOfFilterTags)
	{
		ActiveWhitelist.innerHTML = `Only showing projects that have every tag.`;
	}
	else if(Whitelist.length > 1)
	{
		ActiveWhitelist.innerHTML = `Only showing projects that have all (${Whitelist.length}) whitelisted tags.`;
	}
	
	const ActiveBlacklist = document.getElementById("activeblacklist");
	ActiveBlacklist.innerHTML = "No tags blacklisted."; // if Blacklist.length == 0
	if(Blacklist.length == 1)
	{
		ActiveBlacklist.innerHTML = `Hiding all \"${Blacklist[0]}\" projects.`;
	}
	else if(Blacklist.length == TotalNumberOfFilterTags)
	{
		ActiveBlacklist.innerHTML = `Hiding all projects that have at least one tag.`;
	}
	else if(Blacklist.length > 1)
	{
		ActiveBlacklist.innerHTML = `Hiding projects that have at least one of the (${Blacklist.length}) blacklisted tags.`;
	}
}

// Pass the BUTTON and not the project parent as the button's label is modified
function ExpandProject(/*HTML tag*/ projectbutton)
{
	// first check if another project is currently expanded, and shrink it.
	let delay;
	if(CurrentlyExpandedProjectButton != undefined)
	{
		ShrinkProject(CurrentlyExpandedProjectButton);
		// If there is another project, we want to start expanding the new project right after the shrinking
		//   of the previous project, so we want to delay the expand anim by the duration of the shrink anim.
		// This is actually the duration of the NEW project, not the one just shrunk. If we wanted to use the duration of the
		//   shrinking project, we would have to store it in the HTML tag because for some reason JavaScript can't read CSS.
		delay = "calc(var(--expandproject-duration) * 0.5)";
	}
	else
	{
		delay = "0s"; // if we don't have to wait for a previous project to shrink first
	}
	// set the delay
	projectbutton.parentNode.style.setProperty("--expandproject-delay", delay);

	// set to the expand animation
	projectbutton.parentNode.style.setProperty("--expandproject-animation", ProjectExpandName);
	projectbutton.innerHTML = ProjectShrinkName; // set the label

	// We are now the currently expanded project
	CurrentlyExpandedProjectButton = projectbutton;
}

// Pass the BUTTON and not the project parent as the button's label is modified
function ShrinkProject(/*HTML tag*/ projectbutton)
{
	// If a project can shrink it is currently expanded.
	//   There can only be 1 expanded project at any given time, so if this project
	//   is NOT the currently expanded one, then we have two expanded projects.
	if(projectbutton.value != CurrentlyExpandedProjectButton.value)
	{
		console.error(`Error: somehow two projects are expanded: \"${CurrentlyExpandedProjectButton.value}\" and \"${projectbutton.value}\".`);
	}

	// wipe any delay
	projectbutton.parentNode.style.setProperty("--expandproject-delay", "0s");

	// set to the shrink animation
	projectbutton.parentNode.style.setProperty("--expandproject-animation", ProjectShrinkName);
	projectbutton.innerHTML = ProjectExpandName; // set the label

	// There is now no currently expanded project.
	CurrentlyExpandedProjectButton = undefined; // undefined, NOT null.
}

/// Classes and Objects
/// ===================
class Project
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

// Enum
class TagStatesEnum
{
	static IGNORE = "ig";
	static WHITELISTED = "wh";
	static BLACKLISTED = "bl";

	static DefaultTagState = TagStatesEnum.IGNORE;

	// Cycles state
	static nextStateOf(state)
	{
		switch(state)
		{
			case TagStatesEnum.IGNORE:
				return TagStatesEnum.WHITELISTED;
			case TagStatesEnum.WHITELISTED:
				return TagStatesEnum.BLACKLISTED;
			case TagStatesEnum.BLACKLISTED:
				return TagStatesEnum.IGNORE;
		}
	}
}