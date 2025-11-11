/// Constant / Idempotent / Static Values
/// =====================================
import { ProjectShrinkName } from "./projectlist.js";


/// Global Session State Storage
/// ============================
import { AllProjects, DisplayedProjectsIndexes } from "./main.js";
import { CurrentlyViewedProject } from "./projectlist.js";


/// Runtime Functions
/// =================
import { UpdateURL } from "./main.js";
import { GetAllProjectsIndexFromDisplayIndex, GetDisplayIndexFromAllProjectsIndex } from "./filters.js";
import { FindAndExpandProject } from "./projectlist.js";

// Rerenders the expanded project viewer screen.
// To change what project is being viewed, call ViewProjectInViewer() instead.
export async function RefreshProjectViewer()
{
	// Get <project-viewer> tag and LIT regenerate html
	await document.querySelector("project-viewer").requestUpdate();
	UpdateURL();
}

// BYPASSES ANIMATION, if you want the animation, call FindAndExpandProject().
export async function ViewProjectInViewer(/*index*/ projIndex) // Get by index into to AllProjects[].
{
	let project = AllProjects[projIndex];
	
	let numFiles = project.viewerdatafiles.length; // how many files in total to load

	// Clear the current data and set the array to final size, since it might be filled out of order, even though
	//   accounting for array length is actually unnecessary because JavaScript can have any index filled at any
	//   time regardless of current array size, but that's gross and unreadable and I'm too used to C/C++/C# code)
	ProjectViewerElement.ProjectViewData = new Array(numFiles);
	
	// Dynamically load all files and load them IN THE SAME ORDER
	let numLoadedFiles = 0; // keep track of how many files have been loaded so far
	for(let i = 0; i < numFiles; i++)
	{
		let filename = project.viewerdatafiles[i];

		let fetchedFile;
		// Once fetched, add to the list of stuff shown when viewing.
		await FetchFile(project.datapath + filename, (data) => fetchedFile = data);

		if(fetchedFile == undefined)
		{
			fetchedFile = `<!---->`; // make it into a comment if the file couldn't be loaded
		}

		// Set by i instead of pushing since this runs in an asynchronous callback, so
		//   the order could be out depending on how long each file takes to be loaded.
		ProjectViewerElement.ProjectViewData[i] = [filename, fetchedFile];

		numLoadedFiles++;
		// If this is the final file loaded, refresh to display. Refreshing every
		//   time a file is loaded is unnecessary, and may cause multiple flashes.
		if(numLoadedFiles == numFiles)
		{
			ProjectViewerElement.ProjIndex = projIndex;
			ProjectViewerElement.Displaying = true;
			RefreshProjectViewer();
		}
	}
}
// BYPASSES ANIMATION, if you want the animation, call FindAndExpandProject().
export function ClearProjectViewer()
{
	ProjectViewerElement.Displaying = false;
	ProjectViewerElement.ProjectViewData = [];
	RefreshProjectViewer();
}


/// Helper Functions
/// ================
import { FetchFile } from "./main.js";


/// Page and HTML construction
/// ==========================
import {LitElement, html, unsafeHTML} from "https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/all/lit-all.min.js"; // lit-all for unsafeHTML.
import dompurify from "https://cdn.jsdelivr.net/npm/dompurify@3.2.4/+esm"; // For sanitizing HTML

// Get CSS data for LIT components
import { ProjectListItemElement_StyleCSS, ProjectViewerElement_StyleCSS } from "./styleLIT.js";

// Entire generated inner HTML of <project-viewer></project-viewer>.
/*\
|*| <project-viewer>
|*| |   <div id="projectviewer">
|*| |   |   ...
|*| |   |   <div filename="[Loaded File Name]">
|*| |   |   |   <!-- See FetchFile() in main.js for what can appear here -->
|*| |   |   </div>
|*| |   |   ...
|*| |   </div>
|*| </project-viewer>
\*/
export class ProjectViewerElement extends LitElement
{
	// These are static members and not properties since there are only one
	//   of each, and need to be accessed without reference to the LIT tag.
	static ProjIndex; // Index of the viewed project into AllProjects[].
	static ProjectViewData = []; // fetched project view data set in ViewProjectInViewer().
	static Displaying = false; // If false, nothing will render.

