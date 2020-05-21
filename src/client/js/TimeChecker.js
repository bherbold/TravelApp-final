/**
 * 
 * @param {date Input from document} docDate 
 * @returns true when Date is in a week or farer way
 */
function travelTime(docDate){


    const furtureDate = new Date();
    furtureDate.setDate(furtureDate.getDate() + 7);

    if(docDate > furtureDate){
        return true;
    }
    else{
        return false;
    }

}

export{
    travelTime,
}
