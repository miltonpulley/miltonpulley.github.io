/// Constant / Idempotent / Static Values
/// =====================================
// Print names for the project button as well as their corresponding animation name
export const ProjectExpandName = "Expand"
export const ProjectShrinkName = "Shrink"


/// Global Session State Storage
/// ============================
export var CurrentlyViewedProject; // Keep track of the project in the list who's content is in the viewer
import
{
	AllProjects,
	DisplayedProjectsIndexes,
}
from "./main.js";


/// Runtime Functions
/// =================
import { UpdateURL } from "./main.js";
import { ViewProjectInViewer, ClearProjectViewer } from "./projectviewer.js";

// Rerenders the project list based on filters.
// To modify filters, call FilterProjects() beforehand.
export async function RefreshProjectList()
{
	// Get <project-list> tag and LIT regenerate html
	await document.querySelector("project-list").requestUpdate();
}

// ProjectListItem.ExpandProject() for when you only have its index into DisplayedProjectsIndexes[].
export function FindAndExpandProject(/*index*/ displayIndex)
{
	document.querySelector("project-list").FindAndExpandProject(displayIndex);
}


/// Classes and Objects
/// ===================
// Project data is NOT stored in the LIT element as the project may be filtered out, but the data must still exist
export class Project
{
	name = "";
	_date = ""; // Just text, gets try-parsed to Date() object in GetDisplayDate()
	blurb = "";
	tags = [];
	datapath = "";
	desc = "";
	thumbnail = "";
	viewerdatafiles = [];

	constructor(name, date, blurb, tags, datapath, desc, thumbnail, viewerdatafiles)
	{
		this.name = name;
		this._date = date;
		this.blurb = blurb;
		this.tags = tags;
		this.datapath = datapath;
		this.desc = desc;
		this.thumbnail = thumbnail;
		this.viewerdatafiles = this.viewerdatafiles.concat(desc, viewerdatafiles);
	}

	describe()
	{
		return `Project "${this.name}": (${this.GetDisplayDate()}), ${this.blurb}, [${this.tags}], "${this.desc}", "${this.datapath}", "${this.datapath}" [${this.viewerdatafiles}].`;
	}

	GetDisplayDate()
	{
		// Try to convert to a date
		let d = Date.parse(this._date);
		if(isNaN(d))
		{
			// Failed to parse, so this._date must be text and not a date
			return this._date;
		}
		// Was a date, return formatted text
		return new Date(d).toLocaleDateString();
	}
}


/// Page and HTML construction
/// ==========================
import { LitElement, html } from "https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/core/lit-core.min.js";

// Get CSS data for LIT components
import
{
	ProjectListElement_StyleCSS,
	ProjectListItemElement_StyleCSS,
	ProjectListItemElement_AnimationCSS,
}
from "./styleLIT.js";

// Entire generated inner HTML of <project-list></project-list> and <project-list-item></project-list-item>.
/*\
|*| <project-list>
|*| |   <div>
|*| |   |   ...
|*| |   |   <project-list-item projindex="[Index into AllProjects[] array]">
|*| |   |   |   <div class="project">
|*| |   |   |   |   <div class="projectanim">
|*| |   |   |   |   |   <button class="viewprojectbutton" value="[Project Name]">Expand</button>
|*| |   |   |   |   </div>
|*| |   |   |   |   <img class="projectthumbnail" src="[Project Thumbnail]"></img>
|*| |   |   |   |   <p class="projectdate">[Date]</p>
|*| |   |   |   |   <p class="projectname">[Project Name]</p>
|*| |   |   |   |   <p class="projectblurb">[Project Blurb]</p>
|*| |   |   |   |   <div class="projecttaglist">
|*| |   |   |   |   |   ...
|*| |   |   |   |   |   <p class="projecttag">[Project Tag]</p>
|*| |   |   |   |   |   ...
|*| |   |   |   |   </div>
|*| |   |   |   </div>
|*| |   |   </project-list-item>
|*| |   |   ...
|*| |   </div>
|*| </project-list>
\*/
export class ProjectListElement extends LitElement
{
	// Set the CSS data
	static styles = [ ProjectListElement_StyleCSS, ProjectListItemElement_StyleCSS ];

	// For a better view of the HTML layout, see the comment block above.
	render() // LIT event that contructs the tag's HTML.
	{
		// If there are no projects, show error.
		if(AllProjects.length == 0)
		{
			return html`
				<div><li class="project">
					<img class="projectthumbnail" src="/placeholder.jpg"></img>
					<p class="projectname">An Error Message</p>
					<p class="projectblurb">Um... uh... this is where I list my projects... but there was a problem fetching them!</p>
					<ul class="projecttaglist">
						<li class="projecttag">Error message</li>
						<li class="projecttag">You're not supposed to see this!</li>
					</ul>
				</li></div>`;
		}
		// If there are no projects that match the filters, show so.
		if(DisplayedProjectsIndexes.length == 0)
		{
			return html`
				<div><li class="project">
					<img class="projectthumbnail"></img>
					<p class="projectname">No projects match the filters!</p>
					<p class="projectblurb"> </p>
					<ul class="projecttaglist">
						<li class="projecttag"> </li>
					</ul>
				</li></div>`;
		}
		return html`
			<div>
			${
				// For each project that we want to display
				DisplayedProjectsIndexes.map(function(projIndex) // index into AllProjects[].
				{
					// Give the project list item the reference to the project
					// It would be nice to store the index into DisplayedProjectsIndexes[] but when
					//   I tried it, the filtering broke for a reason I failed to find after 2 days.
					return html`<project-list-item projindex=${projIndex}></project-list-item>`;
				})
			}
			</div>`;
	}

