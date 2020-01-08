arr = [{qid: 'abc'}, {qid: 'bcd'}]
let b = 'abc'
 let c = arr.find(o => o.qid === b)
if (arr.find(o => o.qid === b)){
    arr.score = '12'
}
console.log(arr)