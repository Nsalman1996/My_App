import * as uuid from "uuid";
var randomString = require('random-string');

export class Utility{

    public static generateuuid(){
       return uuid.v1();
    }

    public static generateRandomCode(length:number,string:boolean,number:boolean,special:boolean,exception:string[]){
        let code = randomString({
            length: length,
            numeric: number,
            letters: string,
            special: special,
            exclude: exception
        });
        return code;
    }

    public static ascSort(array:any[]){
        for (let i = 0; i < array.length; i++) {
            let lowest  = i;
            for (let j = i+1; j < array.length; j++) {
                if(array[j] < array[lowest]){
                    lowest = j;
                }
            }
            if (lowest != i) {
                [array[i],array[lowest]] = [array[lowest], array[i]];
            }
        }
        return array;
    }

    public static dscSort(array:any[]){
        for (let i = 0; i < array.length; i++) {
            let  highest = i;
            for (let j = i+1; j < array.length; j++) {
                if (array[j]>array[highest]) {
                    highest = j;
                }
            }
            if (highest != i) {
                [array[i],array[highest]] = [array[highest],array[i]];
            }
        }
        return array;
    }

    public static fischerYatsShuffle(array:any[]){
        for (let index = array.length - 1; index > 0; index--) {
            let j = Math.floor(Math.random() * (index + 1));
    
            let k = array[index];
            array[index] = array[j];
            array[j] = k;
        }
        return array;
    }
}