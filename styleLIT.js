import { css } from "https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/core/lit-core.min.js";

/* Filter Area (FilterAreaElement in filters.js) */
/* ============================================= */
export const FilterAreaElement_StyleCSS = css`
:host *
{
	list-style: none;
}

:host > div
{
	margin: 2px auto 3vh;
	/* margin-top: 2px;
	margin-bottom: 3vh; */
	padding: 0px 0px 3px;
	width: 60em;
	min-width: fit-content;
	max-width: 100%;
	background-color: #d6d6d6;
	border: 0.1em solid #aaaaaa;
	border-radius: 2vw;
}

:host > div > h2 /* Filter Projects By Tags */
{
	display: inline-block;
	margin: 2px 0px 0px 2vw;
	width: fit-content;
	font-size: calc(1vw + 1.5em);
}

:host > div > p /* The 3 filter texts e.g. showing (#/#) projects */
{
	margin: 0.2em auto;
	width: fit-content;
	font-size: calc(1vw + 0.7em);
	align-content: center;
}

#filterallbuttons
{
	display: flex;
	flex-direction: row;
	margin-right: 2vw;
	width: auto;
	font-size: calc(0.4vw + 0.8em);
	justify-content: flex-end;
}

#filtercategories
{
	padding: 0px;
	text-align: center;
}

#filtercategories h3
{
	margin: 5px 0px 1px;
	text-align: center;
	font-size: calc(0.4vw + 1em);
}

.filtercategory
{
	display: flex;  
	flex-wrap: wrap;
	margin: 0px;
	padding: 0px;
	justify-content: center;
}

*[value] /* all ignored ("ig") or unspecified tags, and default of all others */
{
	margin: 0.1em; 
	padding: 0px 0.3em;
	font-size: calc(0.4vw + 1em);
	color: #000000;
	background-color: #efeaea;
	border: 0.15em solid #999999;
	border-radius: 0.4em;
}
button:hover /* all ignored ("ig") or unspecified tags, and default of all others */
{
	background-color: #fffafa;
}
*[value="wh"] /* all whitelisted tags */
{
	color: #333333;
	background-color: #f0f0f0;
	border-color: #444444;
}
button[value="wh"]:hover /* all whitelisted tags */
{
	background-color: #fefefe;
}
*[value="bl"] /* all blacklisted tags */
{
	color: #eeeeee;
	background-color: #111111;
	border-color: #eeeeee;
}
button[value="bl"]:hover /* all blacklisted tags */
{
	background-color: #313131;
}
`;

/* Project List (ProjectListElement in projectlist.js) */
/* =================================================== */
export const ProjectListElement_StyleCSS = css`
:host *
{
	list-style: none;
}

:host > div
{
	display: flex;
	flex-wrap: wrap;
	margin: 0px 1vw;
	padding: 0px 1vw;
	justify-content: center;
}
`;

/* Project List Item (ProjectListItemElement in projectlist.js) */
/* ============================================================ */
export const ProjectListItemElement_StyleCSS = css`
:host *
{
	list-style: none;
}

.project
{
	--projectimg-height: 50%;
	--projectimg-margin-bottom: 2px;
	--projectdesc-margin-left-right: 0.15em;

	--projectanim-animation: ""; /* set by JavaScript and read by .projectanim */
	--projectanim-duration: 1s; /* read by JavaScript and by .projectanim */
	--projectanim-delay: 0s; /* set by JavaScript and read by .projectanim */

	/* The rect that the project animation starts with, set by JavaScript and read by .projectanim */
	--projectanim-from-top: 0;
	--projectanim-from-left: 0;
	--projectanim-from-width: 0;
	--projectanim-from-height: 0;

	/* The rect that the project animation ends with, set by JavaScript and read by .projectanim */
	--projectanim-to-top: 0;
	--projectanim-to-left: 0;
	--projectanim-to-width: 0;
	--projectanim-to-height: 0;

	position: relative;
	display: flex;
	flex-direction: column;
	/* flex: 0 0 0; */
	margin: 0.2em;
	min-width: 30em;
	max-height: calc(20em + 1.2vh);
	aspect-ratio:  4 / 3;
	background-color: #cccccc;
	border: 0.25em solid #666666;
	border-radius: 0.5em;
}

.viewprojectbutton
{
	position: absolute;
	top: 0;
	margin: 4px;
	padding: 0.1em 0.15em;
	visibility: visible; /* To be visible regardless of parent .projectanim */
	font-size: 1.4em;
	background-color: #fbf1f7;
	border: 0.1em solid #777777;
	border-radius: 0.3em;
}
.viewprojectbutton:hover
{
	background-color: #ffffff;
}

.projectdate
{
	position: absolute;
	right: 0;
	margin: 4px;
	padding: 0.1em 0.15em;
	font-size: 1.4em;
	background-color: #cccccc;
	border: 0.1em solid #777777;
	border-radius: 0.3em;
}

.projectimg
{
	flex: 0 0 var(--projectimg-height);
	margin: 2px;
	margin-bottom: var(--projectimg-margin-bottom);
	margin-inline: auto;
	padding: 0px;
	width: auto;
	height: var(--projectimg-height);
	aspect-ratio: auto;
}

.projectname
{
	position: absolute;
	bottom: calc(var(--projectimg-height) - var(--projectimg-margin-bottom) - 2px);
	margin: 2px var(--projectdesc-margin-left-right);
	margin-bottom: 0px;
	padding: 2px 0.25em;
	font-size: 1.8em;
	background-color: #ccccccaa;
	border-top: 0.1em solid #777777;
	border-right: 0.1em solid #777777;
	border-radius: 0 0.4em 0 0;
}

.projectdesc
{
	display: inline-block;
	margin: 0 var(--projectdesc-margin-left-right);
	max-height: 3.4em; /* If I can't write the desc in 3 lines or less, it's too probably too long. */
	font-size: 2em;
	overflow: hidden;
	line-height: 1.1em;
	border-top: 0.1em solid #777777;
}

.projecttaglist
{
	display: flex;
	flex: 1 0 auto;
	flex-wrap: wrap-reverse;
	margin: 1px;
	padding: 2px;
	width: auto;
	justify-content: flex-end;
	align-items: flex-start;
	align-content: end;
}

.projecttag
{
	/* flex: 0 0 auto; */
	margin: 1px;
	padding: 1px;
	font-size: 0.9em;
	background-color: #bfbfbf;
	border: 0.1em solid #888888;
	border-radius: 0.2em;
}
`;

