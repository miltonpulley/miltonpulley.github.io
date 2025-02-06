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
import
{
	ViewProjectInViewer
}
from "./projectviewer.js";


/// Page and HTML construction
/// ==========================
// Constructs the HTML project list based on filters and adds functionality to its buttons.
// Filtering must be called beforehand via FilterProjects().
export function GenerateProjectList()
{
    GenerateProjectListHTML();
    AddProjectListButtonFunctionality();
}

/// Generated HTML layout:
/*\
|*| <ul id="projectlist">
|*| |   ...
|*| |   <li class="project" value="[ProjectList[] ID]">
|*| |   |   <div class="projectanim">
|*| |   |   |   <button value="[Project Name]" class="viewprojectbutton">Expand</button>
|*| |   |   </div>
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
function GenerateProjectListHTML() // Do not call, instead call GenerateProjectList().
{
    let result = "";
    // For each project that we want to display
    DisplayedProjectsIndexes.forEach((index) =>
    {
        const project = AllProjects[index];
        // Add each html tag
        result += `
            <li class=\"project\" value=\"${index}\">
                <div class=\"projectanim\">
                    <button class=\"viewprojectbutton\" value=\"${project.name}\">Expand</button>
                </div>
                <img class=\"projectimg\" src=\"${project.folderpath}/thumbnail.png\"></img>
                <p class=\"projectdate\">${project.date.toLocaleDateString()}</p>
                <p class=\"projectname\">${project.name}</p>
                <p class=\"projectdesc\">${project.blurb}</p>
                <ul class=\"projecttaglist\">
                    ${AddProjectTagsHTML(project.tags)}
                </ul>
            </li>`;
    });
    const ProjectList = document.getElementById("projectlist");
    ProjectList.innerHTML = result;
}

// Insert a project's tags into the HTML.
// see GenerateProjectListHTML()'s output for how this outputs.
function AddProjectTagsHTML(/*string[]*/ tags) // Do not call, instead call GenerateProjectList().
{
    let result = "";
    tags.forEach((t) =>
    {
        result += `<li class=\"projecttag\">${t}</li>`;
    });
    return result;
}

function AddProjectListButtonFunctionality() // Do not call, instead call GenerateProjectList().
{
    // Now that we have all projects in the HTML, we need to add each one's button's functionality.
    let allViewProjectButtons = document.getElementsByClassName("viewprojectbutton");
    for(let b of allViewProjectButtons)
    {
        b.onclick = (b) => 
        {
            // if the button will make the project expand
            if(b.target.innerHTML == ProjectExpandName)
            {
                ExpandProject(b.target); // Pass the BUTTON as we need to modify its label
            }
            else // if the button will make the project shrink (or if it says anything else since the user could modify it)
            {
                ShrinkProject(b.target); // Pass the BUTTON as we need to modify its label
            }
        }
    };
}


/// Runtime Functions
/// =================

// Pass the BUTTON and not the project parent as the button's label is modified
function ExpandProject(/*HTML tag*/ viewprojectbutton)
{
	let projectAnimation = viewprojectbutton.parentNode;
	let projectListItem = projectAnimation.parentNode;

	// first check if another project is currently expanded, and shrink it.
	let delay;
	if(CurrentlyViewingProjectButton != undefined)
	{
		ShrinkProject(CurrentlyViewingProjectButton);
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
	SetProjectAnimationFromRect(projectListItem, projectAnimation);
	SetProjectAnimationToViewport(projectListItem);

	// set to the expand animation
	projectListItem.style.setProperty("--projectanim-animation", ProjectExpandName);
	viewprojectbutton.innerHTML = ProjectShrinkName; // set the label
	
	// We are now the currently expanded project
	CurrentlyViewingProjectButton = viewprojectbutton;

	// View the project in the project viewer
	let project = AllProjects[projectListItem.value];
	ViewProjectInViewer(project);
}

// Pass the BUTTON and not the project parent as the button's label is modified
function ShrinkProject(/*HTML tag*/ viewprojectbutton)
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
	SetProjectAnimationFromRect(projectListItem, projectAnimation);
	SetProjectAnimationToRect(projectListItem, projectListItem);

	// set to the shrink animation
	projectListItem.style.setProperty("--projectanim-animation", ProjectShrinkName);
	viewprojectbutton.innerHTML = ProjectExpandName; // set the label

	// There is now no currently expanded project.
	CurrentlyViewingProjectButton = undefined; // undefined, NOT null.
}

// Set the rect that the animation will expand/shrink from the rect of the reference HTML tag
function SetProjectAnimationFromRect(/*HTML Tag*/ project, /*HTML Tag*/ fromTagRef)
{
	let rect = fromTagRef.getBoundingClientRect();
	project.style.setProperty("--projectanim-from-top", rect.top+"px");
	project.style.setProperty("--projectanim-from-left", rect.left+"px");
	project.style.setProperty("--projectanim-from-width", rect.width+"px");
	project.style.setProperty("--projectanim-from-height", rect.height+"px");
}

// Set the rect that the animation will expand/shrink to the rect of the reference HTML tag
function SetProjectAnimationToRect(/*HTML Tag*/ project, /*HTML Tag*/ toTagRef)
{
	let rect = toTagRef.getBoundingClientRect();
	project.style.setProperty("--projectanim-to-top", rect.top+"px");
	project.style.setProperty("--projectanim-to-left", rect.left+"px");
	project.style.setProperty("--projectanim-to-width", rect.width+"px");
	project.style.setProperty("--projectanim-to-height", rect.height+"px");
}

// Set the rect so that the animation will expand/shrink to the entire viewport
function SetProjectAnimationToViewport(/*HTML Tag*/ project)
{
	// At the top left of the viewport
	project.style.setProperty("--projectanim-to-top", "0px");
	project.style.setProperty("--projectanim-to-left", "0px");
	// 100% the width and height of the viewport
	project.style.setProperty("--projectanim-to-width", "100vw");
	project.style.setProperty("--projectanim-to-height", "100vh");
}