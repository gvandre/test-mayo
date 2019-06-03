let param = '*?asa' // ? => [A-Z] *?asa casa tasa
let lnParam = 4
let keyLike = true
let keyLetters = false
let topControl = Infinity
let sizeResult = 0
let sensitive = true
let longArray = []

let str = ['tasa interes', 'casa grande', 'banco tasa', 'casassa', 'tasasss', '.tasa']
let rex = sensitive ? /\b[A-Z|a-z]asa\b/ :  /\b[A-Z|a-z]asa\b/i

let cleanWordKey = ''
// for (let i = 0; i < str.length; i++) {
//     if (sizeResult === topControl) break
//     let elm = str[i];

//     if (keyLetters) {
//         likeRangeLetters(elm)
//     } else if (!keyLetters && keyLike){
//         onlyLike(elm)
//     } else {
//         withoutLike(elm)
//     }
// }
str.forEach(element => {
    // console.log(/as/g.test(element))
    console.log(element.match(/.as./))
});


function likeRangeLetters (elm) {
    let toArr = elm.split(' ')

    for (let i = 0; i < toArr.length; i++) {
        let nst = toArr[i].match(rex)
        if (nst && toArr[i].length == lnParam) {
            console.log(1)
            longArray.push(elm)
            sizeResult++
            break
        } else {
            if (keyLike){
                console.log(2)
                longArray.push(elm)
                sizeResult++
            }
        }
    }
}

function onlyLike (elm) {
    if (elm.indexOf(cleanWordKey) !== -1) {
        console.log(3)
        longArray.push(elm)
        sizeResult++
    }
}

function withoutLike (elm) {
    if (elm === cleanWordKey ) {
        longArray.push(elm)
        sizeResult++
    }
}
