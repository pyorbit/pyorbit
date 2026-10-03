# Authoring lessons

Courses live at `content/courses/<course-slug>/course.yaml`. Each lesson lives in a numbered directory such as `01-hello-python/lesson.md`. Slugs use lowercase letters, numbers, and hyphens. The directory suffix, `id`, and `slug` must agree. Run `make content` after edits; errors name the file and invalid field.

Treat published course and lesson slugs as stable identifiers: future progress records refer to them. A rename will need an explicit migration and URL redirect.

`course.yaml` requires `id`, `slug`, `title`, `description`, `order`, `difficulty` (`beginner`, `intermediate`, `advanced`), and `tags`. A lesson's YAML frontmatter requires those fields plus `estimatedTime` (positive integer minutes) and `prerequisites` (lesson IDs in the same course). Lesson orders and IDs must be unique within a course.

Use standard Markdown for headings, lists, links, emphasis, and fenced code blocks. For Python, use a `python` fence. The reader syntax-highlights it and provides copy control. Raw HTML, MDX JSX, script/data URLs, and arbitrary React imports are forbidden. This keeps contributed content reviewable and avoids executable markup. Notes, tips, exercises, and quizzes can be added later as a small reviewed set of extensions; do not invent new syntax in lessons yet.

Keep explanations short, accurate, and accessible. Give code examples meaningful variable names and avoid relying on unseen state. A future interactive example should be explicitly marked and loaded only on the page that needs it.
