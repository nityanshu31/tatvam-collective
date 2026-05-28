# TODO

- [ ] Fix `ReferenceError: types is not defined` in `src/app/projects/page.js`
  - [ ] Replace `types` usage with the correct existing variable(s) (likely `categories` / `activeCategory` / `setActiveCategory`)
  - [ ] Fix prop name mismatches inside `TypeFilter` (uses `categories`, `activeCategory`, `onCategoryChange`, `projectCounts`)
  - [ ] Remove unused/incorrect state/props (`activeType`, `types`) or map them correctly
  - [ ] Run lint/dev build check

