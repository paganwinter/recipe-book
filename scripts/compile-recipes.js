const fs = require('fs');

const yaml = require('js-yaml');

function main() {
  const recipes = []
  fs.readdirSync('./recipes').filter((file) => file.endsWith('.yaml')).forEach((file) => {
    console.log(`parsing recipe ${file}...`)
    const content = fs.readFileSync(`./recipes/${file}`, 'utf-8')

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

  // console.log(recipes)
  fs.writeFileSync('recipes.json', JSON.stringify(recipes), 'utf-8');
}
main();
