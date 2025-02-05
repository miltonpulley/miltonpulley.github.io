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

export const FilterTagStateName = "filter"; // HTML attribute name to store what kind of filter the tag is


/// Global Session State Storage
/// ============================
var TotalNumberOfFilterTags = 0; // Total number of tags that can be used to filter.

import
{
	AllProjects,
	Whitelist,
	Blacklist,
	DisplayedProjectsIndexes,
}
from "./main.js";


/// Classes and Objects
/// ===================
import { FilterTag } from "./main.js";


/// Page and HTML construction
/// ==========================
// Constructs the HTML filter list and adds functionality to their buttons.
export function GenerateFilterList()
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
			result += `<li><button class=\"tagfilterbutton\" value=\"${t}\" ${FilterTagStateName}=\"${FilterTag.DefaultTagState}\">${t}</button></li>`;
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
		t.onclick = () => FilterTag.SetTagFilterState(t);
		TotalNumberOfFilterTags++; // count the number of tags
	};
	let filterAllButtons = document.getElementsByClassName("tagfilterallbutton");
	for(let b of filterAllButtons)
	{
		b.onclick = () => FilterTag.SetAllTagFilterStates(b.getAttribute(FilterTagStateName));
	};
}


/// Runtime Functions
/// =================
export function FilterProjects()
{
	// effectively wipes the array to recalculate
	DisplayedProjectsIndexes.splice(0);

	// iterate over projects and keep track of each index
	let i = 0;
	for(const project of Object.values(AllProjects))
	{
		// Check if any tag of this project matches any tag in the whitelist and/or blacklist

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