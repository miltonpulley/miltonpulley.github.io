/// Constant / Idempotent / Static Values
/// =====================================
// const FilterTagButtonID = "tagfilterbutton"
export const ProjectCategoriesAndTags =
{
	"Group size": ["Solo", "Team member", "Team leader"],
	"Project type": ["Sketch", "Protoype", "Test/Experiment"],
	"Programs": ["Blender", "Unity", "MuseScore"],
	"Languages": ["C/C++", "C#", "Java", "Python", "HTML/CSS/JS"],
	"Art": ["2D drawing", "2D digital", "3D model", "Animation", "Costume"],
	"Music": ["Vocals", "Music sheet/MIDI", "Studio performance", "Live performance"],
};


/// Global Session State Storage
/// ============================
// Total number of tags that can be used to filter.
var TotalNumberOfFilterTags = 0;
// total number of tags equals the sum of the number of tags in each category
Object.values(ProjectCategoriesAndTags).forEach((tags) => { TotalNumberOfFilterTags += tags.length;} );

import
{
	AllProjects,
	Whitelist,
	Blacklist,
	DisplayedProjectsIndexes,
}
from "./main.js";


/// Runtime Functions
/// =================
import { RefreshProjectList } from "./projectlist.js";

// Rerenders the filter list.
// To modify filters, call FilterProjects() beforehand.
export function RefreshFilterList()
{
	// Get <filter-area> tag and LIT regenerate html
	document.querySelector("filter-area").requestUpdate();
}

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

	FilterAreaElement.UpdateActiveTagsText();
}

// Gets a project's index into DisplayedProjectsIndexes[] from its index into AllProjects[].
export function GetDisplayIndexFromAllProjectsIndex(/*index*/ allProjectsIndex)
{
	let displayIndex = DisplayedProjectsIndexes.indexOf(allProjectsIndex);
	if(displayIndex == -1)
	{
		displayIndex = undefined;
		console.warn(`Warning: Could not find project with project index \"${allProjectsIndex}\" in the display array. It is either the project does not exist, or is currently being filtered away. Returning undefined...`);
	}
	return displayIndex;
}

// Gets a project's index into AllProjects[] from its index into DisplayedProjectsIndexes[].
export function GetAllProjectsIndexFromDisplayIndex(/*index*/ displayIndex)
{
	// This simple because the purpose of DisplayedProjectsIndexes[] is
	//   to keep track of the displaying project's AllProjects[] index.
	return DisplayedProjectsIndexes[displayIndex];
}


/// Classes and Objects
/// ===================
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
}


