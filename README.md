# RyanMckenzieDotCom

Static website project containing pages: `index.html`, `contact.html`, `epk.html`, `music.html`, `shows.html` and `assets/` for CSS, JS, images and fonts.

## Local usage

Open `index.html` in your browser to view the site.

## Notes

- This repository was initialized from the local project folder.
- To create a remote GitHub repository and push, provide the repo name and whether you want it private or public, and either authenticate with the `gh` CLI beforehand or provide a personal access token.

## Calendar buttons

Calendar buttons use the locally hosted add-to-calendar-button npm package on the home and Shows pages. Run npm install after checkout or dependency updates; its postinstall script copies the browser bundle and license into assets/vendor/add-to-calendar-button. Run npm run sync:calendar to refresh them manually. Commit the generated assets so static hosting needs no build step. Event details are defined on each add-to-calendar-button element in the HTML, using America/New_York time.

