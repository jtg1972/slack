export default errors=>
errors.reduce((acc,cv)=>{
    if(!acc[cv.path])
        acc[cv.path]=[cv.message];
    else
        acc[cv.path].push(cv.message);
    return acc;
},{});
