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

I Added full functionality to the buttons that will (eventually) make the project expand to fill the screen, giving more detail on each project.  
I also reorganised my JavaScript code that runs when the window is first loaded, including HTML generation and button functionality.

Regrettably, these two things were done in the same commit. It definitely would have been better to have them seperate, but I ended up getting sidetracked/carried away while writing the project expand button functionality.
