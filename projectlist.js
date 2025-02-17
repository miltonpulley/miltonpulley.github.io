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
import { ViewProjectInViewer, ClearProjectViewer } from "./projectviewer.js";

// Rerenders the project list based on filters.
// To modify filters, call FilterProjects() beforehand.
export function RefreshProjectList()
{
	// Get <project-list> tag and LIT regenerate html
	document.querySelector("project-list").requestUpdate();
}

// ProjectListItem.ExpandProject() for when you only have index into DisplayedProjectsIndexes[].
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
	viewerdatapath = "";
	viewerdatafiles = [];

	constructor(name, date, blurb, tags, viewerdatapath, viewerdatafiles)
	{
		this.name = name;
		this._date = date;
		this.blurb = blurb
		this.tags = tags;
		this.viewerdatapath = viewerdatapath;
		this.viewerdatafiles = viewerdatafiles;
	}

	describe()
	{
		return `Project "${this.name}": (${this.GetDisplayDate()}), ${this.blurb}, [${this.tags}], "${this.viewerdatapath}" [${this.viewerdatafiles}].`;
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
|*| |   |   <project-list-item displayIndex="[Index into DisplayedProjectsIndexes[] Array]">
|*| |   |   |   <div class="project">
|*| |   |   |   |   <div class="projectanim">
|*| |   |   |   |   |   <button class="viewprojectbutton" value="[Project Name]">Expand</button>
|*| |   |   |   |   </div>
|*| |   |   |   |   <img class="projectimg" src="[Project Image]"></img>
|*| |   |   |   |   <p class="projectdate">[Date]</p>
|*| |   |   |   |   <p class="projectname">[Project Name]</p>
|*| |   |   |   |   <p class="projectdesc">[Project Description]</p>
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
					<img src="/placeholder.jpg" class="projectimg"></img>
					<p class="projectname">An Error Message</p>
					<p class="projectdesc">Um... uh... this is where I list my projects... but there was a problem fetching them!</p>
					<ul class="projecttaglist">
						<li class="projecttag">Error message</li>
						<li class="projecttag">You're not supposed to see this!</li>
					</ul>
				</li></div>`;
		}
		// If there are no projects that match the filters, show so.
		if(DisplayedProjectsIndexes.length == 0)
		{
			return html`<div><li class="project"><p class="projectdesc">No projects match the filters!</p></li></div>`;
		}
		return html`
			<div>
			${
				// For each project that we want to display
				DisplayedProjectsIndexes.map(function(allProjIndex, displayedProjIndex)
				{
					// Get the indexes of the projects that display before and after this project, undefined
					//   if at one end of list. Conveniently don't need to check for OutOfBounds array access
					//   because JavaScript. It will just return undefined, which is actually what we want.
					// let prev = DisplayedProjectsIndexes[displayedProjIndex - 1];
					// let next = DisplayedProjectsIndexes[displayedProjIndex + 1];
					// console.log(allProjIndex + ", " + displayedProjIndex + ", " + prev + ", " + next);

					// Give the project list item the reference to the project
					return html`<project-list-item displayIndex="${displayedProjIndex}"></project-list-item>`;
					// return html`<project-list-item displayIndex="${displayedProjIndex}" .prevIndex="${prev}" .nextIndex="${next}"></project-list-item>`;
				})
			}
			</div>`;
	}

	// ProjectListItem.ExpandProject() for when you only have index into DisplayedProjectsIndexes[].
	FindAndExpandProject(/*index*/ displayIndex)
	{
		let projListItem = this.shadowRoot.querySelector(`project-list-item[displayIndex="${displayIndex}"]`);
		if(projListItem)
		{
			projListItem.ExpandProject(displayIndex);
		}
		else
		{
			console.error(`Error: could not find project list item with display index "${displayIndex}" to expand!`);
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
		displayIndex: {type: Number}, // The index into DisplayedProjectsIndexes[].
		// prevIndex: {type: Number}, // The previous displaying project's index into AllProjects
		// nextIndex: {type: Number}, // The next displaying project's index into AllProjects

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
		if(this.displayIndex == 0) // THIS IS PURELY FOR TESTING SO I DON'T HAVE TO PRESS EXPAND PROJECT EVERY TIME
		{
			this.ExpandProject(); // TEMP
		}
	}*/

	// For a better view of the HTML layout, see the comment block above.
	render() // LIT event that contructs the tag's HTML.
	{
		// Constructs the HTML project list based on filters and adds functionality to its buttons.
		// Filtering must be called beforehand via FilterProjects().
		let project = AllProjects[DisplayedProjectsIndexes[this.displayIndex]];
		return html`
            <div class="project">
                <div class="projectanim">
                    <button @click=${this._viewButtonClicked} class="viewprojectbutton" value="${project.name}">${this._viewState}</button>
                </div>
                <img class="projectimg" src="${project.viewerdatapath}thumbnail.png"></img>
                <p class="projectdate">${project.GetDisplayDate()}</p>
                <p class="projectname">${project.name}</p>
                <p class="projectdesc">${project.blurb}</p>
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
			ViewProjectInViewer(this.displayIndex);
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
			console.warn(`Warning: somehow two projects are expanded: "${CurrentlyViewedProject.displayIndex}" and "${this.displayIndex}", shrinking both...`);
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
