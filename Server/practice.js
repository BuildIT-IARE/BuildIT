const inarray = require('inarray');
arr = ['adam', 'krish', 'nick'];
let compare = inarray(arr, 'kris');
if(!compare){
    arr.push('kris')
}
console.log(arr)