/// Page and HTML construction
/// ==========================
import { LitElement, html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/core/lit-core.min.js";

// Get CSS data for LIT components
import { FilterAreaElement_StyleCSS } from "./styleLIT.js";

// Entire generated inner HTML of <filter-area></filter-area> and <filter-tag></filter-tag>.
/*\
|*| <filter-area>
|*| |   <div>
|*| |   |   <h2>Filter projects by tags</h2>
|*| |   |   <div id="filterallbuttons">
|*| |   |   |   <button class="tagfilterallbutton" value="ig">Ignore All</button>
|*| |   |   |   <button class="tagfilterallbutton" value="wh">Whitelist All</button>
|*| |   |   |   <button class="tagfilterallbutton" value="bl">Blacklist All</button>
|*| |   |   </div>
|*| |   |   <div id="filtercategories">
|*| |   |   |   ...
|*| |   |   |   <h3>[Category Name]</h3>
|*| |   |   |   <div class="filtercategory">
|*| |   |   |   |   ...
|*| |   |   |   |   <filter-tag tag="[Tag Name]">
|*| |   |   |   |   |   <button class="tagfilterbutton" value="filter">[Tag Name]</button>
|*| |   |   |   |   </filter-tag>
|*| |   |   |   |   ...
|*| |   |   |   </div>
|*| |   |   |   ...
|*| |   |   </div>
|*| |   |   <p id="activewhitelist" value="wh">[Text]</p>
|*| |   |   <p id="activeblacklist" value="bl">[Text]</p>
|*| |   |   <p id="numshowingprojects" value="ig">[Text]</p>
|*| |   </div>
|*| </filter-area>
\*/
export class FilterAreaElement extends LitElement
{
	// Text to be displayed to the user informing them on what the filters are doing.
	// These are static members and not properties since there are only one of each.
	static numshowingprojects = "";
	static activewhitelist = "";
	static activeblacklist = "";

	// Set the CSS data
	static styles = [ FilterAreaElement_StyleCSS ];

	// For a better view of the HTML layout, see the comment block above.
	render() // LIT event that contructs the tag's HTML.
	{
		FilterAreaElement.UpdateActiveTagsText();
		return html`
			<div>
				<h2>Filter projects by tags</h2>
				<div id="filterallbuttons">
					<button @click="${this._filterAllButtonClicked}" class="tagfilterallbutton" value="${FilterTag.IGNORE}">Ignore All</button>
					<button @click="${this._filterAllButtonClicked}" class="tagfilterallbutton" value="${FilterTag.WHITELISTED}">Whitelist All</button>
					<button @click="${this._filterAllButtonClicked}" class="tagfilterallbutton" value="${FilterTag.BLACKLISTED}">Blacklist All</button>
				</div>
				<div id="filtercategories">
				${ // For each category:
					Object.entries(ProjectCategoriesAndTags).map(function([category, tags])
					{
						return html`
							<h3>${category}</h3>
							<div class="filtercategory">
							${ // For each tag in the category:
								tags.map(function(tag)
								{
									return html`<filter-tag tag="${tag}" .filter="${FilterTag.DefaultTagState}"></filter-tag>`;
								}, this)
							}
							</div>`;
					}, this)
				}
				</div>
				<p id="activewhitelist" value="${FilterTag.WHITELISTED}">${FilterAreaElement.activewhitelist}</p>
				<p id="activeblacklist" value="${FilterTag.BLACKLISTED}">${FilterAreaElement.activeblacklist}</p>
				<p id="numshowingprojects" value="${FilterTag.IGNORE}">${FilterAreaElement.numshowingprojects}</p>
			</div>`;
	}

	_filterAllButtonClicked(b)
	{
		// The filter type that every filter tag will become.
		let newFilter = b.target.value;

		// Clear all filters
		Whitelist.splice(0);
		Blacklist.splice(0);
		
		// Fill the whitelist with every tag
		if(newFilter == FilterTag.WHITELISTED)
		{
			for(let tagsInCategory of Object.values(ProjectCategoriesAndTags))
			{
				for(let tag of tagsInCategory)
				{
					FilterTag.AddToWhitelist(tag);
				};
			}
		}
		// Fill the blacklist with every tag
		if(newFilter == FilterTag.BLACKLISTED)
		{
			for(let tagsInCategory of Object.values(ProjectCategoriesAndTags))
			{
				for(let tag of tagsInCategory)
				{
					FilterTag.AddToBlacklist(tag);
				};
			}
		}

		// Set all filter tags' filter state
		// This was previously done through FilterAreaElement.render(), but did not properly set the tag styles
		//   because FOR SOME REASON clicking the "ignore all" button more than once stops setting the tags' filters.
		let tags = this.shadowRoot.firstElementChild.querySelectorAll("filter-tag");
		tags.forEach((t) => {t.filter = newFilter});

		// Apply new filter(s) and reconstruct HTML
		FilterProjects();
		RefreshFilterList();
		RefreshProjectList();
	}

	// Mostly beautifying based on corner cases
	static UpdateActiveTagsText()
	{
		FilterAreaElement.numshowingprojects = `Showing (${DisplayedProjectsIndexes.length}/${AllProjects.length}) projects.`;
		
		FilterAreaElement.activewhitelist = "No tags whitelisted."; // if Whitelist.length == 0
		if(Whitelist.length == 1)
		{
			FilterAreaElement.activewhitelist = `Only showing "${Whitelist[0]}" projects.`;
		}
		else if(Whitelist.length == TotalNumberOfFilterTags)
		{
			FilterAreaElement.activewhitelist = `Only showing projects that have every tag.`;
		}
		else if(Whitelist.length > 1)
		{
			FilterAreaElement.activewhitelist = `Only showing projects that have all (${Whitelist.length}) whitelisted tags.`;
		}
		
		FilterAreaElement.activeblacklist = "No tags blacklisted."; // if Blacklist.length == 0
		if(Blacklist.length == 1)
		{
			FilterAreaElement.activeblacklist = `Hiding all "${Blacklist[0]}" projects.`;
		}
		else if(Blacklist.length == TotalNumberOfFilterTags)
		{
			FilterAreaElement.activeblacklist = `Hiding all projects that have at least one tag.`;
		}
		else if(Blacklist.length > 1)
		{
			FilterAreaElement.activeblacklist = `Hiding projects that have at least one of the (${Blacklist.length}) blacklisted tags.`;
		}
	}
}
// registers the FilterAreaElement class as "filter-area" in the DOM
customElements.define("filter-area", FilterAreaElement);

export class FilterTagElement extends LitElement
{
	// defines attributes
	static properties =
	{
		tag: {type: String},
		filter: {type: String},
	};

	// Set the CSS data
	static styles = [ FilterAreaElement_StyleCSS ];

	// Attribute values don't get set up in the constructor, so you can't access their values in the constructor. 
	// To init properties, we can do it in connectedCallback(), which isn't really supposed to be used with LIT elements.
	connectedCallback()
	{
		super.connectedCallback(); // always gotta do this
		this.filter = this.filter || FilterTag.DefaultTagState; // If filter was not set, default to FilterTag.DefaultTagState.
	}

	// For a better view of the HTML layout, see the comment block above.
	render() // LIT event that contructs the tag's HTML.
	{
		return html`<button @click="${this._filterButtonClicked}" class="tagfilterbutton" value="${this.filter}">${this.tag}</button>`;
	}

	_filterButtonClicked(b)
	{
		// Get new filter
		let oldState = this.filter;
		this.filter = FilterTag.nextStateOf(oldState);

		// Remove tag from either whitelist or blacklist
		if(oldState == FilterTag.WHITELISTED) { FilterTag.RemoveFromWhitelist(this.tag); }
		if(oldState == FilterTag.BLACKLISTED) { FilterTag.RemoveFromBlacklist(this.tag); }
		
		// Add tag to either whitelist or blacklist
		if(this.filter == FilterTag.WHITELISTED) { FilterTag.AddToWhitelist(this.tag); }
		if(this.filter == FilterTag.BLACKLISTED) { FilterTag.AddToBlacklist(this.tag); }

		// Apply new filter(s) and reconstruct HTML
		FilterProjects();
		RefreshFilterList();
		RefreshProjectList();
	}
}
// registers the FilterTagElement class as "filter-tag" in the DOM
customElements.define("filter-tag", FilterTagElement);
