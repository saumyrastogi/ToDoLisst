module.exports.getDate = function(){
  const dayy = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return dayy.toLocaleDateString("en-US",options);
}
module.exports.getDay = function(){                        //module.exports or exports
  const dayy = new Date();
  const options = {
    weekday: "long",
  };
  return dayy.toLocaleDateString("en-US",options);

}
