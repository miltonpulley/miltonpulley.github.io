# Creative Process of the Portfolio Website

## 30th of January 2025

I finally decided to create a website portfolio during the break between University terms. A portfolio had been something I planned to make ever since many at TAFE (and many since) have pointed out the benefits of one.

My University's IT faculty had a conference day of sorts during the end-of-year holidays where, among other things, attended a presentation of creating a portfolio. From there I got the idea to use Github Pages, to reflect on assessments, show what didn't work and why, problem solving, teamwork, communication, and not so much on technical prowess. The presentation also showed "Beautiful Jekyll", which helps to quickly construct a website, but I chose to write my own HTML/CSS/JS.

I didn't need to make this website myself but I thought it would be a fun exercise, and because I can (and also I prefer total control over the underlying functionality, which is why I would rather write my own video game engine rather than an off-the-shelf one).

## 31st of January, 2025

I have yet to figure out how to do things like css animation, but I'll figure it out when it comes to it.

Some of the JavaScript was from a project that gradually built up while I was learning HTML/CSS/JS. I probably won't do a datastore with SQL since that feels a bit overkill, I'll probably just fetch from file.

The filtering being done by buttons and not a searchbar is because I currently do not feel like sanitising inputs and protecting against injection attacks (even though I'm sure other attacks are still possible, assuming Github Pages doesn't already protect against that stuff anyway).  