	// Get the projects that display before and after this project, returning undefined if
	//   at one end of list. Conveniently don't need to check for OutOfBounds array access
	//   because JavaScript. It will just return undefined, which is actually what we want.
	// 
	// WHAT THESE FUNCTIONS ARE DOING: Get this project's display index, adjust by 1 to get
	//   prev/next project's display index, then get the project with its AllProjects[] index.
	static GetPrevProject = () => AllProjects[DisplayedProjectsIndexes[GetDisplayIndexFromAllProjectsIndex(ProjectViewerElement.ProjIndex) - 1]];
	static GetNextProject = () => AllProjects[DisplayedProjectsIndexes[GetDisplayIndexFromAllProjectsIndex(ProjectViewerElement.ProjIndex) + 1]];

	// Set the CSS data
	static styles = [ ProjectViewerElement_StyleCSS, ProjectListItemElement_StyleCSS ];

	// For a better view of the HTML layout, see the comment block above.
	render() // LIT event that contructs the tag's HTML.
	{
		// If there is no project to display, render nothing
		//   as to not cover any other element in the window
		if(!ProjectViewerElement.Displaying)
		{
			return html``;
		}

		// Get the previous and next projects' names to display.
		let prevProject = ProjectViewerElement.GetPrevProject();
		let nextProject = ProjectViewerElement.GetNextProject();
		let prevName = (prevProject) ? prevProject.name : "";
		let nextName = (nextProject) ? nextProject.name : "";
		
		// Add the topbar and each loaded file to the project viewer.
		return html`
			<div id="projectviewer">
				<div id="projectviewertopbar" class="centerthree">
					<div><p>${prevName}</p></div>
					<div class="centerthree">
						${ // If there is no previous project, disable the prev project button
						(prevProject) // Lines are identical except for button being disabled
						? html`<div><button @click=${this._viewPrevProject} class="viewprojectbutton"         >Prev</button></div>`
						: html`<div><button @click=${this._viewPrevProject} class="viewprojectbutton" disabled>Prev</button></div>`
						}

						<div><button @click=${this._stopViewingProject} class="viewprojectbutton">${ProjectShrinkName}</button></div>

						${ // If there is no next project, disable the next project button
						(nextProject) // Lines are identical except for button being disabled
						? html`<div><button @click=${this._viewNextProject} class="viewprojectbutton"        >Next</button></div>`
						: html`<div><button @click=${this._viewNextProject} class="viewprojectbutton"disabled>Next</button></div>`
						}
					</div>
					<div><p>${nextName}</p></div>
				</div>
				<div id="projectviewerdata">
					${ // For each file. index is unused but kept to make clear that these are indexed by file order, not by filename. 
						Object.entries(ProjectViewerElement.ProjectViewData).map(function([index, [filename, contents]])
						{
							// unsafeHTML is used because of markdown, but we have sanitized
							return html`<div filename="${dompurify.sanitize(filename)}">${unsafeHTML(dompurify.sanitize(contents))}</div>`;
						})
					}
				</div>
			</div>`;
	}

	_stopViewingProject()
	{
		CurrentlyViewedProject.ShrinkProject();
		UpdateURL();
	}

	_viewPrevProject()
	{
		if(ProjectViewerElement.GetPrevProject())
		{
			FindAndExpandProject(GetDisplayIndexFromAllProjectsIndex(ProjectViewerElement.ProjIndex) - 1);
			UpdateURL();
		}
	}

	_viewNextProject()
	{
		if(ProjectViewerElement.GetNextProject())
		{
			FindAndExpandProject(GetDisplayIndexFromAllProjectsIndex(ProjectViewerElement.ProjIndex) + 1);
			UpdateURL();
		}
	}
}
// registers the ProjectViewerElement class as "project-viewer" in the DOM
customElements.define("project-viewer", ProjectViewerElement);