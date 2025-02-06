/// Constant / Idempotent / Static Values
/// =====================================


/// Global Session State Storage
/// ============================


/// Page and HTML construction
/// ==========================
// Constructs the HTML expanded project viewer screen and adds functionality to its buttons.
// Do not call this to change what project is being viewed, instead use ViewProjectInViewer().
export function GenerateProjectViewer()
{
	GenerateProjectViewerHTML();
	AddProjectViewerButtonFunctionality();
}

function GenerateProjectViewerHTML() // Do not call, instead call GenerateProjectViewer().
{
	//let result = "";
	//result += 
}

function AddProjectViewerButtonFunctionality()
{

}


/// Runtime Functions
/// =================
export function ViewProjectInViewer(/*Project*/ project)
{
	console.log(project.folderpath);
}



function ViewProject(/*Function Callback*/ callback)
{
	ExpandProject();
}

// async function getFile()
// {
// 	let myPromise = new Promise(function(resolve)
// 	{
// 		let req = new XMLHttpRequest();
// 		req.open('GET', "mycar.html");
// 		req.onload = function()
// 		{
// 			if(req.status == 200)
// 			{
// 				resolve(req.response);
// 			}
// 			else
// 			{
// 				resolve("File not Found");
// 			}
// 		};
// 		req.send();
// 	});
// 	document.getElementById("demo").innerHTML = await myPromise;
// }

// getFile();