/* Project List Item Animation (ProjectListItemElement in projectlist.js) */
/* ====================================================================== */
export const ProjectListItemElement_AnimationCSS = css`
.projectanim
{
	position: absolute;
	inset: 0px;
	margin: 0;
	width: auto;
	height: auto;
	z-index: 2; /* to be under all expand/shrink buttons */
	visibility: hidden;
	background-color: #cccccc; /* Black and transparent */

	animation-name: var(--projectanim-animation); /* animaton switched by JavaScript */
	animation-duration: var(--projectanim-duration);
	animation-delay: var(--projectanim-delay);
	animation-iteration-count: 1; /* plays once each time --projectanim-animation is set */
	animation-fill-mode: forwards; /* keep the state of the last frame of animation */
	animation-play-state: running; /* always run, will effectively stop at end of each animation */
	animation-timing-function: ease-in-out;
}

@keyframes Expand /* expand and shrink are both slightly different animations */
{
	0%
	{
		position: fixed;
		top: var(--projectanim-from-top);
		left: var(--projectanim-from-left);
		width: var(--projectanim-from-width);
		height: var(--projectanim-from-height);
		visibility: visible;
		background-color: #00000000; /* Black and transparent */
	}
	100%
	{
		position: fixed;
		top: var(--projectanim-to-top);
		left: var(--projectanim-to-left);
		width: var(--projectanim-to-width);
		height: var(--projectanim-to-height);
		z-index: 9; /* To be on top of everything except for its OWN the expand/shrink button */
		visibility: visible;
	}
}

@keyframes Shrink /* expand and shrink are both slightly different animations */
{
	0%
	{
		position: fixed;
		/* may not be the size of the viewport if the expand was interruped by user */
		top: var(--projectanim-from-top);
		left: var(--projectanim-from-left);
		width: var(--projectanim-from-width);
		height: var(--projectanim-from-height);
		z-index: 9; /* To be on top of everything except for its OWN expand/shrink button */
		visibility: visible;
		border-color: inherit; /* will fade out border like bg colour */
	}
	99%
	{
		position: fixed;
		top: var(--projectanim-to-top);
		left: var(--projectanim-to-left);
		width: var(--projectanim-to-width);
		height: var(--projectanim-to-height);
		background-color: #00000000; /* Black and transparent */
		border: inherit; /* need to copy border to correctly offset expand/shrink button */
		border-color: #00000000; /* fade out border like bg colour */
	}
	100%
	{
		/* effectively reset to default values pre-animation */
	}
}
`;

/* Project Viewer (ProjectViewerElement in projectviewer.js) */
/* ========================================================= */
export const ProjectViewerElement_StyleCSS = css`
#projectviewer
{
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100; /* To be on top of everything, project shrink button only clickable if this isn't over it */
	width: 100vw;
	height: 100vh;
	margin: 20px; /* Temporary value, To not cover the project shrink button */
	overflow: scroll;
	text-wrap: wrap;
}
`;