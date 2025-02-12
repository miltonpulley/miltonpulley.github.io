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
	ProjectViewerElement.projectViewData = {}; // clear the data

	// Dynamically load all files and load them
	project.viewerdatafiles.forEach((file) => 
	{
		FetchFile(project.viewerdatapath + file,
		(data) => // Once fetched, add to the list of stuff shown when viewing.
		{
			ProjectViewerElement.projectViewData[file] = data;
			RefreshProjectViewer(); // Refresh after loading
		});
	});
	// No point in refreshing here because code here will be called BEFORE the FetchFile callback above.
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