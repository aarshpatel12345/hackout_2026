# UI Consistency Rule

The project uses **Tailwind CSS** as its primary styling solution.
**DO NOT** import global UI frameworks like Bootstrap (`bootstrap/dist/css/bootstrap.min.css`) into `main.jsx` or any other global entry point.

Importing Bootstrap alongside Tailwind causes major UI inconsistencies, layout breaks, and typography overwrites because Bootstrap's `Reboot` resets conflict with Tailwind's `Preflight`. 

## Validation Styles
For form validation styles (like `is-invalid`, `was-validated`, `invalid-feedback`), custom classes have been added directly to `index.css` which mimic Bootstrap's feedback functionality without needing the entire Bootstrap framework. Use these directly in your JSX, or rely purely on Tailwind CSS utility classes.