	// ProjectListItem.ExpandProject() for when you only have its index into DisplayedProjectsIndexes[].
	FindAndExpandProject(/*index*/ allProjIndex)
	{
		// querySelectorAll()'s return value Cannot do .find() because projList
		//    is not actually an array, even though it supports forEach().
		let projList = Array.from(this.shadowRoot.querySelectorAll(`project-list-item`));
		
		// Out of all displaying projects, get the one that has the matching AllProjects[] index.
		let projListItem = projList[allProjIndex];

		//console.log("FindAndExpandProject   ");// + "  " + projListItem);
		//console.log(projList);
		//console.log(projListItem);

		if(projListItem)
		{
			projListItem.ExpandProject();
		}
		else
		{
			console.error(`Error: could not find project list item with project index "${allProjIndex}" to expand!`);
		}
	}
}
// registers the ProjectListElement class as "project-list" in the DOM
customElements.define("project-list", ProjectListElement);

export class ProjectListItemElement extends LitElement
{
	// defines attributes
	static properties =
	{
		projIndex: {type: Number}, // The index into AllProjects[].

		// don't want it as an attribute, so state = true (makes it internal)
		// convention to put underscore in front
		_viewState: {type: String, state: true}, // Also what the view project button text will be
		_listenForScroll: {type: Boolean, state: true}, // If true, code will run when the window scrolls

		// Project data is NOT stored in the LIT element as the project may be filtered out, but the data must still exist.
	};

	// Set the CSS data
	static styles = [ ProjectListItemElement_StyleCSS, ProjectListItemElement_AnimationCSS, ];
	
	connectedCallback() 
	{
		super.connectedCallback();

		// init values
		this._viewState = ProjectExpandName;
		this._listenForScroll = false;

		// Be able to listen for scrolling 
		// Adding and removing listener done to ensure only one listener per project list item
		//   https://lit.dev/docs/v1/components/events/#add-event-listeners-in-connectedcallback
		document.addEventListener("scroll", () => this._updateAnimationOnScroll(this));
	}

	disconnectedCallback()
	{
		// Stop listening for scrolling by removing the exact same thing we added in connectedCallback()
		document.removeEventListener("scroll", () => this._updateAnimationOnScroll(this));

		super.disconnectedCallback();
	}

	/*firstUpdated()
	{
		if(this.projIndex == 0) // THIS IS PURELY FOR TESTING SO I DON'T HAVE TO PRESS EXPAND PROJECT EVERY TIME
		{
			this.ExpandProject(); // TEMP
		}
	}*/

	// For a better view of the HTML layout, see the comment block above.
	render() // LIT event that contructs the tag's HTML.
	{
		// Constructs the HTML project list based on filters and adds functionality to its buttons.
		// Filtering must be called beforehand via FilterProjects().
		let project = AllProjects[this.projIndex];
		return html`
            <div class="project">
                <div class="projectanim">
                    <button @click=${this._viewButtonClicked} class="viewprojectbutton" value="${project.name}">${this._viewState}</button>
                </div>
                <img class="projectthumbnail" src="${project.datapath}${project.thumbnail}"></img>
                <p class="projectdate">${project.GetDisplayDate()}</p>
                <p class="projectname">${project.name}</p>
                <p class="projectblurb">${project.blurb}</p>
                <div class="projecttaglist">
					${project.tags.map(function(t)
					{
						return html`<p class="projecttag">${t}</p>`;
					})}
                </div>
            </div>`;
	}

	// underscore is conventional when internal to the class (JavaScript has no actual way to declare it formally)
	_viewButtonClicked(b)
	{
		// expanding or shrinking based on current state
		if(this._viewState == ProjectExpandName)
		{
			this.ExpandProject();
		}
		else
		{
			this.ShrinkProject();
		}
	}

