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
	</li>`

/// Session State Storage
/// =====================
var AllProjects = [];
const ActiveFilters =
{
	whitelisted: [],
	blacklisted: [],
};
var DisplayedProjectsIndexes = [];

/// Initialisation Functions
/// ========================
window.onload = () => // event handler
{
	// Generate the HTML list of project tags
	const CategoryFilters = document.getElementById("filterprojectcategoriestags");
	CategoryFilters.innerHTML = ConstructProjectCategoryList();
	
	// Get all tags and hook up their buttons (would've just done the
	//   onclick directly into the html tags but nothing I tried worked)
	let tagList = document.getElementsByClassName("tagfilterbutton");
	for(let t of tagList)
	{
		t.onclick = () => SetTagFilter(t.value);
	};

	// Get and generate the list of projects
	FetchAllProjects();
}

function FetchAllProjects()
{
	FetchJSON("/projectlist.json", FetchAllProjectsCallback);
}
function FetchAllProjectsCallback(fetchedprojectsJSON)
{
	// clear the projects array
	AllProjects = [];

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
	//console.log(AllProjects)
	FilterProjects();
	ConstructProjectList();
}

/// Page and HTML construction
/// ==========================
/*\
|*| <ul id="filterprojectcategories">
|*| |   ...
|*| |   <li>
|*| |   |   <h3>[Category Name]</h3>
|*| |   |   <ul class="projectcategory">
|*| |   |   |   ...
|*| |   |   |   <li>
|*| |   |   |   |   <button class="tagfilterbutton" value=[Tag Name]>[Tag Name]</button>
|*| |   |   |   </li>
|*| |   |   |   ...
|*| |   |   </ul>
|*| |   </li>
|*| |   ...
|*| </ul>
\*/
const ConstructProjectCategoryList = () =>
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
			result += `<li><button class=\"tagfilterbutton\" value=\"${t}\">${t}</button></li>`;
		});
		result += "</ul></li>";
	};
	return result;
}

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
|*| |   </li>
|*| |   ...
|*| </ul>
\*/
// Constructs the HTML project list based on filters
const ConstructProjectList = () =>
{
	let result = "";
	// For each project that we want to display
	DisplayedProjectsIndexes.forEach((index) =>
	{
		const project = AllProjects[index];
		// Add each html tag
		result += `<li class=\"project\">`;
		result += `<button class="projectexpand" value=\"${project.name}\">Expand</button>`;
		result += `<img class=\"projectimg\" src=\"${project.folderpath}/thumbnail.png\"></img>`;
		result += `<p class=\"projectdate\">${project.date.toLocaleDateString()}</p>`;
		result += `<p class=\"projectname\">${project.name}</p>`;
		result += `<p class=\"projectdesc\">${project.blurb}</p>`;
		result += `<ul class=\"projecttaglist\">`;
		project.tags.forEach((t) =>
		{
			result += `<li class=\"projecttag\">${t}</li>`;
		});
		result += "</ul></li>";
	});
	const ProjectList = document.getElementById("projectlist");
	ProjectList.innerHTML = result;
}

/// Runtime Functions
/// =================
function SetTagFilter(tag)
{
	console.log(tag);
}

function FetchJSON(directory, callbackFunction)
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
	// wipe array to recalculate
	DisplayedProjectsIndexes = [];

	// Set the defaults
	let whitelisted = true;
	let blacklisted = false;
	let i = 0; // instead of traditional for loop as Allprojects.length (annoyingly) isn't a valid thing
	for(let project of Object.values(AllProjects))
	{
		/// Check if any tag of this project appears in the whitelist or blacklist
		/// -----------
		// If the whitelist is empty, use default above (allow all)
		if(ActiveFilters.whitelisted.length > 0)
		{
			whitelisted = project.tags.some(t => ActiveFilters.whitelisted.includes(t));
		}
		// If the blacklist is empty, use default above (remove none)
		if(ActiveFilters.blacklisted.length > 0)
		{
			blacklisted = project.tags.some(t => ActiveFilters.blacklisted.includes(t));
		}

		// if whitelisted and not blacklisted, it will be displayed
		if(whitelisted && !blacklisted)
		{
			DisplayedProjectsIndexes.push(i);
		}
		i++;
	}
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
// const proj1_portfolio = new Project("Portfolio Page", new Date(2025, 1, 30, 12, 41, 26), "", ["Solo", "HTML/CSS/JS", "2D digital"]);
