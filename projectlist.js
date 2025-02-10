/// Constant / Idempotent / Static Values
/// =====================================
// Print names for the project button as well as their corresponding animation name
const ProjectExpandName = "Expand"
const ProjectShrinkName = "Shrink"


/// Global Session State Storage
/// ============================
var CurrentlyViewingProjectButton; // Keep track of the project in the list who's content is in the viewer
import
{
	AllProjects,
	DisplayedProjectsIndexes,
}
from "./main.js";


/// Runtime Functions
/// =================
import { ViewProjectInViewer } from "./projectviewer.js";

// Refresh the project list HTML
export function RefreshProjectList()
{
    const ProjectList = document.getElementById("projectlist");
	ProjectList.requestUpdate(); // LIT regenerate html
}


/// Page and HTML construction
/// ==========================
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

// Get CSS data for LIT components
import
{
	ProjectListElement_StyleCSS,
	ProjectListItemElement_StyleCSS,
	ProjectListItemElement_AnimationCSS,
}
from "./styleLIT.js"

// Project data is NOT stored in the LIT element as the project may be filtered out, but the data must still exist
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

export class ProjectListElement extends LitElement
{
	// Set the CSS data
	static styles = [ ProjectListElement_StyleCSS ];

	render() // LIT event that contructs the tag's HTML.
	{
		// For each project that we want to display
		return html`
		<ul id="projectlist">
		${
			DisplayedProjectsIndexes.map(function(index)
			{
				return html`<project-list-item index="${index}"></project-list-item>`;
			})
		}
		</ul>`;
	}
}
// registers the ProjectListElement class as "project-list" in the DOM
customElements.define("project-list", ProjectListElement);

export class ProjectListItemElement extends LitElement
{
	// defines attributes
	static properties =
	{
		index: {type: Number},
		
		// don't want it as an attribute, so state = true (makes it internal)
		// convention to put underscore in front
		_viewState: {type: String, state: true}

		// Project data is NOT stored in the LIT element as the project may be filtered out, but the data must still exist.
	};

	// Set the CSS data
	static styles = [ ProjectListItemElement_StyleCSS, ProjectListItemElement_AnimationCSS, ];

	constructor()
	{
		super();
		this._viewState = ProjectExpandName;
	}

	render() // LIT event that contructs the tag's HTML.
	{
		// Constructs the HTML project list based on filters and adds functionality to its buttons.
		// Filtering must be called beforehand via FilterProjects().
		let project = AllProjects[this.index];
		return html`
            <li class=\"project\" value=\"${project.name}\">
                <div class=\"projectanim\">
                    <button @click=${this._viewButtonClicked} class=\"viewprojectbutton\" value=\"${project.name}\">${this._viewState}</button>
                </div>
                <img class=\"projectimg\" src=\"${project.folderpath}/thumbnail.png\"></img>
                <p class=\"projectdate\">${project.date.toLocaleDateString()}</p>
                <p class=\"projectname\">${project.name}</p>
                <p class=\"projectdesc\">${project.blurb}</p>
                <ul class=\"projecttaglist\">
					${project.tags.map(function(t)
					{
						return html`<li class=\"projecttag\">${t}</li>`;
					})}
                </ul>
            </li>`;
	}

	// underscore is conventional when internal to the class (JavaScript has no actual way to declare it formally)
	_viewButtonClicked(b)
	{
		// if the button will make the project expand
		if(this._viewState == ProjectExpandName)
		{
			this._expandProject(b.target); // Pass the BUTTON as we need to modify its label
		}
		else // if the button will make the project shrink (or if it says anything else since the user could modify it)
		{
			this._shrinkProject(b.target); // Pass the BUTTON as we need to modify its label
		}
	}

	// Pass the BUTTON and not the project parent as the button's label is modified
	_expandProject(/*HTML tag*/ viewprojectbutton)
	{
		let projectAnimation = viewprojectbutton.parentNode;
		let projectListItem = projectAnimation.parentNode;

		// first check if another project is currently expanded, and shrink it.
		let delay;
		if(CurrentlyViewingProjectButton != undefined)
		{
			this._shrinkProject(CurrentlyViewingProjectButton);
			// If there is another project, we want to start expanding the new project right after the shrinking
			//   of the previous project, so we want to delay the expand anim by the duration of the shrink anim.
			// This is actually the duration of the NEW project, not the one just shrunk. If we wanted to use the duration of the
			//   shrinking project, we would have to store it in the HTML tag because for some reason JavaScript can't read CSS.
			delay = "calc(var(--projectanim-duration) * 0.5)";
		}
		else
		{
			delay = "0s"; // if we don't have to wait for a previous project to shrink first
		}
		// set the delay
		projectListItem.style.setProperty("--projectanim-delay", delay);
		
		// project will expand from the CURRENT size to cover the viewport
		//   CURRENT size because if the shrinking was interrupted by the user then it should expand from where it is
		this._setProjectAnimationFromRect(projectListItem, projectAnimation);
		this._setProjectAnimationToViewport(projectListItem);

		// set to the expand animation
		projectListItem.style.setProperty("--projectanim-animation", ProjectExpandName);
		this._viewState = ProjectShrinkName; // set the label
		
		// We are now the currently expanded project
		CurrentlyViewingProjectButton = viewprojectbutton;

		// View the project in the project viewer
		let project = AllProjects[projectListItem.value];
		ViewProjectInViewer(project);
	}

	// Pass the BUTTON and not the project parent as the button's label is modified
	_shrinkProject(/*HTML tag*/ viewprojectbutton)
	{
		let projectAnimation = viewprojectbutton.parentNode;
		let projectListItem = projectAnimation.parentNode;

		// If a project can shrink it is currently expanded.
		//   There can only be 1 expanded project at any given time, so if this project
		//   is NOT the currently expanded one, then we have two expanded projects.
		if(viewprojectbutton.value != CurrentlyViewingProjectButton.value)
		{
			console.error(`Error: somehow two projects are expanded: \"${CurrentlyViewingProjectButton.value}\" and \"${viewprojectbutton.value}\".`);
		}

		// wipe any delay
		projectListItem.style.setProperty("--projectanim-delay", "0s");

		// project will shrink from the CURRENT size to the project rect
		//   CURRENT size because if the expanding was interrupted by the user then it should shrink from where it is
		this._setProjectAnimationFromRect(projectListItem, projectAnimation);
		this._setProjectAnimationToRect(projectListItem, projectListItem);

		// set to the shrink animation
		projectListItem.style.setProperty("--projectanim-animation", ProjectShrinkName);
		this._viewState = ProjectExpandName; // set the label

		// There is now no currently expanded project.
		CurrentlyViewingProjectButton = undefined; // undefined, NOT null.
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
