const fs = require('fs');

const yaml = require('js-yaml');

// const { marked } = require('marked');



async function main() {
  // const recipeMd = fs.readFileSync('recipes/recipe-1.md', 'utf-8');
  // marked.use({
  //   async: false,
  //   pedantic: false,
  //   gfm: true,
  // });
  // console.log(marked.parse(recipeMd));
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

    const recipe = {
      file,
      ...info,
      ingredients,
      instructions,
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

    recipes.push({
      file,
      name,
      ...metadata,
      recipeMd,
      // contentRaw: content,
    });
  })

  // require('util').inspect.defaultOptions.depth = null;
  // console.log(recipes)
  fs.writeFileSync('recipes.json', JSON.stringify(recipes), 'utf-8');
  // fs.writeFileSync('recipes.yaml', yaml.dump(recipes), 'utf-8');
}
main();
