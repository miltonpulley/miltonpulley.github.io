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
const ActiveFilters =
{
	whitelisted: [],
	blacklisted: [],
}

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
		t.onclick = () => SetTagFilter(t.value)
	};

	// Generate the list of projects
	//const ProjectList = document.getElementById("filterprojectcategoriestags");
	//ProjectList.innerHTML = ConstructProjectList();
}

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

const ConstructProjectList = () =>
{
	let result = "<ul>";
	


	return result + "</ul>";
}


/// Runtime Functions
/// =================
function SetTagFilter(tag)
{
	console.log(tag);
}

/// Classes and Objects
/// ===================
class Project
{
	name = "";
	year = new Date();
	tags = [];

	constructor(name, year, tags)
	{
		this.name = name;
		this.year = year;
		this.tags = tags;
	}

	describe()
	{
		return this.name + " (" + this.year.toString() + "), " + this.tags;
	}
}
const proj1_portfolio = new Project("Portfolio Page", new Date(2025, 1, 30, 12, 41, 26), ["Solo", "HTML/CSS/JS", "2D digital"]);