	ExpandProject()
	{
		// The <div> in the shadow root that contains everything else
		let projectContainer = this.shadowRoot.firstElementChild;
		// The animated <div> inside the project
		let projectAnimation = projectContainer.querySelector(".projectanim");

		// first check if another project is currently expanded, and shrink it.
		let delay = "0s"; // if we don't have to wait for a previous project to shrink first
		if(CurrentlyViewedProject != undefined)
		{
			CurrentlyViewedProject.ShrinkProject();
			// If there is another project, we want to start expanding the new project right after the shrinking
			//   of the previous project, so we want to delay the expand anim by the duration of the shrink anim.
			// This is actually the duration of the NEW project, not the one just shrunk. If we wanted to use the duration of the
			//   shrinking project, we would have to store it in the HTML tag because for some reason JavaScript can't read CSS.
			delay = "calc(var(--projectanim-duration) * 0.25)";
		}
		// set the delay
		projectContainer.style.setProperty("--projectanim-delay", delay);
		
		// project will expand from the CURRENT size to cover the viewport
		//   CURRENT size because if the shrinking was interrupted by the user then it should expand from where it is
		this._setProjectAnimationFromRect(projectContainer, projectAnimation);
		this._setProjectAnimationToViewport(projectContainer);

		// set to the expand animation
		projectContainer.style.setProperty("--projectanim-animation", ProjectExpandName);
		this._viewState = ProjectShrinkName; // set the label

		// We are now the currently expanded project
		CurrentlyViewedProject = this;

		// When the animation ends, run this
		projectAnimation.onanimationend = () =>
		{
			// View the project in the project viewer
			ViewProjectInViewer(this.projIndex);
		};
	}

	ShrinkProject()
	{
		// The <div> in the shadow root that contains everything else
		let projectContainer = this.shadowRoot.firstElementChild;
		// The animated <div> inside the project
		let projectAnimation = projectContainer.querySelector(".projectanim");

		// If a project can shrink it is currently expanded.
		//   There can only be 1 expanded project at any given time, so if this project
		//   is NOT the currently expanded one, then we have two expanded projects.
		if(this != CurrentlyViewedProject)
		{
			console.warn(`Warning: somehow two projects are expanded: "${CurrentlyViewedProject.projIndex}" and "${this.projIndex}", shrinking both...`);
			CurrentlyViewedProject.ShrinkProject();
		}

		// wipe any delay
		projectContainer.style.setProperty("--projectanim-delay", "0s");

		// project will shrink from the CURRENT size to the project rect
		//   CURRENT size because if the expanding was interrupted by the user then it should shrink from where it is
		this._setProjectAnimationFromRect(projectContainer, projectAnimation);
		this._setProjectAnimationToRect(projectContainer, projectContainer);
		this._listenForScroll = true; // continuously set the ToRect in case the screen scrolls

		// set to the shrink animation
		projectContainer.style.setProperty("--projectanim-animation", ProjectShrinkName);
		this._viewState = ProjectExpandName; // set the label

		// There is now no currently expanded project.
		CurrentlyViewedProject = undefined; // undefined, NOT null.

		// Immediately hide the project viewer
		ClearProjectViewer();
		
		// When the animation ends, run this
		projectAnimation.onanimationend = () =>
		{
			this._listenForScroll = false;
			projectContainer.style = null; // clear inline style
		};
	}

	// Do not call, only called by listening for window scrolling
	_updateAnimationOnScroll()
	{
		// Because this listens to the window scroll event, it will happen very often and very quickly.
		//   This means we need to efficiently stop the ones that don't need to be running at that moment.
		if(!this._listenForScroll) { return; }

		// The <div> in the shadow root that contains everything else
		let projectContainer = this.shadowRoot.firstElementChild;
		
		// If we are currently in the shrinking animation
		let animName = projectContainer.style.getPropertyValue("--projectanim-animation");
		if(animName == ProjectShrinkName)
		{
			// Continuously update the end position to the container
			this._setProjectAnimationToRect(projectContainer, projectContainer);
		}
	}

	// Set the rect that the animation will expand/shrink from the rect of the reference HTML tag
	_setProjectAnimationFromRect(/*HTML Tag*/ project, /*HTML Tag*/ fromTagRef)
	{
		let rect = fromTagRef.getBoundingClientRect();
		project.style.setProperty("--projectanim-from-top", rect.top+"px");
		project.style.setProperty("--projectanim-from-left", rect.left+"px");
		project.style.setProperty("--projectanim-from-width", rect.width+"px");
		project.style.setProperty("--projectanim-from-height", rect.height+"px");
	}

	// Set the rect that the animation will expand/shrink to the rect of the reference HTML tag
	_setProjectAnimationToRect(/*HTML Tag*/ project, /*HTML Tag*/ toTagRef)
	{
		let rect = toTagRef.getBoundingClientRect();
		project.style.setProperty("--projectanim-to-top", rect.top+"px");
		project.style.setProperty("--projectanim-to-left", rect.left+"px");
		project.style.setProperty("--projectanim-to-width", rect.width+"px");
		project.style.setProperty("--projectanim-to-height", rect.height+"px");
	}

	// Set the rect so that the animation will expand/shrink to the entire viewport
	_setProjectAnimationToViewport(/*HTML Tag*/ project)
	{
		// At the top left of the viewport
		project.style.setProperty("--projectanim-to-top", "0px");
		project.style.setProperty("--projectanim-to-left", "0px");
		// 100% the width and height of the viewport
		project.style.setProperty("--projectanim-to-width", "100vw");
		project.style.setProperty("--projectanim-to-height", "100vh");
	}
}
// registers the ProjectListItemElement class as "project-list-item" in the DOM
customElements.define("project-list-item", ProjectListItemElement);
