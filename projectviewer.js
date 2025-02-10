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
	let ProjectViewer = document.getElementById("projectlist");
	ProjectViewer.requestUpdate(); // LIT regenerate html
}


export function ViewProjectInViewer(/*Project*/ project)
{
	console.log(project.folderpath);
}


/// Helper Functions
/// ================
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


/// Page and HTML construction
/// ==========================
function GenerateProjectViewerHTML() // Do not call, instead call GenerateProjectViewer().
{
	//let result = "";
	//result += 
}

function AddProjectViewerButtonFunctionality()
{

}
