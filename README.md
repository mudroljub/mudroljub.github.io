# Mudroljub

Selected GitHub Pages projects on the homepage, with a separate [portfolio](https://mudroljub.github.io/portfolio.html) based on the [Particle Theme](https://github.com/nrandecker/particle).

See [my projects](https://mudroljub.github.io).

Open `index.html` in a browser to view the site locally.

Edit the homepage in `index.html` and the portfolio in `portfolio.html`.

Project selection and order: edit [projekti.txt](projekti.txt), one project per line.

After changing the list, regenerate the homepage with Node.js:

```sh
node build.js
```

No packages need to be installed. Project titles and descriptions are stored in `projekti.json`; images are in `assets/img/projects/`. Removed projects can be restored by adding their names back to `projekti.txt`.
