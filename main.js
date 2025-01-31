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

/// Session State Storage
/// =====================
const AllProjects = {};
const ActiveFilters =
{
	whitelisted: [],
	blacklisted: [],
};

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

	// Generate the list of projects
	FetchAllProjects();
}

function FetchAllProjects()
{
	FetchJSON("/projectlist.json", FetchAllProjectsCallback);
}
function FetchAllProjectsCallback(fetchedprojectsJSON)
{
	// clear the projects array
	while(AllProjects.length > 0)
	{
		AllProjects.pop();
	}

	fetchedprojectsJSON.projects.forEach((proj) =>
	{
		if(AllProjects[proj.name])
		{
			console.error(`Error: Project of name \"${proj.name}\" already exists!`);
		}
		else
		{
			AllProjects[proj.name] = new Project(proj.name, new Date(proj.date), proj.folderpath, proj.tags, proj.blurb);
		}
	});
	//console.log(AllProjects)

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
		// ...where each is a list of tags...
		result += `<li><h3>${category}</h3><ul class=\"projectcategory\">`;
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
const ConstructProjectList = () =>
{
	let result = "";
	for(const [name, project] of Object.entries(AllProjects))
	{
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
	};
	const ProjectList = document.getElementById("projectlist");
	//ProjectList.innerHTML = result;
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
	})
	.then((FetchedParsedJSONdata) => // THIS is the data that was promised
	{
		//console.log(FetchedParsedJSONdata); // logs the data
		callbackFunction(FetchedParsedJSONdata);
	});
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
