# Astro Components

## 📝 Project Overview

This is a project based on a series of Coding In Publics <a href="https://learnastro.dev/">Learn Astro Series</a>, focusing on component design and best practices.

**The goal:** Utilize Astro's UI approach to...

- create reusable layouts.
- create modular components to form larger components.
- map data to components.
- style components and layouts with ease.

**Tech Stack:** A bare bones techstack:

- Astro
- Scss for styling
- javascript and a little typescript for static generation

## 🍃 Quickstart

To get started, clone the repository and run the following command in the terminal to see the site in action:

```sh
pnpm dev
```

## 🚀 Project Structure

This project has the following folder and file structure:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│       └── index.astro
│   ├── styles/
│       ├── base/
│       └── styles.scss
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Learnings?

### Typing Props

**Documentation:** [Built-in HTML attributes](https://docs.astro.build/en/guides/typescript/#built-in-html-attributes)

With typescript, you may notice a lot of components require you to give additional prop types to allow for basic functionality. Take a look:

```typescript
// Props for a link component
interface Props {
	href: string;
	isExternal?: boolean; // conditionally render target and rel attr based on boolean
	class?: string; // allows class attribute
	[key: string]: any; // allow any additional attributes not mentioned
}

const { isExternal, href, class: className, ...rest } = Astro.props;
```

Astro uses a **strict** type system and requires explicitly defined types for each component prop. Although technically correct, it's not ideal to add class and key prop types to each component.

We can leverage Built-in HTML attributes for DRY types. Import `HTMLAttributes` from the `astro/types` and extend personal props from a specific element.

```typescript
import type { HTMLAttributes } from "astro/types";
// Props for a link component
interface Props extends HTMLAttributes<"a"> {
	isExternal?: boolean; // conditionally render target and rel attr based on boolean
	// href, class, and key are already defined!
}

const { isExternal, class: className } = Astro.props;
```

Notice how we omit `href` in addition to `class` and `key` from the component's props? That's because we are extending from an ordinary HTML `<a>` element. We only include custom properties at that point.

> **Note:** the class is a reserved keyword for typescript and javascript. To avoid conflicts, we use `className` instead of `class` by aliasing the prop during destructuring.

```typescript
const { isExternal, class: className } = Astro.props;
```

### Additional props ...rest

Following the current `<Link>` component example, adding additional attributes to the component can be simplified with a spread operator.

```astro
---
// Props for a link component extending from HTML `<a>`
interface Props extends HTMLAttributes<"a"> {
	isExternal?: boolean;
}

const { isExternal, class: className, ...rest } = Astro.props;
---

<a
	class={className}
	target={isExternal ? "_blank" : undefined}
	rel={isExternal ? "noopener noreferrer" : undefined}
	{...rest}
>
	<slot />
</a>
```

Instead of manually accounting for each attribute like we see for class,we can use the **spread operator** with keyword **rest** to add any additional attributes to the component. This allows us to quickly and efficiently account for:

- ids
- data attributes
- aria attributes
- any other attribute...

> **Note:** ...rest should be added last in the component, as it will override any other attributes.

```astro
<!-- using Link Component -->
<Link
	isExternal
	href="https://google.com"
	class="button button--primary"
	id="cta-button"
	data-link="gtag"
	aria-label="Google"
>
	click me!
</Link>
```

Using the spread operator with Astro's builtin HTML attributes types, we can easily account for attributes and props innate and new to a component!

### Dynamic Tags

**Documentation:** [Dynamic HTML Tags](https://docs.astro.build/en/reference/astro-syntax/#dynamic-tags)

For some components, we may need to be flexible for different HTML tags. A common case maybe to match headings within blogs and text.

We can achieve this with a **capitalized variable** containing he tag name we want to use. Take a look at this custom heading component:

```astro
---
import type { HTMLAttributes } from "astro/types";
type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface Props extends HTMLAttributes<HeadingLevel> {
	level?: HeadingLevel;
}

const { level = "h1" } = Astro.props;

const Tag = level;
---

<Tag>
	<slot />
</Tag>
```

In order to use a dynamic tag:

- contain the tag name in a constant **capitalized variable**

### Astro Client Islands

**Documentation:**

- [Islands](https://docs.astro.build/en/concepts/islands/#what-is-an-island)
- [Client Islands](https://docs.astro.build/en/concepts/islands/#client-islands)
- [Client Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)

Astro allows rendering dynamic content without blocking the initial page load by using **astro islands** to hydrate the content on client side.

This is useful for interactive components that can slow down initial page loads, such as a React, Vue, or Svelte components.

#### Setup Client Islands

Start by using Astro's cli to install your desired framework into your project. This example will use react:

```sh
pnpm astro add react
```

This will not only install necessary dependencies, but will automatically make necessary changes to your `astro.config.mjs` file:

```javascript
import react from "@astrojs/react";

export default defineConfig({
	// ...
	integrations: [react()],
	// ...
});
```

And update your `tsconfig.json` compiler options:

```json
{
	"extends": "astro/tsconfigs/strict",
	"include": [".astro/types.d.ts", "**/*"],
	"exclude": ["dist"],
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "react"
	}
}
```

#### Using Client Islands

After creating a ui framework component, we need to use [client directives](https://docs.astro.build/en/reference/directives-reference/#client-directives) to control how the component is hydrated onto the page.

> **Note:** client directives must be used, otherwise the component will only be static and not be interactive.

```astro
<ReactComponent client:load />
```

This will render the component on the client side **immediately** on page load, allowing for interactive components to be rendered as soon as possible.

All client directives can be found [here](https://docs.astro.build/en/reference/directives-reference/#client-directives).

Here is a quick list of **client directives**:

- `client:load`: hydrates along with page load.
- `client:idle`: wait until all static content is loaded, then hydrate framework.
- `client:idle={{timeout: ...}}`: specify a custom timeout before hydrating.
- `client:visible`: wait until the component is visible in the viewport, then hydrate framework.
- `client:visible {{rootMargin: ...}}`: similar to intersectionObserver API, specify a custom root margin before hydrating.
- `client:media`: wait until a media query is met, then hydrate framework.
