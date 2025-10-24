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

  const recipesRaw = fs.readdirSync('./recipes')
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      return {
        file,
        content: fs.readFileSync(`./recipes/${file}`, 'utf-8'),
      }
    })
  // console.log(recipesRaw)

  const recipesParsed = recipesRaw.map(({ file, content }) => {
    console.log(`parsing recipe ${file}...`)
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

    return {
      file,
      name,
      ...metadata,
      recipeMd,
      rawContent: content,
    }
  })

  // require('util').inspect.defaultOptions.depth = null;
  // console.log(recipesParsed)
  fs.writeFileSync('recipes.json', JSON.stringify(recipesParsed), 'utf-8');
  fs.writeFileSync('recipes.yaml', yaml.dump(recipesParsed), 'utf-8');
}
main();