The main priority is getting the site in a workable state, as I only have 4 weeks (which is plenty of time but I don't want to get sidetracked and fall victim to scope-creep).

At the end of the day I had finished displaying the project list, read from a .json file.

## 1st of February, 2025

I'm not particularly liking the amount of hardcoded strings due to differing files, e.g. referencing an HTML tag with `id=X` and in JavaScript with `.getElementById(X)`.
Both `X`'s are the same, and should be in a variable for easy editing, but they appear in different files in different languages.  
I'll have to find a way to reference variables across HTML and JavaScript files, although that doesn't sound very doable. I have finished the functionality of filtering by tags, including a whitelist and blacklist.

At the end of the day, I happened to bring up this website while on call with my Mum. As she has had experience in websites and I have conducted video game playtesting, she had a look and gave some feedback on things I didn't even consider, such as the black background of the "Blacklist All" button made it look like it was "currently selected", even though it doesn't "stay selected".  
I am honestly getting ahead of myself to be doing the css before finishing full functionality, so I wrote down what Mum said and I will work on it after functionality.  
This is why playtesting, User Experience (UX), and even customer requirements elicitation are important.

## 2nd of February, 2025

I took the sunday off.

## 3rd of February, 2025

I Added full functionality to the buttons that will (eventually) make the project expand to fill the screen, giving more detail on each project. This involved CSS animation, which was quite easy to pick up.

I also reorganised my JavaScript code that runs when the window is first loaded, including HTML generation and button functionality.

Regrettably, these two things were done in the same commit. It definitely would have been better to have them seperate, but I ended up getting sidetracked/carried away while writing the project expand button functionality.

When the project expands to fill the screen, I'm thinking it could have an area that could display different kinds of things (and not just images) because a lot of these projects could be interacted with, i.e. spinning 3D models that can have wireframe so my topology can be seen, or music I've composed could be played, etc.  
I probably won't write most of these as I'm sure many people have already gone through and designed these things on the internet.

Any tool I create for adding entries of new projects probably won't be very complex, and might not even be more than just writing extra HTML to be loaded from a file. If it does become tedious enough then I will, and I'll write the current system in a way that can be swapped out easily, just in case (note that if improperly done or unchecked will obviously lead to a slew of hacks, attacks and exploits).

There was some unfinished experimenting I have done, but won't commit because of its dirty, messy, experimental, chicken-scratch, off-the-back-of-the-napkin nature.

## 4th of February, 2025

I'll be honest, today I didn't do anything. I *could* have just as easily lied that I was otherwise occupied, but... well I feel like there is some sort of validity as to why I slacked, and therefore a motive against lying (A don't-lie-because-not-guilty sort of situation).

Sure, I did have a slow start to the day but I was fine by ~1pm. Rather, with some basic risk assessment, I gave myself the deadline of the 24th of february as that is when my university term starts. This would mean I have ~13-16 days, depending on how many days of each weekend I take off. I have let's say... 50-75% of the total work done in 4 days (30th, 31st, 1st, 3rd). I feel *quite* confident that I can get this finished in time.  
If this were a group project or something I would get paid for then no question I would be on it, but this is a solo project with much wiggle room.

Also, if one would think I should've taken Saturday the 1st of February off, then you could consider this day to be effectively that.

In other news, I found out there (apparently) will be a blackout tommorow from 7am to 5pm, although just means that I cannot use the internet as a resource. I can still work on the project as Visual Studio Code has an [extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) that can host the website from my computer, which is how I have been seeing real time changes to my HTML/CSS/JS.

## 5th of February, 2025

Just implemented the CSS animation of expanding/shrinking of the projects from the project list, although the illusion is broken when you scroll while shrinking. It (in theory) is easy enough to fix by, while shrinking, continuously updating the end size/position (via the four `--expandproject-to-X` variables), but would have to be done asynchronously and would have to constantly check the progress of the animation.  
I don't really know when I'll get around to fixing it since it has a lower priority than continuing to implement functionality.

I feel like any part of the program I write that makes CSS and JS interact is awfully messy, but I don't really see any better way to do how I'm doing it (otherwise I would obviously do the better way).  
I feel like this is because CSS is kind of an all-over-the-place language that is sometimes vauge and unintuitive in what things do, but I suppose I'd rather have CSS than putting the styling directly into HTML like pre-CSS.

I have decided to instead of having many project viewers with one each per project in the project list, only the animation will be, and the singular actual viewer always stays the same size on screen, just changes visibility. This means that the project viewer has to change its inner HTML to match the currently viewed project.  
I have decided to do this because there will be less everything to load, and it means I can decouple the viewer from the project list.

## 6th of February, 2025

I overslept by 3 HOURS today, waking up at 11am (I usually get up at 9 but I've been getting up at 8 recently, most likely due to less physical exertion over the holidays). I don't know what is happening, I haven't overslept for ***YEARS***, but then suddenly overslept twice.

Nevertheless I still pressed on with the project, even though the project viewer is the most complicated part of the project, mainly because I haven't done "be-able-to-load-anything" in HTML/CSS/JS before.  
I have some ideas on how I could do it, such as loading the entire project viewer's inner HTML from file, meaning I would write different HTML for each project.

Another thing I will have to think about is protecting against attacks, hacks and exploits. I still need to do more research on this, but since the website is read-only from the client's end, attacks to the server should in theory be eliminated. I *think* this will protect against client-to-client-via-server attacks like XSS, but again I need to do more research.  
Yes I should've been thinking about attacks, hacks and exploits from the start but the chances of a malicious someone coming across this website... maybe EVER is astronomically low.

A good solution to all of this (besides the anomalous oversleeping) is using LIT components, which I probably should've started with in the first place since I have been taught in it.  
LIT components would automatically handle a lot of vulnerability protection like sanitising inputs, and would be a good way to generate the project viewer.  
I will probably switch over to LIT components.

## 7th of February, 2025

Finished converting the project list to use LIT elements. It was a bit of a hassle, which is why I decided not to put the filter-tags-to-LIT conversion in the same commit.  
It's annoying that LIT doesn't like to have external CSS, and prefers you put all of it in a static field in the LIT element class, meaning CSS syntax doesn't work without some VSCode extension that I have yet to look for.

I originally had the CSS linked in the LIT's `render()` function, but is now is in the LIT class `static styles = [""]` for compatibility and other reasons.  
In order to not have the JavaScript files be massive, and to make the conversion easier, the css is loaded from another JavaScript file which is just the original CSS file but with each LIT component's CSS wrapped in `export const X = css``;` to make them LIT `css` strings.

Another thing that this seemed to fix was that editing the CSS file wasn't applying to the [VSCode Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) without me reloading the page, instead of it applying when saving the file like usual.

## 8th of February, 2025

Took a break and hung out with some friends.

## 9th of February, 2025

Took a break.

## 10th of February, 2025

After a bit more work, continuing on what I didn't finish on the 7th, I have finally converted the filter area and the project list to LIT components. The project viewer has yet to be converted, but it only exists as ~1-3 lines of code at the moment.  
Again, I probably should've started with LIT but for some reason I didn't. I guess I forgot about the security part.

Just reorganised some of the project, including reordering the functions in each JavaScript file to be consistent, and turning every `<ul>` into `<div>` and removing every `<li>` in the LIT components since even though they were all still unordered lists, the CSS `flex` was doing all the layout.
