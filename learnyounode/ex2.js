var inputs = process.argv.slice(2)
var sum = inputs
  .map( (value,key) => { return +value } )
  .reduce( (a,b) => { return a + b })
console.log(sum)
