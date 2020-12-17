export function isMobile(mobile){
  let regExp = /^(0|86|17951)?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
  if(!regExp.test(mobile)){
    return false;
  }
  return true;

}
export function isTel(tel){
  let regExp = /^(\+\d{2}-)?0\d{2,3}-\d{7,8}$/;
  if(!regExp.test(tel)){
    return false;
  }
  return true;

}
export function isIdCard(idCard){
  let regExp = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  if(!regExp.test(idCard)){
    return false;
  }
  return true;

}

