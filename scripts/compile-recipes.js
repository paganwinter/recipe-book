// require('util').inspect.defaultOptions.depth = null;
const fs = require('fs');
// const path = require('path');

const yaml = require('js-yaml');

// import { marked } from 'marked';
// const { marked } = require('marked');


const sample = `---
# category: kootan1
# tags: [savoury1, daily1]
---

# Dish name
What is this dish about

- **category**: kootan2
- **tags**: savoury2, daily2

---

## Ingredients

### Paste
- Coconut (grated) \`1 cup\`
- Tamarid
- Salt \`to taste\`
- Coconut (grated): 1 cup
- Tamarid
- Salt: to taste

### Garnish
- curry leaves \`4 no\`

---

## Directions
### Paste
- Soak tamarind in warm water for 10 minutes, then extract the juice.
- Grind coconut with tamarind juice to make a smooth paste.
- Add water to adjust consistency if needed.
### Garnish
- Garnish with currey leaves and coriander
`

async function main() {
  // const recipeMd = fs.readFileSync('recipes/recipe-1.md', 'utf-8');
  // const recipeMd = sample
  // marked.use({
  //   async: false,
  //   pedantic: false,
  //   gfm: true,
  // });
  // // console.log(marked.parse(recipeMd));
  // console.log(marked.lexer(recipeMd));


  const recipes = []
  fs.readdirSync('./recipes')
  .filter((file) => file.endsWith('.yaml'))
  .forEach((file) => {
    console.log(`parsing recipe ${file}...`)
    const content = fs.readFileSync(`./recipes/${file}`, 'utf-8')

    // const [info, ingredients, instructions] = yaml.loadAll(content)
    const parts = content.split(/^---\s+/m)
    const info = yaml.load(parts[0])
    const ingredients = yaml.load(parts[1])
    const instructions = parts[2]

    if (typeof info.tags === 'string') info.tags = info.tags.split(/\s*,\s*/)
    const recipe = {
      file,
      ...info,
      ingredients,
      ingrRaw: parts[1],
      instructions,
      contentRaw: content,
    }
    recipes.push(recipe)
  })

  fs.readdirSync('./recipes')
  .filter((file) => file.endsWith('.md'))
  .forEach((file) => {
    console.log(`parsing recipe ${file}...`)
    const content = fs.readFileSync(`./recipes/${file}`, 'utf-8')

    const matched = content.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
    if (!matched) {
      console.error(`Error parsing ${file}... ignoring it`)
      return
    }

    let metadata = {}
    const recipeMd = matched[2]
    try {
      metadata = yaml.load(matched[1])
    } catch (error) {
      console.error(`Error parsing metadata for ${file}... ignoring it`)
    }

    const name = content.match(/^# (.+)$/m)[1];
    // const category = content.match(/^-?\s*\**category\**\s*:\s*(.+)$/m)?.[1] ?? 'uncategorised';
    // const tags = content.match(/^-?\s*\**tags\**\s*:\s*(.+)$/m)?.[1]?.replace(/^\[|\]$/g, '')?.split(/\s*,\s*/) ?? [];
    // const descriptionMd = recipeMd.match(/^# .+?[\n\r](.+)## /);
    // const descriptionMd = recipeMd.match(/^# (.+?)[\n\r]+(.+?)[\n\r]+## /s);
    // const descriptionMd = recipeMd.match(/(^#+\s.*$\n)((?:.|\n)*?)(?=(^#+\s.*$|\n*$))/gm)
    // console.log(descriptionMd)

    recipes.push({
      file,
      name,
      ...metadata,
      recipeMd,
      contentRaw: content,
    });
  })

  // require('util').inspect.defaultOptions.depth = null;
  // console.log(recipesParsed)
  fs.writeFileSync('recipes.json', JSON.stringify(recipes), 'utf-8');
  fs.writeFileSync('recipes.yaml', yaml.dump(recipes), 'utf-8');
}
main();
