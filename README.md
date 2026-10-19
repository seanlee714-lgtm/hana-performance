# HANA 運動飲茶 — website

Pages: `index.html` (home), `brand.html` (About), `product.html` (001 Black Lemon Tea), `join.html` (email list).
Shared styling in `styles.css`, behaviour in `main.js`, media in `assets/`.

## Preview in VS Code
Install the **Live Server** extension, right-click `index.html` → **Open with Live Server**.
(Opening the HTML file directly also works, but videos load more reliably through Live Server.)

## Notes
- Email signups post to Formspree (`data-endpoint` on the form in `join.html`).
- English type is set in Neue Haas Unica W1G when installed/licensed, falling back to Helvetica Neue.
- `assets/img/characters/` and `runner-cycle.png` are the character cut-outs for the treadmill runner (not currently on the page).

## After editing styles.css or main.js
Bump the `?v=` number on the `styles.css` / `main.js` links in all four HTML pages (e.g. `?v=20` → `?v=21`).
Browsers keep old copies of these files; a new number makes them fetch the update.
