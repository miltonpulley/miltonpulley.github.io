import { css } from "https://cdn.jsdelivr.net/gh/lit/dist@3.2.1/core/lit-core.min.js";

/* Filter Area (FilterAreaElement in filters.js) */
/* ============================================= */
export const FilterAreaElement_StyleCSS = css`
:host *
{
	list-style: none;
}

.dropdowntrue
{
	position: absolute;
	height: 0px;
	transform: scale(0);
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
	border: 0.2em solid #aaaaaa;
	border-radius: 1em;
}

:host #filterareaheader
{
	display: inline-block;
	margin: 2px 0px 2px calc(2px + 0.1em);
	height: calc(1vw + 1.5em);
	width: fit-content;
	height: fit-content;
	font-size: calc(1vw + 1.5em);
	vertical-align: center;
}

:host #filterareaheader > *
{
	vertical-align: middle;
}

:host #filterareaheader > h2 /* "Filter Projects By Tags" */
{
	display: inline;
	margin: 0px;
	font-size: inherit;
}

:host #filterareaheader > .tagfilterdropdownbutton
{
	margin: 0px;
	padding: 2px;
	font-size: inherit;
	width: fit-content;
	height: fit-content;
	background-color: #ffffff;
	border: 0.1em solid #aaaaaa;
	border-radius: 0.25em;
}
:host #filterareaheader .tagfilterdropdownbutton #chevron
{
	margin: 0em;
	width: 0.5em;
	height: 0.5em;
	border-right: 0.1em solid #000000;
	border-bottom: 0.1em solid #000000;
}
:host #filterareaheader .tagfilterdropdownbutton .chevronclosed
{
	transform: scale(0.7)translateX(-0.14142em) rotate(-45deg);
}
:host #filterareaheader .tagfilterdropdownbutton .chevronopen
{
	transform: scale(0.7) translateY(-0.14142em) rotate(45deg);
}

:host > div > p /* The 3 filter texts e.g. showing (#/#) projects */
{
	margin: 0.2em auto;
	width: fit-content;
	font-size: calc(0.7vw + 1em);
	align-content: center;
}

#numshowingprojects /* The make the (#/#) projects slightly bigger*/
{
	font-size: calc(1vw + 1em);
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
	margin: 0.5em 1em;
	padding: 0.5em 0px;
	text-align: center;
	border: 0.2em solid #999999;
	border-radius: 1em;
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
button:active /* all ignored ("ig") or unspecified tags, and default of all others */
{
	background-color: #ddddda;
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
button[value="wh"]:active /* all whitelisted tags */
{
	background-color: #eeeeee;
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
button[value="bl"]:active /* all blacklisted tags */
{
	background-color: #000000;
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
	--projectthumbnail-height: 50%;
	--projectthumbnail-margin-bottom: 2px;
	--projectblurb-margin-left-right: 0.15em;

	--projectanim-animation: ""; /* set by JavaScript and read by .projectanim */
	--projectanim-duration: 0.80s; /* read by JavaScript and by .projectanim */
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
	margin: 4px;
	padding: 0.1em 0.15em;
	visibility: visible; /* To be visible regardless of parent .projectanim */
	font-size: calc(1vw + 10px);
	background-color: #fbf1f7;
	border: 0.1em solid #777777;
	border-radius: 0.3em;
}
.viewprojectbutton:enabled:hover
{
	background-color: #ffffff;
}
.viewprojectbutton:enabled:active
{
	background-color: #dbd1d7;
}
.viewprojectbutton:disabled
{
	color: #3b3137;
	background-color: #aba1a7;
}

.projectdate
{
	position: absolute;
	top: 0;
	left: 0;
	margin: 0px var(--projectblurb-margin-left-right);
	padding: 2px 0.25em;
	font-size: 1.8em;
	background-color: #ccccccaa;
	border-right: 0.1em solid #777777;
	border-bottom: 0.1em solid #777777;
	border-radius: 0 0 0.4em 0;
}

.projectthumbnail
{
	flex: 0 0 var(--projectthumbnail-height);
	margin: 2px;
	margin-inline: auto;
	margin-bottom: var(--projectthumbnail-margin-bottom);
	margin-right: var(--projectthumbnail-margin-bottom);
	padding: 0px;
	width: auto;
	height: var(--projectthumbnail-height);
	aspect-ratio: auto;
}

.projectname
{
	position: absolute;
	bottom: calc(var(--projectthumbnail-height) - var(--projectthumbnail-margin-bottom) - 2px);
	margin: 2px var(--projectblurb-margin-left-right);
	margin-bottom: 0px;
	padding: 2px 0.25em;
	font-size: 1.8em;
	background-color: #cccccccc;
	border-top: 0.1em solid #777777;
	border-right: 0.1em solid #777777;
	border-radius: 0 0.4em 0 0;
}

.projectblurb
{
	display: inline-block;
	margin: 0 var(--projectblurb-margin-left-right);
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
	display: flex;
	inset: 0px;
	margin: 0;
	z-index: 2; /* to be under all expand/shrink buttons */
	width: auto;
	height: auto;
	visibility: hidden;
	align-items: flex-start;
	justify-content: center;
	background-color: #cccccc;

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
		z-index: 9; /* To be on top of everything except for its OWN the expand/shrink button */
		width: var(--projectanim-to-width);
		height: var(--projectanim-to-height);
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
		z-index: 9; /* To be on top of everything except for its OWN expand/shrink button */
		width: var(--projectanim-from-width);
		height: var(--projectanim-from-height);
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
	position: absolute;
	top: 0;
	left: 0;
	z-index: 100; /* To be on top of everything, project shrink button only clickable if this isn't over it */
	background-color: #cccccc;
	font-size: 1em;
}

#projectviewertopbar /* Still dependent on width for centering */
{
	position: sticky;
	top: 0;
	display: flex;
	width: 100vw;
	background-color: #cccccc;
}

#projectviewertopbar p
{
	position: relative;
	margin: 0;
	width: 100%;
	overflow: hidden;
	white-space: nowrap; 
	text-overflow: ellipsis;
}

/* Align the three child divs so that the middle div is horizontally centered with the screen, and the other two adjust accordingly */
.centerthree
{
	display: flex;
	height: auto;
	align-items: center;
}
.centerthree > div:first-child /* To align the middle button to screen center */
{
	display: flex;
	flex: 1 1 0;
	justify-content: right;
	text-align: right;
}
.centerthree > div:last-child /* To align the middle button to screen center */
{
	display: flex;
	flex: 1 1 0;
	justify-content: left;
	text-align: left;
}

#projectviewerdata
{
	top: 0;
	margin: 1em;
	margin-top: 0;
	padding: 0.5em;
	text-wrap: wrap;
	border: 0.5em solid #888888;
	border-radius: 0.2em;
}

#projectviewerdata > div
{
	margin: 0.5em 0px;
	border-bottom: 0.5em solid #888888;
}

/* markdown images are inserted as img, wrapped in p */

#projectviewerdata p:not(:has(> img)) /* p that dont wrap markdown images */
{
	max-width: 90vw;
}
#projectviewerdata p:has(> img) /* p that wrap markdown images */
{
	text-align: center;
}
#projectviewerdata p > img /* markdown images */
{
	width: 15cm;
	max-width: 90vw;
	aspect-ratio: auto;
	text-align: center;
}

#projectviewerdata div:has(> img) /* div that wrap non-markdown images */
{
	width: auto;
	text-align: center;
}
#projectviewerdata div > img /* non-markdown images */
{
	max-width: 90vw;
	aspect-ratio: auto;
	text-align: center;
}

#projectviewerdata video
{
	width: auto;
	max-width: 90vw;
}
#projectviewerdata div:has(> video)
{
	text-align: center;
}
`;