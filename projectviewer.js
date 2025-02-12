/// Constant / Idempotent / Static Values
/// =====================================


/// Global Session State Storage
/// ============================


/// Runtime Functions
/// =================
// Rerenders the expanded project viewer screen.
// To change what project is being viewed, call ViewProjectInViewer() instead.
export function RefreshProjectViewer()
{
	// Get <project-viewer> tag and LIT regenerate html
	document.querySelector("project-viewer").requestUpdate();
}

export function ViewProjectInViewer(/*Project*/ project)
{
	let numFiles = project.viewerdatafiles.length;

	// Clear the current data and set the array to final size, since it might be filled out of order, even though
	//   accounting for array length is actually unnecessary because JavaScript can have any index filled at any
	//   time regardless of current array size, but that's gross and unreadable and I'm too used to C/C++/C# code)
	ProjectViewerElement.projectViewData = new Array(numFiles);

	// Dynamically load all files and load them
	for(let i = 0; i < numFiles; i++)
	{
		let file = project.viewerdatafiles[i];
		FetchFile(project.viewerdatapath + file,
		(data) => // Once fetched, add to the list of stuff shown when viewing.
		{
			// Set by i instead of pushing since this runs in an asynchronous callback, so
			//   the order could be out depending on how long each file takes to be loaded.
			ProjectViewerElement.projectViewData[i] = data;

			// If this is the final file loaded, refresh to display.
			if(i == numFiles - 1)
			{
				console.log(ProjectViewerElement.projectViewData);
				RefreshProjectViewer();
			}
		});
	}
}


/// Helper Functions
/// ================
import { FetchFile } from "./main.js"


/// Page and HTML construction
/// ==========================
import {LitElement, html, unsafeHTML} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import dompurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.2.4/+esm'; // For sanitizing HTML

// Get CSS data for LIT components
import { ProjectViewerElement_StyleCSS } from "./styleLIT.js"

// Entire generated inner HTML of <project-viewer></project-viewer>.
/*\
|*| <project-viewer>
|*| |   <div id="projectviewer">
|*| |   |   ...
|*| |   |   <div value="[Loaded File Name]">
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
	static projectViewData = []; // fetched project view data set in ViewProjectInViewer().

	// Set the CSS data
	static styles = [ ProjectViewerElement_StyleCSS ];

	// For a better view of the HTML layout, see the comment block above.
	render() // LIT event that contructs the tag's HTML.
	{
		return html`
			<div id="projectviewer">
				${Object.entries(ProjectViewerElement.projectViewData).map(function([filename, contents])
				{
					// unsafeHTML is used because of markdown, but we have sanitized
					return html`<div value="${filename}">${unsafeHTML(dompurify.sanitize(contents))}</div>`;
				})}
			</div>`;
	}
}
// registers the ProjectViewerElement class as "project-viewer" in the DOM
customElements.define("project-viewer", ProjectViewerElement);